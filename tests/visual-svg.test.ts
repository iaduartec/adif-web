import { describe, expect, it } from "vitest";
import { isSafePracticeSvg } from "../lib/content/practice-svg";

describe("practice SVG validation", () => {
  it("accepts basic static drawings", () => {
    expect(isSafePracticeSvg('<svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="#000"/></svg>')).toBe(true);
  });
  it.each([
    '<svg viewBox="0 0 10 10"><script>alert(1)</script></svg>',
    '<svg viewBox="0 0 10 10"><rect onload="alert(1)"/></svg>',
    '<svg viewBox="0 0 10 10"><image href="https://evil.test/a"/></svg>',
    '<svg viewBox="0 0 10 10"><rect fill="url(https://evil.test/a)"/></svg>',
    '<svg viewBox="0 0 10 10"><foreignObject/></svg>',
    '<svg viewBox="0 0 10 10"><g></svg>',
  ])("rejects unsafe or malformed SVG: %s", (svg) => expect(isSafePracticeSvg(svg)).toBe(false));
});
