# Techcombank Rewind 2026

An interactive demo of a year-in-review experience, presented inside an iPhone 17 Pro Max
on a desktop stage — built to show how the flow looks and how it feels to move through it.

**Live demo:** https://quanganhtr.github.io/techcombank-rewind-2026/

## How to use it

| Action | Result |
| --- | --- |
| Tap / click the right side | Next card |
| Tap / click the left side | Previous card |
| Hold | Pause |
| Swipe left / right | Next / previous card |
| `←` `→` | Previous / next card |
| `Space` | Pause or resume |
| `R` | Start over |

Cards also advance on their own every 6.2 seconds. Append `?scene=3` to the URL to open the
deck on a specific card — useful when walking someone through a single screen.

## Content

Seven cards: opening, total spend, spending by category, a standout transaction, savings by
month, cashback, and a closing persona card with a share action. All figures are illustrative —
there is no account data of any kind in this project.

Copy is in Vietnamese. Everything lives in [`src/data/rewind.ts`](src/data/rewind.ts) as a typed
list of scenes, so changing the story means editing that one file.

## Running it locally

```bash
npm install
npm run dev
```

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Motion. Deployed to GitHub Pages by the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

## Project layout

```
src/
  App.tsx                    stage the phone sits on
  data/rewind.ts             the seven cards, typed
  components/
    Rewind.tsx               playback: autoplay clock, tap zones, swipe, keyboard
    PhoneFrame.tsx           440×956 device canvas, scaled to the window
    Scenes.tsx               one component per card
  lib/
    cn.ts                    clsx + tailwind-merge
    useCountUp.ts            number animation, respects reduced motion
```
