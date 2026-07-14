import {
  Building2,
  CircleDollarSign,
  CloudCog,
  CreditCard,
  Landmark,
  Plug,
  WalletCards,
  Wrench,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";

const markets = [
  {
    icon: Landmark,
    title: "Bank & Digital Bank",
  },
  {
    icon: CreditCard,
    title: "Payment Gateway",
  },
  {
    icon: WalletCards,
    title: "Fintech & E-Wallet",
  },
  {
    icon: Building2,
    title: "Remittance Provider",
  },
] as const;

const revenueStreams = [
  {
    icon: CircleDollarSign,
    title: "Platform Subscription",
    description:
      "Biaya berlangganan bulanan atau tahunan berdasarkan paket dan kebutuhan institusi.",
  },
  {
    icon: Plug,
    title: "API Integration",
    description:
      "Biaya integrasi, implementation support, dan penyesuaian sistem enterprise.",
  },
  {
    icon: CloudCog,
    title: "Usage-Based Service",
    description:
      "Biaya berdasarkan volume transaksi, inference, atau penggunaan layanan intelligence.",
  },
  {
    icon: Wrench,
    title: "Analytics & Security Service",
    description:
      "Layanan analitik, audit keamanan, model customization, dan enterprise support.",
  },
] as const;

export function BusinessSection() {
  return (
    <section className="py-24 sm:py-30">
      <Container>
        <ScrollReveal>
          <SectionHeading
            align="center"
            description="TrustLens dirancang sebagai infrastruktur fraud intelligence untuk institusi dengan volume transaksi tinggi dan sensitivitas risiko yang besar."
            eyebrow="Market & business"
            title="B2B SaaS untuk ekosistem keuangan digital."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((market, index) => {
            const Icon = market.icon;

            return (
              <ScrollReveal
                delay={index * 0.06}
                key={market.title}
              >
                <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>

                  <p className="font-display text-sm font-bold">
                    {market.title}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-4xl border border-border bg-card">
          <div className="border-b border-border p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Revenue model
            </p>

            <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
              Pendapatan berulang dengan layanan enterprise tambahan.
            </h3>
          </div>

          <div className="grid md:grid-cols-2">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon;

              return (
                <ScrollReveal
                  className="border-b border-border p-6 last:border-b-0 md:border-r md:nth-[2n]:border-r-0 md:nth-last-[-n+2]:border-b-0 sm:p-8"
                  delay={index * 0.06}
                  key={stream.title}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>

                  <h4 className="mt-5 font-display text-lg font-bold">
                    {stream.title}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {stream.description}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}