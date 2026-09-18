import type { ReactNode } from "react";
import { Placeholder } from "./Placeholder";

export type Page = {
  id: string;
  /** Background tone of the page — sets the progress bar colour so it stays legible. */
  tone: "dark" | "light";
  render: () => ReactNode;
};

/**
 * The deck. Add one entry per screen; the player handles progress, autoplay,
 * tap zones, swipe and keyboard for whatever is in this list.
 */
export const pages: Page[] = [
  { id: "placeholder", tone: "dark", render: () => <Placeholder /> },
];
