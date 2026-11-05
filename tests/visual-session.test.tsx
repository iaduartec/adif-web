import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { OriginalPracticeSession } from "../components/practice/original-practice-session";
import type { OriginalPracticeQuestionDto } from "../lib/content/original-practice-public-dto";

const figure = '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="5"/></svg>';
const item: OriginalPracticeQuestionDto = {
 id: "visual-test", origin: "original", domain: "psychometric", topicId: "matrices", topic: "Matrices", skill: "matrices", prompt: "Escoge", figure, figureAlt: "Un círculo", difficulty: 1, tags: [],
 options: ["A", "B", "C", "D"].map((key) => ({ key: key as "A" | "B" | "C" | "D", text: `Opción ${key}`, ...(key === "A" ? { figure, figureAlt: "Círculo de opción" } : {}) })),
};
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("renders graphical choices and reveals correction only after submission", async () => {
 vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ isCorrect: true, correctAnswer: "A", explanation: "Explicación de prueba" }) }));
 render(<OriginalPracticeSession questions={[item]} />);
 fireEvent.click(screen.getByRole("button", {name: "Comenzar bloque"}));
 expect(screen.getByRole("img", {name: "Un círculo"})).toBeVisible();
 expect(screen.getByRole("img", {name: "Círculo de opción"})).toBeVisible();
 expect(screen.queryByText("Explicación de prueba")).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("radio", {name: /Opción A/}));
 fireEvent.click(screen.getByRole("button", {name: "Comprobar respuesta"}));
 expect(await screen.findByText("Explicación de prueba")).toBeVisible();
});
