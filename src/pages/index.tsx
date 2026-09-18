import type { ReactNode } from "react";
import { Start } from "./Start";
import { First } from "./First";
import { FirstSentence } from "./FirstSentence";

export type PageProps = { next: () => void; prev: () => void };

export type Page = {
  id: string;
  render: (p: PageProps) => ReactNode;
};

/** The flow, in order. Each screen advances itself through its own control. */
export const pages: Page[] = [
  { id: "start", render: () => <Start /> },
  { id: "first", render: ({ next }) => <First next={next} /> },
  { id: "first-sentence", render: ({ next }) => <FirstSentence next={next} /> },
];
