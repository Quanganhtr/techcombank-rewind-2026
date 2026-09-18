import { Rewind } from "./components/Rewind";

export default function App() {
  return (
    <main className="ledger-field relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-black px-6 py-10">
      <header className="absolute left-8 top-7 flex items-baseline gap-3">
        <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-tcb-bone">
          Techcombank
        </span>
        <span className="text-[14px] font-medium text-tcb-bone/60">Rewind 2026</span>
      </header>

      <Rewind />
    </main>
  );
}
