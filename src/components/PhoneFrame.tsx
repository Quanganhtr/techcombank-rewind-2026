import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import mockup from "../assets/mockup.png";

/** Measured from mockup.png: the 440×956 transparent cutout inside the 472×988 frame. */
const FRAME_W = 472;
const FRAME_H = 988;
export const SCREEN_W = 440;
export const SCREEN_H = 956;
const SCREEN_X = 16;
const SCREEN_Y = 16;

/** Scales the fixed device canvas down to whatever the window allows. */
function useFitScale(margin = 120) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () =>
      setScale(
        Math.min(1, (window.innerHeight - margin) / FRAME_H, (window.innerWidth - margin) / FRAME_W),
      );
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [margin]);
  return scale;
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const scale = useFitScale();

  return (
    <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }} className="relative">
      <div
        style={{
          width: FRAME_W,
          height: FRAME_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute left-0 top-0"
      >
        {/* screen sits behind the frame, so the bezel and Dynamic Island mask it */}
        <div
          style={{ left: SCREEN_X, top: SCREEN_Y, width: SCREEN_W, height: SCREEN_H }}
          className="absolute overflow-hidden rounded-[56px] bg-black"
        >
          {children}
        </div>

        <img
          src={mockup}
          alt=""
          width={FRAME_W}
          height={FRAME_H}
          className="pointer-events-none absolute inset-0 select-none drop-shadow-[0_40px_70px_rgba(0,0,0,0.65)]"
        />
      </div>
    </div>
  );
}
