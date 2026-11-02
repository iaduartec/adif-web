-- Preserve historical attempts for the former item while preventing its reuse.
update private.learning_questions
set active = false
where question_id in ('orig-tel-ict-006', 'orig-tel-ict-017');

-- The corrected wording has a new ID so old answers retain their meaning.
insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
select 'orig-tel-ict-006-v2', 'B', array['ict-concept-9'], 'practice:original:telecom',
       exists (select 1 from private.learning_concepts where concept_id = 'ict-concept-9' and active)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = private.learning_questions.active and excluded.active;

insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
select 'orig-tel-ict-017-v2', 'A', array['ict-concept-10'], 'practice:original:telecom',
       exists (select 1 from private.learning_concepts where concept_id = 'ict-concept-10' and active)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = private.learning_questions.active and excluded.active;
