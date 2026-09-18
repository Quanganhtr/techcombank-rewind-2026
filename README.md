# Techcombank Rewind 2026

An interactive demo of Rewind 2026 — a conversation with your own year — played inside an
iPhone 17 Pro Max mockup on a black stage, built to be shown on a laptop.

**Live demo:** https://quanganhtr.github.io/techcombank-rewind-2026/

Built from the Figma file [Rewind 2026](https://www.figma.com/design/xo6Gp5G7NvdKw2NZbRZfKZ/Rewind-2026),
board "Option 1".

## The flow

| # | Screen | Advances when |
| --- | --- | --- |
| 1 | `Start` — QUANG ƠI! / TRÒ CHUYỆN VỚI 2026 | you press the dotted **BẮT ĐẦU** ring |
| 2 | `First` — "Năm 2026 của bạn ổn chứ?" | you press **Gửi** |
| 3 | `FirstSentence` — the answer card, +28.7% | — |

Screens drive themselves through their own controls, so there is no autoplay and no tap-to-advance
overlay that would swallow a button press. For presenting, `←` and `→` step through the flow, `R`
returns to the start, and `?page=2` opens directly on a given screen.

## The dome transition

Pressing **BẮT ĐẦU** plays moves 1–3 from the design. The dome is one rigid group —
pale field, glow stack, ring and label all hold the same offsets from its top edge in
every frame — so the whole move is a single `translateY`:

| Stage | Dome top | Figma frame |
| --- | --- | --- |
| rest | 399 | Start |
| — | 182 | move 1 (passed through, not held) |
| — | → −956 | move 2, move 3 |

Figma draws the dome 558 tall at rest and 956 tall once it moves, but at rest the extra
height falls past the screen edge, so a fixed 956 is visually identical and keeps the
animation a pure transform. Moves 1-3 are waypoints along one unbroken travel, not stops — the dome accelerates
away in a single tween. The screens swap the moment the dome's top passes y=50 and
covers the header, driven by its real position rather than a timer, so the crossfade
stays hidden however the easing is retuned.

The chat input rises from below the screen at the moment the dome's **bottom edge**
crosses the middle of the screen — dome top at −478, since the dome is 956 tall. Like
the screen swap, it is triggered by the dome's real position, not a timer. It lives in
the shell rather than in a screen, because it persists across the conversation.

**Native:** `.offset(y:)` on a `ZStack` / `Modifier.offset` on a `Box` for both — the
blurred layers stay cached, nothing re-rasterises.

## The typing reveal

The composer's question, "Cũng cũng. Tài sản của tôi / năm nay thế nào?", types itself
the moment the chat box finishes sliding up — roughly 1.5s after the press.
Each character ignites amber-white and cools to plain white over the next four, with a
block cursor on the character being struck.

It is chained off the slide's completion, not a timer, so retiming the slide carries the
typing with it. The headline above it is static and simply fades in with its screen.

It runs off one registered custom property, `--cursor`, animated 0→N in CSS. Every
character knows its own index and derives its own heat, colour and shadow from it — so
there is no per-frame JavaScript, and it is unaffected by Motion's repeating animations
stalling inside an `AnimatePresence` child.

The string is split with `Intl.Segmenter` at **grapheme** granularity, not by code
point, so a Vietnamese diacritic can never be revealed a frame after its base letter.
Speed is `charMs` on the component (38ms; ~0.9s for this line).

**Native:** SwiftUI `AttributedString` with per-run `.shadow`, Compose `AnnotatedString`
with `SpanStyle(shadow=…)`, both driven by one animated float. Use attributed strings
rather than a view per character, or line wrapping becomes manual on both platforms.

## The glow heartbeat

The dome's glow stack beats slowly — a lub-dub at 1.030 then 1.045, 600ms apart, then a
rest, on a 3s cycle. The whole stack is scaled as one container, so the seven blurred
layers stay cached and only get re-composited; nothing re-blurs. `transform-origin` is
the stack's own centre (220, 266) rather than the dome's, so it breathes in place.

Pass `pulse` to `<Glow>` to apply it. Only the dome uses it — the composer's glow is
still.

**Native:** `.scaleEffect()` with a repeating animation / `Modifier.graphicsLayer` with
`rememberInfiniteTransition`. Transform only, so it stays cheap on both.

## The start ring

From the Figma motion timeline on node `10:173`:

| Field | Motion |
| --- | --- |
| `pathTrimStart` / `pathTrimEnd` | both advance 1.0 per second, holding a 0.16 window — a 16% arc sweeping one lap per second |
| `strokeWeight` | 8 → 4 over the first second on an ease-in-out, then holds; snaps back to 8 at the top of the 2s loop |

SVG cannot dash and trim the same stroke, so the trim is a **mask** over the dotted
ring: the mask path carries `stroke-dasharray: 0.16 0.84` with `pathLength=1` and an
animating `stroke-dashoffset`.

The visible portion is the literal reading of the timeline — start `0.92` to end `1.08`
is 16% of the path. If the intent was the complement (84% visible with a 16% gap
chasing round), swap the mask's dash array to `0.84 0.16`.

**Native:** `Shape.trim(from:to:)` in SwiftUI, `PathMeasure.getSegment` in Compose —
both support path trim directly, no mask needed.

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
