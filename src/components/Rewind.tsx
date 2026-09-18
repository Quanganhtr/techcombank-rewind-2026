import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame, StatusBar } from "./PhoneFrame";
import { SceneView } from "./Scenes";
import { scenes } from "../data/rewind";
import { cn } from "../lib/cn";

const SCENE_MS = 6200;

/** Scenes on a light background need dark status-bar glyphs. */
const LIGHT_SCENES = new Set(["total", "saving", "persona"]);

/** ?scene=3 opens the deck on a given card — handy when presenting. */
function initialIndex() {
  const raw = new URLSearchParams(window.location.search).get("scene");
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n < scenes.length ? n : 0;
}

export function Rewind() {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const holdStart = useRef(0);

  const scene = scenes[index];
  const last = index === scenes.length - 1;

  const go = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(Math.min(scenes.length - 1, Math.max(0, next)));
    setProgress(0);
  }, [index]);

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
    setPlaying(true);
  }, []);

  // Autoplay clock — also drives the segment fill, so pausing is free.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let start = performance.now() - progress * SCENE_MS;
    const tick = (now: number) => {
      const t = (now - start) / SCENE_MS;
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
    // progress is intentionally omitted: it is this effect's own output
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const held = performance.now() - holdStart.current;
    if (held < 250) action();
    setPlaying(true);
  };

  return (
    <PhoneFrame>
      <div className="relative h-full w-full bg-tcb-ink">
        <StatusBar tone={LIGHT_SCENES.has(scene.kind) ? "dark" : "light"} />

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={scene.id}
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
            <SceneView scene={scene} active />
          </motion.div>
        </AnimatePresence>

        {/* segmented progress */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-[18px] top-[58px] z-30 flex gap-[5px]",
            LIGHT_SCENES.has(scene.kind) ? "text-tcb-ink" : "text-tcb-bone",
          )}
        >
          {scenes.map((s, i) => (
            <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-current opacity-25">
              <div
                className="h-full w-full origin-left rounded-full bg-current"
                style={{
                  transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})`,
                }}
              />
            </div>
          ))}
        </div>

        {/* tap zones — real buttons so the deck is keyboard- and screen-reader-navigable */}
        <button
          type="button"
          aria-label="Màn hình trước"
          className="absolute inset-y-0 left-0 z-20 w-1/3 cursor-w-resize"
          onPointerDown={onHoldStart}
          onPointerUp={() => onHoldEnd(prev)}
          onPointerLeave={() => setPlaying(true)}
        />
        <button
          type="button"
          aria-label="Màn hình tiếp theo"
          className="absolute inset-y-0 right-0 z-20 w-2/3 cursor-e-resize"
          onPointerDown={onHoldStart}
          onPointerUp={() => onHoldEnd(next)}
          onPointerLeave={() => setPlaying(true)}
        />

        {/* end-of-deck actions */}
        <AnimatePresence>
          {last && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-x-8 bottom-[52px] z-30 flex gap-3"
            >
              <button
                type="button"
                onClick={() => navigator.share?.({ title: "Techcombank Rewind 2026" })}
                className="flex-1 rounded-full bg-tcb-red py-4 text-[16px] font-semibold text-tcb-bone transition-transform active:scale-[0.97]"
              >
                Chia sẻ Rewind
              </button>
              <button
                type="button"
                onClick={restart}
                aria-label="Xem lại từ đầu"
                className={cn(
                  "rounded-full border border-tcb-ink/20 px-6 text-[16px] font-semibold text-tcb-ink",
                  "transition-transform active:scale-[0.97]",
                )}
              >
                Xem lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
