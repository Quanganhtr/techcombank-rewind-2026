import { cn } from "../lib/cn";

/**
 * The CRT treatment from the design: 1px scanlines that roll downward,
 * matching the shader's Scanlines 20% / size 1 / roll settings.
 *
 * It sits inside the glow container, so the text above it stays crisp — and
 * because the lines are dark, they only register over the glow, not over the
 * black background.
 */
export function CrtScreen({
  /** "Scanlines" in the shader panel. */
  opacity = 0.2,
  /** Seconds per scanline period — lower rolls faster. */
  rollSeconds = 0.77,
  className,
}: {
  opacity?: number;
  rollSeconds?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("crt-scanlines pointer-events-none absolute inset-x-0", className)}
      style={{ top: -2, bottom: 0, opacity, ["--crt-roll" as string]: `${rollSeconds}s` }}
    />
  );
}
