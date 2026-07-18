"use client";

import {
  useActionState,
  useEffect,
} from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { updateInquiryStatusAction } from "@/src/actions/admin/inquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InquiryStatusBadge } from "@/src/components/admin/inquiries/inquiry-status-badge";
import {
  initialInquiryActionState,
} from "@/src/lib/investor-inquiries/inquiry-action-state";
import {
  getDocumentStatusLabel,
  getEmailStatusLabel,
  inquiryStatusOptions,
} from "@/src/lib/investor-inquiries/inquiry-labels";

type InquiryStatusFormProps = {
  inquiryCode: string;
  currentStatus: string;
  documentStatus: string;
  emailStatus: string;
  consentAccepted: boolean;
  failureReason?: string | null;
};

export function InquiryStatusForm({
  inquiryCode,
  currentStatus,
  documentStatus,
  emailStatus,
  consentAccepted,
  failureReason,
}: InquiryStatusFormProps) {
  const [state, formAction, isPending] =
    useActionState(
      updateInquiryStatusAction,
      initialInquiryActionState,
    );

  useEffect(() => {
    if (!state.actionId) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message, {
        duration: 2000,
      });

      return;
    }

    if (state.status === "error") {
      toast.error(state.message, {
        duration: 2000,
      });
    }
  }, [
    state.actionId,
    state.message,
    state.status,
  ]);

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">
          Status Inquiry
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Status saat ini
          </p>

          <InquiryStatusBadge
            className="mt-3"
            status={currentStatus}
          />
        </div>

        <form
          action={formAction}
          className="grid gap-4"
        >
          <input
            name="inquiryCode"
            type="hidden"
            value={inquiryCode}
          />

          <div className="grid gap-2">
            <Label htmlFor="inquiry-status">
              Ubah status
            </Label>

            <select
              className="flex h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              defaultValue={currentStatus}
              disabled={isPending}
              id="inquiry-status"
              key={currentStatus}
              name="status"
            >
              {inquiryStatusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <Button
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Simpan Status
              </>
            )}
          </Button>
        </form>

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
                documentStatus,
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
                emailStatus,
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
                consentAccepted
                  ? "default"
                  : "destructive"
              }
            >
              {consentAccepted
                ? "Disetujui"
                : "Tidak"}
            </Badge>
          </div>
        </div>

        {failureReason ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-destructive">
              Failure reason
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {failureReason}
            </p>
          </div>
        ) : null}

        <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted-foreground">
            Perubahan status akan langsung tampil
            pada dashboard dan daftar inquiry.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}