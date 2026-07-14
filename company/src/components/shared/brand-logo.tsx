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
    <div
      className={cn(
        "inline-flex items-center gap-3",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="size-10 shrink-0"
        fill="none"
        viewBox="0 0 64 64"
      >
        <rect
          className="fill-logo-surface stroke-logo-border"
          height="61"
          rx="15"
          strokeWidth="1.5"
          width="61"
          x="1.5"
          y="1.5"
        />

        <g
          className="stroke-logo-ink"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="32"
            cy="25.5"
            r="15.5"
            strokeWidth="1.45"
          />

          <path
            d="M32 10.5C26.4 14.3 23.2 19.6 23.2 25.5C23.2 31.5 26.4 36.7 32 40.5"
            strokeWidth="1.1"
          />

          <path
            d="M32 10.5C37.6 14.3 40.8 19.6 40.8 25.5C40.8 31.5 37.6 36.7 32 40.5"
            strokeWidth="1.1"
          />

          <path
            d="M18.8 18.8C22.7 21.5 27.2 22.8 32 22.8C36.8 22.8 41.3 21.5 45.2 18.8"
            strokeWidth="1.1"
          />

          <path
            d="M18.8 32.2C22.7 29.5 27.2 28.2 32 28.2C36.8 28.2 41.3 29.5 45.2 32.2"
            strokeWidth="1.1"
          />

          <path
            d="M16.7 25.5H47.3"
            strokeWidth="1"
          />

          <path
            d="M22.2 15.7L29.1 22.2L37.6 18.9L43.1 25.4L38.6 33.9L29 35.1L22.8 28.3"
            strokeWidth="1.35"
          />

          <path
            d="M29.1 22.2L29 35.1M29.1 22.2L38.6 33.9M37.6 18.9L29 35.1"
            strokeWidth="1"
          />
        </g>

        <g className="fill-logo-ink">
          <circle cx="22.2" cy="15.7" r="1.65" />
          <circle cx="29.1" cy="22.2" r="1.65" />
          <circle cx="37.6" cy="18.9" r="1.65" />
          <circle cx="43.1" cy="25.4" r="1.65" />
          <circle cx="38.6" cy="33.9" r="1.65" />
          <circle cx="29" cy="35.1" r="1.65" />
          <circle cx="22.8" cy="28.3" r="1.65" />
          <circle cx="32" cy="25.5" r="2" />
        </g>

        <text
          className="fill-logo-ink"
          dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="5"
          fontWeight="700"
          letterSpacing="1.15"
          textAnchor="middle"
          x="32"
          y="53"
        >
          TRUSTLENS
        </text>
      </svg>

      {showWordmark ? (
        <span className="font-display text-xl font-extrabold tracking-[-0.045em] text-foreground">
          Trust
          <span className="text-primary">
            Lens
          </span>
        </span>
      ) : null}
    </div>
  );
}