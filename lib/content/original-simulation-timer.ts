const THRESHOLDS = [
  { seconds: 300, message: "Quedan 5 minutos de simulacro." },
  { seconds: 60, message: "Queda 1 minuto de simulacro." },
  { seconds: 0, message: "El tiempo ha terminado. El simulacro se entrega ahora." },
] as const;

/**
 * A countdown that changes every second must never sit inside a live region:
 * a screen reader would read the whole exam over the timer. Instead the visible
 * clock is silent and this helper returns a message only when a threshold is
 * crossed, so the learner hears the time at useful moments and nothing else.
 */
export function timerAnnouncement(previous: number | null, next: number): string | null {
  const before = previous ?? Number.POSITIVE_INFINITY;
  if (next >= before) return null;
  const crossed = THRESHOLDS.find((threshold) => before > threshold.seconds && next <= threshold.seconds);
  return crossed?.message ?? null;
}
