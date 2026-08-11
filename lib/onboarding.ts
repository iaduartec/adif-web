export const ONBOARDING_SESSION_MINUTES = [20, 30, 45, 60] as const;

export type OnboardingData = {
  weeklyTargetMinutes: number;
  preferredDays: number[];
  sessionMinutes: (typeof ONBOARDING_SESSION_MINUTES)[number];
  examDate: string | null;
  diagnostic: boolean;
};

export type OnboardingErrors = Partial<Record<keyof OnboardingData, string>>;

export type OnboardingParseResult =
  | { data: OnboardingData; errors: Record<string, never> }
  | { data: null; errors: OnboardingErrors };

export function getMadridDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function parseOnboardingInput(formData: FormData, today = getMadridDate()): OnboardingParseResult {
  const weeklyTargetMinutes = Number(formData.get("weekly_target_minutes"));
  const rawPreferredDays = formData.getAll("preferred_days").map(String);
  const preferredDays = [...new Set(rawPreferredDays.map(Number))].sort((a, b) => a - b);
  const sessionMinutes = Number(formData.get("session_minutes"));
  const rawExamDate = formData.get("exam_date");
  const examDate = typeof rawExamDate === "string" && rawExamDate ? rawExamDate : null;
  const diagnostic = formData.get("diagnostic") === "true";
  const errors: OnboardingErrors = {};

  if (!Number.isInteger(weeklyTargetMinutes) || weeklyTargetMinutes < 1 || weeklyTargetMinutes > 1680) {
    errors.weeklyTargetMinutes = "Indica un objetivo semanal entre 1 y 1.680 minutos.";
  }
  if (rawPreferredDays.length === 0 || rawPreferredDays.some((day) => !/^[0-6]$/.test(day))) {
    errors.preferredDays = "Elige al menos un día de estudio.";
  }
  if (!ONBOARDING_SESSION_MINUTES.includes(sessionMinutes as (typeof ONBOARDING_SESSION_MINUTES)[number])) {
    errors.sessionMinutes = "Elige una duración de sesión disponible.";
  }
  if (examDate && (!isCalendarDate(examDate) || examDate < today)) {
    errors.examDate = "La fecha de examen no puede ser anterior a hoy.";
  }

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return {
    data: {
      weeklyTargetMinutes,
      preferredDays,
      sessionMinutes: sessionMinutes as OnboardingData["sessionMinutes"],
      examDate,
      diagnostic,
    },
    errors: {},
  };
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

type DiagnosticQuestion = { id: string; source: { section: string } };

export function selectBalancedDiagnosticQuestionIds(
  questions: readonly DiagnosticQuestion[],
  limit = 15,
) {
  const sections = new Map<string, string[]>();
  for (const question of questions) {
    const bucket = sections.get(question.source.section) ?? [];
    bucket.push(question.id);
    sections.set(question.source.section, bucket);
  }

  const buckets = [...sections.values()];
  const selected: string[] = [];
  while (selected.length < limit && buckets.some((bucket) => bucket.length > 0)) {
    for (const bucket of buckets) {
      const questionId = bucket.shift();
      if (questionId) selected.push(questionId);
      if (selected.length === limit) break;
    }
  }
  return selected;
}
