import {
  BellRing,
  BrainCircuit,
  Database,
  Network,
  ShieldCheck,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";

const processSteps = [
  {
    icon: Database,
    step: "01",
    title: "Transaction Stream",
    description:
      "Data transaksi, akun, perangkat, merchant, channel, dan negara diterima melalui integrasi API.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Validation & Enrichment",
    description:
      "Data divalidasi, dibersihkan, dinormalisasi, dan diperkaya agar siap dianalisis.",
  },
  {
    icon: Network,
    step: "03",
    title: "Graph Construction",
    description:
      "Setiap entitas dihubungkan menjadi node dan edge dalam jaringan transaksi terstruktur.",
  },
  {
    icon: BrainCircuit,
    step: "04",
    title: "AI Risk Analysis",
    description:
      "GNN, behavioral model, dan cross-border intelligence menganalisis pola serta anomali.",
  },
  {
    icon: BellRing,
    step: "05",
    title: "Decision & Investigation",
    description:
      "Sistem menghasilkan risk score, alert, visualisasi graph, dan rekomendasi tindakan.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-card/35 py-24 sm:py-30">
      <Container>
        <ScrollReveal>
          <SectionHeading
            description="Dari data transaksi mentah hingga keputusan yang dapat ditindaklanjuti, seluruh proses dirancang untuk berjalan terintegrasi."
            eyebrow="Cara kerja"
            title="Dari transaction stream menuju keputusan real-time."
          />
        </ScrollReveal>

        <div className="relative mt-14 grid gap-4 lg:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-linear-to-r from-transparent via-primary/35 to-transparent lg:block" />

          {processSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal
                className="relative"
                delay={index * 0.07}
                key={step.step}
              >
                <div className="h-full rounded-2xl border border-border bg-background/75 p-5 backdrop-blur transition duration-300 hover:border-primary/35">
                  <div className="relative z-10 flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>

                  <p className="mt-7 text-xs font-bold tracking-[0.16em] text-primary">
                    STEP {step.step}
                  </p>

                  <h3 className="mt-2 font-display text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
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