import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Globe2,
  Mail,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InquiryStatusBadge } from "@/src/components/admin/inquiries/inquiry-status-badge";
import type { InvestorInquiryDetail } from "@/src/lib/investor-inquiries/get-inquiry-detail";
import {
  getDocumentStatusLabel,
  getEmailStatusLabel,
  getFocusAreaLabel,
  getInterestTypeLabel,
  getInvestmentRangeLabel,
  getInvestorTypeLabel,
} from "@/src/lib/investor-inquiries/inquiry-labels";

type InquiryDetailCardProps = {
  inquiry: InvestorInquiryDetail;
};

function formatDate(
  value?: Date | null,
) {
  if (!value) {
    return "Belum ditentukan";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "long",
      timeZone: "Asia/Jakarta",
    },
  ).format(value);
}

function formatDateTime(
  value?: Date | null,
) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    },
  ).format(value);
}

function DetailItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={
        fullWidth
          ? "sm:col-span-2"
          : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm font-medium leading-6">
        {value || "-"}
      </p>
    </div>
  );
}

export function InquiryDetailCard({
  inquiry,
}: InquiryDetailCardProps) {
  const whatsappNumber =
    inquiry.whatsapp.replace(/\D/g, "");

  const whatsappMessage =
    encodeURIComponent(
      `Halo ${inquiry.fullName}, kami dari tim TrustLens ingin menindaklanjuti inquiry dengan kode ${inquiry.inquiryCode}.`,
    );

  const emailSubject =
    encodeURIComponent(
      `Tindak Lanjut Inquiry ${inquiry.inquiryCode}`,
    );

  const emailBody =
    encodeURIComponent(
      `Halo ${inquiry.fullName},\n\nKami dari tim TrustLens ingin menindaklanjuti inquiry investasi dengan kode ${inquiry.inquiryCode}.\n\nTerima kasih.`,
    );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="grid gap-6">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <UserRound className="size-5 text-primary" />
              </div>

              <div>
                <CardTitle>
                  Informasi Investor
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Identitas dan informasi institusi.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <DetailItem
              label="Nama lengkap"
              value={inquiry.fullName}
            />

            <DetailItem
              label="Jabatan"
              value={inquiry.jobTitle}
            />

            <DetailItem
              label="Perusahaan atau fund"
              value={inquiry.companyName}
            />

            <DetailItem
              label="Negara"
              value={inquiry.country}
            />

            <DetailItem
              label="Email"
              value={inquiry.email}
            />

            <DetailItem
              label="WhatsApp"
              value={inquiry.whatsapp}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <CircleDollarSign className="size-5 text-primary" />
              </div>

              <div>
                <CardTitle>
                  Ketertarikan Investasi
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Profil investasi dan bentuk kerja
                  sama yang dipertimbangkan.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <DetailItem
              label="Jenis investor"
              value={getInvestorTypeLabel(
                inquiry.investorType,
              )}
            />

            <DetailItem
              label="Jenis ketertarikan"
              value={getInterestTypeLabel(
                inquiry.interestType,
              )}
            />

            <DetailItem
              label="Kisaran investasi"
              value={getInvestmentRangeLabel(
                inquiry.investmentRange,
              )}
            />

            <DetailItem
              label="Fokus ketertarikan"
              value={getFocusAreaLabel(
                inquiry.focusArea,
              )}
            />

            <DetailItem
              label="Preferensi tanggal diskusi"
              value={formatDate(
                inquiry.preferredMeetingDate,
              )}
              fullWidth
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <NotebookPen className="size-5 text-primary" />
              </div>

              <div>
                <CardTitle>
                  Pesan Investor
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pesan yang dikirim melalui form
                  investor.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-muted-foreground">
              {inquiry.message}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>

              <div>
                <CardTitle>
                  Catatan Internal
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Catatan ini hanya terlihat oleh
                  admin.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-muted-foreground">
              {inquiry.internalNotes ||
                "Belum ada catatan internal."}
            </p>

            <p className="mt-5 text-xs text-muted-foreground">
              Catatan internal dapat diperbarui pada
              Stage 6B.
            </p>
          </CardContent>
        </Card>
      </div>

      <aside className="grid h-fit gap-6 xl:sticky xl:top-24">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">
              Status Inquiry
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Status saat ini
              </p>

              <InquiryStatusBadge
                className="mt-3"
                status={inquiry.status}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />

                  <span className="text-sm">
                    Dokumen PDF
                  </span>
                </div>

                <Badge variant="secondary">
                  {getDocumentStatusLabel(
                    inquiry.documentStatus,
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />

                  <span className="text-sm">
                    Pengiriman Email
                  </span>
                </div>

                <Badge variant="secondary">
                  {getEmailStatusLabel(
                    inquiry.emailStatus,
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />

                  <span className="text-sm">
                    Persetujuan Data
                  </span>
                </div>

                <Badge
                  variant={
                    inquiry.consentAccepted
                      ? "default"
                      : "destructive"
                  }
                >
                  {inquiry.consentAccepted
                    ? "Disetujui"
                    : "Tidak"}
                </Badge>
              </div>
            </div>

            {inquiry.failureReason ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-destructive">
                  Failure reason
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {inquiry.failureReason}
                </p>
              </div>
            ) : null}

            <p className="text-xs leading-5 text-muted-foreground">
              Perubahan status tersedia pada Stage
              6B.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">
              Hubungi Investor
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3 pt-6">
            <Button asChild>
              <Link
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="size-4" />
                Hubungi via WhatsApp
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
            >
              <Link
                href={`mailto:${inquiry.email}?subject=${emailSubject}&body=${emailBody}`}
              >
                <Mail className="size-4" />
                Kirim Email
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">
              Informasi Sistem
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 pt-6">
            <div className="flex items-start gap-3">
              <Globe2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <DetailItem
                label="Kode inquiry"
                value={inquiry.inquiryCode}
              />
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <DetailItem
                label="Dibuat"
                value={formatDateTime(
                  inquiry.createdAt,
                )}
              />
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <DetailItem
                label="Terakhir diperbarui"
                value={formatDateTime(
                  inquiry.updatedAt,
                )}
              />
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <DetailItem
                label="Internal email terkirim"
                value={formatDateTime(
                  inquiry.internalEmailSentAt,
                )}
              />
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <DetailItem
                label="Investor email terkirim"
                value={formatDateTime(
                  inquiry.investorEmailSentAt,
                )}
              />
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}