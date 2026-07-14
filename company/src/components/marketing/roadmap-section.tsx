import {
  CheckCircle2,
  FlaskConical,
  Network,
  Rocket,
  ServerCog,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";

const roadmap = [
  {
    icon: CheckCircle2,
    status: "Selesai",
    title: "Concept & Architecture",
    description:
      "Problem validation, system architecture, data flow, database, dan product design.",
  },
  {
    icon: FlaskConical,
    status: "Berjalan",
    title: "Proof of Concept",
    description:
      "Implementasi model baseline, graph model, data simulation, dan pengujian konsep.",
  },
  {
    icon: ServerCog,
    status: "Berikutnya",
    title: "Integrated MVP",
    description:
      "Integrasi API, AI inference, dashboard monitoring, alert, dan investigation workflow.",
  },
  {
    icon: Network,
    status: "Direncanakan",
    title: "Federated Simulation",
    description:
      "Simulasi pembelajaran antar-institusi tanpa pertukaran data transaksi mentah.",
  },
  {
    icon: Rocket,
    status: "Target",
    title: "Institutional Pilot",
    description:
      "Pilot terbatas, evaluasi performa, keamanan, operasional, dan kesiapan implementasi.",
  },
] as const;

export function RoadmapSection() {
  return (
    <section className="border-y border-border bg-card/35 py-24 sm:py-30">
      <Container>
        <ScrollReveal>
          <SectionHeading
            description="Roadmap difokuskan pada milestone yang dapat divalidasi sebelum TrustLens diterapkan dalam lingkungan institusi keuangan."
            eyebrow="Development roadmap"
            title="Dari konsep menuju institutional pilot."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {roadmap.map((item, index) => {
            const Icon = item.icon;

            return (
              <ScrollReveal
                delay={index * 0.07}
                key={item.title}
              >
                <div className="group h-full rounded-2xl border border-border bg-background/70 p-5 transition duration-300 hover:border-primary/35">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <span className="font-display text-sm font-extrabold text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <Badge
                    className="mt-6"
                    variant={
                      item.status === "Berjalan"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {item.status}
                  </Badge>

                  <h3 className="mt-4 font-display text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}