import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame } from "./PhoneFrame";
import { pages } from "../pages";

/** ?page=2 opens the flow on a given screen — handy when presenting. */
function initialIndex() {
  const n = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
}

export function Rewind() {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);

  const go = useCallback((to: number) => {
    const clamped = Math.min(pages.length - 1, Math.max(0, to));
    setDirection(clamped >= index ? 1 : -1);
    setIndex(clamped);
  }, [index]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const restart = useCallback(() => {
    setDirection(-1);
    setIndex(0);
  }, []);

  // Screens drive themselves; these are for walking through the flow while presenting.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, restart]);

  const page = pages[index];

  return (
    <PhoneFrame>
      <div className="relative h-full w-full bg-black">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) next();
              else if (info.offset.x > 70) prev();
            }}
            className="absolute inset-0"
          >
            {page.render({ next, prev })}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
