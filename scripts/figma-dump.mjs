/** Prints a compact layout tree (geometry, fills, radii, text) for one screen. */
import { readFileSync } from "node:fs";
const tree = JSON.parse(readFileSync("figma/screens.json", "utf8"));
const ID = process.argv[2] ?? "1:69";
const hex = (c, a = c.a) => {
  const h = "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
  return a !== undefined && a < 1 ? `${h}@${a.toFixed(2)}` : h;
};
const paint = (f) => {
  if (f.visible === false) return null;
  if (f.type === "SOLID") return `solid ${hex(f.color, f.opacity ?? f.color.a)}`;
  if (f.type?.startsWith("GRADIENT")) {
    const stops = f.gradientStops.map(s => `${hex(s.color, s.color.a)}@${s.position.toFixed(2)}`).join(" ");
    const h = (f.gradientHandlePositions ?? []).map(p => `(${p.x.toFixed(2)},${p.y.toFixed(2)})`).join("");
    return `${f.type} ${h} [${stops}]`;
  }
  if (f.type === "IMAGE") return "image";
  return f.type;
};
const root = tree.nodes[ID].document;
const ox = root.absoluteBoundingBox.x, oy = root.absoluteBoundingBox.y;
const walk = (n, d = 0) => {
  const b = n.absoluteBoundingBox;
  const pos = b ? `${Math.round(b.x - ox)},${Math.round(b.y - oy)} ${Math.round(b.width)}×${Math.round(b.height)}` : "";
  const bits = [];
  if (n.cornerRadius !== undefined) bits.push(`r=${n.cornerRadius}`);
  if (n.rectangleCornerRadii) bits.push(`r=[${n.rectangleCornerRadii}]`);
  const fills = (n.fills ?? []).map(paint).filter(Boolean);
  if (fills.length) bits.push(`fill:${fills.join(" | ")}`);
  const strokes = (n.strokes ?? []).map(paint).filter(Boolean);
  if (strokes.length) bits.push(`stroke:${strokes.join(" | ")} w=${n.strokeWeight}${n.strokeDashes ? ` dash=[${n.strokeDashes}]` : ""}`);
  if (n.opacity !== undefined && n.opacity < 1) bits.push(`op=${n.opacity}`);
  if (n.effects?.length) bits.push("fx:" + n.effects.filter(e => e.visible !== false).map(e => `${e.type}${e.radius ? ` r${Math.round(e.radius)}` : ""}`).join(","));
  if (n.style) bits.push(`${n.style.fontFamily} ${n.style.fontWeight}/${Math.round(n.style.fontSize)} lh${Math.round(n.style.lineHeightPx)} ls${(n.style.letterSpacing ?? 0).toFixed(1)} ${n.style.textAlignHorizontal ?? ""}`);
  if (n.characters) bits.push(`"${n.characters.replace(/\n/g, "\\n")}"`);
  console.log(`${"  ".repeat(d)}${n.type.padEnd(9)} ${pos.padEnd(20)} ${n.name}${bits.length ? "  ·  " + bits.join("  ") : ""}`);
  for (const c of n.children ?? []) walk(c, d + 1);
};
console.log(`=== ${root.name} ===`);
walk(root);
