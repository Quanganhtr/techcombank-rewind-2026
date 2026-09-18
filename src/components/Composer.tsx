import send from "../assets/icon-send.svg";

/** The ask-2026 input at the bottom of the conversation screens. */
export function Composer({ question, onSend }: { question: string; onSend: () => void }) {
  return (
    <div className="absolute left-[24px] top-[756px] h-[176px] w-[392px] rounded-[32px] bg-black">
      <p className="absolute left-[24px] top-[24px] w-[280px] whitespace-pre-line text-[20px] font-normal leading-[28px] text-white">
        {question}
      </p>
      <button
        type="button"
        onClick={onSend}
        className="absolute left-[258px] top-[96px] flex h-[56px] w-[110px] items-center justify-center gap-[12px] rounded-full bg-white transition-transform active:scale-[0.97]"
      >
        <span className="text-[16px] font-semibold leading-[24px] text-ink-soft">Gửi</span>
        <img src={send} alt="" width={20} height={20} />
      </button>
    </div>
  );
}
