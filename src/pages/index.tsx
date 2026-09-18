import type { ReactNode } from "react";
import { Start } from "./Start";
import { First } from "./First";
import { FirstSentence } from "./FirstSentence";

export type PageProps = {
  next: () => void;
  prev: () => void;
  /** True once the dome is clear of the screen, or straight away on a deep link. */
  domeCleared: boolean;
  /** Called when a screen's headline has finished typing. */
  onHeadlineTyped: () => void;
};

export type Page = {
  id: string;
  render: (p: PageProps) => ReactNode;
};

/** The flow, in order. Each screen advances itself through its own control. */
export const pages: Page[] = [
  { id: "start", render: () => <Start /> },
  {
    id: "first",
    render: ({ domeCleared, onHeadlineTyped }) => (
      <First domeCleared={domeCleared} onHeadlineTyped={onHeadlineTyped} />
    ),
  },
  { id: "first-sentence", render: () => <FirstSentence /> },
];
