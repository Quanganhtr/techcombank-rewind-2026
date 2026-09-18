/** iOS status bar, positioned to match the Figma frame exactly. */
export function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[50px] text-white">
      <span className="font-system absolute left-[66px] top-[24px] h-[22px] w-[37px] text-center text-[17px] font-semibold leading-[22px]">
        9:41
      </span>
      <svg className="absolute left-[317px] top-[29px]" width="19" height="12" viewBox="0 0 19 12" fill="currentColor" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5.3" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10.6" y="3" width="3" height="9" rx="1" />
        <rect x="15.9" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg className="absolute left-[343px] top-[29px]" width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
        <path d="M8.5 11.6 6.2 8.9a3.6 3.6 0 0 1 4.6 0l-2.3 2.7ZM3.9 6.3 2 4.2a9.6 9.6 0 0 1 13 0l-1.9 2.1a6.9 6.9 0 0 0-9.2 0Z" />
      </svg>
      <svg className="absolute left-[368px] top-[29px]" width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
        <rect x="0.5" y="0.5" width="24" height="12" rx="4.3" fill="none" stroke="currentColor" opacity="0.35" />
        <rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor" />
        <path d="M26 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}
