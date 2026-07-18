import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Inbox,
  MailCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InquiryStatusBadge } from "@/src/components/admin/inquiries/inquiry-status-badge";
import { getDb } from "@/src/lib/db";
import { requireAdminSession } from "@/src/lib/auth-session";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    },
  ).format(value);
}

export default async function AdminPage() {
  const session =
    await requireAdminSession();

  const db = getDb();

  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    meetingScheduled,
    recentInquiries,
  ] = await Promise.all([
    db.investorInquiry.count(),

    db.investorInquiry.count({
      where: {
        status: "NEW",
      },
    }),

    db.investorInquiry.count({
      where: {
        status: "CONTACTED",
      },
    }),

    db.investorInquiry.count({
      where: {
        status: "MEETING_SCHEDULED",
      },
    }),

    db.investorInquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        inquiryCode: true,
        fullName: true,
        companyName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const statistics = [
    {
      label: "Total inquiry",
      value: totalInquiries,
      icon: UsersRound,
    },
    {
      label: "Inquiry baru",
      value: newInquiries,
      icon: Inbox,
    },
    {
      label: "Sudah dihubungi",
      value: contactedInquiries,
      icon: MailCheck,
    },
    {
      label: "Meeting terjadwal",
      value: meetingScheduled,
      icon: CalendarClock,
    },
  ] as const;

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Dashboard
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Selamat datang,{" "}
            {session.user.name}.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Pantau inquiry investor yang masuk
            melalui company profile TrustLens.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/inquiries">
            Lihat Semua Inquiry
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              key={statistic.label}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {statistic.label}
                  </p>

                  <p className="mt-3 font-display text-3xl font-extrabold">
                    {statistic.value}
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-xl font-bold">
              Inquiry terbaru
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Lima inquiry investor yang terakhir
              diterima.
            </p>
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
          >
            <Link href="/admin/inquiries">
              Lihat semua
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto size-10 text-muted-foreground" />

            <p className="mt-4 font-semibold">
              Belum ada inquiry
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Data investor akan muncul setelah
              form berhasil dikirim.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentInquiries.map(
              (inquiry) => (
                <article
                  className="grid gap-4 px-5 py-5 transition-colors hover:bg-muted/25 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                  key={inquiry.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        className="font-semibold hover:text-primary hover:underline"
                        href={`/admin/inquiries/${inquiry.inquiryCode}`}
                      >
                        {inquiry.fullName}
                      </Link>

                      <InquiryStatusBadge
                        status={inquiry.status}
                      />
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {inquiry.companyName}
                    </p>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {inquiry.email}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <Link
                      className="font-mono text-xs font-semibold text-primary hover:underline"
                      href={`/admin/inquiries/${inquiry.inquiryCode}`}
                    >
                      {inquiry.inquiryCode}
                    </Link>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(
                        inquiry.createdAt,
                      )}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}