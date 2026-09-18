import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame } from "./PhoneFrame";
import { GlowDome } from "./GlowDome";
import { Composer } from "./Composer";
import { pages } from "../pages";

/** ?page=2 opens the flow on a given screen — handy when presenting. */
function initialIndex() {
  const n = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
}

export function Rewind() {
  const [index, setIndex] = useState(initialIndex);
  const [leaving, setLeaving] = useState(false);
  const [domeMounted, setDomeMounted] = useState(() => initialIndex() === 0);
  /** The composer rises as the dome's bottom clears the middle of the screen. */
  const [composerShown, setComposerShown] = useState(() => initialIndex() > 0);
  /** The question types once the composer has settled. Already done past that screen. */
  const [questionTyping, setQuestionTyping] = useState(
    () => initialIndex() > 1,
  );
  const swapped = useRef(false);

  const go = useCallback((to: number) => {
    setIndex(Math.min(pages.length - 1, Math.max(0, to)));
  }, []);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Returning to Start brings the dome back with it.
  useEffect(() => {
    if (index === 0) {
      setDomeMounted(true);
      setLeaving(false);
      setComposerShown(false);
      setQuestionTyping(false);
      swapped.current = false;
    }
  }, [index]);

  /**
   * Pressing BẮT ĐẦU sends the dome up and off in one unbroken move — the design's
   * moves 1-3 are waypoints along it. The screens swap the moment the dome covers the
   * header, driven by its actual position rather than a timer, so the crossfade stays
   * hidden however the easing is tuned.
   */
  const begin = useCallback(() => setLeaving(true), []);

  /** Back to Start — the dome comes with it, via the effect above. */
  const restart = useCallback(() => go(0), [go]);

  const onCovered = useCallback(() => {
    if (swapped.current) return;
    swapped.current = true;
    next();
  }, [next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") index === 0 ? begin() : next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [begin, next, prev, restart, index]);

  const page = pages[index];

  return (
    <>
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
          <Composer
            question={"Cũng cũng. Tài sản của tôi\nnăm nay thế nào?"}
            onSend={next}
            shown={composerShown}
            typing={questionTyping}
            onSettled={() => setQuestionTyping(true)}
          />

          {domeMounted && (
            <GlowDome
              leaving={leaving}
              onBegin={begin}
              onCovered={onCovered}
              onBottomAtCentre={() => setComposerShown(true)}
              onGone={() => setDomeMounted(false)}
            />
          )}
        </div>
      </PhoneFrame>

      {index > 0 && (
        <button
          type="button"
          onClick={restart}
          className="fixed bottom-6 right-6 z-50 rounded-full border border-white/20 px-5 py-2.5 text-[14px] text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          Xem lại từ đầu
        </button>
      )}
    </>
  );
}
