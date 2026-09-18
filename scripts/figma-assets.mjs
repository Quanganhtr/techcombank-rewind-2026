/** Exports the logo + send arrow as SVG and the stats card gradient as PNG. */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
const FILE_KEY = "xo6Gp5G7NvdKw2NZbRZfKZ";
const TOKEN = process.env.FIGMA_TOKEN ??
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^FIGMA_TOKEN=(.+)$/m)?.[1].trim() : null);
const get = async (p) => {
  const r = await fetch(`https://api.figma.com/v1${p}`, { headers: { "X-Figma-Token": TOKEN } });
  const j = await r.json();
  if (!r.ok) { console.error(j); process.exit(1); }
  return j;
};
const grab = async (id, format, scale, out) => {
  const j = await get(`/images/${FILE_KEY}?ids=${encodeURIComponent(id)}&format=${format}${scale ? `&scale=${scale}` : ""}`);
  const url = j.images[id];
  if (!url) { console.error("no render for", id); return; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(out, buf);
  console.log("wrote", out, `(${(buf.length / 1024).toFixed(1)} kB)`);
};
await grab("1:74", "svg", null, "src/assets/logo-tcb.svg");
await grab("1:112", "svg", null, "src/assets/icon-send.svg");
await grab("1:127", "png", 3, "src/assets/stats-card.png");
