/** Stand-in for the real screens. Delete this file once the deck is filled in. */
export function Placeholder() {
  return (
    <div className="flex h-full w-full flex-col justify-end bg-tcb-ink px-8 pb-20 pt-28">
      <p className="font-display text-[44px] font-extrabold leading-[0.92] tracking-[-0.04em] text-tcb-bone">
        Chưa có
        <br />
        trang nào
      </p>
      <p className="mt-5 max-w-[24ch] text-[17px] leading-relaxed text-tcb-bone/60">
        Thêm từng màn hình vào <span className="text-tcb-bone">src/pages/index.tsx</span>. Điều
        hướng, thanh tiến trình và tự động chuyển trang đã sẵn sàng.
      </p>
    </div>
  );
}
