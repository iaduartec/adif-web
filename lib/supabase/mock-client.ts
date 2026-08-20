import { getMockStore, MOCK_USER } from "./mock-store";

export function createMockSupabaseClient() {
  const mockStore = getMockStore();
  const chain = (tableName: string, dataState: any[]) => {
    let operation: "select" | "insert" | "upsert" | "delete" | "update" | null = null;
    let operationPayload: any = null;
    let upsertOptions: any = null;
    const filters: Array<{ type: "eq" | "gte"; column: string; value: any }> = [];
    let orderByColumn: string | null = null;
    let orderAscending = true;

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
        operation = "upsert";
        operationPayload = payload;
        upsertOptions = options;
        return builder;
      },
      delete: () => {
        operation = "delete";
        return builder;
      },
      update: (payload: any) => {
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
      execute: () => {
        let resultData: any = null;

        if (operation === "select") {
          resultData = [...dataState];
        } else if (operation === "insert") {
          const rows = Array.isArray(operationPayload) ? operationPayload : [operationPayload];
          resultData = rows.map((row) => {
            const newRow = {
              id: Math.random().toString(36).substring(7),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...row,
            };
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
              const newRow = {
                id: Math.random().toString(36).substring(7),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...row,
              };
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
              Object.assign(row, operationPayload, { updated_at: new Date().toISOString() });
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

        return resultData;
      },
      maybeSingle: async () => {
        const data = builder.execute();
        return { data: data[0] || null, error: null };
      },
      single: async () => {
        const data = builder.execute();
        return { data: data[0] || null, error: null };
      },
      then: (onfulfilled?: (value: any) => any) => {
        const data = builder.execute();
        const result = { data, error: null };
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
        if (typeof window !== "undefined" && !options?.options?.skipBrowserRedirect) {
          window.location.href = redirectTo;
        }
        return Promise.resolve({ data: { url: redirectTo }, error: null });
      },
      signOut: () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.resolve({ error: null });
      },
    },
    rpc: (functionName: string, args: any) => {
      if (functionName !== "submit_simulation_attempt") {
        return Promise.resolve({ data: null, error: new Error("Unknown mock RPC") });
      }

      const attemptId = Math.random().toString(36).substring(7);
      const createdAt = new Date().toISOString();
      const answerRows = Array.isArray(args.p_answers) ? args.p_answers : [];
      const attempt = {
        id: attemptId,
        user_id: MOCK_USER.id,
        simulation_id: args.p_simulation_id,
        score: args.p_score,
        correct_count: args.p_correct_count,
        incorrect_count: args.p_incorrect_count,
        omitted_count: args.p_omitted_count,
        elapsed_ms: args.p_elapsed_ms,
        created_at: createdAt,
      };
      const answers = answerRows.map((answer: any) => ({
        id: Math.random().toString(36).substring(7),
        user_id: MOCK_USER.id,
        attempt_id: attemptId,
        question_id: answer.question_id,
        selected_answer: answer.selected_answer,
        is_correct: answer.is_correct,
        created_at: createdAt,
      }));

      // Commit both arrays together after the payload has been materialized.
      mockStore.simulationAttempts.push(attempt);
      mockStore.simulationAnswers.push(...answers);
      return Promise.resolve({ data: attemptId, error: null });
    },
    from: (tableName: string) => {
      if (tableName === "question_attempts") return chain(tableName, mockStore.questionAttempts);
      if (tableName === "simulation_attempts") return chain(tableName, mockStore.simulationAttempts);
      if (tableName === "simulation_answers") return chain(tableName, mockStore.simulationAnswers);
      if (tableName === "lesson_progress") return chain(tableName, mockStore.lessonProgress);
      if (tableName === "favorites") return chain(tableName, mockStore.favorites);
      if (tableName === "notes") return chain(tableName, mockStore.notes);
      if (tableName === "study_goals") return chain(tableName, mockStore.studyGoals);
      return chain(tableName, []);
    },
  } as any;
}
