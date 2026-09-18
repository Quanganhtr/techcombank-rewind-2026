import { motion } from "motion/react";
import { Glow, START_GLOW } from "./Glow";
import { CrtScreen } from "./CrtScreen";

/**
 * The ACTION dome. It is one rigid group — pale field, glow stack, ring and label all
 * hold the same offsets from its top edge in every frame of the design — so the whole
 * move is a single translateY. That keeps the blurred layers cached instead of
 * re-rasterising, and ports to .offset(y:) / Modifier.offset natively.
 *
 * Figma draws it 558 tall at rest and 956 tall once it moves, but at rest the extra
 * height falls below the screen edge, so a fixed 956 is visually identical.
 */
export const DOME_H = 956;

/**
 * Dome top edge. The design's move 1/2/3 are waypoints along one continuous travel,
 * not stops — rest and gone are the only two states the animation targets.
 */
export const DOME_Y = {
  rest: 399, // Start
  gone: -956, // clear of the screen, past move 3
} as const;

/** Once the top passes the header, the screens can swap unseen behind the dome. */
const COVERS_HEADER = 50;
/** Top position at which the dome's bottom edge reaches the middle of the screen. */
const BOTTOM_AT_CENTRE = 478 - DOME_H;

export function GlowDome({
  leaving,
  onBegin,
  onCovered,
  onBottomAtCentre,
  onGone,
}: {
  leaving: boolean;
  onBegin: () => void;
  onCovered: () => void;
  onBottomAtCentre: () => void;
  onGone: () => void;
}) {
  return (
    <motion.div
      className="dome-inner-light grain absolute inset-x-0 z-40 overflow-hidden rounded-[220px] bg-dome"
      style={{ height: DOME_H, top: 0 }}
      initial={{ y: DOME_Y.rest }}
      animate={{ y: leaving ? DOME_Y.gone : DOME_Y.rest }}
      transition={
        leaving
          ? // one unbroken accelerating move: it rises, then launches away
            { duration: 1.05, ease: [0.55, 0, 0.85, 0.45] }
          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
      onUpdate={(latest) => {
        const y =
          typeof latest.y === "number"
            ? latest.y
            : Number.parseFloat(String(latest.y));
        if (!leaving) return;
        if (y <= COVERS_HEADER) onCovered();
        if (y <= BOTTOM_AT_CENTRE) onBottomAtCentre();
      }}
      onAnimationComplete={() => leaving && onGone()}
    >
      <Glow layers={START_GLOW} className="inset-0" />
      <CrtScreen />

      <button
        type="button"
        onClick={onBegin}
        aria-label="Bắt đầu"
        className="absolute left-[160px] top-[172px] h-[188px] w-[120px] rounded-full"
      >
        {/* Dotted ring with the design's path-trim sweep. SVG cannot dash and trim the
            same stroke, so the trim is a mask over the dotted ring.
            Native: SwiftUI Shape.trim(from:to:), Compose PathMeasure.getSegment. */}
        <svg
          className="absolute left-[-6px] top-[-6px]"
          width="132"
          height="200"
          viewBox="0 0 132 200"
          aria-hidden="true"
        >
          <defs>
            <mask id="ring-trim" maskUnits="userSpaceOnUse">
              <rect
                className="ring-sweep"
                x="6"
                y="6"
                width="120"
                height="188"
                rx="60"
                fill="none"
                stroke="white"
                strokeWidth="16"
                pathLength={1}
                strokeDasharray="0.16 0.84"
              />
            </mask>
          </defs>
          <rect
            className="ring-dots"
            x="6"
            y="6"
            width="120"
            height="188"
            rx="60"
            fill="none"
            stroke="white"
            strokeDasharray="1 12"
            pathLength={494}
            mask="url(#ring-trim)"
          />
        </svg>
        <span className="font-system absolute inset-0 flex items-center justify-center text-[18px] font-extralight leading-[21px] text-white">
          BẮT ĐẦU
        </span>
      </button>
    </motion.div>
  );
}
