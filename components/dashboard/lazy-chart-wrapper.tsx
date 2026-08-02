"use client";

import dynamicNext from "next/dynamic";
import type { DayActivity } from "../../lib/progress/metrics";

const PerformanceChart = dynamicNext(
  () => import("./performance-chart"),
  {
    ssr: false,
    loading: () => <p className="p-6 border border-rail bg-white text-gray-500">Cargando gráfico de rendimiento…</p>,
  },
);

export function LazyChartWrapper({ activity }: { activity: DayActivity[] }) {
  return <PerformanceChart activity={activity} />;
}
