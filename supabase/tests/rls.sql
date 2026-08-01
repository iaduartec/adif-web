begin;

select plan(6);

select tests.create_supabase_user('owner@example.com');
select tests.create_supabase_user('other@example.com');

select set_config(
  'request.jwt.claim.sub',
  (select id::text from auth.users where email = 'owner@example.com'),
  true
);
set local role authenticated;

select lives_ok(
  $$insert into public.profiles (user_id, display_name) values (auth.uid(), 'Owner')$$,
  'an owner can insert their own profile'
);

select is(
  (select display_name from public.profiles where user_id = auth.uid()),
  'Owner',
  'an owner can select their own profile'
);

select throws_ok(
  $$insert into public.notes (user_id, lesson_id, body) values (
    (select id from auth.users where email = 'other@example.com'),
    'lesson-1',
    'Cross-user write'
  )$$,
  '42501',
  null,
  'a user cannot insert a row owned by someone else'
);

reset role;

insert into public.notes (user_id, lesson_id, body)
values (
  (select id from auth.users where email = 'other@example.com'),
  'lesson-1',
  'Private note'
);

set local role authenticated;

select is(
  (select count(*) from public.notes where lesson_id = 'lesson-1'),
  0::bigint,
  'a user cannot select another user''s row'
);

select is(
  (
    with changed as (
      update public.notes
      set body = 'Attempted overwrite'
      where lesson_id = 'lesson-1'
      returning 1
    )
    select count(*) from changed
  ),
  0::bigint,
  'a user cannot update another user''s row'
);

reset role;

select is(
  (select body from public.notes where lesson_id = 'lesson-1'),
  'Private note',
  'cross-user update leaves the protected row unchanged'
);

select * from finish();
rollback;
