const PAGE_SIZE = 500;

type PageResult<Row> = {
  data: Row[] | null;
  error: unknown;
};

type RangedQuery<Row> = {
  range(from: number, to: number): PromiseLike<PageResult<Row>>;
};

/**
 * Exhausts a PostgREST query without relying on the project's server row cap.
 * A fresh builder is created for every page so range state cannot leak between requests.
 */
export async function fetchPaginatedRows<Row>(
  createQuery: () => RangedQuery<Row>,
): Promise<Row[]> {
  const rows: Row[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const result = await createQuery().range(from, from + PAGE_SIZE - 1);
    if (result.error) throw result.error;
    const page = result.data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}
