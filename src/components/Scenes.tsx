import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/cn";
import { useCountUp } from "../lib/useCountUp";
import { vnd, type Scene } from "../data/rewind";

const MONTHS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const EASE = [0.16, 1, 0.3, 1] as const;

/** Every scene shares one entrance: content rises once, in order. */
const rise = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: EASE },
  }),
};

function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      className={cn("flex h-full w-full flex-col px-8 pb-24 pt-28", className)}
    >
      {children}
    </motion.section>
  );
}

function Label({ children, tone = "bone" }: { children: ReactNode; tone?: "bone" | "ink" }) {
  return (
    <motion.p
      variants={rise}
      custom={0}
      className={cn(
        "text-[15px] font-medium leading-snug",
        tone === "bone" ? "text-tcb-bone/70" : "text-tcb-ink/60",
      )}
    >
      {children}
    </motion.p>
  );
}

function Money({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("tabular", className)}>
      {vnd(value)}
      <span className="ml-2 text-[0.44em] font-semibold">₫</span>
    </span>
  );
}

type Of<K extends Scene["kind"]> = Extract<Scene, { kind: K }>;
type Props<K extends Scene["kind"]> = { scene: Of<K>; active: boolean };

function OpenScene({ scene }: Props<"open">) {
  return (
    <Frame className="justify-end bg-tcb-ink">
      <motion.p
        variants={rise}
        custom={0}
        className="text-[15px] font-semibold tracking-wide text-tcb-bone/60"
      >
        {scene.kicker}
      </motion.p>
      <motion.h1
        variants={rise}
        custom={1}
        className="font-display text-[86px] font-extrabold leading-[0.86] tracking-[-0.045em] text-tcb-red"
      >
        Rewind
        <br />
        <span className="text-tcb-bone">2026</span>
      </motion.h1>
      <motion.p
        variants={rise}
        custom={2}
        className="mt-6 max-w-[19ch] text-[19px] leading-relaxed text-tcb-bone/85"
      >
        {scene.line}
      </motion.p>
      <motion.p variants={rise} custom={3} className="mt-10 text-[14px] text-tcb-bone/45">
        {scene.hint}
      </motion.p>
    </Frame>
  );
}

function TotalScene({ scene, active }: Props<"total">) {
  const n = useCountUp(scene.amount, active, 1400);
  return (
    <Frame className="justify-end bg-tcb-bone">
      <Label tone="ink">{scene.label}</Label>
      <motion.div
        variants={rise}
        custom={1}
        className="mt-4 font-display text-[54px] font-extrabold leading-[0.95] tracking-[-0.04em] text-tcb-red"
      >
        <Money value={n} />
      </motion.div>
      <motion.p variants={rise} custom={2} className="mt-6 text-[20px] font-semibold text-tcb-ink">
        {scene.delta}
      </motion.p>
      <motion.p
        variants={rise}
        custom={3}
        className="mt-3 max-w-[26ch] text-[16px] leading-relaxed text-tcb-ink/65"
      >
        {scene.note}
      </motion.p>
    </Frame>
  );
}

function CategoriesScene({ scene, active }: Props<"categories">) {
  const max = Math.max(...scene.items.map((i) => i.amount));
  return (
    <Frame className="justify-end bg-tcb-ink">
      <Label>{scene.label}</Label>
      <ul className="mt-8 flex flex-col gap-6">
        {scene.items.map((item, i) => (
          <motion.li key={item.name} variants={rise} custom={i + 1}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[26px] font-semibold tracking-[-0.02em] text-tcb-bone">
                {item.name}
              </span>
              <span className="tabular text-[15px] text-tcb-bone/60">{item.count} lần</span>
            </div>
            <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-tcb-bone/15">
              <motion.div
                className={cn("h-full rounded-full", i === 0 ? "bg-tcb-gold" : "bg-tcb-red")}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active ? item.amount / max : 0 }}
                style={{ transformOrigin: "left" }}
                transition={{ delay: 0.25 + i * 0.09, duration: 0.7, ease: EASE }}
              />
            </div>
            <p className="tabular mt-2 text-[15px] text-tcb-bone/75">{vnd(item.amount)} ₫</p>
          </motion.li>
        ))}
      </ul>
    </Frame>
  );
}

function MomentScene({ scene }: Props<"moment">) {
  return (
    <Frame className="justify-end bg-tcb-pine">
      <Label>{scene.label}</Label>
      <motion.p
        variants={rise}
        custom={1}
        className="mt-4 font-display text-[76px] font-extrabold leading-[0.9] tracking-[-0.045em] text-tcb-gold"
      >
        {scene.time}
      </motion.p>
      <motion.p variants={rise} custom={2} className="mt-5 text-[19px] font-semibold text-tcb-bone">
        {scene.date}
      </motion.p>
      <motion.p variants={rise} custom={3} className="mt-1 text-[17px] text-tcb-bone/75">
        {scene.place}
      </motion.p>
      <motion.p variants={rise} custom={4} className="tabular mt-1 text-[17px] text-tcb-bone/75">
        {vnd(scene.amount)} ₫
      </motion.p>
      <motion.p
        variants={rise}
        custom={5}
        className="mt-10 max-w-[27ch] border-t border-tcb-bone/20 pt-5 text-[16px] leading-relaxed text-tcb-bone/70"
      >
        {scene.note}
      </motion.p>
    </Frame>
  );
}

function SavingScene({ scene, active }: Props<"saving">) {
  const n = useCountUp(scene.amount, active, 1300);
  return (
    <Frame className="justify-end bg-tcb-gold">
      <Label tone="ink">{scene.label}</Label>
      <motion.div
        variants={rise}
        custom={1}
        className="mt-4 font-display text-[52px] font-extrabold leading-[0.95] tracking-[-0.04em] text-tcb-ink"
      >
        <Money value={n} />
      </motion.div>
      <motion.div variants={rise} custom={2} className="mt-10 flex items-end gap-[6px]">
        {scene.months.map((filled, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              className={cn("w-full rounded-[3px]", filled ? "bg-tcb-ink" : "bg-tcb-ink/15")}
              initial={{ height: 8 }}
              animate={{ height: active && filled ? 56 : 8 }}
              transition={{ delay: 0.3 + i * 0.045, duration: 0.45, ease: EASE }}
            />
            <span className="tabular text-[11px] font-medium text-tcb-ink/55">{MONTHS[i]}</span>
          </div>
        ))}
      </motion.div>
      <motion.p
        variants={rise}
        custom={3}
        className="mt-8 max-w-[26ch] text-[17px] leading-relaxed text-tcb-ink/75"
      >
        {scene.note}
      </motion.p>
    </Frame>
  );
}

function CashbackScene({ scene, active }: Props<"cashback">) {
  const n = useCountUp(scene.amount, active, 1200);
  return (
    <Frame className="justify-end bg-tcb-red-deep">
      <Label>{scene.label}</Label>
      <motion.div
        variants={rise}
        custom={1}
        className="mt-4 font-display text-[58px] font-extrabold leading-[0.95] tracking-[-0.04em] text-tcb-gold"
      >
        <Money value={n} />
      </motion.div>
      <motion.p variants={rise} custom={2} className="mt-6 text-[20px] font-semibold text-tcb-bone">
        {scene.rank}
      </motion.p>
      <motion.p
        variants={rise}
        custom={3}
        className="mt-3 max-w-[25ch] text-[17px] leading-relaxed text-tcb-bone/75"
      >
        {scene.note}
      </motion.p>
    </Frame>
  );
}

function PersonaScene({ scene }: Props<"persona">) {
  return (
    <Frame className="justify-end bg-tcb-bone pb-44">
      <Label tone="ink">{scene.label}</Label>
      <motion.h2
        variants={rise}
        custom={1}
        className="mt-4 font-display text-[58px] font-extrabold leading-[0.88] tracking-[-0.045em] text-tcb-ink"
      >
        {scene.persona}
      </motion.h2>
      <motion.p
        variants={rise}
        custom={2}
        className="mt-5 max-w-[26ch] text-[18px] leading-relaxed text-tcb-ink/70"
      >
        {scene.blurb}
      </motion.p>
      <motion.dl
        variants={rise}
        custom={3}
        className="mt-10 grid grid-cols-3 gap-4 border-t border-tcb-ink/15 pt-6"
      >
        {scene.stats.map((s) => (
          <div key={s.k}>
            <dt className="text-[13px] text-tcb-ink/55">{s.k}</dt>
            <dd className="tabular mt-1 font-display text-[21px] font-semibold tracking-[-0.02em] text-tcb-red">
              {s.v}
            </dd>
          </div>
        ))}
      </motion.dl>
    </Frame>
  );
}

export function SceneView({ scene, active }: { scene: Scene; active: boolean }) {
  switch (scene.kind) {
    case "open":
      return <OpenScene scene={scene} active={active} />;
    case "total":
      return <TotalScene scene={scene} active={active} />;
    case "categories":
      return <CategoriesScene scene={scene} active={active} />;
    case "moment":
      return <MomentScene scene={scene} active={active} />;
    case "saving":
      return <SavingScene scene={scene} active={active} />;
    case "cashback":
      return <CashbackScene scene={scene} active={active} />;
    case "persona":
      return <PersonaScene scene={scene} active={active} />;
  }
}
