import { StatusBar } from "../components/StatusBar";
import { Header } from "../components/Header";
import { Composer } from "../components/Composer";
import { Glow, COMPOSER_GLOW } from "../components/Glow";

const QUESTION = "Tài sản của tôi\nnăm nay thế nào?";

/** Screen 2 — 2026 opens the conversation. */
export function First({ next }: { next: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="grain absolute inset-0">
        <Glow layers={COMPOSER_GLOW} className="inset-0" />
      </div>

      <StatusBar />
      <Header title="Techcombank Rewind" />

      <h1 className="absolute left-[24px] top-[154px] w-[392px] text-[40px] font-extralight leading-[56px] text-white">
        Năm 2026 của bạn ổn chứ?
      </h1>

      <Composer question={QUESTION} onSend={next} />
    </div>
  );
}
