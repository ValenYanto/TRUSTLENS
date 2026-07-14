import {
  Activity,
  Globe2,
  Network,
  ShieldCheck,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const solutionPillars = [
  {
    icon: Network,
    number: "01",
    title: "Graph Intelligence",
    description:
      "Menghubungkan transaksi, akun, perangkat, merchant, alamat IP, dan negara untuk menemukan pola jaringan yang tersembunyi.",
  },
  {
    icon: Activity,
    number: "02",
    title: "Real-Time Decisioning",
    description:
      "Menghasilkan fraud score dan rekomendasi tindakan untuk approve, alert, investigate, atau block secara cepat.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Privacy-Preserving Collaboration",
    description:
      "Memungkinkan institusi meningkatkan model secara kolaboratif tanpa memindahkan atau membagikan data mentah.",
  },
  {
    icon: Globe2,
    number: "04",
    title: "Cross-Border Intelligence",
    description:
      "Menganalisis relasi dan aliran transaksi lintas negara untuk menemukan anomali yang tidak terlihat secara lokal.",
  },
] as const;

export function SolutionSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-30" id="solusi">
      <div className="absolute -right-48 top-24 -z-10 size-96 rounded-full bg-primary/8 blur-[110px]" />

      <Container>
        <ScrollReveal>
          <SectionHeading
            align="center"
            description="TrustLens tidak hanya menilai satu transaksi. Platform ini memahami hubungan, perilaku, dan konteks risiko di seluruh jaringan finansial."
            eyebrow="TrustLens Intelligence"
            title="Satu platform untuk melihat risiko dari setiap hubungan."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {solutionPillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <ScrollReveal
                delay={index * 0.08}
                key={pillar.title}
              >
                <Card className="group h-full overflow-hidden border-border bg-card/75 transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-start justify-between gap-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <Icon className="size-5.5 text-primary" />
                    </div>

                    <span className="font-display text-4xl font-extrabold text-primary/15 transition-colors group-hover:text-primary/25">
                      {pillar.number}
                    </span>
                  </CardHeader>

                  <CardContent>
                    <CardTitle className="font-display text-xl">
                      {pillar.title}
                    </CardTitle>

                    <p className="mt-4 leading-7 text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}