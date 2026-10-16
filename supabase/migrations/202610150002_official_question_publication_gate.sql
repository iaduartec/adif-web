-- Historical question text and answer keys have no verified PDF hashes or
-- scoped public-text rights decision yet. Keep the private records for audit
-- and old attempt references, but prevent every 2023-2025 key from practice
-- and simulator RPCs. A later approval must use a new forward-only migration.
update private.learning_questions
set active = false
where question_id ~ '^ADIF-202[345]-[0-9]{4}-Q[0-9]{2}$'
  and active;
