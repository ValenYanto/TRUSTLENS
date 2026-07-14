import {
  Building2,
  Layers3,
  Rocket,
  Trophy,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";

const credibilityItems = [
  {
    icon: Trophy,
    label: "Hackathon",
    value: "480 tim terpilih",
  },
  {
    icon: Building2,
    label: "Kolaborasi",
    value: "3 universitas",
  },
  {
    icon: Rocket,
    label: "Current stage",
    value: "POC menuju prototype",
  },
  {
    icon: Layers3,
    label: "Business model",
    value: "B2B SaaS",
  },
] as const;

export function CredibilityStrip() {
  return (
    <section className="border-y border-border bg-card/40">
      <Container>
        <ScrollReveal>
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {credibilityItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex items-center gap-4 px-1 py-6 sm:px-6 lg:px-7"
                  key={item.label}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    <Icon className="size-4.5 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}