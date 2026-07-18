"use client";

import {
  useActionState,
  useEffect,
} from "react";
import {
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { updateInquiryNotesAction } from "@/src/actions/admin/inquiries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialInquiryActionState } from "@/src/lib/investor-inquiries/inquiry-action-state";

type InquiryNotesFormProps = {
  inquiryCode: string;
  internalNotes?: string | null;
};

export function InquiryNotesForm({
  inquiryCode,
  internalNotes,
}: InquiryNotesFormProps) {
  const [state, formAction, isPending] =
    useActionState(
      updateInquiryNotesAction,
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
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>

          <div>
            <CardTitle>
              Catatan Internal
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Catatan ini hanya dapat dilihat oleh
              admin TrustLens.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
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
            <Label htmlFor="internalNotes">
              Catatan tindak lanjut
            </Label>

            <Textarea
              className="min-h-44 resize-y"
              defaultValue={internalNotes ?? ""}
              disabled={isPending}
              id="internalNotes"
              maxLength={5000}
              name="internalNotes"
              placeholder="Contoh: Sudah dihubungi melalui WhatsApp, menunggu konfirmasi jadwal meeting..."
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Maksimal 5.000 karakter. Kosongkan
              seluruh isi untuk menghapus catatan.
            </p>
          </div>

          <div className="flex justify-end">
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
                  Simpan Catatan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}