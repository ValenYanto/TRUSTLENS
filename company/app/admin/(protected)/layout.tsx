import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import { AdminSignOutButton } from "@/src/components/admin/admin-sign-out-button";
import { ModeToggle } from "@/src/components/theme/mode-toggle";
import { requireAdminSession } from "@/src/lib/auth-session";
import { Button } from "@/components/ui/button";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await requireAdminSession();

  return (
    <div className="min-h-screen bg-muted/25">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            className="flex min-w-0 items-center gap-3"
            href="/admin"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-black p-1">
              <Image
                alt="TrustLens"
                className="size-full rounded-lg object-cover"
                height={36}
                src="/logo-trustlens.png"
                width={36}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-display font-extrabold">
                TrustLens Admin
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Investor Management
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="hidden sm:inline-flex"
              size="sm"
              variant="ghost"
            >
              <Link
                href="/"
                target="_blank"
              >
                Website
                <ExternalLink className="size-4" />
              </Link>
            </Button>

            <ModeToggle />

            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-border bg-card p-3">
              <Link
                className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
                href="/admin"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />

                <p className="text-sm font-semibold">
                  ADMIN
                </p>
              </div>

              <p className="mt-3 truncate text-sm font-medium">
                {session.user.name}
              </p>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}