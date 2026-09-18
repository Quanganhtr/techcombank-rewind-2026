# Techcombank Rewind 2026

An interactive demo shell: a tap-through deck of screens played inside an iPhone 17 Pro Max
mockup on a desktop stage, built to show how the flow looks and how it feels to move through it.

**Live demo:** https://quanganhtr.github.io/techcombank-rewind-2026/

The deck is currently empty — one placeholder screen — and waiting for the real designs.

## Adding screens

Each screen is a component that fills the 440×956 device canvas. Add it to the list in
[`src/pages/index.tsx`](src/pages/index.tsx):

```tsx
export const pages: Page[] = [
  { id: "intro",  tone: "dark",  render: () => <Intro /> },
  { id: "spend",  tone: "light", render: () => <Spend /> },
];
```

`tone` is the screen's background tone — it keeps the progress bar legible against it. Everything
else (navigation, progress, autoplay, transitions) is handled by the player. Delete
[`src/pages/Placeholder.tsx`](src/pages/Placeholder.tsx) once real screens are in.

## Controls

| Action | Result |
| --- | --- |
| Tap / click the right side | Next screen |
| Tap / click the left side | Previous screen |
| Hold | Pause |
| Swipe left / right | Next / previous screen |
| `←` `→` | Previous / next screen |
| `Space` | Pause or resume |
| `R` | Start over |

Screens also advance on their own every 6.2 seconds once there is more than one. Append `?page=3`
to the URL to open the deck on a specific screen — useful when walking someone through one of them.

## The device frame

[`src/assets/mockup.png`](src/assets/mockup.png) is a 472×988 PNG with a transparent screen
cutout measuring 440×956 at offset (16, 16). Screen content is rendered *behind* the image, so the
bezel and Dynamic Island mask it for free. Swapping in a different mockup means re-measuring those
four numbers at the top of [`src/components/PhoneFrame.tsx`](src/components/PhoneFrame.tsx).

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
  App.tsx                    stage the phone sits on
  pages/
    index.tsx                the deck — add screens here
    Placeholder.tsx          stand-in until the real screens land
  components/
    Rewind.tsx               playback: autoplay clock, tap zones, swipe, keyboard
    PhoneFrame.tsx           device frame + 440×956 screen canvas, scaled to the window
  lib/
    cn.ts                    clsx + tailwind-merge
    useCountUp.ts            number animation, respects reduced motion
  assets/mockup.png          iPhone 17 Pro Max frame
```
