import Link from "next/link";
import {
  Activity,
  BellRing,
  ExternalLink,
  FileSearch,
  Globe2,
  Network,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/lib/site";

const productFeatures = [
  {
    icon: Activity,
    label: "Real-Time Monitoring",
  },
  {
    icon: BellRing,
    label: "Priority Alerts",
  },
  {
    icon: Network,
    label: "Graph Explorer",
  },
  {
    icon: Globe2,
    label: "Cross-Border Intelligence",
  },
  {
    icon: FileSearch,
    label: "Transaction Investigation",
  },
] as const;

export function ProductShowcaseSection() {
  return (
    <section
      className="border-y border-border bg-card/35 py-24 sm:py-30"
      id="produk"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <ScrollReveal>
            <SectionHeading
              description="Jelajahi bagaimana TrustLens membantu analyst memonitor transaksi, membuka alert, dan menginvestigasi jaringan risiko."
              eyebrow="Interactive prototype"
              title="Lihat TrustLens bekerja melalui product demo."
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {productFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3"
                    key={feature.label}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>

                    <span className="text-sm font-semibold">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button asChild className="mt-8 h-12 rounded-full px-6">
              <Link
                href={siteConfig.productDemoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Buka Demo TrustLens
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-primary/8 blur-3xl" />

              <div className="overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl shadow-primary/8">
                <div className="flex items-center gap-2 border-b border-border px-3 pb-3">
                  <span className="size-2.5 rounded-full bg-destructive" />
                  <span className="size-2.5 rounded-full bg-warning" />
                  <span className="size-2.5 rounded-full bg-success" />

                  <div className="ml-3 flex-1 rounded-lg bg-muted px-3 py-1.5 text-center text-[10px] text-muted-foreground">
                    trustlens-one.vercel.app
                  </div>
                </div>

                <div className="grid min-h-105 grid-cols-[4.5rem_1fr] overflow-hidden rounded-b-[1.4rem] bg-background">
                  <div className="border-r border-border bg-card/70 p-3">
                    <div className="size-8 rounded-lg bg-primary/15" />

                    <div className="mt-8 grid gap-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          className="h-2 rounded-full bg-muted"
                          key={index}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="h-3 w-24 rounded-full bg-primary/20" />
                        <div className="mt-3 h-6 w-44 rounded-lg bg-foreground/10" />
                      </div>

                      <div className="h-8 w-20 rounded-lg bg-primary/15" />
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      {[
                        "bg-primary/15",
                        "bg-brand-blue/15",
                        "bg-destructive/12",
                      ].map((background) => (
                        <div
                          className="rounded-xl border border-border bg-card p-4"
                          key={background}
                        >
                          <div className={`size-7 rounded-lg ${background}`} />
                          <div className="mt-5 h-5 w-16 rounded bg-foreground/10" />
                          <div className="mt-2 h-2 w-20 rounded bg-muted" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-[1.35fr_0.65fr]">
                      <div className="relative min-h-48 overflow-hidden rounded-xl border border-border bg-card graph-grid">
                        <div className="absolute left-[16%] top-[25%] size-4 rounded-full bg-primary" />
                        <div className="absolute left-[48%] top-[42%] size-5 rounded-full bg-brand-blue" />
                        <div className="absolute right-[18%] top-[22%] size-4 rounded-full bg-destructive" />
                        <div className="absolute bottom-[18%] left-[30%] size-3 rounded-full bg-primary" />
                        <div className="absolute bottom-[20%] right-[22%] size-3 rounded-full bg-brand-cyan" />

                        <svg
                          aria-hidden="true"
                          className="absolute inset-0 size-full"
                        >
                          <line
                            className="stroke-primary/40"
                            x1="18%"
                            x2="50%"
                            y1="28%"
                            y2="45%"
                          />
                          <line
                            className="stroke-destructive/45"
                            x1="50%"
                            x2="81%"
                            y1="45%"
                            y2="25%"
                          />
                          <line
                            className="stroke-primary/35"
                            x1="50%"
                            x2="31%"
                            y1="45%"
                            y2="80%"
                          />
                          <line
                            className="stroke-brand-cyan/35"
                            x1="50%"
                            x2="78%"
                            y1="45%"
                            y2="79%"
                          />
                        </svg>
                      </div>

                      <div className="rounded-xl border border-border bg-card p-4">
                        <div className="h-3 w-20 rounded bg-foreground/10" />

                        <div className="mt-5 grid gap-3">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div
                              className="rounded-lg border border-border p-3"
                              key={index}
                            >
                              <div className="h-2 w-full rounded bg-muted" />
                              <div className="mt-2 h-2 w-2/3 rounded bg-primary/20" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}