import type { OfficialQuestion } from "../content/schema";

export interface MetricQuestion {
  id: string;
  /** @deprecated Optional only while legacy callers are migrated to official question records. */
  source?: Pick<OfficialQuestion["source"], "year" | "examCode" | "section">;
}

export interface MetricAttempt {
  question_id: string;
  is_correct: boolean;
  created_at: string;
}

export interface MetricLessonProgress {
  lesson_id: string;
  percent: number;
  completed: boolean;
  last_activity_at: string;
}

export interface ModuleAccuracy {
  correct: number;
  total: number;
  accuracy: number;
}

export interface DayActivity {
  date: string;
  count: number;
}

export interface ExamCoverage {
  year: number;
  examCode: string;
  attempted: number;
  total: number;
}

export interface StudyMetrics {
  streak: number;
  accuracyByModule: Record<string, ModuleAccuracy>;
  weakestModule: string | null;
  sevenDayActivity: DayActivity[];
  coverageByExam: Record<string, ExamCoverage>;
}

export function calculateMetrics(
  attempts: readonly MetricAttempt[],
  lessonProgress: readonly MetricLessonProgress[],
  questions: readonly MetricQuestion[],
  refDate: Date = new Date(),
): StudyMetrics {
  // Only active official questions can contribute to study history.
  const activeQuestions = questions.filter(
    (question): question is MetricQuestion & { source: NonNullable<MetricQuestion["source"]> } => question.source !== undefined,
  );
  const questionMap = new Map(activeQuestions.map((q) => [q.id, q]));
  const activeAttempts = attempts.filter((attempt) => questionMap.has(attempt.question_id));
  const accuracyByModule: Record<string, ModuleAccuracy> = {};

  for (const attempt of activeAttempts) {
    const q = questionMap.get(attempt.question_id);
    if (!q) continue;
    const section = q.source.section;

    if (!accuracyByModule[section]) {
      accuracyByModule[section] = { correct: 0, total: 0, accuracy: 0 };
    }

    const stats = accuracyByModule[section];
    stats.total++;
    if (attempt.is_correct) {
      stats.correct++;
    }
  }

  // Calculate final accuracy percentages
  let weakestModule: string | null = null;
  let minAccuracy = Infinity;

  for (const moduleName of Object.keys(accuracyByModule)) {
    const stats = accuracyByModule[moduleName];
    stats.accuracy = stats.total > 0 ? stats.correct / stats.total : 0;

    if (stats.accuracy < minAccuracy) {
      minAccuracy = stats.accuracy;
      weakestModule = moduleName;
    }
  }

  // 2. Calculate unique active days
  const activeDates = new Set<string>();

  for (const attempt of activeAttempts) {
    const dateStr = attempt.created_at.split("T")[0];
    activeDates.add(dateStr);
  }
  for (const progress of lessonProgress) {
    const dateStr = progress.last_activity_at.split("T")[0];
    activeDates.add(dateStr);
  }

  // 3. Streak calculation
  let streak = 0;
  const getLocalDateStr = (d: Date) => d.toISOString().split("T")[0];

  const todayStr = getLocalDateStr(refDate);
  const yesterdayDate = new Date(refDate.getTime() - 24 * 3600 * 1000);
  const yesterdayStr = getLocalDateStr(yesterdayDate);

  let startStreakDate: Date | null = null;

  if (activeDates.has(todayStr)) {
    startStreakDate = refDate;
  } else if (activeDates.has(yesterdayStr)) {
    startStreakDate = yesterdayDate;
  }

  if (startStreakDate !== null) {
    let checkDate = new Date(startStreakDate.getTime());
    while (activeDates.has(getLocalDateStr(checkDate))) {
      streak++;
      // go back 1 day
      checkDate = new Date(checkDate.getTime() - 24 * 3600 * 1000);
    }
  }

  // 4. Seven day activity ending on refDate
  const sevenDayActivity: DayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate.getTime() - i * 24 * 3600 * 1000);
    const dateStr = getLocalDateStr(d);

    // count attempts on this day
    let count = 0;
    for (const attempt of activeAttempts) {
      if (attempt.created_at.startsWith(dateStr)) count++;
    }
    for (const progress of lessonProgress) {
      if (progress.last_activity_at.startsWith(dateStr)) count++;
    }

    sevenDayActivity.push({ date: dateStr, count });
  }

  const coverageByExam: Record<string, ExamCoverage> = {};
  for (const question of activeQuestions) {
    const id = `ADIF-${question.source.year}-${question.source.examCode}`;
    if (!coverageByExam[id]) {
      coverageByExam[id] = {
        year: question.source.year,
        examCode: question.source.examCode,
        attempted: 0,
        total: 0,
      };
    }
    coverageByExam[id].total++;
  }
  for (const questionId of new Set(activeAttempts.map((attempt) => attempt.question_id))) {
    const question = questionMap.get(questionId);
    if (!question) continue;
    const id = `ADIF-${question.source.year}-${question.source.examCode}`;
    coverageByExam[id].attempted++;
  }

  return {
    streak,
    accuracyByModule,
    weakestModule,
    sevenDayActivity,
    coverageByExam,
  };
}

export interface Recommendation {
  type: "lesson" | "practice" | "simulation";
  id: string;
  title: string;
  description: string;
  href: string;
}

export const MODULE_NAME_TO_LESSON_SLUG: Record<string, string> = {
  "G1 Igualdad": "igualdad",
  "G2 PRL": "prevencion-riesgos-laborales",
  "G3 Estatuto ADIF": "estatuto-adif",
  "E1 ICT RD 346/2011": "ict-rd-346-2011",
  "E2 Compatibilidad electromagnetica": "compatibilidad-electromagnetica",
  "E3 RCF Libro 1": "rcf-libro-1",
  "P Psicotecnicos": "psicometria",
  "I Ingles A2": "ingles-a2",
};

export const MODULE_NAME_TO_LABEL: Record<string, string> = {
  "G1 Igualdad": "Igualdad",
  "G2 PRL": "Prevención de Riesgos Laborales",
  "G3 Estatuto ADIF": "Estatuto de ADIF",
  "E1 ICT RD 346/2011": "ICT RD 346/2011",
  "E2 Compatibilidad electromagnetica": "Compatibilidad electromagnética",
  "E3 RCF Libro 1": "RCF Libro 1",
  "P Psicotecnicos": "Psicotécnicos",
  "I Ingles A2": "Inglés A2",
};

export const OFFICIAL_SECTION_LABELS: Record<OfficialQuestion["source"]["section"], string> = {
  general: "Conocimientos generales",
  english: "Inglés",
  specific: "Conocimiento específico",
};

function isOfficialSection(value: string): value is OfficialQuestion["source"]["section"] {
  return Object.hasOwn(OFFICIAL_SECTION_LABELS, value);
}

export function displayModuleName(moduleName: string | null | undefined): string {
  if (!moduleName) return "General";
  if (isOfficialSection(moduleName)) return OFFICIAL_SECTION_LABELS[moduleName];
  return MODULE_NAME_TO_LABEL[moduleName] ?? moduleName;
}

export function lessonSlugForModule(moduleName: string | null | undefined): string | null {
  if (!moduleName) return null;
  return MODULE_NAME_TO_LESSON_SLUG[moduleName] ?? null;
}

export function recommendNextSession(
  lessons: readonly { slug: string; title: string; percent: number; completed: boolean }[],
  weakestModule: string | null,
  simulations: readonly { id: string; title: string }[] = [],
): Recommendation {
  // Recommend the first incomplete lesson
  const incomplete = lessons.find((l) => !l.completed);
  if (incomplete) {
    return {
      type: "lesson",
      id: incomplete.slug,
      title: `Volver a ${incomplete.title}`,
      description: "Tienes temario pendiente. Reanuda la lección antes de volver a la práctica intensiva.",
      href: `/curso/${incomplete.slug}`,
    };
  }

  // Recommend practice only for a filterable official section.
  if (weakestModule && isOfficialSection(weakestModule)) {
    return {
      type: "practice",
      id: weakestModule,
      title: `Practicar ${displayModuleName(weakestModule)}`,
      description: "Ya no hay lecciones pendientes. Repite la sección donde peor estás rindiendo ahora mismo.",
      href: `/tests?section=${encodeURIComponent(weakestModule)}&practice=true`,
    };
  }

  const nextSimulation = simulations[0];
  if (nextSimulation) {
    return {
      type: "simulation",
      id: nextSimulation.id,
      title: `Hacer ${nextSimulation.title}`,
      description: "Completa un simulacro para medir el rendimiento real y detectar fallos de gestión del tiempo.",
      href: `/simulacros/${nextSimulation.id}`,
    };
  }

  // Default recommendation
  return {
    type: "simulation",
    id: "SIM-01",
    title: "Iniciar simulacro",
    description: "Si no hay datos suficientes, empieza por un simulacro completo para establecer una referencia.",
    href: "/simulacros/SIM-01",
  };
}
