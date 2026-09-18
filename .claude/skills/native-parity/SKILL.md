---
name: native-parity
description: Use when choosing any UI technique, animation, effect, or layout approach for a web build that must also ship as a native iOS and Android app — before writing the CSS or component, not after.
---

# Native Parity

## Overview

This web build is a **specification for native apps**, not the final product. A technique
that only exists on the web is a defect, however good it looks in the browser.

**Core rule:** every visual technique must have a named SwiftUI equivalent and a named
Jetpack Compose equivalent before it is written.

## Required: state the mapping

When introducing any effect, animation, or layout primitive, the work is not complete
until the choice carries its mapping. One line, in the code comment or the message:

```
glow = stacked blurred pills → SwiftUI .blur(radius:) / Compose Modifier.blur (API 31+)
```

If a technique has no mapping, do not build it. See "No equivalent" below.

## Quick reference

| Web | SwiftUI | Compose | Watch for |
|---|---|---|---|
| `filter: blur()` | `.blur(radius:)` | `Modifier.blur()` | Compose: **API 31+**, silent no-op below |
| `box-shadow` (outer) | `.shadow()` | `Modifier.shadow()` | — |
| `box-shadow` **inset** | none | none | **No native equivalent** — mask trick |
| `backdrop-filter` | `.background(.ultraThinMaterial)` | `Modifier.blur` on a copy | Compose has no true backdrop blur |
| `mix-blend-mode` | `.blendMode()` | `BlendMode` in `drawWithContent` | Compose blend support is narrower |
| `repeating-linear-gradient` | `Canvas` / tiled `Image` | `Canvas` / tiled painter | — |
| Procedural effect (CRT, noise) | `.layerEffect` Metal (iOS 17+) | `RuntimeShader` AGSL (**API 33+**) | Needs a pre-rendered fallback |
| `stroke-dasharray` | `StrokeStyle(dash:)` | `dashPathEffect` | Closed paths need even division |
| `rotate()` | `.rotationEffect()` | `Modifier.rotate()` | — |
| Absolute px coordinates | `.offset()` / `ZStack` | `Modifier.offset()` / `Box` | Fixed canvas ports cleanly — prefer it |
| `position: sticky` | `.safeAreaInset` / scroll reader | `stickyHeader` in `LazyColumn` | Restructure, don't port directly |
| SVG filters | none | none | **No native equivalent** — use a shader |

## Animation cost — the rule that changes designs

Animating **blur radius, width/height, or layout** re-rasterises every frame. Animating
**transform, opacity, or colour** re-composites a cached texture and is nearly free.

This is true on all three platforms. The same look is usually reachable either way, so
decide it *before* the motion is designed: "the glow grows and brightens" is cheap,
"the glow softens" is expensive.

## No equivalent — what to do

1. **Find a technique that does have one.** Most looks have several implementations.
2. **If the look is essential, move it into a shader.** One shader pass ports to Metal
   and AGSL/SkSL and is usually *faster* than the layered version.
3. **If neither works, say so before building**, with the cost and the alternatives.
   Never build it silently and leave the port to be discovered later.

## Red flags

- Reaching for a CSS feature without naming its native counterpart
- "We'll figure out the native version later"
- Animating `blur()`, `width`, `height`, `top`, or `left`
- Using a web layout system (grid auto-flow, sticky, floats) for a fixed-size screen
- An effect that only works because of DOM stacking or `backdrop-filter`

## Rationalizations

| Excuse | Reality |
|---|---|
| "It's just a prototype" | The prototype is the spec. Web-only techniques become rework. |
| "Native devs will adapt it" | They will change the design to fit. Decide it now, deliberately. |
| "Compose probably has something" | Check the API level. `Modifier.blur` fails silently below 31. |
| "It's one small effect" | Inset shadows are one small effect and have no native equivalent at all. |
| "React Native/Flutter can do anything" | RN Skia bundles Skia and can. Plain RN views cannot. Name the stack. |

## When this does not apply

Web-only deliverables: marketing pages, docs, internal dashboards. Say so once and
proceed without the mapping.
