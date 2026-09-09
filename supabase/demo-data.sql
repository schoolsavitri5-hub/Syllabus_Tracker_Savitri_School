-- Complete development/demo dataset. Run after schema.sql in an empty demo project.
-- It creates all Nursery–12 classes, A/B sections, suitable subjects and 11 months of syllabus.
do $$
declare c text; grp text; cid uuid; sid uuid; subj text; mon text; idx int; subjects_for_class text[];
begin
  foreach c in array array['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'] loop
    grp := case when c in ('Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8') then 'PRIMARY' else 'SENIOR' end;
    insert into classes(class_name,class_group) values(c,grp) on conflict(class_name) do update set class_group=excluded.class_group returning id into cid;
    insert into sections(class_id,section_name) values(cid,'A'),(cid,'B') on conflict do nothing;
    subjects_for_class := case when c in ('Nursery','LKG','UKG') then array['English','Hindi','Mathematics','EVS'] when c in ('Class 1','Class 2','Class 3','Class 4','Class 5') then array['English','Hindi','Mathematics','EVS','Computer'] when c in ('Class 6','Class 7','Class 8','Class 9','Class 10') then array['English','Hindi','Mathematics','Science','Social Science','Computer'] else array['English','Physics','Chemistry','Mathematics','Biology'] end;
    foreach subj in array subjects_for_class loop
      insert into subjects(subject_name) values(subj) on conflict(subject_name) do update set subject_name=excluded.subject_name returning id into sid;
      idx := 0;
      foreach mon in array array['April','May','June','July','August','September','October','November','December','January','February'] loop
        idx := idx+1;
        insert into syllabus_topics(class_id,subject_id,month,unit_chapter_en,topic_en,assessment_en,status,remarks)
        values(cid,sid,mon,format('%s %s — Unit %s',c,subj,idx),format('Core %s concepts and practice',subj),'Monthly assessment',(array['Done','In Progress','Not Done'][(idx%3)+1])::topic_status,'Demo academic syllabus');
      end loop;
    end loop;
  end loop;
end $$;
