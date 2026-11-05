import { describe, expect, it } from "vitest";

import { timerAnnouncement } from "../lib/content/original-simulation-timer";

describe("timerAnnouncement", () => {
  it("announces the remaining time only when a threshold is crossed", () => {
    expect(timerAnnouncement(null, 300)).toBe("Quedan 5 minutos de simulacro.");
    expect(timerAnnouncement(301, 300)).toBe("Quedan 5 minutos de simulacro.");
    expect(timerAnnouncement(300, 299)).toBeNull();
    expect(timerAnnouncement(120, 61)).toBeNull();
    expect(timerAnnouncement(61, 60)).toBe("Queda 1 minuto de simulacro.");
    expect(timerAnnouncement(60, 59)).toBeNull();
    expect(timerAnnouncement(1, 0)).toBe("El tiempo ha terminado. El simulacro se entrega ahora.");
  });

  it("does not repeat a threshold that was already crossed", () => {
    expect(timerAnnouncement(300, 300)).toBeNull();
    expect(timerAnnouncement(60, 60)).toBeNull();
    expect(timerAnnouncement(0, 0)).toBeNull();
  });

  it("ignores a clock that moves backwards instead of announcing twice", () => {
    expect(timerAnnouncement(299, 305)).toBeNull();
  });
});
