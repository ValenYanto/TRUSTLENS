import type { Metadata } from "next";
import {
  CalendarClock,
  Inbox,
  MailCheck,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    },
  ).format(value);
}

function getStatusLabel(
  status: string,
) {
  switch (status) {
    case "NEW":
      return "Baru";

    case "CONTACTED":
      return "Sudah Dihubungi";

    case "MEETING_SCHEDULED":
      return "Meeting Terjadwal";

    case "QUALIFIED":
      return "Qualified";

    case "FOLLOW_UP":
      return "Follow Up";

    case "CLOSED":
      return "Selesai";

    case "REJECTED":
      return "Ditolak";

    default:
      return status;
  }
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "outline" {
  if (status === "NEW") {
    return "default";
  }

  if (
    status === "CONTACTED" ||
    status === "MEETING_SCHEDULED"
  ) {
    return "secondary";
  }

  return "outline";
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
        <div className="border-b border-border px-5 py-5 sm:px-6">
          <h2 className="font-display text-xl font-bold">
            Inquiry terbaru
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Lima inquiry investor yang terakhir
            diterima.
          </p>
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
                  className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                  key={inquiry.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {inquiry.fullName}
                      </p>

                      <Badge
                        variant={getStatusVariant(
                          inquiry.status,
                        )}
                      >
                        {getStatusLabel(
                          inquiry.status,
                        )}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {inquiry.companyName}
                    </p>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {inquiry.email}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-mono text-xs font-semibold text-primary">
                      {inquiry.inquiryCode}
                    </p>

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

      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="font-semibold">
          Tahap selanjutnya
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Halaman daftar inquiry, detail investor,
          perubahan status, pencatatan internal,
          filter, pencarian, dan pagination akan
          dibuat pada stage berikutnya.
        </p>
      </div>
    </div>
  );
}