import Link from "next/link";
import {
  ArrowDown,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/lib/site";

export function InvestorHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
      <div className="absolute -left-48 top-10 -z-10 size-120 rounded-full bg-primary/10 blur-[120px]" />

      <div className="absolute -right-56 -top-20 -z-10 size-136 rounded-full bg-brand-blue/10 blur-[130px]" />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal>
            <Badge
              className="rounded-full border-primary/20 bg-primary/10 px-5 py-4 text-primary"
              variant="outline"
            >
              <TrendingUp className="mr-1.5 size-3.5" />
              Investment Opportunity
            </Badge>

            <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[1.02] font-extrabold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              Investasi pada fondasi keamanan finansial{" "}
              <span className="bg-linear-to-r from-primary via-brand-cyan to-brand-blue bg-clip-text text-transparent">
                generasi berikutnya.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              TrustLens sedang membuka diskusi dengan investor strategis,
              institusi keuangan, dan mitra teknologi untuk mempercepat
              pengembangan MVP serta institutional pilot.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="h-12 rounded-full px-6">
                <Link href="#investor-form">
                  Isi Form Investor
                  <ArrowDown className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="h-12 rounded-full px-6"
                variant="outline"
              >
                <Link
                  href={siteConfig.productDemoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Lihat Demo Produk
                  <ExternalLink className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="h-12 rounded-full px-6"
                variant="ghost"
              >
                <Link
                  href={siteConfig.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="relative overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-8">
              <div className="absolute right-0 top-0 size-48 rounded-full bg-primary/10 blur-[80px]" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Investor Snapshot
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-extrabold">
                    TrustLens
                  </h2>
                </div>

                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
              </div>

              <div className="relative mt-8 grid gap-3">
                {[
                  {
                    label: "Industry",
                    value: "Fraud Intelligence",
                  },
                  {
                    label: "Stage",
                    value: "POC menuju Prototype",
                  },
                  {
                    label: "Business Model",
                    value: "B2B SaaS",
                  },
                  {
                    label: "Initial Market",
                    value: "Indonesia & Southeast Asia",
                  },
                  {
                    label: "Core Technology",
                    value: "GNN + Federated Learning",
                  },
                ].map((item) => (
                  <div
                    className="flex items-start justify-between gap-5 rounded-xl border border-border bg-background/60 px-4 py-3"
                    key={item.label}
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <span className="text-right text-sm font-bold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}