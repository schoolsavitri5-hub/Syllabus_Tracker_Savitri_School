-- Excel imports may create Nursery, LKG, and UKG classes.
-- Keep the database constraint aligned with the application's three class groups.
alter table public.classes drop constraint if exists classes_class_group_check;
alter table public.classes
  add constraint classes_class_group_check
  check (class_group in ('PREPRIMARY', 'PRIMARY', 'SENIOR'));
