import Link from "next/link";
import {
  ExternalLink,
  Mail,
  MessageCircle,
} from "lucide-react";

import { BrandLogo } from "@/src/components/shared/brand-logo";
import { Container } from "@/src/components/shared/container";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/src/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/30">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <BrandLogo />

            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Fraud intelligence berbasis graph untuk membantu membangun
              ekosistem keuangan digital yang lebih aman dan tepercaya.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <Link
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              href={siteConfig.productDemoUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-4" />
              Demo produk
            </Link>

            <Link
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              href={siteConfig.whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Link>

            <Link
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              href="mailto:trustlens.fraud@gmail.com"
            >
              <Mail className="size-4" />
              trustlens.fraud@gmail.com
            </Link>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TrustLens. Seluruh hak dilindungi.
          </p>

          <p>
            Dibangun untuk keamanan finansial yang lebih cerdas.
          </p>
        </div>
      </Container>
    </footer>
  );
}