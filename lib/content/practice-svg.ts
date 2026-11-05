// Deliberately small static SVG subset. No CSS, links, entities, animation or foreign content.
const elements = new Set(["svg", "g", "rect", "circle", "ellipse", "line", "polyline", "polygon", "path", "text"]);
const attributes = new Set(["viewBox", "width", "height", "xmlns", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "d", "points", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "font-size", "font-family", "font-weight", "text-anchor", "dominant-baseline", "transform", "opacity"]);

export function isSafePracticeSvg(svg: string): boolean {
  if (svg.length > 50000 || /[&]/.test(svg)) return false;
  const tokens = svg.match(/<[^>]*>|[^<]+/g);
  if (!tokens || tokens.join("") !== svg) return false;
  const stack: string[] = [];
  let rootSeen = false;
  for (const token of tokens) {
    if (!token.startsWith("<")) {
      if (token.includes(">") || (!stack.length && token.trim())) return false;
      continue;
    }
    const close = /^<\/([a-z]+)\s*>$/.exec(token);
    if (close) {
      if (stack.pop() !== close[1]) return false;
      continue;
    }
    const open = /^<([a-z]+)([\s\S]*?)(\/?)>$/.exec(token);
    if (!open || !elements.has(open[1])) return false;
    if (!stack.length) {
      if (rootSeen || open[1] !== "svg" || open[3]) return false;
      rootSeen = true;
    } else if (open[1] === "svg") return false;
    let rest = open[2];
    const seen = new Set<string>();
    while (rest.trim()) {
      const attribute = /^\s+([A-Za-z][A-Za-z0-9-]*)="([^"<>]*)"/.exec(rest);
      if (!attribute || !attributes.has(attribute[1]) || seen.has(attribute[1])) return false;
      const value = attribute[2];
      if (attribute[1] !== "xmlns" && (!/^[a-zA-Z0-9#.,%()\s+\-]*$/.test(value) || /url\s*\(/i.test(value))) return false;
      if (attribute[1] === "xmlns" && value !== "http://www.w3.org/2000/svg") return false;
      seen.add(attribute[1]);
      rest = rest.slice(attribute[0].length);
    }
    if (!open[3]) stack.push(open[1]);
  }
  return rootSeen && stack.length === 0;
}
