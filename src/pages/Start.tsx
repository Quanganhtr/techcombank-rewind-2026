import { motion } from "motion/react";
import { StatusBar } from "../components/StatusBar";
import { Glow, START_GLOW } from "../components/Glow";
import logo from "../assets/logo-tcb.svg";

/** Screen 1 — the invitation. */
export function Start({ next }: { next: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <StatusBar />

      <p className="absolute left-[24px] top-[74px] text-[40px] font-light leading-[56px] text-white">
        QUANG ƠI!
      </p>
      <img src={logo} alt="Techcombank" width={56} height={56} className="absolute left-[360px] top-[74px]" />
      <p className="absolute left-[24px] top-[154px] text-[40px] font-extralight leading-[56px] text-white">
        TRÒ CHUYỆN VỚI
      </p>
      <p className="absolute left-[-44px] top-[204px] w-[529px] text-[200px] font-light leading-[196px] text-white">
        2026
      </p>

      {/* the dome of light, and the button sitting in its dark centre */}
      <div className="grain absolute left-0 top-[399px] h-[558px] w-[440px] overflow-hidden rounded-t-full bg-glow-50">
        <Glow layers={START_GLOW} className="inset-0" />
      </div>

      <motion.button
        type="button"
        onClick={next}
        aria-label="Nhấn để bắt đầu"
        className="absolute left-[160px] top-[571px] h-[188px] w-[120px] rounded-full"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* dotted ring — 4px round caps on a 1/12 dash, as drawn in Figma */}
        <svg className="absolute inset-0" width="120" height="188" viewBox="0 0 120 188" aria-hidden="true">
          <rect
            x="2"
            y="2"
            width="116"
            height="184"
            rx="58"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 12"
          />
        </svg>
        <span className="font-system absolute inset-0 flex items-center justify-center text-center text-[18px] font-medium leading-[21px] text-white">
          NHẤN ĐỂ
          <br />
          BẮT ĐẦU
        </span>
      </motion.button>
    </div>
  );
}
