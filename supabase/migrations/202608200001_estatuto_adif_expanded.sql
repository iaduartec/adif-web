-- Keep the private learning catalog in sync with the expanded Estatuto lesson.
-- The first adaptive migration seeded concepts 1-10; this forward migration
-- adds the article and disposition concepts introduced by the course material.
insert into private.learning_concepts (concept_id, active)
select 'estatuto-concept-' || concept_number, true
from generate_series(11, 56) as concept_number
on conflict (concept_id) do update
set active = excluded.active;
