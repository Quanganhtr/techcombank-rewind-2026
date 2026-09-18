import logo from "../assets/logo-tcb.svg";

/** Wordmark + logo, aligned to the logo at x=360 as in the design. */
export function Header({ title }: { title: string }) {
  return (
    <div className="absolute inset-x-0 top-[50px] h-[80px]">
      <span className="absolute right-[96px] top-[40px] text-[20px] font-extralight leading-[24px] text-white">
        {title}
      </span>
      <img
        src={logo}
        alt="Techcombank"
        width={56}
        height={56}
        className="absolute left-[360px] top-[24px]"
      />
    </div>
  );
}
