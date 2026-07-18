import Link from "next/link";
import {
  ArrowUpRight,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InquiryStatusBadge } from "@/src/components/admin/inquiries/inquiry-status-badge";
import type { InvestorInquiryListItem } from "@/src/lib/investor-inquiries/get-inquiries";
import {
  getInterestTypeLabel,
  getInvestorTypeLabel,
} from "@/src/lib/investor-inquiries/inquiry-labels";

type InquiryTableProps = {
  inquiries: InvestorInquiryListItem[];
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    },
  ).format(value);
}

export function InquiryTable({
  inquiries,
}: InquiryTableProps) {
  if (inquiries.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-5 font-display text-lg font-bold">
          Inquiry tidak ditemukan
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Belum ada inquiry yang cocok dengan
          pencarian atau filter yang digunakan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-280 text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <tr>
            <th className="px-5 py-4 font-semibold">
              Kode
            </th>

            <th className="px-5 py-4 font-semibold">
              Investor
            </th>

            <th className="px-5 py-4 font-semibold">
              Perusahaan
            </th>

            <th className="px-5 py-4 font-semibold">
              Jenis Investor
            </th>

            <th className="px-5 py-4 font-semibold">
              Ketertarikan
            </th>

            <th className="px-5 py-4 font-semibold">
              Status
            </th>

            <th className="px-5 py-4 font-semibold">
              Tanggal Masuk
            </th>

            <th className="px-5 py-4 text-right font-semibold">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {inquiries.map((inquiry) => (
            <tr
              className="transition-colors hover:bg-muted/30"
              key={inquiry.id}
            >
              <td className="px-5 py-4 align-top">
                <Link
                  className="font-mono text-xs font-bold text-primary hover:underline"
                  href={`/admin/inquiries/${inquiry.inquiryCode}`}
                >
                  {inquiry.inquiryCode}
                </Link>
              </td>

              <td className="px-5 py-4 align-top">
                <p className="font-semibold">
                  {inquiry.fullName}
                </p>

                <p className="mt-1 max-w-52 break-all text-xs text-muted-foreground">
                  {inquiry.email}
                </p>
              </td>

              <td className="px-5 py-4 align-top">
                <p className="font-medium">
                  {inquiry.companyName}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {inquiry.jobTitle}
                </p>
              </td>

              <td className="px-5 py-4 align-top text-muted-foreground">
                {getInvestorTypeLabel(
                  inquiry.investorType,
                )}
              </td>

              <td className="px-5 py-4 align-top text-muted-foreground">
                {getInterestTypeLabel(
                  inquiry.interestType,
                )}
              </td>

              <td className="px-5 py-4 align-top">
                <InquiryStatusBadge
                  status={inquiry.status}
                />
              </td>

              <td className="px-5 py-4 align-top text-muted-foreground">
                {formatDateTime(
                  inquiry.createdAt,
                )}
              </td>

              <td className="px-5 py-4 text-right align-top">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                >
                  <Link
                    href={`/admin/inquiries/${inquiry.inquiryCode}`}
                  >
                    Detail
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}