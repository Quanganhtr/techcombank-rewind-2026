/** Pulls full trees + PNG renders for every screen on the "Option 1" board. */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
const FILE_KEY = "xo6Gp5G7NvdKw2NZbRZfKZ";
const IDS = ["1:69", "1:92", "1:113"];
const TOKEN = process.env.FIGMA_TOKEN ??
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^FIGMA_TOKEN=(.+)$/m)?.[1].trim() : null);
const api = async (p) => {
  const r = await fetch(`https://api.figma.com/v1${p}`, { headers: { "X-Figma-Token": TOKEN } });
  const j = await r.json();
  if (!r.ok) { console.error(j); process.exit(1); }
  return j;
};
mkdirSync("figma", { recursive: true });
const tree = await api(`/files/${FILE_KEY}/nodes?ids=${IDS.join(",")}`);
writeFileSync("figma/screens.json", JSON.stringify(tree, null, 2));
const imgs = await api(`/images/${FILE_KEY}?ids=${IDS.join(",")}&format=png&scale=2`);
for (const [id, url] of Object.entries(imgs.images)) {
  if (!url) continue;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`figma/${id.replace(":", "-")}.png`, buf);
  console.log("wrote", `figma/${id.replace(":", "-")}.png`);
}
// summarise fonts and solid colours used across all three
const fonts = new Map(), colors = new Map(), texts = [];
const hex = (c) => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const walk = (n, screen) => {
  if (n.style?.fontFamily) {
    const k = `${n.style.fontFamily} ${n.style.fontWeight} / ${Math.round(n.style.fontSize)}px  lh ${Math.round(n.style.lineHeightPx ?? 0)}  ls ${(n.style.letterSpacing ?? 0).toFixed(2)}`;
    fonts.set(k, (fonts.get(k) ?? 0) + 1);
  }
  if (n.type === "TEXT") texts.push(`[${screen}] "${n.characters?.replace(/\n/g, "\\n")}"`);
  for (const f of n.fills ?? []) if (f.type === "SOLID" && f.visible !== false) colors.set(hex(f.color), (colors.get(hex(f.color)) ?? 0) + 1);
  for (const c of n.children ?? []) walk(c, screen);
};
for (const id of IDS) { const d = tree.nodes[id].document; walk(d, d.name); }
console.log("\n— TYPE —");
for (const [k, v] of [...fonts].sort((a, b) => b[1] - a[1])) console.log(`  ${v}×  ${k}`);
console.log("\n— SOLID FILLS —");
for (const [k, v] of [...colors].sort((a, b) => b[1] - a[1])) console.log(`  ${v}×  ${k}`);
console.log("\n— TEXT —");
for (const t of texts) console.log("  " + t);
