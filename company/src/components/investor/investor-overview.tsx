import {
  BanknoteArrowUp,
  BrainCircuit,
  Building2,
  DatabaseZap,
  Globe2,
  Handshake,
  Rocket,
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

const investmentReasons = [
  {
    icon: Globe2,
    title: "Masalah global yang terus berkembang",
    description:
      "Transaksi digital dan cross-border menciptakan pola fraud yang semakin terhubung dan sulit dianalisis menggunakan sistem konvensional.",
  },
  {
    icon: BrainCircuit,
    title: "Technology moat yang terintegrasi",
    description:
      "TrustLens menggabungkan Graph Neural Network, Federated Learning, real-time detection, dan cross-border intelligence.",
  },
  {
    icon: Building2,
    title: "Model bisnis enterprise",
    description:
      "Pendapatan dirancang melalui subscription, usage-based service, integrasi API, serta layanan analitik dan keamanan.",
  },
] as const;

const fundingFocus = [
  {
    icon: BrainCircuit,
    title: "AI & Model Development",
    description:
      "Pengembangan GNN, behavioral model, evaluasi akurasi, dan continuous learning.",
  },
  {
    icon: DatabaseZap,
    title: "Data Infrastructure",
    description:
      "Pipeline transaksi real-time, graph processing, observability, dan scalable infrastructure.",
  },
  {
    icon: Rocket,
    title: "Product Engineering",
    description:
      "Integrasi dashboard, investigation workflow, alert management, API, dan enterprise readiness.",
  },
  {
    icon: Handshake,
    title: "Institutional Pilot",
    description:
      "Validasi kebutuhan, pilot terbatas, evaluasi operasional, serta penyempurnaan implementasi.",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description:
      "Peningkatan keamanan sistem, kontrol akses, privasi data, dan kesiapan kepatuhan.",
  },
  {
    icon: BanknoteArrowUp,
    title: "Business Development",
    description:
      "Market validation, strategic partnership, legal preparation, dan ekspansi pasar awal.",
  },
] as const;

export function InvestorOverview() {
  return (
    <>
      <section className="border-y border-border bg-card/35 py-24 sm:py-30">
        <Container>
          <ScrollReveal>
            <SectionHeading
              align="center"
              description="TrustLens dibangun untuk menjadi mitra fraud intelligence bagi institusi keuangan, bukan sekadar alat transaction scoring."
              eyebrow="Investment thesis"
              title="Mengapa TrustLens memiliki peluang untuk berkembang."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {investmentReasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <ScrollReveal
                  delay={index * 0.08}
                  key={reason.title}
                >
                  <Card className="h-full border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/5">
                    <CardHeader>
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>

                      <CardTitle className="mt-5 font-display text-xl leading-7">
                        {reason.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="leading-7 text-muted-foreground">
                        {reason.description}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-30">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <ScrollReveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  description="Nominal dan persentase penggunaan dana belum dipublikasikan. Pembagian final akan ditentukan berdasarkan tahap pendanaan dan milestone yang disepakati."
                  eyebrow="Funding focus"
                  title="Pendanaan diarahkan pada milestone yang terukur."
                />
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {fundingFocus.map((focus, index) => {
                const Icon = focus.icon;

                return (
                  <ScrollReveal
                    delay={index * 0.06}
                    key={focus.title}
                  >
                    <article className="h-full rounded-2xl border border-border bg-card p-6 transition duration-300 hover:border-primary/35">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>

                      <h3 className="mt-5 font-display text-lg font-bold">
                        {focus.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {focus.description}
                      </p>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}