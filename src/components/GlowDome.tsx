import { motion } from "motion/react";
import { Glow, START_GLOW } from "./Glow";
import { CrtScreen } from "./CrtScreen";

/**
 * The ACTION dome. It is one rigid group — pale field, glow stack, ring and label
 * all hold the same offsets from its top edge in every frame of the design — so the
 * whole interaction is a single translateY. That keeps the blurred layers cached
 * instead of re-rasterising, and ports to .offset(y:) / Modifier.offset natively.
 *
 * Figma draws it 558 tall at rest and 956 tall once it moves, but at rest the extra
 * height falls below the screen edge, so a fixed 956 is visually identical.
 */
export const DOME_H = 956;

/** Dome top edge, per frame of the design. */
export const DOME_Y = {
  rest: 399, // Start
  charge: 182, // move 1 — grows toward the viewer on press
  gone: -956, // past move 3, fully clear of the screen
} as const;

export type DomeStage = keyof typeof DOME_Y;

export function GlowDome({
  stage,
  onBegin,
  onGone,
}: {
  stage: DomeStage;
  onBegin: () => void;
  onGone: () => void;
}) {
  return (
    <motion.div
      className="dome-inner-light grain absolute inset-x-0 z-40 overflow-hidden rounded-[220px] bg-dome"
      style={{ height: DOME_H, top: 0 }}
      initial={{ y: DOME_Y.rest }}
      animate={{ y: DOME_Y[stage] }}
      transition={
        stage === "gone"
          ? { duration: 0.9, ease: [0.32, 0, 0.2, 1] }
          : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
      }
      onAnimationComplete={() => stage === "gone" && onGone()}
    >
      <Glow layers={START_GLOW} className="inset-0" />
      <CrtScreen />

      <button
        type="button"
        onClick={onBegin}
        aria-label="Bắt đầu"
        className="absolute left-[160px] top-[172px] h-[188px] w-[120px] rounded-full"
      >
        {/* 4px stroke centred on the pill, 1/12 dash, butt caps; pathLength closes it evenly */}
        <svg
          className="absolute left-[-2px] top-[-2px]"
          width="124"
          height="192"
          viewBox="0 0 124 192"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="2"
            width="120"
            height="188"
            rx="60"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray="1 12"
            pathLength={494}
          />
        </svg>
        <span className="font-system absolute inset-0 flex items-center justify-center text-[18px] font-extralight leading-[21px] text-white">
          BẮT ĐẦU
        </span>
      </button>
    </motion.div>
  );
}
