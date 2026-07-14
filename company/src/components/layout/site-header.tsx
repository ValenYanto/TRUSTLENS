import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Menu,
  MessageCircle,
} from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ModeToggle } from "@/src/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/src/lib/site";

function TrustLensBrand() {
  return (
    <Link
      aria-label="Kembali ke halaman utama TrustLens"
      className="group inline-flex shrink-0 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href="/"
    >
      <span
        className="
          relative flex size-11 shrink-0 items-center justify-center
          overflow-hidden rounded-xl
          border border-slate-300
          bg-white p-1
          shadow-sm shadow-slate-900/10
          ring-1 ring-slate-950/5
          transition-all duration-200
          group-hover:-translate-y-0.5
          group-hover:border-primary/70
          group-hover:shadow-md
          group-hover:shadow-primary/15
          sm:size-12
          dark:border-primary/25
          dark:bg-slate-950
          dark:shadow-black/30
          dark:ring-white/10
          dark:group-hover:border-primary/60
        "
      >
        <span className="relative size-full overflow-hidden rounded-lg bg-black">
          <Image
            alt="Logo TrustLens"
            className="size-full scale-[1.08] object-cover"
            height={48}
            priority
            sizes="(min-width: 640px) 48px, 44px"
            src="/logo-trustlens.png"
            width={48}
          />
        </span>
      </span>

      <span className="flex flex-col">
        <span className="font-display text-lg leading-none font-extrabold tracking-[-0.045em] text-slate-950 transition-colors sm:text-xl md:text-2xl dark:text-white">
          Trust
          <span className="text-primary">Lens</span>
        </span>

      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between">
        <TrustLensBrand />

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 lg:flex"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ModeToggle />

          <Button asChild size="sm" variant="ghost">
            <Link href="/en">
              EN
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <Link
              href={siteConfig.productDemoUrl}
              rel="noreferrer"
              target="_blank"
            >
              Demo Produk
              <ExternalLink className="size-4" />
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link
              href={siteConfig.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle className="size-4" />
              Hubungi Kami
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Buka menu navigasi"
                size="icon"
                variant="outline"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              className="border-border bg-card px-6"
              side="right"
            >
              <SheetHeader className="px-0 pt-6">
                <SheetTitle asChild>
                  <div className="flex">
                    <TrustLensBrand />
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Navigasi mobile"
                className="mt-10 flex flex-col gap-2"
              >
                {siteConfig.navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-8 grid gap-3">
                <Button asChild variant="outline">
                  <Link href="/en">
                    English Version
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline">
                  <Link
                    href={siteConfig.productDemoUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Lihat Demo Produk
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>

                <Button asChild>
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
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}