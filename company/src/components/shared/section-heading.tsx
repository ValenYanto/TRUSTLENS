import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>

      <h2 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-6 text-base leading-8 text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}