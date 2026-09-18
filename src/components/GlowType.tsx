import { useMemo } from "react";
import type { CSSProperties } from "react";
import { cn } from "../lib/cn";

// The trail length (4 characters) lives in .glow-type-char in index.css.

/**
 * Splits on grapheme clusters, not code points, so a Vietnamese diacritic can never
 * be revealed a frame after the letter it belongs to.
 */
function graphemes(text: string): string[] {
  const Segmenter = (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (!Segmenter) return Array.from(text);
  const segments = new Segmenter("vi", { granularity: "grapheme" }).segment(
    text,
  );
  return Array.from(segments, (s) => s.segment);
}

/**
 * Types the text out one character at a time, each igniting bright and cooling to
 * plain white behind the cursor.
 *
 * The whole thing runs off one animated custom property, `--cursor`, which every
 * character reads to work out its own heat — so there is no per-frame JavaScript, and
 * it is unaffected by Motion's repeating animations stalling inside AnimatePresence.
 */
export function GlowType({
  text,
  playing,
  charMs = 38,
  onDone,
  className,
}: {
  text: string;
  playing: boolean;
  charMs?: number;
  /** Fires when the last character has been struck. */
  onDone?: () => void;
  className?: string;
}) {
  const chars = useMemo(() => graphemes(text), [text]);

  return (
    <span
      aria-label={text}
      className={cn("glow-type", playing && "glow-type--playing", className)}
      onAnimationEnd={(e) => {
        if (e.animationName === "glow-type") onDone?.();
      }}
      style={
        {
          "--glow-type-count": chars.length,
          "--glow-type-dur": `${chars.length * charMs}ms`,
        } as CSSProperties
      }
    >
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="glow-type-char"
          style={{ "--n": i } as CSSProperties}
        >
          {c}
        </span>
      ))}
    </span>
  );
}
