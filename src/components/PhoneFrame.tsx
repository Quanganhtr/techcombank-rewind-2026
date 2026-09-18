import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export const SCREEN_W = 440;
export const SCREEN_H = 956;

/** Scales the fixed 440×956 device canvas down to whatever the window allows. */
function useFitScale(margin = 170) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const h = (window.innerHeight - margin) / SCREEN_H;
      const w = (window.innerWidth - margin) / SCREEN_W;
      setScale(Math.min(1, h, w));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [margin]);
  return scale;
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const scale = useFitScale();

  return (
    <div
      style={{
        width: SCREEN_W * scale,
        height: SCREEN_H * scale,
      }}
      className="relative"
    >
      <div
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute left-0 top-0"
      >
        {/* titanium rail */}
        <div className="absolute -inset-[13px] rounded-[74px] bg-gradient-to-br from-[#b9b4ac] via-[#6f6a64] to-[#cfc9c0] shadow-[0_44px_90px_-20px_rgba(60,0,8,0.55)]" />
        {/* bezel */}
        <div className="absolute -inset-[3px] rounded-[64px] bg-black" />

        <div className="relative h-full w-full overflow-hidden rounded-[61px] bg-black">
          {children}

          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-[13px] h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black" />
          {/* home indicator */}
          <div className="pointer-events-none absolute bottom-[9px] left-1/2 h-[5px] w-[144px] -translate-x-1/2 rounded-full bg-white/45 mix-blend-difference" />
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ tone }: { tone: "light" | "dark" }) {
  const color = tone === "light" ? "text-white" : "text-black";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[54px] items-center justify-between px-[34px] text-[17px] font-semibold ${color}`}
    >
      <span className="tabular">9:41</span>
      <div className="flex items-center gap-[6px]">
        <Signal />
        <Wifi />
        <Battery />
      </div>
    </div>
  );
}

const Signal = () => (
  <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor" aria-hidden="true">
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5.3" y="5.5" width="3" height="6.5" rx="1" />
    <rect x="10.6" y="3" width="3" height="9" rx="1" />
    <rect x="15.9" y="0" width="3" height="12" rx="1" />
  </svg>
);

const Wifi = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
    <path d="M8.5 11.6 6.2 8.9a3.6 3.6 0 0 1 4.6 0l-2.3 2.7ZM3.9 6.3 2 4.2a9.6 9.6 0 0 1 13 0l-1.9 2.1a6.9 6.9 0 0 0-9.2 0Z" />
  </svg>
);

const Battery = () => (
  <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
    <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity="0.4" />
    <rect x="2.2" y="2.2" width="17.6" height="7.6" rx="2" fill="currentColor" />
    <path d="M23.5 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" opacity="0.5" />
  </svg>
);
