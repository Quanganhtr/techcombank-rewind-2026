import { StatusBar } from "../components/StatusBar";
import logo from "../assets/logo-tcb.svg";

/** Screen 1 — the invitation. The dome and its button live in the shell, above this. */
export function Start() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <StatusBar />

      {/* the year sits under both black bars, so they clip the rotated numerals */}
      <div className="absolute inset-x-0 top-[50px] h-[349px]">
        <div className="absolute inset-x-0 top-[185px] h-[164px]">
          <p className="absolute left-[-30px] top-[-16px] w-[499px] rotate-[-12deg] text-[200px] font-extralight leading-[196px] text-white">
            2026
          </p>
        </div>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-black px-[24px] pb-0 pt-[24px]">
          <p className="text-[40px] font-extralight leading-[56px] text-white">QUANG ƠI!</p>
          <img src={logo} alt="Techcombank" width={56} height={56} />
        </div>

        <div className="absolute inset-x-0 top-[80px] bg-black p-[24px] shadow-[inset_0_-0.5px_0_0_#fff]">
          <p className="text-[40px] font-extralight leading-[56px] text-white">TRÒ CHUYỆN VỚI</p>
        </div>
      </div>
    </div>
  );
}
