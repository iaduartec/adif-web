import { mockStore, MOCK_USER } from "./mock-store";

export function createMockSupabaseClient() {
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
