import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame } from "./PhoneFrame";
import { GlowDome, type DomeStage } from "./GlowDome";
import { pages } from "../pages";

/** ?page=2 opens the flow on a given screen — handy when presenting. */
function initialIndex() {
  const n = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
}

/** How long the dome holds at its charged position before it travels. */
const CHARGE_MS = 300;
/**
 * How far into the travel the screens swap. The dome covers the header once its top
 * passes y=50 — about 12% of the way — so swapping at 250ms keeps the crossfade
 * hidden behind it, as the design does.
 */
const SWAP_MS = 250;

export function Rewind() {
  const [index, setIndex] = useState(initialIndex);
  const [stage, setStage] = useState<DomeStage>("rest");
  const [domeMounted, setDomeMounted] = useState(() => initialIndex() === 0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = useCallback((to: number) => {
    setIndex(Math.min(pages.length - 1, Math.max(0, to)));
  }, []);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Returning to Start brings the dome back with it.
  useEffect(() => {
    if (index === 0) {
      setDomeMounted(true);
      setStage("rest");
    }
  }, [index]);

  /**
   * Pressing BẮT ĐẦU: the dome charges toward the viewer, then travels up and off
   * while the conversation fades in underneath it — moves 1 through 3 in the design.
   */
  const begin = useCallback(() => {
    setStage("charge");
    timers.current.push(
      window.setTimeout(() => setStage("gone"), CHARGE_MS),
      window.setTimeout(() => next(), CHARGE_MS + SWAP_MS),
    );
  }, [next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") index === 0 ? begin() : next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "r") go(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [begin, next, prev, go, index]);

  const page = pages[index];

  return (
    <PhoneFrame>
      <div className="relative h-full w-full bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={page.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {page.render({ next, prev })}
          </motion.div>
        </AnimatePresence>

        {/* above the screens, as the design layers it — it occludes 2026 on the way up */}
        {domeMounted && (
          <GlowDome stage={stage} onBegin={begin} onGone={() => setDomeMounted(false)} />
        )}
      </div>
    </PhoneFrame>
  );
}
