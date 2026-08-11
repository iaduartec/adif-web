"use server";

import {
  buildDailyPlan,
  listDailyTaskCandidates,
  type DailyPlanAction,
} from "../../lib/adaptive/daily-plan";
import { assembleDailyPlanInput } from "../../lib/adaptive/daily-plan-server";
import { madridDayKey } from "../../lib/adaptive/review-schedule";
import { createServerClient } from "../../lib/supabase/server";

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type PersistedAction = Pick<DailyPlanAction, "action"> & {
  replacement_task_key: string | null;
};

function sameAction(
  existing: PersistedAction,
  action: DailyPlanAction["action"],
  replacementTaskKey: string | null,
) {
  return existing.action === action && existing.replacement_task_key === replacementTaskKey;
}

async function authenticatedContext() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Debes iniciar sesión para modificar tu plan diario.");
  return { supabase, user };
}

async function existingAction(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userId: string,
  planDate: string,
  taskKey: string,
) {
  const { data, error } = await supabase
    .from("daily_plan_actions")
    .select("action,replacement_task_key")
    .eq("user_id", userId)
    .eq("plan_date", planDate)
    .eq("task_key", taskKey)
    .maybeSingle();
  if (error) throw new Error("No se ha podido comprobar la acción del plan.");
  return data;
}

async function persistAction({
  action,
  planDate,
  replacementTaskKey,
  supabase,
  taskKey,
  userId,
}: {
  action: DailyPlanAction["action"];
  planDate: string;
  replacementTaskKey: string | null;
  supabase: Awaited<ReturnType<typeof createServerClient>>;
  taskKey: string;
  userId: string;
}) {
  const { error } = await supabase.from("daily_plan_actions").insert({
    user_id: userId,
    plan_date: planDate,
    task_key: taskKey,
    action,
    replacement_task_key: replacementTaskKey,
  });
  if (!error) return { ok: true } as const;

  if (error.code === "23505") {
    const raced = await existingAction(supabase, userId, planDate, taskKey);
    if (raced && sameAction(raced, action, replacementTaskKey)) return { ok: true } as const;
  }
  throw new Error("No se ha podido guardar la acción del plan. Inténtalo de nuevo.");
}

async function actionContext(planDate: string, taskKey: string) {
  if (!DAY_PATTERN.test(planDate) || planDate !== madridDayKey(new Date())) {
    throw new Error("La fecha del plan ya no es la fecha activa en Madrid.");
  }
  if (typeof taskKey !== "string" || taskKey.length < 1 || taskKey.length > 200) {
    throw new Error("La tarea del plan no es válida.");
  }
  const { supabase, user } = await authenticatedContext();
  const existing = await existingAction(supabase, user.id, planDate, taskKey);
  return { existing, supabase, user };
}

export async function postponeDailyTask(planDate: string, taskKey: string) {
  const { existing, supabase, user } = await actionContext(planDate, taskKey);
  if (existing) {
    if (sameAction(existing, "postpone", null)) return { ok: true } as const;
    throw new Error("Esta tarea ya tiene una acción registrada para hoy.");
  }

  const input = await assembleDailyPlanInput(planDate, { supabase, userId: user.id });
  const activePlan = buildDailyPlan(input);
  if (!activePlan.tasks.some((task) => task.key === taskKey)) {
    throw new Error("La tarea ya no está activa en el plan de hoy.");
  }
  return persistAction({
    action: "postpone",
    planDate,
    replacementTaskKey: null,
    supabase,
    taskKey,
    userId: user.id,
  });
}

export async function replaceDailyTask(planDate: string, taskKey: string, replacementTaskKey: string) {
  const { existing, supabase, user } = await actionContext(planDate, taskKey);
  if (existing) {
    if (sameAction(existing, "replace", replacementTaskKey)) return { ok: true } as const;
    throw new Error("Solo puedes reemplazar una vez cada tarea original al día.");
  }
  if (replacementTaskKey === taskKey) throw new Error("Elige una tarea distinta como alternativa.");

  const input = await assembleDailyPlanInput(planDate, { supabase, userId: user.id });
  const original = buildDailyPlan(input).tasks.find((task) => task.key === taskKey);
  if (!original) throw new Error("La tarea original ya no está activa en el plan de hoy.");
  const replacement = listDailyTaskCandidates(input).find((task) => task.key === replacementTaskKey);
  if (!replacement) throw new Error("La tarea alternativa ya no está activa.");
  if (replacement.estimatedMinutes > original.estimatedMinutes) {
    throw new Error("La duración de la alternativa no puede superar la de la tarea original.");
  }

  return persistAction({
    action: "replace",
    planDate,
    replacementTaskKey,
    supabase,
    taskKey,
    userId: user.id,
  });
}
