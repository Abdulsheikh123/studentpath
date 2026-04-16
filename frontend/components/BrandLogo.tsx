import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  inverted?: boolean;
};

export default function BrandLogo({ href = "/", inverted = false }: BrandLogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] bg-cyan-300 shadow-lg shadow-cyan-500/20">
        <div className="absolute inset-[1px] rounded-[1.15rem] bg-slate-950/12" />
        <div className="relative h-6 w-6">
          <span className="absolute top-0 left-0 h-6 w-2.5 rounded-full bg-white" />
          <span className="absolute top-0 right-0 h-6 w-2.5 rounded-full bg-white/85" />
          <span className="absolute top-1.5 left-1/2 h-2.5 w-3.5 -translate-x-1/2 rounded-full bg-sky-700" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-white/35" />
        </div>
      </div>

      <div className="min-w-0 leading-none">
        <span
          className={`block truncate text-[1.18rem] font-semibold tracking-[-0.05em] sm:text-[1.48rem] ${
            inverted ? "text-white" : "text-foreground"
          }`}
        >
          Student
          <span className="ml-0.5 text-cyan-600 dark:text-cyan-300">Path</span>
        </span>
        <span
          className={`mt-1 block truncate text-[9px] font-medium tracking-[0.24em] uppercase ${
            inverted ? "text-cyan-300" : "text-cyan-600 dark:text-cyan-300"
          }`}
        >
          Learn. Choose. Grow.
        </span>
      </div>
    </div>
  );

  return (
    <Link href={href} className="inline-flex min-w-0 items-center">
      {content}
    </Link>
  );
}
