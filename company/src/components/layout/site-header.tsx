import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Menu,
  MessageCircle,
} from "lucide-react";

import { BrandLogo } from "@/src/components/shared/brand-logo";
import { Container } from "@/src/components/shared/container";
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

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between">
        <Link
          aria-label="Kembali ke halaman utama TrustLens"
          href="/"
        >
          <BrandLogo />
        </Link>

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

        <Sheet>
          <SheetTrigger asChild>
            <Button
              aria-label="Buka menu navigasi"
              className="lg:hidden"
              size="icon"
              variant="outline"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent className="border-border bg-card px-6" side="right">
            <SheetHeader className="px-0 pt-6">
              <SheetTitle>
                <BrandLogo />
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
      </Container>
    </header>
  );
}