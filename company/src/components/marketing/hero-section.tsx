import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { TrustGraph } from "@/src/components/marketing/trust-graph";
import { Container } from "@/src/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/lib/site";

const highlights = [
  {
    label: "Current Stage",
    value: "POC → Prototype",
  },
  {
    label: "Business Model",
    value: "B2B SaaS",
  },
  {
    label: "Core Intelligence",
    value: "GNN + Federated Learning",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-34 sm:pb-30 sm:pt-40">
      <div className="absolute inset-0 -z-20 bg-background" />

      <div className="absolute -left-40 -top-32 -z-10 size-112 rounded-full bg-primary/10 blur-[110px]" />

      <div className="absolute -right-48 top-20 -z-10 size-120 rounded-full bg-brand-blue/10 blur-[120px]" />

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Badge
              className="mb-7 rounded-full border-primary/20 bg-primary/10 px-5 py-4 text-primary"
              variant="outline"
            >
              <Sparkles className="mr-1.5 size-3.5" />
              Terpilih dalam 480 Tim Digdaya x Hackathon Bank Indonesia 2026
            </Badge>

            <h1 className="max-w-4xl font-display text-5xl leading-[0.98] font-extrabold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              Mendeteksi fraud sebelum menjadi{" "}
              <span className="bg-linear-to-r from-primary via-brand-cyan to-brand-blue bg-clip-text text-transparent">
                kerugian.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-pretty text-muted-foreground sm:text-lg">
              TrustLens adalah platform fraud intelligence real-time
              berbasis Graph Neural Network dan Federated Learning untuk
              membantu institusi keuangan mengungkap jaringan fraud tanpa
              mengorbankan privasi data.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="h-12 rounded-full px-6">
                <Link href="#solusi">
                  Jelajahi TrustLens
                  <ArrowRight className="size-4" />
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
                className="h-12 rounded-full px-6 text-muted-foreground hover:text-foreground"
                variant="ghost"
              >
                <Link
                  href={siteConfig.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="size-4" />
                  Diskusikan Investasi
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <ShieldCheck className="size-4 text-primary" />
              </div>

              <p>
                Fraud intelligence yang dirancang untuk keamanan,
                kolaborasi, dan perlindungan privasi.
              </p>
            </div>

            <div className="mt-12 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <div key={highlight.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {highlight.label}
                  </p>

                  <p className="mt-2 text-sm font-bold text-foreground">
                    {highlight.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/5 blur-2xl" />
            <TrustGraph />
          </div>
        </div>
      </Container>
    </section>
  );
}