begin;
do $$
begin
  if (select count(*) from private.active_learning_questions
      where question_id in ('orig-gen-prl-expo-001', 'orig-gen-prl-expo-002')
        and simulation_id = 'practice:original:general-knowledge'
        and concept_ids = array['prl-exposicion-fundamentos']) <> 2 then
    raise exception 'PRL exposition practice items or their concept mapping are missing';
  end if;
  if not exists (select 1 from private.active_learning_questions where question_id = 'orig-gen-prl-expo-001' and correct_answer = 'D')
     or not exists (select 1 from private.active_learning_questions where question_id = 'orig-gen-prl-expo-002' and correct_answer = 'C') then
    raise exception 'PRL exposition correct answers do not match the reviewed practice items';
  end if;
  if exists (select 1 from private.official_simulation_allowlist where simulation_id = 'practice:original:general-knowledge') then
    raise exception 'Original practice entered the official simulation allowlist';
  end if;
end;
$$;
rollback;
