import { cn } from "../lib/cn";

/**
 * A soft band of light travelling up through the glow, with a rest between passes so it
 * reads as a sweep rather than a constant shimmer.
 *
 * It blends with `screen`, so it brightens the amber underneath instead of washing it
 * toward white. Transform and opacity only — nothing re-blurs.
 *
 * Native: a rotated `LinearGradient` in a `.mask`/`clipped()` with `.blendMode(.screen)`
 * on iOS, `Brush.linearGradient` drawn with `BlendMode.Screen` on Compose.
 */
export function Sheen({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="glow-sheen" />
    </div>
  );
}
