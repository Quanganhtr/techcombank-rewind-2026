import { GlowType } from "../components/GlowType";
import { StatusBar } from "../components/StatusBar";
import { Header } from "../components/Header";
import { Glow, COMPOSER_GLOW } from "../components/Glow";
import { CrtScreen } from "../components/CrtScreen";

/** Screen 2 — 2026 opens the conversation. */
export function First({ domeCleared }: { domeCleared: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="grain absolute inset-0">
        <Glow layers={COMPOSER_GLOW} className="inset-0" />
        <CrtScreen />
      </div>

      <StatusBar />
      <Header title="Techcombank Rewind" />

      <h1 className="absolute left-[24px] top-[154px] w-[392px] text-[40px] font-extralight leading-[56px] text-white">
        <GlowType text="Năm 2026 của bạn ổn chứ?" playing={domeCleared} />
      </h1>
    </div>
  );
}
