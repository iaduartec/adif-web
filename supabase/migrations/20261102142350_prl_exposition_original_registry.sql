-- Register reviewed original PRL study items without reactivating retired IDs.
insert into private.learning_concepts (concept_id, active)
values ('prl-exposicion-fundamentos', true)
on conflict (concept_id) do nothing;

insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
select entry.question_id, entry.correct_answer, array['prl-exposicion-fundamentos'],
       'practice:original:general-knowledge',
       exists (select 1 from private.learning_concepts where concept_id = 'prl-exposicion-fundamentos' and active)
from (values ('orig-gen-prl-expo-001', 'D'), ('orig-gen-prl-expo-002', 'C')) as entry(question_id, correct_answer)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = private.learning_questions.active and excluded.active;
