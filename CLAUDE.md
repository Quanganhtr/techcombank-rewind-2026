# Techcombank Rewind 2026 — Claude instructions

An interactive demo of Rewind 2026, played inside an iPhone 17 Pro Max mockup on a
black stage. It is built from Figma and is intended to become a **native iOS and
Android app**.

## Always

**Before choosing any UI technique, effect, or animation, use the `native-parity`
skill.** Every visual choice needs a named SwiftUI and Jetpack Compose equivalent
before it is written. This overrides "whatever looks right in the browser".

**Do not `git push` unless explicitly asked.** Commit locally and say what is unpushed.

## Source of truth

The Figma file is authoritative, not the browser. Pull real values rather than
eyeballing renders:

```bash
node scripts/figma-list.mjs        # pages and frames
node scripts/figma-screens.mjs     # trees, PNG renders, type/colour summary
node scripts/figma-dump.mjs 1:69   # layout tree for one screen
```

Needs `FIGMA_TOKEN` in `.env.local` (gitignored). Check `rotation`, `strokeAlign`,
`strokeCap`, `strokeDashes` and effects on nodes — plugin "copy as code" output gets
these wrong.

## Conventions

- Screens are 440×956 and positioned with absolute coordinates taken from Figma
- Tailwind utility classes; shared utilities live in `src/index.css`
- Conditional classes go through `cn()` in `src/lib/cn.ts`
- Entrance and transition animation: Motion. **Infinite decorative loops: CSS keyframes**
  — Motion freezes repeating animations inside an `AnimatePresence` child subtree
- Verify against Figma by measuring (script a headless browser), not by eye
