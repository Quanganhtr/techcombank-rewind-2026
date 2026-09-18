# Techcombank Rewind 2026

An interactive demo of Rewind 2026 — a conversation with your own year — played inside an
iPhone 17 Pro Max mockup on a black stage, built to be shown on a laptop.

**Live demo:** https://quanganhtr.github.io/techcombank-rewind-2026/

Built from the Figma file [Rewind 2026](https://www.figma.com/design/xo6Gp5G7NvdKw2NZbRZfKZ/Rewind-2026),
board "Option 1".

## The flow

| # | Screen | Advances when |
| --- | --- | --- |
| 1 | `Start` — QUANG ƠI! / TRÒ CHUYỆN VỚI 2026 | you press the dotted **NHẤN ĐỂ BẮT ĐẦU** ring |
| 2 | `First` — "Năm 2026 của bạn ổn chứ?" | you press **Gửi** |
| 3 | `FirstSentence` — the answer card, +28.7% | — |

Screens drive themselves through their own controls, so there is no autoplay and no tap-to-advance
overlay that would swallow a button press. For presenting, `←` and `→` step through the flow, `R`
returns to the start, and `?page=2` opens directly on a given screen.

## Adding screens

Add a component and an entry in [`src/pages/index.tsx`](src/pages/index.tsx). Each screen fills the
440×956 canvas and receives `next` / `prev`:

```tsx
export const pages: Page[] = [
  { id: "start", render: ({ next }) => <Start next={next} /> },
];
```

Screens are positioned with absolute coordinates taken straight from Figma, so they match the
design 1:1 rather than approximating it.

## Pulling from Figma

Put a Figma personal access token (scope: **File content** read) in `.env.local`:

```
FIGMA_TOKEN=figd_…
```

Then:

```bash
node scripts/figma-list.mjs      # pages and top-level frames
node scripts/figma-screens.mjs   # trees + PNG renders + a type/colour summary
node scripts/figma-dump.mjs 1:69 # compact layout tree for one screen
node scripts/figma-assets.mjs    # re-export the logo and send icon
```

Output lands in a gitignored `figma/` folder. `.env.local` is gitignored too.

## The device frame

[`src/assets/mockup.png`](src/assets/mockup.png) is a 472×988 PNG with a transparent screen cutout
of 440×956 at offset (16, 16). Screen content renders *behind* it, so the bezel and Dynamic Island
mask it for free. Swapping the mockup means re-measuring those four numbers at the top of
[`src/components/PhoneFrame.tsx`](src/components/PhoneFrame.tsx).

## Design notes

The amber light is built the way the design builds it: stacked blurred pills, palest and widest at
the outside down to near-black in the middle ([`src/components/Glow.tsx`](src/components/Glow.tsx)).
Figma's layer-blur radius is converted to a CSS blur of `radius / 2.4`, which matches the reference
renders most closely. Type is Plus Jakarta Sans (200/300/400/600); the status bar uses the system
face, as real iOS chrome would.

## Running it locally

```bash
npm install
npm run dev
```

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Motion. Deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

## Project layout

```
src/
  App.tsx                    black stage the phone sits on
  pages/
    index.tsx                the flow, in order
    Start.tsx  First.tsx  FirstSentence.tsx
  components/
    Rewind.tsx               screen transitions, swipe, keyboard
    PhoneFrame.tsx           device frame + 440×956 canvas, scaled to the window
    Glow.tsx                 the stacked-blur light source
    Header.tsx  Composer.tsx  StatusBar.tsx
  lib/cn.ts                  clsx + tailwind-merge
  assets/                    mockup, logo, send icon
scripts/                     Figma REST pullers
```
