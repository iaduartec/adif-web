import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OnboardingForm } from "../components/onboarding/onboarding-form";

describe("OnboardingForm", () => {
  it("renders the accessible profile contract with constrained choices and retained errors", () => {
    render(
      <OnboardingForm
        initialValues={{
          weeklyTargetMinutes: "240",
          preferredDays: ["1"],
          sessionMinutes: "45",
          examDate: "2026-08-10",
          diagnostic: false,
        }}
        next="/curso"
      />,
    );

    expect(screen.getByRole("spinbutton", { name: "Objetivo semanal (minutos)" })).toHaveValue(240);
    expect(screen.getByRole("checkbox", { name: "Lunes" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "45 minutos" })).toBeChecked();
    expect(screen.getByLabelText("Fecha de examen (opcional)")).toHaveValue("2026-08-10");
    expect(screen.getByRole("checkbox", { name: "Quiero hacer un diagnóstico inicial" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Guardar preparación" })).toBeVisible();
  });
});
