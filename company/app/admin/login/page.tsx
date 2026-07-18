import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/src/components/admin/admin-login-form";
import {
  getCurrentSession,
  hasAdminRole,
} from "@/src/lib/auth-session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Login dashboard internal TrustLens.",
};

export default async function AdminLoginPage() {
  const session =
    await getCurrentSession();

  if (
    session &&
    hasAdminRole(session.user.role)
  ) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute -left-48 -top-32 size-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-brand-blue/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Button
          asChild
          className="mb-5"
          variant="ghost"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Kembali ke website
          </Link>
        </Button>

        <Card className="overflow-hidden border-border bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur">
          <CardHeader className="items-center border-b border-border pb-7 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-black p-1 shadow-lg">
              <Image
                alt="TrustLens"
                className="size-full rounded-xl object-cover"
                height={56}
                priority
                src="/logo-trustlens.png"
                width={56}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="size-5 text-primary" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Secure Access
                </p>
              </div>

              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em]">
                TrustLens Admin
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Masuk untuk mengelola inquiry
                investor dan operasional website.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}