import { cn } from "../lib/cn";

type Layer = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  /** Figma layer-blur radius; CSS uses half of it. */
  blur: number;
  radius?: number;
};

/** Stacked blurred pills — how the design builds its light source. */
export function Glow({
  layers,
  pulse,
  className,
}: {
  layers: Layer[];
  /** Beat the whole stack slowly, like a heart. */
  pulse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        pulse && "glow-heartbeat",
        className,
      )}
      aria-hidden="true"
    >
      {layers.map((l, i) => (
        <div
          key={i}
          style={{
            left: l.x,
            top: l.y,
            width: l.w,
            height: l.h,
            background: l.color,
            borderRadius: l.radius ?? 999,
            filter: `blur(${l.blur / 2}px)`,
          }}
          className="absolute"
        />
      ))}
    </div>
  );
}

/** Inside the dome. Offsets are from the dome's top edge and never change as it moves. */
export const START_GLOW: Layer[] = [
  { x: 112, y: 96, w: 216, h: 340, color: "#ffa366", blur: 56 },
  { x: 64, y: 48, w: 312, h: 436, color: "#ffdd80", blur: 56 },
  { x: 96, y: 80, w: 248, h: 372, color: "#ffc266", blur: 48 },
  { x: 112, y: 104, w: 216, h: 324, color: "#ff8800", blur: 32 },
  { x: 132, y: 124, w: 176, h: 284, color: "#e07306", blur: 24 },
  { x: 148, y: 152, w: 144, h: 228, color: "#613005", blur: 24, radius: 80 },
  { x: 160, y: 172, w: 120, h: 188, color: "#130901", blur: 24 },
];

/** The light pooling behind the composer. Coordinates are relative to the screen. */
export const COMPOSER_GLOW: Layer[] = [
  { x: -35, y: 676, w: 510, h: 713, color: "#ff8800", blur: 92 },
  { x: 17, y: 728, w: 405, h: 608, color: "#ffc266", blur: 78 },
  { x: 43, y: 768, w: 353, h: 530, color: "#ffdd80", blur: 52 },
  { x: 76, y: 800, w: 288, h: 464, color: "#ffebb2", blur: 39 },
];

/** Same pool, but the outermost layer turns white once the answer lands. */
export const ANSWER_GLOW: Layer[] = [
  { x: -35, y: 610, w: 510, h: 779, color: "rgba(255,255,255,0.58)", blur: 92 },
  ...COMPOSER_GLOW.slice(1),
];
