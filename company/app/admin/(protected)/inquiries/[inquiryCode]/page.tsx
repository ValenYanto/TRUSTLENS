import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Hash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InquiryDetailCard } from "@/src/components/admin/inquiries/inquiry-detail-card";
import { InquiryStatusBadge } from "@/src/components/admin/inquiries/inquiry-status-badge";
import { requireAdminSession } from "@/src/lib/auth-session";
import { getInvestorInquiryByCode } from "@/src/lib/investor-inquiries/get-inquiry-detail";

type InquiryDetailPageProps = {
  params: Promise<{
    inquiryCode: string;
  }>;
};

export async function generateMetadata({
  params,
}: InquiryDetailPageProps): Promise<Metadata> {
  const { inquiryCode } = await params;

  return {
    title: `Inquiry ${inquiryCode}`,
  };
}

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  await requireAdminSession();

  const { inquiryCode } = await params;

  const inquiry =
    await getInvestorInquiryByCode(
      inquiryCode,
    );

  if (!inquiry) {
    notFound();
  }

  return (
    <div>
      <Button
        asChild
        className="mb-6"
        variant="ghost"
      >
        <Link href="/admin/inquiries">
          <ArrowLeft className="size-4" />
          Kembali ke daftar inquiry
        </Link>
      </Button>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Inquiry Detail
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            {inquiry.fullName}
          </h1>

          <p className="mt-3 text-muted-foreground">
            {inquiry.companyName}
            {" · "}
            {inquiry.jobTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 font-mono text-xs font-bold text-primary">
            <Hash className="size-4" />
            {inquiry.inquiryCode}
          </div>

          <InquiryStatusBadge
            status={inquiry.status}
          />
        </div>
      </div>

      <section className="mt-8">
        <InquiryDetailCard
          inquiry={inquiry}
        />
      </section>
    </div>
  );
}