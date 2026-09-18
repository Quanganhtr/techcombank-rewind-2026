import { motion } from "motion/react";
import { StatusBar } from "../components/StatusBar";
import { Header } from "../components/Header";
import { Composer } from "../components/Composer";
import { Glow, ANSWER_GLOW } from "../components/Glow";

const QUESTION = "Tài sản của tôi\nnăm nay thế nào?";

/** Screen 3 — the answer. */
export function FirstSentence({ next }: { next: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="grain absolute inset-0">
        <Glow layers={ANSWER_GLOW} className="inset-0" />
      </div>

      <StatusBar />
      <Header title="Techcombank Rewind" />

      <h1 className="absolute left-[24px] top-[154px] w-[392px] text-[40px] font-light leading-[56px] text-white">
        Tổng giá trị tài sản của bạn trong 2026
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="stats-gradient grain absolute left-[24px] top-[290px] h-[304px] w-[270px] overflow-hidden rounded-[16px]"
      >
        <p className="absolute left-[24px] top-[16px] text-[24px] font-light leading-[32px] text-ink-soft">
          Tăng
        </p>
        <p className="absolute left-[24px] top-[56px] text-[72px] font-normal leading-[96px] text-ink-soft">
          28.7%
        </p>
        <p className="absolute left-[24px] top-[160px] w-[222px] text-[24px] font-light leading-[32px] text-ink-soft">
          Thuộc top 25% khách hàng Private có giá trị tài sản cao nhất
        </p>
      </motion.div>

      <Composer question={QUESTION} onSend={next} />
    </div>
  );
}
