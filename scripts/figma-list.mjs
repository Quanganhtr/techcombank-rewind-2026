/** Lists every page and top-level frame in the Figma file. */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
const FILE_KEY = "xo6Gp5G7NvdKw2NZbRZfKZ";
const TOKEN = process.env.FIGMA_TOKEN ??
  (existsSync(".env.local") ? readFileSync(".env.local", "utf8").match(/^FIGMA_TOKEN=(.+)$/m)?.[1].trim() : null);
const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=2`, {
  headers: { "X-Figma-Token": TOKEN },
});
const file = await res.json();
if (!res.ok) { console.error(file); process.exit(1); }
writeFileSync("figma/file-index.json", JSON.stringify(file, null, 2));
console.log(`file: "${file.name}"  last modified ${file.lastModified}\n`);
for (const page of file.document.children) {
  console.log(`PAGE  ${page.name}  (${page.children?.length ?? 0} frames)`);
  for (const f of page.children ?? []) {
    const b = f.absoluteBoundingBox;
    console.log(`   ${f.id.padEnd(9)} ${String(Math.round(b?.width ?? 0)).padStart(4)}×${String(Math.round(b?.height ?? 0)).padEnd(5)} ${f.name}`);
  }
  console.log();
}
