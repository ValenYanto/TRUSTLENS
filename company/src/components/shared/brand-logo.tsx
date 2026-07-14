import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function BrandLogo({
  className,
  showWordmark = true,
}: BrandLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        aria-hidden="true"
        className="size-9 shrink-0"
        fill="none"
        viewBox="0 0 44 44"
      >
        <rect
          className="fill-primary/10 stroke-primary"
          height="40"
          rx="12"
          width="40"
          x="2"
          y="2"
        />

        <circle
          className="stroke-primary"
          cx="22"
          cy="22"
          r="10"
          strokeWidth="2"
        />

        <circle className="fill-primary" cx="22" cy="22" r="3.5" />

        <circle className="fill-brand-cyan" cx="14" cy="17" r="2" />
        <circle className="fill-brand-blue" cx="30" cy="17" r="2" />
        <circle className="fill-primary" cx="16" cy="29" r="2" />
        <circle className="fill-brand-cyan" cx="29" cy="28" r="2" />

        <path
          className="stroke-primary/70"
          d="M15.5 18.5 20 21M28.5 18.5 24 21M17.5 27.5 20.5 23.5M27.5 27 23.5 23.5"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>

      {showWordmark ? (
        <span className="font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
          Trust
          <span className="text-primary">Lens</span>
        </span>
      ) : null}
    </div>
  );
}