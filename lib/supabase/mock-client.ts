import { getMockStore, MOCK_USER } from "./mock-store";
import { getOfficialExam, getOfficialQuestion } from "../content/repository";
import { activeTheoryConceptRegistry } from "../../content/theory-concepts";
import {
  applyReviewSchedule,
  madridDayKey,
  type ConceptMastery,
  type ReviewRating,
} from "../adaptive/review-schedule";

export function createMockSupabaseClient() {
  const mockStore = getMockStore();

  const persistEvidence = ({
    clientEventId,
    conceptId,
    isCorrect,
    occurredAt,
    questionId,
    rating,
    sourceKind,
  }: {
    clientEventId: string;
    conceptId: string;
    isCorrect?: boolean;
    occurredAt: string;
    questionId: string | null;
    rating: ReviewRating;
    sourceKind: "question" | "recall";
  }) => {
    if (mockStore.reviewEvents.some((event) => event.client_event_id === clientEventId)) return false;
    const previous = sourceKind === "question"
      ? [...mockStore.reviewEvents].reverse().find((event) => (
          event.source_kind === "question"
          && event.question_id === questionId
          && event.concept_id === conceptId
        ))
      : undefined;
    const existing = mockStore.conceptMastery.find((row) => row.concept_id === conceptId);
    const current: ConceptMastery = existing ? {
      status: existing.status,
      repetitions: existing.repetitions,
      easeFactor: existing.ease_factor,
      intervalDays: existing.interval_days,
      dueOn: existing.due_on,
      lastReviewedAt: existing.last_reviewed_at,
      lastEvidenceAt: existing.last_evidence_at,
      correctEvidence: existing.correct_evidence,
      incorrectEvidence: existing.incorrect_evidence,
    } : {
      status: "new",
      repetitions: 0,
      easeFactor: 2.5,
      intervalDays: 0,
      dueOn: null,
      lastReviewedAt: null,
      lastEvidenceAt: null,
      correctEvidence: 0,
      incorrectEvidence: 0,
    };
    const next = applyReviewSchedule(
      current,
      sourceKind === "question"
        ? {
            kind: "question",
            questionId: questionId!,
            isCorrect: Boolean(isCorrect),
            occurredAt,
            previousMatchingOccurredAt: previous?.occurred_at,
            conceptActive: activeTheoryConceptRegistry.has(conceptId),
          }
        : { kind: "recall", rating, occurredAt, conceptActive: activeTheoryConceptRegistry.has(conceptId) },
      madridDayKey(occurredAt),
    );
    if (!next) return false;

    const now = occurredAt;
    const masteryRow = {
      user_id: MOCK_USER.id,
      concept_id: conceptId,
      status: next.status,
      repetitions: next.repetitions,
      ease_factor: next.easeFactor,
      interval_days: next.intervalDays,
      due_on: next.dueOn,
      last_reviewed_at: next.lastReviewedAt,
      last_evidence_at: next.lastEvidenceAt,
      correct_evidence: next.correctEvidence,
      incorrect_evidence: next.incorrectEvidence,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    if (existing) Object.assign(existing, masteryRow);
    else mockStore.conceptMastery.push(masteryRow);
    mockStore.reviewEvents.push({
      id: Math.random().toString(36).substring(7),
      user_id: MOCK_USER.id,
      concept_id: conceptId,
      source_kind: sourceKind,
      question_id: questionId,
      rating,
      client_event_id: clientEventId,
      occurred_at: occurredAt,
      created_at: occurredAt,
    });
    return true;
  };
  const chain = (tableName: string, dataState: any[]) => {
    let operation: "select" | "insert" | "upsert" | "delete" | "update" | null = null;
    let operationPayload: any = null;
    let upsertOptions: any = null;
    const filters: Array<{ type: "eq" | "gte"; column: string; value: any }> = [];
    let orderByColumn: string | null = null;
    let orderAscending = true;
    let rangeFrom: number | null = null;
    let rangeTo: number | null = null;
    let operationError: Error | null = null;

    const createRow = (row: any) => {
      const now = new Date().toISOString();

      if (tableName === "concept_mastery") {
        return {
          created_at: now,
          updated_at: now,
          status: "new",
          repetitions: 0,
          ease_factor: 2.5,
          interval_days: 0,
          due_on: null,
          last_reviewed_at: null,
          last_evidence_at: null,
          correct_evidence: 0,
          incorrect_evidence: 0,
          ...row,
        };
      }

      if (tableName === "review_events") {
        return {
          id: Math.random().toString(36).substring(7),
          created_at: now,
          occurred_at: now,
          ...row,
        };
      }

      if (tableName === "daily_plan_actions") {
        return {
          id: Math.random().toString(36).substring(7),
          created_at: now,
          ...row,
        };
      }

      return {
        id: Math.random().toString(36).substring(7),
        created_at: now,
        updated_at: now,
        ...row,
      };
    };

    const builder: any = {
      select: (fields?: string) => {
        if (!operation) {
          operation = "select";
        }
        return builder;
      },
      insert: (payload: any) => {
        operation = "insert";
        operationPayload = payload;
        return builder;
      },
      upsert: (payload: any, options?: any) => {
        if (tableName === "review_events") {
          operationError = new Error("Review events are immutable.");
          return builder;
        }
        operation = "upsert";
        operationPayload = payload;
        upsertOptions = options;
        return builder;
      },
      delete: () => {
        if (tableName === "review_events") {
          operationError = new Error("Review events are immutable.");
          return builder;
        }
        operation = "delete";
        return builder;
      },
      update: (payload: any) => {
        if (tableName === "review_events") {
          operationError = new Error("Review events are immutable.");
          return builder;
        }
        operation = "update";
        operationPayload = payload;
        return builder;
      },
      eq: (column: string, value: any) => {
        filters.push({ type: "eq", column, value });
        return builder;
      },
      gte: (column: string, value: any) => {
        filters.push({ type: "gte", column, value });
        return builder;
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        orderByColumn = column;
        orderAscending = options?.ascending !== false;
        return builder;
      },
      range: async (from: number, to: number) => {
        rangeFrom = from;
        rangeTo = to;
        const data = builder.execute();
        return { data: operationError ? null : data, error: operationError };
      },
      execute: () => {
        let resultData: any = null;

        if (operation === "select") {
          resultData = [...dataState];
        } else if (operation === "insert") {
          const rows = Array.isArray(operationPayload) ? operationPayload : [operationPayload];
          const incomingActionKeys = new Set<string>();
          if (tableName === "daily_plan_actions" && rows.some((row) => {
            const key = `${row.user_id}\u001f${row.plan_date}\u001f${row.task_key}`;
            if (incomingActionKeys.has(key)) return true;
            incomingActionKeys.add(key);
            return dataState.some((existing) => (
              existing.user_id === row.user_id
              && existing.plan_date === row.plan_date
              && existing.task_key === row.task_key
            ));
          })) {
            operationError = Object.assign(
              new Error("duplicate key value violates daily_plan_actions user/date/task uniqueness"),
              { code: "23505" },
            );
            return null;
          }
          resultData = rows.map((row) => {
            const newRow = createRow(row);
            dataState.push(newRow);
            return newRow;
          });
        } else if (operation === "upsert") {
          const rows = Array.isArray(operationPayload) ? operationPayload : [operationPayload];
          const conflictFields = upsertOptions?.onConflict
            ? upsertOptions.onConflict.split(",")
            : ["id"];

          resultData = rows.map((row) => {
            const matchIndex = dataState.findIndex((existing) => {
              return conflictFields.every((field: string) => existing[field] === row[field]);
            });

            if (matchIndex !== -1) {
              const updatedRow = {
                ...dataState[matchIndex],
                ...row,
                updated_at: new Date().toISOString(),
              };
              dataState[matchIndex] = updatedRow;
              return updatedRow;
            } else {
              const newRow = createRow(row);
              dataState.push(newRow);
              return newRow;
            }
          });
        } else if (operation === "delete") {
          const toDelete: any[] = [];
          const remaining = dataState.filter((row) => {
            const match = filters.every((f) => {
              if (f.type === "eq") return row[f.column] === f.value;
              if (f.type === "gte") return row[f.column] >= f.value;
              return true;
            });
            if (match) toDelete.push(row);
            return !match;
          });
          dataState.length = 0;
          dataState.push(...remaining);
          resultData = toDelete;
        } else if (operation === "update") {
          const updated: any[] = [];
          dataState.forEach((row) => {
            const match = filters.every((f) => {
              if (f.type === "eq") return row[f.column] === f.value;
              if (f.type === "gte") return row[f.column] >= f.value;
              return true;
            });
            if (match) {
              const timestamp =
                tableName === "daily_plan_actions" ? {} : { updated_at: new Date().toISOString() };
              Object.assign(row, operationPayload, timestamp);
              updated.push(row);
            }
          });
          resultData = updated;
        }

        // Apply filters only for select queries (or we can filter input/returns, but select is standard)
        if (operation === "select" && resultData) {
          resultData = resultData.filter((row: any) => {
            return filters.every((f) => {
              if (f.type === "eq") return row[f.column] === f.value;
              if (f.type === "gte") return row[f.column] >= f.value;
              return true;
            });
          });
        }

        // Apply sorting
        if (orderByColumn && resultData) {
          resultData.sort((a: any, b: any) => {
            if (a[orderByColumn!] < b[orderByColumn!]) return orderAscending ? -1 : 1;
            if (a[orderByColumn!] > b[orderByColumn!]) return orderAscending ? 1 : -1;
            return 0;
          });
        }

        if (rangeFrom !== null && rangeTo !== null && resultData) {
          resultData = resultData.slice(rangeFrom, rangeTo + 1);
        }

        return resultData;
      },
      maybeSingle: async () => {
        const data = builder.execute();
        return { data: data?.[0] || null, error: operationError };
      },
      single: async () => {
        const data = builder.execute();
        return { data: data?.[0] || null, error: operationError };
      },
      then: (onfulfilled?: (value: any) => any) => {
        const data = builder.execute();
        const result = { data: operationError ? null : data, error: operationError };
        return Promise.resolve(result).then(onfulfilled);
      },
    };

    return builder;
  };

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: MOCK_USER }, error: null }),
      signInWithOAuth: (options: any) => {
        const redirectTo = options?.options?.redirectTo || "/";
        if (typeof window !== "undefined") {
          window.location.href = redirectTo;
        }
        return Promise.resolve({ data: {}, error: null });
      },
      signOut: () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.resolve({ error: null });
      },
    },
    rpc: (functionName: string, args: any) => {
      const constraintError = (message: string) => Object.assign(new Error(message), { code: "23514" });
      const validUuid = (value: unknown) => typeof value === "string"
        && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
      const validElapsed = (value: unknown) => typeof value === "number"
        && Number.isSafeInteger(value) && value >= 0 && value <= 86_400_000;
      const idempotencyMismatch = () => Promise.resolve({
        data: null,
        error: constraintError("Idempotency key was already used with a different payload."),
      });

      if (functionName === "record_daily_plan_action") {
        const currentMadridDate = madridDayKey(new Date());
        const taskKeyValid = typeof args.p_task_key === "string"
          && args.p_task_key.trim().length > 0
          && args.p_task_key.length <= 200;
        const replacementKeyValid = typeof args.p_replacement_task_key === "string"
          && args.p_replacement_task_key.trim().length > 0
          && args.p_replacement_task_key.length <= 200
          && args.p_replacement_task_key !== args.p_task_key;
        const shapeValid = args.p_action === "postpone"
          ? args.p_replacement_task_key == null
          : args.p_action === "replace" && replacementKeyValid;
        if (args.p_plan_date !== currentMadridDate || !taskKeyValid || !shapeValid) {
          return Promise.resolve({ data: null, error: constraintError("Invalid daily plan action") });
        }
        const existing = mockStore.dailyPlanActions.find((action) => (
          action.user_id === MOCK_USER.id
          && action.plan_date === args.p_plan_date
          && action.task_key === args.p_task_key
        ));
        if (existing) {
          if (
            existing.action === args.p_action
            && existing.replacement_task_key === (args.p_replacement_task_key ?? null)
          ) return Promise.resolve({ data: true, error: null });
          return Promise.resolve({
            data: null,
            error: Object.assign(new Error("A different action already exists."), { code: "23505" }),
          });
        }
        const createdAt = new Date().toISOString();
        mockStore.dailyPlanActions.push({
          id: Math.random().toString(36).substring(7),
          user_id: MOCK_USER.id,
          plan_date: args.p_plan_date,
          task_key: args.p_task_key,
          action: args.p_action,
          replacement_task_key: args.p_replacement_task_key ?? null,
          created_at: createdAt,
        });
        return Promise.resolve({ data: true, error: null });
      }

      if (functionName === "record_practice_attempt") {
        const mode = args.p_mode ?? "practice";
        const question = getOfficialQuestion(args.p_question_id);
        if (
          !validUuid(args.p_client_event_id)
          || !["A", "B", "C", "D"].includes(args.p_selected_answer)
          || !["practice", "simulation"].includes(mode)
          || !validElapsed(args.p_elapsed_ms)
          || !question
          || question.conceptIds.some((conceptId) => !activeTheoryConceptRegistry.has(conceptId))
        ) {
          return Promise.resolve({ data: null, error: constraintError("Invalid practice payload") });
        }
        const requestFingerprint = JSON.stringify([
          question.id,
          args.p_selected_answer,
          args.p_elapsed_ms,
          mode,
        ]);
        const existing = mockStore.questionAttempts.find(
          (attempt) => attempt.client_event_id === args.p_client_event_id,
        );
        if (existing) {
          if (existing.request_fingerprint !== requestFingerprint) return idempotencyMismatch();
          return Promise.resolve({
            data: { attempt_id: existing.id, is_correct: existing.is_correct },
            error: null,
          });
        }
        const createdAt = new Date().toISOString();
        const isCorrect = question.answer === args.p_selected_answer;
        const attempt = {
          id: Math.random().toString(36).substring(7),
          client_event_id: args.p_client_event_id,
          request_fingerprint: requestFingerprint,
          user_id: MOCK_USER.id,
          question_id: question.id,
          selected_answer: args.p_selected_answer,
          is_correct: isCorrect,
          mode: mode as "practice" | "simulation",
          elapsed_ms: args.p_elapsed_ms,
          created_at: createdAt,
        };
        mockStore.questionAttempts.push(attempt);
        for (const conceptId of [...question.conceptIds].sort()) {
          persistEvidence({
            clientEventId: `${args.p_client_event_id}:${question.id}:${conceptId}`,
            conceptId,
            isCorrect,
            occurredAt: createdAt,
            questionId: question.id,
            rating: isCorrect ? 2 : 0,
            sourceKind: "question",
          });
        }
        return Promise.resolve({ data: { attempt_id: attempt.id, is_correct: isCorrect }, error: null });
      }

      if (functionName === "record_recall_review") {
        if (
          !validUuid(args.p_client_event_id)
          || !Number.isInteger(args.p_rating)
          || args.p_rating < 0
          || args.p_rating > 3
          || !activeTheoryConceptRegistry.has(args.p_concept_id)
        ) return Promise.resolve({ data: null, error: constraintError("Invalid recall payload") });
        const existing = mockStore.reviewEvents.find(
          (event) => event.client_event_id === args.p_client_event_id,
        );
        if (existing) {
          if (
            existing.source_kind !== "recall"
            || existing.concept_id !== args.p_concept_id
            || existing.rating !== args.p_rating
            || existing.question_id !== null
          ) return idempotencyMismatch();
          return Promise.resolve({ data: true, error: null });
        }
        const failure = mockStore.reviewRpcFailure;
        if (failure === "definitive") {
          mockStore.reviewRpcFailure = null;
          return Promise.resolve({
            data: null,
            error: Object.assign(new Error("Invalid recall payload"), { code: "23514" }),
          });
        }
        const occurredAt = new Date().toISOString();
        const recorded = persistEvidence({
          clientEventId: args.p_client_event_id,
          conceptId: args.p_concept_id,
          occurredAt,
          questionId: null,
          rating: args.p_rating,
          sourceKind: "recall",
        });
        if (failure === "uncertain") {
          mockStore.reviewRpcFailure = null;
          return Promise.resolve({
            data: null,
            error: Object.assign(new Error("Connection lost"), { code: "08006" }),
          });
        }
        return Promise.resolve({ data: recorded, error: null });
      }

      if (functionName !== "submit_simulation_attempt") {
        return Promise.resolve({ data: null, error: new Error("Unknown mock RPC") });
      }

      const exam = getOfficialExam(args.p_simulation_id);
      const answerRows = args.p_answers;
      if (!validUuid(args.p_client_event_id) || !validElapsed(args.p_elapsed_ms) || !exam || !Array.isArray(answerRows)) {
        return Promise.resolve({ data: null, error: constraintError("Invalid simulation payload") });
      }
      const expectedIds = new Set(exam.questionIds);
      const suppliedIds = new Set<string>();
      for (const answer of answerRows) {
        if (
          !answer || typeof answer !== "object" || Array.isArray(answer)
          || typeof answer.question_id !== "string"
          || !(answer.selected_answer === null || ["A", "B", "C", "D"].includes(answer.selected_answer))
          || !expectedIds.has(answer.question_id)
          || suppliedIds.has(answer.question_id)
        ) return Promise.resolve({ data: null, error: constraintError("Invalid simulation answer rows") });
        suppliedIds.add(answer.question_id);
      }
      if (answerRows.length !== exam.questionIds.length || suppliedIds.size !== exam.questionIds.length) {
        return Promise.resolve({ data: null, error: constraintError("Incomplete simulation answers") });
      }
      const questions = exam.questionIds.map((questionId) => getOfficialQuestion(questionId));
      if (
        questions.some((question) => !question)
        || questions.some((question) => question!.conceptIds.some(
          (conceptId) => !activeTheoryConceptRegistry.has(conceptId),
        ))
      ) return Promise.resolve({ data: null, error: constraintError("Inactive simulation question") });

      const canonicalAnswers = answerRows
        .map((answer: any) => [answer.question_id, answer.selected_answer] as const)
        .sort(([left], [right]) => left.localeCompare(right));
      const requestFingerprint = JSON.stringify([
        args.p_simulation_id,
        args.p_elapsed_ms,
        canonicalAnswers,
      ]);
      const simulationResult = (attempt: (typeof mockStore.simulationAttempts)[number]) => ({
        attempt_id: attempt.id,
        correct_count: attempt.correct_count,
        incorrect_count: attempt.incorrect_count,
        omitted_count: attempt.omitted_count,
        score: attempt.score,
        elapsed_ms: attempt.elapsed_ms,
        answers: mockStore.simulationAnswers
          .filter((answer) => answer.attempt_id === attempt.id)
          .sort((left, right) => left.question_id.localeCompare(right.question_id))
          .map((answer) => ({
            question_id: answer.question_id,
            selected_answer: answer.selected_answer,
            is_correct: answer.is_correct,
          })),
      });
      const existing = mockStore.simulationAttempts.find(
        (attempt) => attempt.client_event_id === args.p_client_event_id,
      );
      if (existing) {
        if (existing.request_fingerprint !== requestFingerprint) return idempotencyMismatch();
        return Promise.resolve({ data: simulationResult(existing), error: null });
      }

      const attemptId = Math.random().toString(36).substring(7);
      const createdAt = new Date().toISOString();
      const persistedAnswers = answerRows.map((answer: any) => {
        const question = getOfficialQuestion(answer.question_id)!;
        return {
          id: Math.random().toString(36).substring(7),
          user_id: MOCK_USER.id,
          attempt_id: attemptId,
          question_id: answer.question_id,
          selected_answer: answer.selected_answer,
          is_correct: answer.selected_answer === question.answer,
          created_at: createdAt,
        };
      });
      const correctCount = persistedAnswers.filter((answer: any) => answer.is_correct).length;
      const omittedCount = persistedAnswers.filter((answer: any) => answer.selected_answer === null).length;
      const incorrectCount = persistedAnswers.length - correctCount - omittedCount;
      const attempt = {
        id: attemptId,
        client_event_id: args.p_client_event_id,
        request_fingerprint: requestFingerprint,
        user_id: MOCK_USER.id,
        simulation_id: args.p_simulation_id,
        score: Math.round((correctCount - incorrectCount / 3) * 100) / 100,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        omitted_count: omittedCount,
        elapsed_ms: args.p_elapsed_ms,
        created_at: createdAt,
      };

      mockStore.simulationAttempts.push(attempt);
      mockStore.simulationAnswers.push(...persistedAnswers);
      for (const answer of persistedAnswers.filter((row: any) => row.selected_answer !== null)) {
        const question = getOfficialQuestion(answer.question_id)!;
        for (const conceptId of [...question.conceptIds].sort()) {
          persistEvidence({
            clientEventId: `${args.p_client_event_id}:${question.id}:${conceptId}`,
            conceptId,
            isCorrect: answer.is_correct,
            occurredAt: createdAt,
            questionId: question.id,
            rating: answer.is_correct ? 2 : 0,
            sourceKind: "question",
          });
        }
      }
      return Promise.resolve({ data: simulationResult(attempt), error: null });
    },
    from: (tableName: string) => {
      if (tableName === "question_attempts") return chain(tableName, mockStore.questionAttempts);
      if (tableName === "simulation_attempts") return chain(tableName, mockStore.simulationAttempts);
      if (tableName === "simulation_answers") return chain(tableName, mockStore.simulationAnswers);
      if (tableName === "lesson_progress") return chain(tableName, mockStore.lessonProgress);
      if (tableName === "favorites") return chain(tableName, mockStore.favorites);
      if (tableName === "notes") return chain(tableName, mockStore.notes);
      if (tableName === "study_goals") return chain(tableName, mockStore.studyGoals);
      if (tableName === "concept_mastery") return chain(tableName, mockStore.conceptMastery);
      if (tableName === "review_events") return chain(tableName, mockStore.reviewEvents);
      if (tableName === "daily_plan_actions") return chain(tableName, mockStore.dailyPlanActions);
      return chain(tableName, []);
    },
  } as any;
}
