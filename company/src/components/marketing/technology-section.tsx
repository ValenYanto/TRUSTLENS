import {
  BrainCircuit,
  Globe2,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";

const technologies = [
  {
    icon: BrainCircuit,
    title: "Graph Neural Network",
    description:
      "Mempelajari pola hubungan kompleks yang tidak dapat ditangkap optimal oleh analisis tabular tradisional.",
  },
  {
    icon: ShieldCheck,
    title: "Federated Learning",
    description:
      "Model dapat dikembangkan secara terdistribusi tanpa mengumpulkan seluruh data sensitif dalam satu tempat.",
  },
  {
    icon: Globe2,
    title: "Cross-Border Intelligence",
    description:
      "Memperkaya analisis melalui konteks negara asal, tujuan transaksi, dan pola risiko lintas yurisdiksi.",
  },
  {
    icon: RefreshCcw,
    title: "Continuous Learning Loop",
    description:
      "Hasil investigasi dan pelabelan digunakan untuk meningkatkan kualitas model secara berkelanjutan.",
  },
] as const;

const comparisons = [
  {
    label: "Analisis hubungan graph",
    conventional: "Terbatas",
    trustLens: "Terintegrasi",
  },
  {
    label: "Kolaborasi tanpa berbagi data mentah",
    conventional: "Tidak",
    trustLens: "Ya",
  },
  {
    label: "Cross-border intelligence",
    conventional: "Terpisah",
    trustLens: "Terintegrasi",
  },
  {
    label: "Continuous learning",
    conventional: "Terbatas",
    trustLens: "Adaptif",
  },
] as const;

export function TechnologySection() {
  return (
    <section className="py-24 sm:py-30" id="teknologi">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <ScrollReveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                description="Keunggulan TrustLens berada pada integrasi teknologi, bukan hanya pada satu model deteksi."
                eyebrow="Technology moat"
                title="Dibangun untuk fraud modern yang bergerak sebagai jaringan."
              />

              <div className="mt-8 flex flex-wrap gap-2">
                <Badge variant="secondary">GNN-powered</Badge>
                <Badge variant="secondary">Privacy preserving</Badge>
                <Badge variant="secondary">Real-time</Badge>
                <Badge variant="secondary">Cross-border ready</Badge>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {technologies.map((technology, index) => {
              const Icon = technology.icon;

              return (
                <ScrollReveal
                  delay={index * 0.07}
                  key={technology.title}
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-6 transition duration-300 hover:border-primary/35">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <h3 className="mt-6 font-display text-lg font-bold">
                      {technology.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {technology.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        <ScrollReveal className="mt-16">
          <div className="overflow-hidden rounded-4xl border border-border bg-card">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border bg-muted/50 px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] sm:px-7">
              <span>Kemampuan</span>
              <span className="w-24 text-center sm:w-36">
                Konvensional
              </span>
              <span className="w-24 text-center text-primary sm:w-36">
                TrustLens
              </span>
            </div>

            {comparisons.map((comparison) => (
              <div
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-5 last:border-b-0 sm:px-7"
                key={comparison.label}
              >
                <span className="text-sm font-semibold">
                  {comparison.label}
                </span>

                <span className="w-24 text-center text-sm text-muted-foreground sm:w-36">
                  {comparison.conventional}
                </span>

                <span className="w-24 text-center text-sm font-bold text-primary sm:w-36">
                  {comparison.trustLens}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}