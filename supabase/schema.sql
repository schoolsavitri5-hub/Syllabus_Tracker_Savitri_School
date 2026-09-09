create type public.app_role as enum ('ADMIN','COMPUTER_OPERATOR');
create type public.topic_status as enum ('Done','In Progress','Not Done');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, role app_role not null default 'COMPUTER_OPERATOR', active boolean not null default true, created_at timestamptz default now());
create table public.classes (id uuid primary key default gen_random_uuid(), class_name text not null unique, class_group text not null check (class_group in ('PRIMARY','SENIOR')), active boolean default true, created_at timestamptz default now());
create table public.sections (id uuid primary key default gen_random_uuid(), class_id uuid not null references public.classes(id), section_name text not null, active boolean default true, created_at timestamptz default now(), unique(class_id,section_name));
create table public.subjects (id uuid primary key default gen_random_uuid(), subject_name text not null unique, active boolean default true);
create table public.syllabus_files (id uuid primary key default gen_random_uuid(), class_id uuid references public.classes(id), section_id uuid references public.sections(id), file_name text not null, storage_path text not null, version int not null, is_current boolean default true, uploaded_by uuid references public.profiles(id), uploaded_at timestamptz default now(), unique(class_id,section_id,version));
create unique index one_current_file_per_section on public.syllabus_files(class_id,section_id) where is_current;
create table public.syllabus_topics (id uuid primary key default gen_random_uuid(), class_id uuid references public.classes(id), section_id uuid references public.sections(id), subject_id uuid references public.subjects(id), month text not null, unit_chapter_en text, unit_chapter_hi text, topic_en text, topic_hi text, assessment_en text, assessment_hi text, status topic_status not null default 'Not Done', remarks text, source_file_id uuid references public.syllabus_files(id), created_at timestamptz default now(), updated_at timestamptz default now());
create index topics_filter_idx on public.syllabus_topics(class_id,section_id,subject_id,month,status);
alter table public.profiles enable row level security; alter table public.classes enable row level security; alter table public.sections enable row level security; alter table public.subjects enable row level security; alter table public.syllabus_files enable row level security; alter table public.syllabus_topics enable row level security;
create function public.is_active_staff() returns boolean language sql stable security definer as $$select exists(select 1 from public.profiles where id=auth.uid() and active)$$;
create function public.is_admin() returns boolean language sql stable security definer as $$select exists(select 1 from public.profiles where id=auth.uid() and role='ADMIN' and active)$$;
create policy "staff manage academic data" on public.classes for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff manage sections" on public.sections for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff manage subjects" on public.subjects for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff manage files" on public.syllabus_files for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "staff manage topics" on public.syllabus_topics for all to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy "self read profile" on public.profiles for select to authenticated using (id=auth.uid());
create policy "admin manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Create private `school-assets` and `syllabus-excels` Storage buckets, then use signed URLs for downloads.

-- Validated Excel replacement: one transaction prevents partial/stale imports.
-- The caller sends [{subject, month, chapter, topic, hindi, assessment, status, remarks}].
create or replace function public.replace_syllabus_import(import_rows jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare r jsonb; sid uuid;
begin
  if not public.is_active_staff() then raise exception 'Not authorised'; end if;
  if jsonb_typeof(import_rows) <> 'array' or jsonb_array_length(import_rows)=0 then raise exception 'No valid syllabus rows supplied'; end if;
  for r in select value from jsonb_array_elements(import_rows) loop
    if coalesce(trim(r->>'subject'),'')='' or coalesce(trim(r->>'month'),'')='' or coalesce(trim(r->>'chapter'),'')='' or coalesce(trim(r->>'status'),'') not in ('Done','In Progress','Not Done') then
      raise exception 'Invalid import row';
    end if;
  end loop;
  -- Only after every row is valid do we remove the previous imported data.
  delete from syllabus_topics;
  for r in select value from jsonb_array_elements(import_rows) loop
    insert into subjects(subject_name) values (trim(r->>'subject')) on conflict (subject_name) do update set subject_name=excluded.subject_name returning id into sid;
    insert into syllabus_topics(subject_id,month,unit_chapter_en,unit_chapter_hi,topic_en,assessment_en,status,remarks)
    values(sid,trim(r->>'month'),trim(r->>'chapter'),nullif(r->>'hindi',''),nullif(r->>'topic',''),nullif(r->>'assessment',''),(r->>'status')::topic_status,nullif(r->>'remarks',''));
  end loop;
end $$;
