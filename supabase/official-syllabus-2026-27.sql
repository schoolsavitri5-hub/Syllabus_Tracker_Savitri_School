-- Generated for approved 2026-27 Class 1-8 PDF.
-- Nursery, LKG, UKG removed per school specification.
begin;
insert into public.classes (class_name, class_group) values ('Class 1', 'PRIMARY'), ('Class 2', 'PRIMARY'), ('Class 3', 'PRIMARY'), ('Class 4', 'PRIMARY'), ('Class 5', 'PRIMARY'), ('Class 6', 'PRIMARY'), ('Class 7', 'PRIMARY'), ('Class 8', 'PRIMARY') on conflict (class_name) do update set class_group = excluded.class_group;
insert into public.subjects (subject_name) values ('A.R.T'), ('Activity'), ('Computer'), ('E.V.S'), ('English'), ('G.K'), ('Grammar'), ('Hindi'), ('Math'), ('Rhymes'), ('Sanskrit'), ('Science'), ('Social Studies'), ('Table Book'), ('Vyakaran') on conflict (subject_name) do nothing;
delete from public.syllabus_topics where class_id in (select id from public.classes where class_name in ('Nursery', 'LKG', 'UKG'));
delete from public.classes where class_name in ('Nursery', 'LKG', 'UKG');
delete from public.syllabus_topics where class_id in (select id from public.classes where class_name in ('Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'));
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Unit 1 – Seekh Aur Sangeet
Lesson 1 – Samay ki Pabandi
Lesson 2 – Mochi aur Baune
Lesson 3 – Railgadhi ki Kahani', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – Sangeet ka Fhal
Lesson 5 – Pyara Upahar
Unit 2 – Parivar Aur Sair – Sapata
Lesson 6 – Maa ki Seekh
Lesson 7 – Udaipur ki Sair
Subh ki Sair ( Reading Only )', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit 3 – Parisham Aur Budhimani
Lesson 8 – Sabse Bada Amir
Lesson 9 – Sadak Nahi Chalti
Lesson 10 – Mehanat
Chite ki Khal me Gadha (Reading Only)', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit 4 – Mera Desh Aur Jankari
Lesson 11 – Hamara Pyara Triranga
Lesson 12 – Traffic Light
Lesson 13 – Tree
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 3', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 to 7', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 to10', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 to 15
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Unit-1: Fun with Friends
• Fun with pictures
Lesson – 1 The Fat Cat
Lesson – 2 The Pets at the Feast
• Life Skills
Lesson – 3 Picnic Time', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Unit-2: Welcome to My World
• Fun with pictures
Lesson – 4 It is Fun
Lesson – 5 Save the Earth
Unit-3: Going Places
• Fun with pictures
Lesson – 6 Boats Sail on the Rivers
Lesson – 7 Come and Go
• Activity for Fun', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit-4: Life Around Us
• Fun with pictures
Lesson – 8 We are Going to the Zoo
Lesson – 9 Why Dogs Chase Cars
Lesson – 10 The Cunning Fox', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit-5: Harmony
• Fun with pictures
Lesson – 11 Little Drops of Water
• The Little Plant (Only For
reading)
Lesson – 12 Community Helpers
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Self Introduction:
Name, Class, Mother and Father
Name…
Picture Description:
चित्र चिखाकर तीन-िार वाक्य बोलना।
Save tree Drawing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Patriotic Song
(िेशभक्ति गीत)
Good Habits Chart
अच्छी आितें िार्ट
Festival Drawing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Simple Science Experiments
Greeting Card Making', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Indoor Games
Show and Tell
चिखाएँ और बताएँ', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – The Sentence
Lesson 2 – Affirmative And Nega.
Lesson 3 – The Noun
Lesson 4 – Nouns : Singular
Section – II : Writing Skills
Lesson 1 – Paragraph Writing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 5 – Nouns : Countable and Un.
Lesson 6 – Nouns : Masculine and
Fem.
Lesson 7 – Nouns : Pronouns
Lesson 8 – Adjectives
Lesson 9 – Verbs
Section – II : Writing Skills
Lesson 2 – Story Writing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 10 – Use of Is, Am, Are (M.V.)
Lesson 11 – Use of Was, Were (M.V.)
Lesson 12 – Is, Am, Are (H.V)
Lesson 13 – Was, Ware (H.V.)
Section – II : Writing Skills
Lesson 3 – Letter Writing', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 14 – Use of Has, Have, Had
Lesson 15 – Articles : A, An, The
Lesson 16 – Position Words
(Prepo.)
Lesson 17 – Conjunctions (J.W.)
Section – III : Reading Skills
Lesson 1 – Comprehension
Passages
Lesson 2 – Antonyms', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – More About A
Computer', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 2 – Computer Peripherals
Lesson 3 – Activities Using Keyboard
And Mouse
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 4 – Introducing Word 2021
• National Cyber Olympiad', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 5 – Know About The Tux
Paint
Lesson 6 – AI And Robots
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – A Little About Me
Lesson 2 – Human Body', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Family Relations
Lesson 4 – What Different People Do?
Lesson 5 – Plants
Lesson 6 – Animal Kingdom', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 – Our Earth
Lesson 8 – Air And Water', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 9 – Weather And Seasons
Lesson 10 – Food for Us
Lesson 11 – Safety Rules
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 4', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 to 9', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 to 13', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 to 18
Assessement.', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Page No. 2 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Page No. 7 to 11', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Page No. 12 to 16', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Page No. 17 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Matching I – V
(Explore Further)
Lesson 2 – Sorting I – V
Lesson 3 – GK Treasure – I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – Classification I – VI
( Explore Further )
Lesson 5 – Ordering I – III
Lesson 6 – GK Treasure – II
Mock Test – I
Lesson 7 – Patterns I – V
(Explore Further)', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – Shadows I – III
Lesson 9 – GK Treasure – III
Lesson 10 – Tiles I – III
(Explore Further)', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – Quantitative Quiz I-
III
Lesson 12 – GK Treasure – IV
Mock Test – II
Olympiad Test Paper – I – II
Let’s Challenge Ourselves!', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Book Work :
(Colouring)
Page No. 1 to 5
(Craft)
Page No. 1 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Book Work :
(Colouring)
Page No. 6 to 10
(Craft)
Page no. 7 to 12', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Book Work :
(Colouring)
Page No. 11 to 15
(Craft)
Page no. 13 to 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Book Work :
(Colouring)
Page No. 16 to 20
(Craft)
Page no. 19 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 2' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Dubati Madhumakhi
(Picture Reading – Reading Only)
Unit – 1 : Parivar Aur Seekh
Lesson 1 – Nanhe Balak
Lesson 2 – Raja Aur Bhichuk
Lesson 3 – Accha Aacharan
Lesson 4 – Dadi Ma ka Radio', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Unit – 2 : Sair – Sapata Aur Tyohar
Lesson 5 – Titli
Lesson 6 – Keral ki Yatra (Patr)
Lesson 7 – Chalo, Picnic Chale
Lesson 8 – Onam', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit – 3 : Jeev–Jagat Aur Paryavara
Lesson 9 – Gaay
Lesson 10 – Kali koyal
Lesson 11 – Pradushan', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit – 4 : Bahaduri Aur Upyogi
Jankari
Lesson 12 – Maharana Pratap Singh
Lesson 13 – Kaun Shreshth
Mother Teresa ( Reading Only )
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 4', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 to 8', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 9 to 11', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 12 to 15
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Unit-1: Fun with Friends
• Fun with pictures
Lesson – 1 What is Pink?
Lesson – 2 On the Beach
Lesson – 3 Mother’s Gift', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson – 4 The Best Friend
• Life Skills
Unit-2: Toys and Games
• Fun with pictures
Lesson – 5 Little Elephants
Lesson – 6 A Unique Game
Lesson – 7 I want Many Toys', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit-3: Good Food
• Fun with pictures
Lesson – 8 Cookies for Santa
• Test of Intelligence
Lesson – 9 Lunch Time
Lesson – 10 A Restaurant', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit-4: The Sky
• Fun with pictures
Lesson – 11 O, Look at the Moon
Lesson – 12 Why the Sun Lives in
the sky
• Rain in Summer (Only for
reading)
Lesson – 13 The Chandrayaan
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Self Introduction:
Name, Class, Mother and Father
Name…
Picture Description:
चित्र चिखाकर तीन-िार वाक्य बोलना।
Save tree Drawing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Patriotic Song
(िेशभक्ति गीत)
Good Habits Chart
अच्छी आितें िार्ट
Festival Drawing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Simple Science Experiments
Greeting Card Making', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Indoor Games
Show and Tell
चिखाएँ और बताएँ', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – The Sentence
Lesson 2 – Parts Of a Sentence
Lesson 3 – Interrogative Sentences
Lesson 4 – Irregular Plural Nouns
Lesson 5 – Proper Nouns
Lesson 6 – Collective Nouns
Section – II : Writing Skills
Lesson 1 – Paragraph writing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 7 – Possessive Forms of Nouns
Lesson 8- Nouns : Male And Female
Lesson 9 – Pronouns
Lesson 10 – Pronouns : This, That….
Lesson 11 – Adjectives
Section – II : Writing Skills
Lesson 2 – Story Writing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 12 – Comparison of Adjectives
Lesson 13 – Verbs (Doing Words)
Lesson 14 – Simple Present Tense
Lesson 15 – Present Continuous Tense
Lesson 16 – Adverbs (Describing
Verbs)
Section - II : Writing Skills
Lesson 3 – Letter Writing', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 17 – Articles : A, An, The
Lesson 18 – Punctuation
Lesson 19 – Prepositions
Lesson 20 – Conjunctions
Lesson 21 – Interjection
Section – III : Reading Skills
Comprehension
Passages', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Components of a
Computer
Lesson 2 – Basic of Operating
System', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Editing in Word 2021
Lesson 4 – Let’s Format Document….
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 5 – Let’s Paint with Paint 3D
Lesson 6 – Coding With Scratch
• National Cyber Olympiad', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 7 – Internet
Lesson 8 – Knowing Artificial
Intelligence (AI)
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Being Together
Lesson 2 – Games For Fun
Lesson 3 – Festivals', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – Know More About Plants
Lesson 5 – Leaves
Lesson 6 – Animals World
Lesson 7 – Feathered Friends', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – Water – The Precious Gift
of Nature
Lesson 9 – Our Food
Lesson 10 – Be Healthy Be Happy', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – Potter’s Wheel
Lesson 12 – Houses
Lesson 13 – Our Universe
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='E.V.S';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Page No. 2 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Page No. 7 to 11', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Page No. 12 to 16', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Page No. 17 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='Table Book';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy
Lesson 2 – Series
Lesson 3 – Classification
Lesson 4 – Directions
Lesson 5 – Patterns
Lesson 6 – Quizopedia
Lesson 7 – GK Treasure – I
Explore Further
Olympiad Test - English', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part B : Non – Verbal Aptitude
Lesson 8 – Analog
Lesson 9 – Patterns
Lesson 10 – Classification
Lesson 11 – Figure Completion
Lesson 12 – Matching Halves
Lesson 13 – Mirror Images
Lesson 14 – Water Images
Lesson 15 – GK Treasure – II
Explore Further
Olympiad Test – Science', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Part C : Quantitative Aptitude
Lesson 16 – Ages
Lesson 17 – Play with Numbers
Lesson 18 – Mathematical Operations
Lesson 19 – Counting Shapes
Lesson 20 – Mental Maths
Lesson 21 – Problem Solving
Lesson 22 – GK Treasure – III
Explore Further
Olympiad Test – Maths', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Part D : Aptitude Tests
Aptitude Test I – VI
Lesson 23 – GK Treasure – IV
Explore Further
Olympiad Test – Cyber
Lesson 24 – GK Treasure – V
Explore Further
Let’s Challenge Ourselves!', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Book Work :
(Colouring)
Page No. 1 to 5
(Craft)
Page No. 1 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Book Work :
(Colouring)
Page No. 6 to 10
(Craft).
Page no. 7 to 12', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Book Work :
(Colouring)
Page No. 11 to 15
(Craft)
Page no. 13 to 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Book Work :
(Colouring)
Page No. 16 to 20
(Craft)
Page no. 19 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 3' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – सवेरा
Lesson 2 – परोपकारी शतपत्र
Lesson 3 - स्वस्थ शरीर', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – असली योगिान
Lesson 5 – चिमालय
Lesson 6 – सािसी रूपा
Lesson 7 – िीरा और मोती
Lesson 8 – मछुआरे की सूझभूझ
चिसका काम उसी को सािे (Reading only)', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 9 – गलती सबसे िोती िै
Lesson 10 – िेलेन के लर
Lesson 11 – फ्ूूंली
Lesson 12 – गौरैया का उपिार', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 13 – िेशगान
Lesson 14 – भारत का नृत्य
Lesson 15 – सुन्दर शिर : मैसूर
Lesson 16 – कूं प्यूर्र
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 3 and 17', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 to 6, 14 and 16', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 to 9 and 15', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 10 to 13 and 18
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Unit-1: Our Nature
• Fun with pictures
Lesson – 1 I would like to be
Lesson – 2 The cactus :A desert plant
Lesson – 3 Birds held an election', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson – 4 Pollution
Unit-2: Technology
• Fun with pictures
Lesson – 5 Computer Prayer
• Life Skills
Lesson – 6 A domestic robot
Lesson – 7 The Wright Brothers', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit-3 Celebration
• Fun with pictures
Lesson – 8 Butterfly Laughter
Lesson – 9 Nag Panchami : The
Lesson – 10 Dances of India
• Test of Intelligence', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit-4 Our Past
• Fun with pictures
Lesson – 11 Nation’s Builders
Lesson – 12 Inquilab Zindabad
Lesson – 13 Letter to Daughter
• Mary Had a Little Lamb
(Only for reading)
Lesson – 15 Akbar Fell Ill
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'School Rules Chart
Reading Aloud
Uses of Trees Chart', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Freedom fighters Chart
Healthy Food Poster
Story from Ramayana / Mahabharata', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Science Model ( Simple )
Best from Waste', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Yoga and Exercise
Speech Practice', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – The Sentence : Kinds….
Lesson 2 – Sentences : Positive and ..
Lesson 3 – The Nouns : Kinds
Lesson 4 – Nouns : Countable and …
Lesson 5 – Nouns : Singular and …
Lesson 6 – Nouns : Gender
Section – III : Reading Skills
Lesson 1 – Bees', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 7 – Possessive Nouns
Lesson 8 – Verbs
Lesson 9 – Subject – Verb Agreement
Lesson 10 – Simple Present Tense
Lesson 11 – Present Continuous Tense
Lesson 12 – Simple Past Tense
Lesson 13 – Past Continuous Tense
Section – II : Writing Skills
Lesson 1 – Paragraph Writing
Section – III : Reading Skills
Lesson 2 – Meera’s Brave Sacrifice', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 14 – Simple Future Tense
Lesson 15 – Future Continuous
Tense
Lesson 16 – Personal Pronouns
Lesson 17 – Demonstrative Pronouns
Lesson 18 – Adjective
Lesson 19 – Comparison of
Adjectives
Section – II : Writing Skills
Lesson 2 – Story Writing
Section – III : Reading Skills
Lesson 3 – The Little Ant', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 20 – Models : Can, May
Lesson 21 – Adverbs
Lesson 22 – Punctuation
Lesson 23 – Prepositions
Lesson 24 – Conjunctions
Section – II : Writing Skills
Lesson 3 – Notice Writing
Section - III : Reading Skills
Lesson 4 – The Painter’s Magic
Brush', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Computer And Its Types
Lesson 2 – Computer Ports
• Swachh Bharat Abhiyan', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – More on Windows 11
Lesson 4 – Advanced Features of Word
2021
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 5 – Introduction To P.P.2021
Lesson 6 – More On Scratch
• National Cyber Olympiad', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 7 – Know About the Internet
Lesson 8 – Application of AI
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Globe and Maps
Lesson 2 – Exploring India and its
Neighbours
Lesson 3 – The Himalayan Heights', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – Northern Plains
Lesson 5 – The Thar Desert
Lesson 6 – The Southern Plateaus
Lesson 7 – The Coastal Plains', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – India
Lesson 9 – Natural Resource
Lesson 10 – Natural Resource : Soil', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – Natural Resource :
Water
Lesson 12 – Natural Resource :
Mine.
Lesson 13 – India : Farming
Lesson 14 – Indian Constitution
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 5', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 6 to 10', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 11 to 15', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 16 to 20
Quiz Challenges.', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy I – III
Lesson 2 – Series I – V
Lesson 3 – Classification I – IV
Explore Further
Lesson 4 – Ranking
Lesson 5 – Patterns I – II
Lesson 6 – Logical Sense I – II
Lesson 7 – GK Treasure – I
Olympiad Test – English', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part B : Non – Verbal Aptitude
Lesson 8 – Analogy
Lesson 9 – Patterns I – IV
Lesson 10 – Classification
Explore Further
Lesson 11 – Figure Matrix
Lesson 12 – Figure Completion
Lesson 13 – Mirror Images
Lesson 14 – GK Treasure – II
Olympiad Test – Science
Explore Further', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Part C : Quantitative Aptitude
Lesson 15 – Ages
Lesson 16 – Numbers I – II
Lesson 17 – Mathematical
Operations I – III
Explore Further
Lesson 18 – Fractions
Lesson 19 – Mental Maths I – III
Lesson 20 – Problem Solving
Lesson 21 – GK Treasure – III
Olympiad Test – Maths', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Part D : Aptitude Tests
Aptitude Test I – V
Explore Further
Lesson 22 – GK Treasure – IV
Olympiad Test – Cyber
Lesson 23 – GK Treasure – V
Let’s Challenge Ourselves', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Book Work :
(Colouring)
Page No. 1 to 5
(Craft)
Page No. 1 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Book Work :
(Colouring)
Page No. 6 to 10
(Craft).
Page no. 7 to 12', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Book Work :
(Colouring)
Page No. 11 to 15
(Craft)
Page no. 13 to 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Book Work :
(Colouring)
Page No. 16 to 20
(Craft)
Page no. 19 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – वन्दना
Lesson 2 – प्रातः काचलकी सुषमा
Lesson 3 – सङ्घे शक्ति:', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – अम्लाचन द्राक्षाफलाचन
Lesson 5 – बुद्धे: िातुयटम
Lesson 6 – मूखाट : चशष्या:
Lesson 7 – गणतन्त्रः चिवसः', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – वीर: बालक: (अचभमन्यु)
Lesson 9 – परोपकार :
Lesson 10 – मूढ: श्रचमकः', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – सूंस्कृ त भाषा
Lesson 12 – ज्ञानप्रिाः श्लोका:
Lesson 13 – वसन्त ऋतु :
Lesson 14 – शब्दरूपाचण', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – How Animals Reproduce
Lesson 2 – Animals Classification', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Plants
Lesson 4 – Plants : Adaptation
Lesson 5 – Food and Our Body
Lesson 6 – Teeth and Microbes', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 – Food and Water
Lesson 8 – Safety Protocols', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 4' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – उठो धरा के अमर सपूतो ूं
Lesson 2 – मै और मेरा िेश
Lesson 3 – मिात्मा गाूंधी
Lesson 4 – बालक िूंद्रगुप्त', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 – वृक्ष
Lesson 6 – चिट्ठी
Lesson 7 – कर बुरा तो िो बुरा
Lesson 8 – चिसमस का के क
Lesson 9 – मेरा बिपन', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 – सत्य की िीत
Lesson 11 – िौधरी सािब की भैस
Lesson 12 – स्वास्थ्य :सबसे बड़ा धन
Lesson 13 – िै अरमान यिी', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 – गुरु मिाराि का आगमन
Lesson 15 – बाल मििूरी
Lesson 16 – कबड्डी
खुश रचिए, स्वस्थ रचिए ( Reading Only
)
Lesson 17 – पयाटवरण
Lesson 18 – स्पूतचनक की उड़ान
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 3 and 17', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 to 7, 16 and 19', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 to 10 and 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 to 15 and 20
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Unit-1: Environment Awareness
• Fun with pictures
Lesson – 1 Rain in Summer
Lesson – 2 Sea Anger
Lesson – 3 Birth of Coal
Lesson – 4 The Chipko Movement', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Unit-2: Technology
• Fun with pictures
Lesson – 5 Science
• Life Skills
Lesson – 6 Step on the Moon
Lesson – 7 Sir J.C. Bose
Lesson – 8 The Robot', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Unit-3: Travellers and Their Journeys
• Fun with pictures
Lesson – 9 A Voyage
Lesson – 10 A Fellow Traveller
Lesson – 11 Sail Off the Earth
Lesson – 12 Bachendri Pal', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Unit-4: Stories
• Fun with pictures
Lesson – 13 The Muffin Man
Lesson – 14 The Ass Has no brain
• Test of Intelligence
• The Noblest Deed (Only
for reading)
Lesson - 15 Vishvamitra
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'School Rules Chart
Reading Aloud
Uses of Trees Chart', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Freedom fighters Chart
Healthy Food Poster
Story from Ramayana / Mahabharata', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Science Model ( Simple )
Best from Waste', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Yoga and Exercise
Speech Practice', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – Kinds of Sentences
Lesson 2 – Negative Sentences
Lesson 3 – Interrogative Sentences
Lesson 4 – Phrases and Clauses
Lesson 5 – Question Tags
Section – II : Writing Skills
Lesson 1 – Paragraph Writing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 6 – Parts of Speech
Lesson 7 – Common and Proper Nouns
Lesson 8 – Abstract and Concrete Nouns
Lesson 9 – Countable and Uncountable
Lesson 10 – Pronouns
Section – II : Writing Skills
Lesson 3 – Essay Writing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 11 – Adjectives
Lesson 12 – Adjectives : Degrees
Lesson 13 – Preposition
Lesson 14 – Articles
Lesson 15 – Adverbs
Section –II : Writing Skills
Lesson 2 – Notice Writing', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 16 – Punctuation
Lesson 17 – Tenses
Lesson 18 – Subject-Verb
Agreement
Lesson 19 – Modals
Lesson 20–Direct and Indirect
Speech
Section – II : Writing Skills
Lesson 4 – Letter Writing
Section – III : Reading Skills
Lesson 1 – Comprehension', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Birth of Computer
Lesson 2 – Managing Windows 11
• Constitution of India', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – More on Word 2021
Lesson 4 – Enhancing PowerPoint 2021
Lesson 5 – Introduction to Excel 2021
• Project work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 6 – Editing and Formatting in
Lesson 7 – Algorithm and Flowchart
• National Cyber Olympiad', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 8 – Internet and Emails
Lesson 9 – Evaluation of AI
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Globe and Maps
Lesson 2 – Latitudes and Longitude
Lesson 3 – Movements of The
Earth
Lesson 4 – Weather and Climate', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 – Congo
Lesson 6 – Greenland
Lesson 7 – Saudi Arabia
Lesson 8 – Prairies
Lesson 9 – Conquering Distances', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 – The World of Growing
Lesson 11 – Health in Your Hands
Lesson 12 – The Age of Machines
Lesson 13 – The Revolt of 1857', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 – Great People Never
Die
Lesson 15 – The Working of the
UN
Lesson 16 – Trade and
Globalisation
Lesson 17 – Beyond the Bank
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 7', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 8 to 14', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 15 to 19', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 20 to 25', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy
Lesson 2 – Series
Lesson 3 – Classification
Explore Further
Lesson 4 - Alphabet Test
Lesson 5 – Break the codes
Lesson 6 – Quizopedia
Lesson 7 – GK Treasure – I
Olympiad Test – English', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part B : Non-Verbal Aptitude
Lesson 8 – Analogy
Lesson 9 – Patterns
Lesson 10 – Classification
Lesson 11 – Embedded Figures
Lesson 12 – Figure Completion
Explore Further
Lesson 13 – Mirror Images
Lesson 14 – Lines and Points
Lesson 15 – Shading Parts of Figures
Lesson 16 – Cubes
Lesson 17 – GK Treasure – II
Olympiad Test – Science', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Explore Further
Part C : Quantitative Aptitude
Lesson 18 – Ages
Lesson 19 – Numbers
Lesson 20 – Mathematical Operations
Explore Further
Lesson 21 – Fractions
Lesson 22 – Mental Maths
Lesson 23 – Roman Numerical
Lesson 24 – GK Treasure – III
Olympiad Test – Maths', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section D : Aptitude tests
Aptitude Test I – VI
Explore Further
Lesson 25 – GK Treasure – IV
Lesson 26 – GK Treasure – V
Olympiad Test – Cyber
Let’s Challenge Ourselves !', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Book Work :
(Colouring)
Page No. 1 to 5
(Craft)
Page No. 1 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Book Work :
(Colouring)
Page No. 6 to 10
(Craft).
Page no. 7 to 12', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Book Work :
(Colouring)
Page No. 11 to 15
(Craft)
Page no. 13 to 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Book Work :
(Colouring)
Page No. 16 to 20
(Craft)
Page no. 19 to 24', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Reproduction in Plants
Lesson 2 – Animals Around Us', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Bones and Muscles
Lesson 4 – Respiratory System and
Lesson 5 – Staying Healthy
Lesson 6 – Safety First', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 – Air and Water
Lesson 8 – Our Amazing Planet : Earth
Lesson 9 – Light, Shadows, and Eclipses', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 10 – Our Environment and
Lesson 11 – Rocks, Minerals, and
Lesson 12 – Matter and Its
Changing
Lesson 13 – Force, Friction, and
Test Paper – 1
Test Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – वन्दना
Lesson 2 – अकारान्त - पुचलङ्गम
Lesson 3 – प्रथमः पुरुष :- एकविनम्', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – प्रथमः पुरुष :- चिविनम्
Lesson 5 – प्रथमः पुरुष :- बहुविनम्
Lesson 6 – आकारान्त - स्त्रीचलङ््‌गम्
Lesson 7 – प्रथमः पुरुष :- स्त्रीचलङ््‌गम्', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – अकारान्त नपुूंसकचलङ्गम्
Lesson 9 – प्रथम पुरुष : नपुूंसकचलङ्गम्
Lesson 10 – मध्यम पुरुष : एकविनम्', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – मध्यम पुरुष : चिविनम्
Lesson 12 – मध्यम पुरुष : बहुविनम्
Lesson 13 – उत्तम पुरुष : चत्र - विनम्
Lesson 14 – सम्बोधन
व्याकरण', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 5' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – वीरो ूंकी पूिा
Lesson 2 – हृिय पररवतटन
Lesson 3 – मेरा धमट , मेरा ईश्वर
Lesson 4 – त्याग', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 – उठो धरा के अमर सपूतो
Lesson 6 – िूचलया
Lesson 7 – गुरु नानक
Lesson 8 – िार की िीत
Lesson 9 – कोचशश करने वालो ूंकी िार निी ूं
िोती', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 – बिािुर धोबी
Lesson 11 – बिले की आग
Lesson 12 – आप भले तो िग भला
Lesson 13 – सूरिास के पि', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 – यक्ष और युचधचिर
Lesson 15 – सामूचिक प्रयास
Lesson 16 – मैंने तैरना सीखा
Lesson 17 – बहुत चिनो ूंसे सोि रिा था
Lesson 18 – स्त्री की पीड़ा
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – भाषा चलचप और व्याकरण
Lesson 2 – वणट चविार
Lesson 3 – शब्द चविार
Lesson 4 – शब्द रिना : उपसगट
Lesson 5 – शब्द रिना : प्रत्यय
Lesson 22 – सूंवाि लेखन', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 6 – समास
Lesson 7 – सूंचध
Lesson 8 – सूंज्ञा
Lesson 9 – चलूंग
Lesson 10 – विन
Lesson 24 – अनुच्छेि लेखन
Lesson 25 – किानी लेखन', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 11 – कारक
Lesson 12 – सवटनाम
Lesson 13 – चवशेषण
Lesson 14 – चिया
Lesson 15 – काल एवूं वाच्य
Lesson 16 – अचवकारी शब्द
Lesson 23 – डायरी लेखन', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 17 – शब्द भूंडार
Lesson 18 – वाक्य चविार
Lesson 19 – चवराम चिन्ह
Lesson 20 – मुिावरे एवूं लोकोक्तियाूं
Lesson 21 – अपचठत
Lesson 26 – पत्र लेखन
Lesson 27 – चनबूंध लेखन
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Green All Around
Lesson 2 – Do Animals Think?
Lesson 3 – Childhood Bliss', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – The Voyage
Lesson 5 – Bhutan: The Green Heaven
Lesson 6 – Mother the Life – Giver
Lesson 7 – My Tree
Lesson 8 – Snow White and the Seven', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 9 – The Art and the Artist
Lesson 10 – On Killing a Tree
Lesson 11 – The Clever Girl', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 12 – Flying Beast
Lesson 13 – Clouds and Wave
Lesson 14 – The Magic unicorn
Lesson 15 – On a Winter’s Night', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Discipline and Goal Setting
Hindi/English Paragraph Writing
Environment Speech', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Speech / Essay on Independence
Health Awareness talk
Moral Values Discussion', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Science Quiz
Poster Making Competition', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Sports Awareness and Practice
Debate / Group Discussion', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – The Sentences
Lesson 2 – Phrases and Clauses
Lesson 3 – The Nouns
Lesson 4 – Articles
Lesson 5 – Determiners
Lesson 6 – Adjectives
Section – II : Writing Skills
Lesson 1 – Diary Writing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 7 – Adjectives of Comparison
Lesson 8 – The Position and Order of..
Lesson 9 – Finite and Non-Finite Verbs
Lesson 10 – The Pronoun
Lesson 11 – Simple Present
Lesson 12 – Simple Past
Section – II : Writing Skills
Lesson 2 – Letter Writing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 13 – Present Perfect
Lesson 14 –Use of ‘Will’ and ‘Going to’
Lesson 15 – Expressing Future Time
Lesson 16 – Modal Verbs
Lesson 17 – Active And Passive Voice
Lesson 18 – Direct and Indirect Speech
Section – II : Writing Skills
Lesson 3 – Paragraph Writing', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 19 – Prepositions
Lesson 20 – Conjunctions
Lesson 21 – Punctuation
Lesson 22 – Conditional
Sentences
Lesson 23 – Adjectives Clauses
Lesson 24 – Adverb Clauses
Section – II : Writing Skills
Lesson 4 – Essay Writing
Section – III : Reading Skills
Lesson 1 – Comprehension
Passages', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Basics of Programming
Lesson 2 – Setting in Windows 11
• Worksheet – 1', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Table in Word 2021
Lesson 4 – Enhancing the Presentation
Lesson 5 – Introduction to Excel 2021
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 6 – Editing and Formatting in
Excels
Lesson 7 – Krita – Image Editor
• Worksheet – 2', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 8 – Internet and Emails
Lesson 9 – Uses of AI in
Languages
• National Cyber Olympiad', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Geography :
Lesson 1 – िमारी पृथ्वी और सौरमूंडल
Lesson 2 – ग्लोब - अक्षाूंश और िेशाूंतर
History :
Lesson 1 – ऐचतिाचसक िानकाररयाँ
Lesson 2 – िमारे पूवटि
Civics :
Lesson 1 – अनेकता को समझना
Lesson 2 – पूवटग्रि , असमानता और
भेिभाव', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Geography :
Lesson 3 – पृथ्वी की गचतयाँ
Lesson 4 – पृथ्वी - मुख्य मूंडल
History :
Lesson 3 – सूंग्रािक से कृ षक
Lesson 4 – चसूंधु घार्ी सभ्यता
Lesson 5 – वेिो ूंका युग
Civics :
Lesson 3 – सरकार और सरकार िलाना
Lesson 4 – प्रिाताूंचत्रक सरकार के मुख्य
अवयव', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Geography :
Lesson 5 – पृथ्वी के स्थल - रूप
Lesson 6 – भारत - भौचतक भाग
History :
Lesson 6 – िनपि तथा मिािनपि
Lesson 7 – अशोक - साम्राज्य और प्रशासन
Civics :
Lesson 5 - स्थानीय सरकार', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Geography :
Lesson 7 - भारत - िलवायु, वनस्पचत
और वन्य िीव
History :
Lesson 8 – िूर स्थानो ूंसे सूंबूंध
Lesson 9 – चवज्ञान और सूंस्कृ चत
Civics :
Lesson 6 – ग्रामीण आिीचवका
Lesson 7 – नगरीय आिीचवका
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 3', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 to 7', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 to 10', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 to 13', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy I – III
Lesson 2 – Series I – III
Lesson 3 – Classification I – II
Lesson 4 – Break the codes
Lesson 5 – Analytical Reasoning
Lesson 6 – GK Treasure – I
Lesson 7 – Direction
Lesson 8 – Sequencing
Lesson 9 – Ages
Lesson 10 – Logical Problems
Lesson 11 – Computer Quiz
Explore Further', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part B : Non-Verbal Aptitude
Lesson 12 – Analogy I – III
Lesson 13 – Classification I – II
Lesson 14 – Mirror Images
Lesson 15 – Water Images
Lesson 16 – Completing
Lesson 17 – Paper Folding
Lesson 18 – Clock Puzzles
Lesson 19 – GK Treasure – II
Explore Further
Olympiad Test – English
Olympiad Test – Science
Part C : Quantitative Aptitude
Lesson 20 – Multiplication
Lesson 21 – Costing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 22 – Division
Lesson 23 – Smallest / Greatest
Explore Further
Lesson 24–Mathematical Operations I-II
Lesson 25 – Number puzzle
Lesson 26 – Mixed Problems
Lesson 27 – GK Treasure – III
Lesson 28 – Analytical Reasoning
Lesson 29 – Data Analysis
Lesson 30 – Bar Chart
Lesson 31 – Pie Chart
Lesson 32 – Line Chart
Explore Further', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Part D : Aptitude Test – I – V
Olympiad Test – Maths
Olympiad Test – Cyber
Lesson 33 – GK Treasure – IV
Part F : Word Building
Lesson 34 – Homophones
Lesson 35 – Occupations
Lesson 36 – Prefix and Suffix
Lesson 37 – Anagrams
Lesson 38 – Similes and
Metaphors
Lesson 39 – Onomatopoeia
Explore Further
Let’s Challenge Ourselves!', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Introduction
Lesson 2 – Still Life Composition
Lesson 3 – Green Leaves
Lesson 4 – Fresh Vegetables
Lesson 5 – Healthy Fruits
Lesson 6 – Beautiful Flowers', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 7 – Funny Birds
Lesson 8 – Water Animals
Lesson 9 – Insects and Reptiles
Lesson 10 – Cute Animals
Lesson 11 – Landscape (Water Colours)
Lesson 12 – Landscape (Pencil Shading)', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 13 – Landscape (Pastel Colours)
Lesson 14 – Landscape (Oil Pastel)
Lesson 15 – Trees
Lesson 16 – Human Body
Lesson 17 – Portrait
Lesson 18 – Waste Material Art', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 19 – Cartoon Drawing
Lesson 20 – Human Composition
Lesson 21 – Folk Art
Lesson 22 – Poster Making
Lesson 23 – Air Pollution
Lesson 24 – Madhubani Painting
Lesson 25 – Mehandi Design
Lesson 26 – Rangoli Design', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – The Wonderful World
Lesson 2 – Diversity in the Living
Periodic Assessment – I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Mindful Eating
Lesson 4 – Exploring Magnets
Lesson 5 – Measurement of Length
Lesson 6 – Materials Around Us
Half Yearly Examination', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 – Temperature and its
Lesson 8 – A journey through states of
Lesson 9 – Methods of Separation in
Periodic Assessment – II', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 10 – Living Creatures
Lesson 11 – Nature’s Treasures
Lesson 12 – Beyond the Earth
Annual Examination', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'वन्दना
प्रथम: पाठ: – अकारान्त पुक्तिङ्ग
चितीय: पाठ: – अकारान्त स्त्रीचलङ्ग
तृतीय: पाठ: – अकारान्त नपुूंसकचलङ्ग
ितुथट: पाठ: – सवटनाम प्रयोग (प्रथम पुरुष,
लर्् लकार)', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'पूंिम: पाठ: – सवटनाम प्रयोग: (मध्यम पुरुष, लर््
लकार)
षि: पाठ: – सवटनाम प्रयोग: (उत्तम पुरुष, लर््
लकार)
सप्तम पाठ – लङ् लकार (भूतकाल)
अष्टम पाठ – लृर्् लकार (भचवष्यत् काल)
नवम पाठ – अिूं िलूं चपबाचम (चितीया चवभक्ति)', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'िशम पाठ – बालकाः कन्िुके न िीडक्तन्त
एकािश पाठ – वृक्षात् फलाचन पतक्तन्त
िािशः पाठः : वृक्षे फलाचन सक्तन्त', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'त्रयोिशः पाठः : गोपालनन्दनः श्रीकृ ष्णः
ितुिटशः पाठः : सुभाचषताचन
पञ्चिशः पाठः : मूखोपिेशः
षोडशः पाठः : अस्माकूं चवद्यालयः
पररचशष्ट', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 6' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – स्वगट से भी अच्छा
Lesson 2 – सच्चा तीथटयात्री
Lesson 3 – नेतािी सुभाषिन्द्र बोस
Lesson 4 – चमत्रता', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 – िलाओ िीये
Lesson 6 – बीमार का इलाि
Lesson 7 – मिाराणा प्रताप
Lesson 8 – ईिगाि
Lesson 9 – बीि', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 – चबना चविारे िो करे
Lesson 11 – सत्सािस
Lesson 12 – अशोक का अूंचतम युद्ध
Lesson 13 – िल्दीघार्ी का युद्ध', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 – बूढा कु त्ता
Lesson 15 – सत्यवाचिता
Lesson 16 – प्रशूंसा का िक्कर
Lesson 17 – झाँसी की रानी
Lesson 18 – मिाराि का इलाि
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – भाषा चलचप और व्याकरण
Lesson 2 – वणट चविार
Lesson 3 – शब्द चविार
Lesson 4 – शब्द-चनमाटण: उपसगट एवूं
प्रत्यय
Lesson 5 – शब्द-चनमाटण: समास
Lesson 21 – सूंवाि लेखन
Lesson 22 - सार लेखन', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 6 – सूंचध
Lesson 7 – सूंज्ञा
Lesson 8 – चलूंग
Lesson 9 – विन
Lesson 10 – कारक
Lesson 24 – अनुच्छेि लेखन
Lesson 25 – किानी लेखन', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 11 – सवटनाम
Lesson 12 – चवशेषण
Lesson 13 – चिया
Lesson 14 – काल एवूं वाच्य
Lesson 15 – अचवकारी शब्द
Lesson 23 – डायरी लेखन', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 16 – शब्द भूंडार
Lesson 17 – वाक्य चविार
Lesson 18 – चवराम चिन्ह
Lesson 19 – मुिावरे एवूं लोकोक्तियाूं
Lesson 20 – अपचठत
Lesson 26 – पत्र लेखन
Lesson 27 – चनबूंध लेखन
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – The Chronicles of
Eldoria
Lesson 2 – Fight for Freedom
Lesson 3 – How Beautiful is the
Rain', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – The Paradise
Lesson 5 – The Snout Bearers
Lesson 6 – Gulmohar Blossoms
Lesson 7 – The Lion and the Jackal
Lesson 8 – Black Beauty', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 9 – The daffodils
Lesson 10 – The Icons
Lesson 11 – Murder !', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 12 – The Owl and the Pussy-
cat
Lesson 13 – The Share
Lesson 14 – True friends
Lesson 15 – The Last Lesson', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Discipline and Goal Setting
Hindi/English Paragraph Writing
Environment Speech', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Speech / Essay on Independence
Health Awareness talk
Moral Values Discussion', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Science Quiz
Poster Making Competition', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Sports Awareness and Practice
Debate / Group Discussion', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – The Sentence
Lesson 2 – Nouns
Lesson 3 – Pronouns
Lesson 4 – Adjectives
Lesson 5 – The Present Tense
Section – II : Writing Skills
Lesson 4 – Making a Diary Entry', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 6 – The Past Tense
Lesson 7 – The Present Perfect and Past
Lesson 8 – The Present Perfect
Lesson 9 – The Future Tense
Lesson 10 – Verbs
Section – II : Writing Skills
Lesson 1 – Letter Writing
Lesson 3 – Story Writing', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 11 – Adverbs
Lesson 12 – Prepositions
Lesson 13 – Conjunctions
Lesson 14 – Interjections
Lesson 15 – Articles
Section – II : Writing Skills
Lesson 5 – Paragraph Writing', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 16 – Modals
Lesson 17 – Active and Passive Voice
Lesson 18 – Narration :
Lesson 19 – Punctuation
Lesson 20 – Idioms
Section – II : Writing Skills
Lesson 2 – Essay Writing
Section – III : Reading Skills
Comprehension Passages', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Computer Numbering
Lesson 2 – Exploring PowerPoint
Worksheet – 1', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Formulas and Functions
Lesson 4 – Advanced Features of Excel
Lesson 5 – Web Designing Language
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 6 – Introduction to Adobe
Lesson 7 – Introduction to Python
Worksheet – 2', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 8 – Google Apps
Lesson 9 – Artificial Intelligence and
• National Cyber Olympiad', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Geography :
Lesson 1 – िमारा वातावरण
Lesson 2 – पृथ्वी की आूंतररक रिना
History :
Lesson 1 – मध्यकालीन युग
Lesson 2 – नए रािा एवूं राज्य
Civics :
Lesson 1 – प्रिातूंत्र का उत्कषट', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Geography :
Lesson 3 – मुख्य धरातल
Lesson 4 – वायुमूंडल
Lesson 5 – मौसम और िलवायु
History :
Lesson 3 – िचक्षण भारत में रािनीचतक चवकास
Lesson 4 – चििी सल्तनत
Civics :
Lesson 2 – राज्य सरकार
Lesson 3 – सूंसाधनो ूंका चवतरण – राज्य
सरकार', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Geography :
Lesson 6 – वायुिाब एवूं पवन
Lesson 7 – मिासागरीय िल
History :
Lesson 5 – मुगल साम्राज्य
Lesson 6 – सामाचिक िशाएँ और िनिातीय
समुिाय
Civics :
Lesson 4 – सूंिार माध्यम एवूं चवज्ञापन', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Geography :
Lesson 8 – प्राकृ चतक वनस्पचत और
Lesson 9 – मानवीय पयाटवरण – पररविन
History :
Lesson 7 – क्षेत्रीय सूंस्कृ चतयो ूंका उत्कषट
Lesson 8 – नई रािनीचतक सूंरिनाएँ
Civics :
Lesson 5 – चलूंग असमानताएँ
Lesson 6 – िमारे िारो ूंओर के बाजार
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Book :-1
Lesson 1 to 3', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Book :-1
Lesson 4 to 7', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Book :-1
Lesson 8
Book :- 2
Lesson 1 to 3', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Book :-2
Lesson 4 to 7', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy
Lesson 2 – Series
Lesson 3 – Classification
Lesson 4 – Ranking
Lesson 5 – Puzzle Test
Lesson 6 – Substitution
Lesson 7 – Direction Test
Explore Further
Lesson 8 – Problems on Ages
Lesson 9 – Logical Problems
Lesson 10 – Blood Relations
Lesson 11 – Break the Codes
Lesson 12 – Ordering of Words
Lesson 13 – GK Treasure – I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part C : Quantitative Aptitude
Lesson 25 – Numbers
Lesson 26 – Number Puzzle
Lesson 27 – Mathematical Operations
Lesson 28 – Problems Based on Speed,
Lesson 29 – Clock Puzzle
Explore Further
Lesson 30 –Problems on HCF and LCM
Lesson 31 – Quick Calculations
Lesson 32 – Bar Chart
Lesson 33 – Pie Chart
Lesson 34 – Understanding Table
Lesson 35 – Basic Geometric Shapes
Lesson 36 – GK Treasure – III', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Part B : Non-Verbal Aptitude
Lesson 14 – Analogy
Lesson 15 – Classification
Lesson 16 – Mirror Images
Lesson 17 – Water Images
Lesson 18 – Paper Cutting
Explore Further
Lesson 19 – Paper Folding
Lesson 20 – Missing Letter Puzzle
Lesson 21 – Figure Completion
Lesson 22 – Cubes and Cuboids
Lesson 23 – Images Analysis
Lesson 24 – GK Treasure – II', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Part D : Aptitude Test – I and II
Explore Further
Part E : Olympiad Tests
Olympiad Test – English
Olympiad Test – Science
Lesson 37 – GK Treasure – IV
Olympiad Test – Maths
Olympiad Test – Cyber
Part F : Word Building
Lesson 38 – Synonyms
Lesson 39 – Antonyms
Lesson 40 – Idioms and Phrases
Explore Further
Let’s Challenge Ourselves', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Introduction
Lesson 2 – Still Life
Lesson 3 – Vegetables
Lesson 4 – Fruits
Lesson 5 – Flowers
Lesson 6 – Leaves', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 7 – Trees
Lesson 8 – Animals
Lesson 9 – Birds
Lesson 10 – Insects
Lesson 11 – Human ( Anatomy )
Lesson 12 – Landscapes
Lesson 13 – Cartoons', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 14 – Football Players
Lesson 15 – Monument ( Taj Mahal )
Lesson 16 – Poster Designs
Lesson 17 – Madhubani Painting
Lesson 18 – Fun with Tangram
Lesson 19 – Mehandi Designs', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 20 – Action Figures
Lesson 21 – Ice Cream Stick and
Lesson 22 – Sketching
Lesson 23 – Village Ladies
Lesson 24 – Compositions
Lesson 25 – Portraits', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Nutrition in Plants
Lesson 2 – Nutrition in Animals
Periodic Assessment - I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Heat
Lesson 4 – Acids , Bases and Salts
Lesson 5 – Changes Around Us
Lesson 6 – Respiratory in Organisms
Half-Yearly Examination', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 7 – Transportation of Materials
Lesson 8 – Reproduction in Plants
Lesson 9 – Motion and Time
Periodic Assessment – II', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 10 – Electric Current
Lesson 11 – Light
Lesson 12 – Forests
Lesson 13 – Wastewater Management
Annual Examination', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'वन्दना
प्रथमः पाठः : लालबिािुर शास्त्री
चितीयः पाठः : चिमालयः
तृतीयः पाठः : मूखटकाकः', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'ितुथटः पाठः : सुभाचषताचन
पञ्चमः पाठः : षर्् शाण्डूं समािरेत्
षिः पाठः : बालकः ध्रुवः
सप्तमः पाठः : नीलवणटः शृगालः
अष्टमः पाठः : िोचलकोत्सवः', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'नवमः पाठः : ितुरः बीरबलः
िशमः पाठः : गीतोपिेशः
एकािशः पाठः : िेशभिः िन्द्रशेखररािािः
िािशः पाठः : ितुरः वानरः', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'त्रयोिशः पाठः : मूखटसेवकः
ितुिटशः पाठः : विनामृतम्
पञ्चिशः पाठः : कः तस्या पचतः
षोडशः पाठः : कश्मीरः – पृचथव्याः स्वगटः
पररचशष्ट', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 7' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – वर िे
Lesson 2 – जमीन की भूख
Lesson 3 – अच्छे नागररक
Lesson 4 – साइचकल की सवारी', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 5 – इतने ऊँ िे उठो
Lesson 6 – राखी का मूल्य
Lesson 7 – समाि सेवा
Lesson 8 – वापसी
Lesson 9 – पिरू सावधान रिना', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 10 – भारत एक िै
Lesson 11 – प्रायचित
Lesson 12 – वीर बालक
Lesson 13 – पथ की पििान', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 14 – अकबरी लोर्ा
Lesson 15 – चनराश िोने की बात निी ूं
Lesson 16 – भोलाराम का िीव
Lesson 17 – चकसको नमन करूँ मैं
Lesson 18 – स्वणट मरीचिका
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Hindi';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – भाषा चलचप और व्याकरण
Lesson 2 – वणट चविार
Lesson 3 – शब्द चविार
Lesson 4 – शब्द-चनमाटण
Lesson 5 – सूंचध
Lesson 21 – सूंवाि लेखन', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 6 – सूंज्ञा
Lesson 7 – चलूंग
Lesson 8 – विन
Lesson 9 – कारक
Lesson 10 – सवटनाम
Lesson 22 – किानी लेखन
Lesson 24 – पत्र लेखन', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 11 – चवशेषण
Lesson 12 – चिया
Lesson 13 – काल
Lesson 14 – वाच्य
Lesson 15 – अचवकारी शब्द
Lesson 23 – अनुच्छेि लेखन', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 16 – वाक्य चविार
Lesson 17 – चवराम चिन्ह
Lesson 18 – शब्द भूंडार
Lesson 19 – मुिावरे एवूं लोकोक्तियाूं
Lesson 20 – अपचठत
Lesson 25 – चनबूंध लेखन
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Vyakaran';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – The Victory
Lesson 2 – Beautiful Goa
Lesson 3 – Be Brave!', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – The Frog Prince
Lesson 5 – The Brave hearts
Lesson 6 – If You Can
Lesson 7 – The Little match Girl', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – The Beggar and The King
Lesson 9 – The Duck and The Kangaroo
Lesson 10 – The Clever Horse', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – Dream Bigger than
Your
Lesson 12 – Where the Mind is
Lesson 13 – A Loving Stranger
Lesson 14 – Together We Rise', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='English';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Discipline and Goal Setting
Hindi/English Paragraph Writing
Environment Speech', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Speech / Essay on Independence
Health Awareness talk
Moral Values Discussion', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Science Quiz
Poster Making Competition', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Sports Awareness and Practice
Debate / Group Discussion', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Activity';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Section – I : Grammar
Lesson 1 – Tenses
Lesson 2 – Modal Auxiliaries
Lesson 3 – Finite and Non-finite V.
Lesson 4 – Infinitives
Lesson 5 – Gerunds
Section – II : Writing Skills
Lesson 1 – Letter Writing', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Section – I : Grammar
Lesson 6 – Participles
Lesson 7 – Nouns
Lesson 8 – Pronouns
Lesson 9 – Subject-Verb Agreement
Lesson 10 – Active and Passive Voice
Section – II : Writing Skills
Lesson 2 – Application Writing
Lesson 3 – Story Writing
Lesson 5 – Writing Notices', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Section – I : Grammar
Lesson 11 – Adjectives
Lesson 12 – Verbs
Lesson 13 – Adverbs
Lesson 14 – Direct and Indirect Speech
Lesson 15 – Prepositions
Section – II : Writing Skills
Lesson 6 – Writing E-mails', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Section – I : Grammar
Lesson 16 – Conjunctions
Lesson 17 – Interjections
Lesson 18 – Articles
Lesson 19 – Punctuation
Section – II : Writing Skills
Lesson 4 – Essay Writing
Lesson 7 – Message Writing
Lesson 8 – Making Posters
Section – III : Reading Skills
Comprehension Passages', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Grammar';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Computer Networking
Lesson 2 – Latest Technological
• Worksheet – 1', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 3 – Animation Using Adobe
Lesson 4 – Introduction to Adobe
Lesson 5 – More on Photoshop 2021
• Project Work Compulsory', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 6 – Lists, Images and Links
Lesson 7 – Programming in Python
• Worksheet – 2', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 8 – Computer Ethics and
Lesson 9 – AI Domains and Its
• National Cyber Olympiad', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Computer';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Geography :
Lesson 1 – सूंसाधन एवूं चवकास
Lesson 2 – भूचम एवूं मृिा
History :
Lesson 1 – आधुचनक युग – चवकास एवूं
स्रोत
Lesson 2 – कूं पनी शक्ति की स्थापना
Civics :
Lesson 1 – भारतीय सूंचवधान', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Geography :
Lesson 3 – िल सूंसाधन
Lesson 4 – खचनि एवूं ऊिाट सूंसाधन
History :
Lesson 3 – ग्रामीण क्षेत्रो ूंमें िीवन
Lesson 4 – 1857 ई० का चवद्रोि
Lesson 5 – 1857 ई० के बाि चिचर्श नीचतयाँ
Civics :
Lesson 2 – मूल अचधकार एवूं कतटव्य
Lesson 3 – सूंसिीय सरकार', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Geography :
Lesson 5 – कृ चष और प्रमुख फ़सलें
Lesson 6 – उद्योग-धूंधे
History :
Lesson 6 – चशक्षा एवूं चिचर्श शासन
Lesson 7 – भारतीय समाि में सुधार
Civics :
Lesson 4 – सूंघीय कायटपाचलका', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Geography :
Lesson 7 – आपिा एवूं आपिा-प्रबूंधन
History :
Lesson 8 – स्वतूंत्रता की ओर किम
Lesson 9 – स्वतूंत्रता के बाि भारत
Civics :
Lesson 5 – न्यायपाचलका
Lesson 6 – न्यायालय एवूं पुचलस
Model Question Paper – 1
Model Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Social
Studies';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 to 6', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 7 to 12', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 13 to 18', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 19 to 23
Sample Question Paper – 1
Sample Question Paper – 2', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Math';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Part A : Verbal Aptitude
Lesson 1 – Analogy I – IV
Lesson 2 – Series I – IV
Lesson 3 – Classification I – III
Lesson 4 – Subtraction
Lesson 5 – Ranking
Lesson 6 – Direction Test
Lesson 7 – Problems on Ages
Explore Further
Lesson 8 – Blood Relations
Lesson 9 – Logical Problems
Lesson 10 – Break the Codes
Lesson 11 – GK Treasure – I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Part C : Quantitative Aptitude
Lesson 19 – Numbers
Lesson 20 – Missing Number Puzzle
Lesson 21 – Mathematical Operations
Lesson 22 – GK Treasure – II
Lesson 23 – Problems on Trains
Lesson 24 – Problems on Average
Lesson 25 – Numerical Ability
Lesson 26 – Analytical reasoning
Explore Further
Lesson 27 – Quick Calculations
Lesson 28 – Bar Graph
Lesson 29 – Table Chart', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 30 – Pie Chart
Lesson 31 – GK Treasure – III
Part B : Non-Verbal Aptitude
Lesson 12 – Analogy
Lesson 13 – Classification
Lesson 14 – Mirror Images
Lesson 15 – Water Images
Lesson 16 – Paper Folding
Explore Further
Lesson 17 – Cubes and Cuboids
Lesson 18 – Missing Letter Puzzle
Olympiad Test – English
Olympiad Test – Science', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Part D : Aptitude Test – I – II
Explore Further
Part E : Olympiad Tests
Lesson 32 – GK Treasure – IV
Olympiad Test – Maths
Olympiad Test – Cyber
Part F : Word Building
Lesson 34 – Foreign Words and
Ph.
Lesson 35 – Oxymorons
Lesson 36 – Proverbs
Lesson 37 – One – Word
Substitution
Explore Further
Let’s Challenge Ourselves!', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='G.K';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Introduction
Lesson 2 – Flowers
Lesson 3 – Object Drawing
Lesson 4 – Still Life Composition
Lesson 5 – Fruits
Lesson 6 – Fruits Composition
Lesson 7 – Vegetables
Lesson 8 – Vegetables Composition', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 9 – Birds
Lesson 10 – Animal Study
Lesson 11 – Insects
Lesson 12 – Face Parts
Lesson 13 – Human Composition
Lesson 14 – Portrait (Poster Colours)
Lesson 15 – Portrait (Pencil Shading)
Lesson 16 – Facial Expressions
Lesson 17 – Stippling Technique', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 18 – Mountains and Stones
Lesson 19 – Steps Drawing
Lesson 20 – Trees (Water Colours)
Lesson 21 – Landscapes
Lesson 22 – Different Flowers(Nature)
Lesson 23 – Mehandi Designs
Lesson 24 – Alekhan
Lesson 25 – Geometrical Designs', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 26 – Rangoli or Alpna
Lesson 27 – Typography
Lesson 28 – Picture Story
Lesson 29 – Poster Drawing
Lesson 30 – Bird Mosaic
Lesson 31 – Flower Vase
Lesson 32 – Greeting Cards
Lesson 33 – Blowing Activity
Lesson 34 – Mask Making', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='A.R.T';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'Lesson 1 – Crop Production
Lesson 2 – Microorganisms
Lesson 3 – Coal and Petroleum
Periodic Assessment – I', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'Lesson 4 – Combustion and Flame
Lesson 5 – Conservation of Biodiversity
Lesson 6 – Reproduction
Lesson 7 – Reaching the Age of Adoles.
Half-Yearly Examination', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'Lesson 8 – Force and Pressure
Lesson 9 – Friction
Lesson 10 – Sound
Periodic Assessment – II', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'Lesson 11 – Chemical Effects of
Elec.
Lesson 12 – Some Natural
Phenom.
Lesson 13 – Light
Annual Examination', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Science';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Apr - July', 'PA 1 syllabus', 'वन्दना
प्रथमः पाठः – चसक्तद्धमन्त्रः
चितीयः पाठः – उपायेन चसद्ध्यचत कायटम्
तृतीयः पाठः – नयः धूतटः', 'PA 1', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Aug - Oct', 'Half Yearly syllabus', 'ितुथटः पाठः – मिाराणाप्रतापः
पूंिमः पाठः – सुभाचषताचन
षिः पाठः – प्रबुद्धो ग्रामीणः
सप्तमः पाठः – श्रद्धा लभते ज्ञानम्
अष्टमः पाठः – मिनमोिनमालवीयः', 'Half Yearly', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Nov - Dec', 'PA 2 syllabus', 'नवमः पाठः – िीवनसूत्राचण
िशमः पाठः – ितुरः िौरः
एकािशः पाठः – वीरभोगा चि वीरता
िािशः पाठः – चवज्ञानस्य िमत्कारः', 'PA 2', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Sanskrit';
insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, 'Jan - Feb', 'Annual syllabus', 'त्रयोिशः पाठः – चववेकूं भव
ितुिटशः पाठः – गुरुिचक्षणा
पूंििशः पाठः – अमृतविनाचन
षोडशः पाठः – वसन्तः ऋतुः
पररचशष्ट', 'Annual', 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name='Class 8' and s.subject_name='Sanskrit';
commit;
-- Imported 397 class-subject-assessment records.
