/**
 * Pulls a Figma node tree + PNG renders for the Rewind design.
 *   node scripts/figma-pull.mjs [node-id]
 * Reads FIGMA_TOKEN from .env.local (gitignored) or the environment.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const FILE_KEY = "xo6Gp5G7NvdKw2NZbRZfKZ";
const NODE = (process.argv[2] ?? "1-69").replace("-", ":");
const OUT = "figma";

function token() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN;
  if (existsSync(".env.local")) {
    const m = readFileSync(".env.local", "utf8").match(/^FIGMA_TOKEN=(.+)$/m);
    if (m) return m[1].trim();
  }
  console.error("No FIGMA_TOKEN. Put FIGMA_TOKEN=... in .env.local");
  process.exit(1);
}

const TOKEN = token();
const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    console.error(`${res.status} ${res.statusText} — ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
};

mkdirSync(OUT, { recursive: true });

// 1. the node tree: layer names, geometry, fills, type styles
const tree = await api(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE)}&geometry=paths`);
writeFileSync(`${OUT}/node-${NODE.replace(":", "-")}.json`, JSON.stringify(tree, null, 2));

const root = tree.nodes[NODE]?.document;
if (!root) {
  console.error(`Node ${NODE} not in response. Available:`, Object.keys(tree.nodes));
  process.exit(1);
}
console.log(`root: "${root.name}" (${root.type}) — ${root.children?.length ?? 0} children`);
for (const c of root.children ?? []) {
  const b = c.absoluteBoundingBox;
  console.log(`  ${c.id}  ${c.type.padEnd(9)} ${Math.round(b?.width ?? 0)}×${Math.round(b?.height ?? 0)}  ${c.name}`);
}

// 2. PNG renders of the node and each direct child, so the layout can be eyeballed
const ids = [NODE, ...(root.children ?? []).map((c) => c.id)];
const imgs = await api(
  `/images/${FILE_KEY}?ids=${encodeURIComponent(ids.join(","))}&format=png&scale=2`,
);
for (const [id, url] of Object.entries(imgs.images)) {
  if (!url) continue;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const name = `${OUT}/${id.replace(":", "-")}.png`;
  writeFileSync(name, buf);
  console.log("wrote", name, `(${(buf.length / 1024).toFixed(0)} kB)`);
}

// 3. published variables (tokens), if the file has any on a paid plan
try {
  const vars = await api(`/files/${FILE_KEY}/variables/local`);
  writeFileSync(`${OUT}/variables.json`, JSON.stringify(vars, null, 2));
  console.log("wrote", `${OUT}/variables.json`);
} catch {
  console.log("no variables endpoint access (needs an Enterprise plan) — skipping");
}
