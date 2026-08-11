"use client";

import { useActionState } from "react";
import { saveOnboarding } from "../../app/onboarding/actions";
import { ONBOARDING_SESSION_MINUTES } from "../../lib/onboarding";
import { initialOnboardingFormState, type OnboardingFormState } from "../../lib/onboarding-form-state";

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function OnboardingForm({
  initialValues,
  next,
}: {
  initialValues: OnboardingFormState["values"];
  next: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    saveOnboarding.bind(null, next),
    { ...initialOnboardingFormState, values: initialValues },
  );
  const { errors, values } = state;

  return (
    <form action={formAction} className="onboarding-form" noValidate>
      <div aria-live="polite" className="onboarding-form__status">
        {errors.form ? <p role="alert">{errors.form}</p> : null}
      </div>

      <div className="onboarding-field">
        <label htmlFor="weekly-target">Objetivo semanal (minutos)</label>
        <input aria-describedby={errors.weeklyTargetMinutes ? "weekly-target-error" : undefined} defaultValue={values.weeklyTargetMinutes} id="weekly-target" max="1680" min="1" name="weekly_target_minutes" required step="1" type="number" />
        {errors.weeklyTargetMinutes ? <p id="weekly-target-error" role="alert">{errors.weeklyTargetMinutes}</p> : null}
      </div>

      <fieldset className="onboarding-field" aria-describedby={errors.preferredDays ? "preferred-days-error" : undefined}>
        <legend>Días preferidos de estudio</legend>
        <div className="onboarding-day-grid">
          {days.map((day, index) => (
            <label key={day}>
              <input defaultChecked={values.preferredDays.includes(String(index))} name="preferred_days" type="checkbox" value={index} />
              {day}
            </label>
          ))}
        </div>
        {errors.preferredDays ? <p id="preferred-days-error" role="alert">{errors.preferredDays}</p> : null}
      </fieldset>

      <fieldset className="onboarding-field" aria-describedby={errors.sessionMinutes ? "session-minutes-error" : undefined}>
        <legend>Duración habitual de sesión</legend>
        <div className="onboarding-session-grid">
          {ONBOARDING_SESSION_MINUTES.map((minutes) => (
            <label key={minutes}>
              <input defaultChecked={values.sessionMinutes === String(minutes)} name="session_minutes" required type="radio" value={minutes} />
              {minutes} minutos
            </label>
          ))}
        </div>
        {errors.sessionMinutes ? <p id="session-minutes-error" role="alert">{errors.sessionMinutes}</p> : null}
      </fieldset>

      <div className="onboarding-field">
        <label htmlFor="exam-date">Fecha de examen (opcional)</label>
        <input aria-describedby={errors.examDate ? "exam-date-error" : undefined} defaultValue={values.examDate} id="exam-date" name="exam_date" type="date" />
        {errors.examDate ? <p id="exam-date-error" role="alert">{errors.examDate}</p> : null}
      </div>

      <label className="onboarding-diagnostic">
        <input defaultChecked={values.diagnostic} name="diagnostic" type="checkbox" value="true" />
        Quiero hacer un diagnóstico inicial
      </label>
      <p className="onboarding-diagnostic__hint">Prepararemos una práctica de 15 preguntas oficiales repartidas entre las secciones disponibles.</p>

      <button className="ui-button" disabled={isPending} type="submit">
        {isPending ? "Guardando…" : "Guardar preparación"}
      </button>
    </form>
  );
}
