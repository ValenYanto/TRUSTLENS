import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { HeroSection } from "@/src/components/marketing/hero-section";
import { ProblemPreview } from "@/src/components/marketing/problem-preview";
import { Container } from "@/src/components/shared/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/lib/site";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />

        <ProblemPreview />

        <section className="py-24 sm:py-30" id="solusi">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                TrustLens Intelligence
              </p>

              <h2 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
                Menghubungkan setiap sinyal untuk menemukan risiko yang
                tidak terlihat.
              </h2>

              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                TrustLens membangun relasi antartransaksi, akun,
                perangkat, merchant, dan negara, kemudian menganalisis
                pola tersebut untuk menghasilkan fraud score serta
                rekomendasi tindakan secara real-time.
              </p>
            </div>
          </Container>
        </section>

        <section
          className="border-y border-border bg-card/30 py-24 sm:py-30"
          id="produk"
        >
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Product Prototype
                </p>

                <h2 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-[-0.045em] sm:text-5xl">
                  Lihat bagaimana TrustLens bekerja.
                </h2>

                <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                  Jelajahi dashboard monitoring, transaction
                  investigation, priority alert, graph explorer, dan
                  cross-border intelligence melalui prototype interaktif
                  TrustLens.
                </p>

                <div className="mt-8">
                  <Button asChild className="h-12 rounded-full px-6">
                    <Link
                      href={siteConfig.productDemoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Buka Demo Produk
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl shadow-primary/5">
                <div className="flex items-center gap-2 border-b border-border px-3 pb-3">
                  <span className="size-2.5 rounded-full bg-destructive" />
                  <span className="size-2.5 rounded-full bg-warning" />
                  <span className="size-2.5 rounded-full bg-success" />

                  <div className="ml-3 flex-1 rounded-lg bg-muted px-3 py-1.5 text-center text-[10px] text-muted-foreground">
                    trustlens-one.vercel.app
                  </div>
                </div>

                <div className="flex min-h-80 items-center justify-center rounded-b-[1.4rem] bg-background graph-grid">
                  <div className="max-w-xs text-center">
                    <p className="font-display text-xl font-bold">
                      Interactive Product Demo
                    </p>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Preview visual produk akan ditambahkan pada tahap
                      product showcase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-24 sm:py-30" id="investasi">
          <Container>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/8 px-6 py-14 text-center sm:px-12 sm:py-18">
              <div className="absolute left-1/2 top-0 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]" />

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Investment Opportunity
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
                Bangun masa depan keamanan finansial bersama TrustLens.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted-foreground">
                Kami membuka diskusi dengan investor strategis,
                institusi keuangan, dan mitra teknologi untuk mempercepat
                pengembangan MVP serta pilot project TrustLens.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-full px-6">
                  <Link href="#investasi">
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
                    Hubungi melalui WhatsApp
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}