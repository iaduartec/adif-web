type TopicQuestion = { id: string; topicId: string };

function seededRandom(seed: string) {
  let state = 2166136261;
  for (const char of seed) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

/**
 * Builds a reproducible, topic-balanced sample. A seed can be kept in tests;
 * production callers should use a fresh random seed for each exam.
 */
export function selectBalancedOriginalQuestions<T extends TopicQuestion>(
  questions: readonly T[],
  requestedCount: number,
  seed: string,
): T[] {
  const unique = [...new Map(questions.map((question) => [question.id, question])).values()];
  const count = Math.min(unique.length, Math.max(0, Math.floor(requestedCount)));
  if (count === 0) return [];

  const random = seededRandom(seed);
  const byTopic = new Map<string, T[]>();
  for (const question of unique) {
    const group = byTopic.get(question.topicId) ?? [];
    group.push(question);
    byTopic.set(question.topicId, group);
  }

  const topics = shuffle([...byTopic.keys()], random);
  const buckets = new Map(topics.map((topic) => [topic, shuffle(byTopic.get(topic)!, random)]));
  const selected: T[] = [];
  while (selected.length < count) {
    let selectedInRound = false;
    for (const topic of topics) {
      const next = buckets.get(topic)!.shift();
      if (!next) continue;
      selected.push(next);
      selectedInRound = true;
      if (selected.length === count) break;
    }
    if (!selectedInRound) break;
  }
  return shuffle(selected, random);
}
