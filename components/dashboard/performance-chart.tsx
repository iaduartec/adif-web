"use client";

import type { DayActivity } from "../../lib/progress/metrics";

export default function PerformanceChart({ activity }: { activity: DayActivity[] }) {
  const maxCount = Math.max(...activity.map((a) => a.count), 1);
  const chartHeight = 180;
  const barWidth = 36;
  const gap = 16;
  const totalWidth = activity.length * (barWidth + gap) - gap;

  // Format date helper (e.g. "02 Ago")
  function formatDateLabel(dateStr: string): string {
    try {
      const date = new Date(`${dateStr}T12:00:00Z`);
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="border border-rail bg-white p-6 mb-8">
      <h3 className="text-lg font-bold mb-6">Actividad de los últimos 7 días</h3>

      {/* SVG-based responsive Chart */}
      <div className="flex justify-center mb-8" aria-hidden="true">
        <svg
          height={chartHeight + 40}
          viewBox={`0 0 ${totalWidth} ${chartHeight + 40}`}
          width="100%"
          className="max-w-xl"
        >
          {activity.map((day, idx) => {
            const barHeight = (day.count / maxCount) * chartHeight;
            const x = idx * (barWidth + gap);
            const y = chartHeight - barHeight;

            return (
              <g key={day.date}>
                {/* Background column guideline */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  fill="var(--rail)"
                  opacity="0.15"
                  rx="2"
                />
                {/* Actual value bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="var(--accent)"
                  rx="2"
                  className="transition-all duration-500 ease-out"
                />
                {/* Hover value indicator */}
                {day.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {day.count}
                  </text>
                )}
                {/* Axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fill="color-mix(in srgb, var(--ink) 60%, var(--paper))"
                  fontSize="11"
                  className="capitalize"
                >
                  {formatDateLabel(day.date)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Screen Reader Table */}
      <section className="sr-only-tab-visible">
        <h4 className="sr-only">Detalle de actividad diaria</h4>
        <table className="min-w-full divide-y divide-rail text-left text-sm text-gray-700">
          <thead>
            <tr>
              <th className="py-2 font-bold text-xs uppercase tracking-wider text-gray-500">Fecha</th>
              <th className="py-2 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Sesiones/Respuestas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rail">
            {activity.map((day) => (
              <tr key={day.date}>
                <td className="py-2">{formatDateLabel(day.date)}</td>
                <td className="py-2 text-right font-medium">{day.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
