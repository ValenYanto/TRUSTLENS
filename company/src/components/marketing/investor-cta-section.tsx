import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/lib/site";

export function InvestorCtaSection() {
  return (
    <section
      className="scroll-mt-28 pb-24 sm:pb-30"
      id="investasi"
    >
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-card px-6 py-14 text-center shadow-2xl shadow-primary/5 sm:px-12 sm:py-20">
            <div className="absolute left-1/2 top-0 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Investment opportunity
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight font-extrabold tracking-tighter text-balance sm:text-6xl">
              Bangun masa depan keamanan finansial bersama
              TrustLens.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Kami membuka diskusi dengan investor strategis,
              institusi keuangan, dan mitra teknologi untuk
              mempercepat pengembangan MVP serta institutional
              pilot.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full px-6"
              >
                <Link href="/investors">
                  Isi Form Investor
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="h-12 rounded-full px-6"
                variant="outline"
              >
                <Link
                  href={siteConfig.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="size-4" />
                  Hubungi via WhatsApp
                </Link>
              </Button>

              <Button
                asChild
                className="h-12 rounded-full px-6"
                variant="ghost"
              >
                <Link
                  href={siteConfig.productDemoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Lihat Produk
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3.5" />
              trustlens.fraud@gmail.com
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}