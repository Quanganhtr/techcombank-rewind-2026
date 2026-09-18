import { motion } from "motion/react";
import { GlowType } from "./GlowType";
import send from "../assets/icon-send.svg";

/** Parked fully below the screen: the container sits at y=732 and is 224 tall. */
const OFFSCREEN_Y = 224;

/**
 * The ask-2026 input. It lives in the shell rather than the screens, because it
 * persists across the conversation and its entrance is driven by the dome's position.
 */
export function Composer({
  question,
  onSend,
  shown,
  typing,
}: {
  question: string;
  onSend: () => void;
  shown: boolean;
  /** The question types itself in once the headline above has finished. */
  typing: boolean;
}) {
  return (
    <motion.div
      className="absolute left-[24px] top-[756px] z-30 h-[176px] w-[392px] rounded-[32px] bg-black"
      initial={{ y: OFFSCREEN_Y }}
      animate={{ y: shown ? 0 : OFFSCREEN_Y }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="absolute left-[24px] top-[24px] w-[280px] text-[20px] font-extralight leading-[28px] text-white">
        <GlowType text={question} playing={typing} />
      </p>
      <button
        type="button"
        onClick={onSend}
        className="absolute left-[258px] top-[96px] flex h-[56px] w-[110px] items-center justify-center gap-[12px] rounded-full bg-white transition-transform active:scale-[0.97]"
      >
        <span className="text-[16px] font-extralight leading-[24px] text-ink-soft">
          Gửi
        </span>
        <img src={send} alt="" width={20} height={20} />
      </button>
    </motion.div>
  );
}
