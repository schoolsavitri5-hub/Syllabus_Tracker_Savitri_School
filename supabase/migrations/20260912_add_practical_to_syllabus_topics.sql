-- Store Excel "Practical / Lab Work" separately from the detailed syllabus.
alter table public.syllabus_topics
  add column if not exists practical text;

-- Preserve practicals entered by older versions that stored them in Remarks.
update public.syllabus_topics
set practical = nullif(trim(substring(remarks from '\\[Practical:\\s*(.*?)\\]')), '')
where coalesce(trim(practical), '') = ''
  and remarks ~ '\\[Practical:\\s*.*?\\]';
