import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame } from "./PhoneFrame";
import { pages } from "../pages";
import { cn } from "../lib/cn";

const PAGE_MS = 6200;

/** ?page=3 opens the deck on a given screen — handy when presenting. */
function initialIndex() {
  const n = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
}

export function Rewind() {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(pages.length > 1);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const holdStart = useRef(0);

  const page = pages[index];
  const last = index === pages.length - 1;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(Math.min(pages.length - 1, Math.max(0, next)));
      setProgress(0);
    },
    [index],
  );

  const next = useCallback(() => {
    if (last) {
      setPlaying(false);
      setProgress(1);
      return;
    }
    go(index + 1);
  }, [index, last, go]);

  const prev = useCallback(() => go(index - 1), [index, go]);

  const restart = useCallback(() => {
    setDirection(1);
    setIndex(0);
    setProgress(0);
    setPlaying(pages.length > 1);
  }, []);

  // Autoplay clock — also drives the segment fill, so pausing is free.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / PAGE_MS;
      if (t >= 1) {
        setProgress(1);
        next();
        return;
      }
      setProgress(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, index, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key.toLowerCase() === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, restart]);

  const onHoldStart = () => {
    holdStart.current = performance.now();
    setPlaying(false);
  };
  const onHoldEnd = (action: () => void) => {
    if (performance.now() - holdStart.current < 250) action();
    setPlaying(pages.length > 1);
  };

  return (
    <PhoneFrame>
      <div className="relative h-full w-full bg-tcb-ink">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 34 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -34 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) next();
              else if (info.offset.x > 70) prev();
            }}
            className="absolute inset-0"
          >
            {page.render()}
          </motion.div>
        </AnimatePresence>

        {/* segmented progress, hidden while there is only one screen */}
        {pages.length > 1 && (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-[18px] top-[22px] z-30 flex gap-[5px]",
              page.tone === "light" ? "text-tcb-ink" : "text-tcb-bone",
            )}
          >
            {pages.map((p, i) => (
              <div
                key={p.id}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-current opacity-25"
              >
                <div
                  className="h-full w-full origin-left rounded-full bg-current"
                  style={{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* tap zones — real buttons so the deck is keyboard- and screen-reader-navigable */}
        <button
          type="button"
          aria-label="Trang trước"
          className="absolute inset-y-0 left-0 z-20 w-1/3 cursor-w-resize"
          onPointerDown={onHoldStart}
          onPointerUp={() => onHoldEnd(prev)}
          onPointerLeave={() => setPlaying(pages.length > 1)}
        />
        <button
          type="button"
          aria-label="Trang tiếp theo"
          className="absolute inset-y-0 right-0 z-20 w-2/3 cursor-e-resize"
          onPointerDown={onHoldStart}
          onPointerUp={() => onHoldEnd(next)}
          onPointerLeave={() => setPlaying(pages.length > 1)}
        />
      </div>
    </PhoneFrame>
  );
}
