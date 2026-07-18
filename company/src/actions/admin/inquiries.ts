"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/src/lib/auth-session";
import { getDb } from "@/src/lib/db";
import type { InquiryActionState } from "@/src/lib/investor-inquiries/inquiry-action-state";
import {
  updateInquiryNotesSchema,
  updateInquiryStatusSchema,
} from "@/src/lib/validations/admin-inquiry";

function createActionState(
  status: InquiryActionState["status"],
  message: string,
): InquiryActionState {
  return {
    status,
    message,
    actionId: randomUUID(),
  };
}

function revalidateInquiryPages(
  inquiryCode: string,
) {
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");

  revalidatePath(
    `/admin/inquiries/${inquiryCode}`,
  );
}

export async function updateInquiryStatusAction(
  previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  void previousState;

  await requireAdminSession();

  const validationResult =
    updateInquiryStatusSchema.safeParse({
      inquiryCode: formData.get("inquiryCode"),
      status: formData.get("status"),
    });

  if (!validationResult.success) {
    return createActionState(
      "error",
      validationResult.error.issues[0]?.message ??
        "Data status inquiry tidak valid.",
    );
  }

  const { inquiryCode, status } =
    validationResult.data;

  try {
    const db = getDb();

    const result =
      await db.investorInquiry.updateMany({
        where: {
          inquiryCode,
        },

        data: {
          status,
        },
      });

    if (result.count === 0) {
      return createActionState(
        "error",
        "Inquiry tidak ditemukan.",
      );
    }

    revalidateInquiryPages(inquiryCode);

    return createActionState(
      "success",
      "Status inquiry berhasil diperbarui.",
    );
  } catch (error) {
    console.error(
      "[updateInquiryStatusAction]",
      error,
    );

    return createActionState(
      "error",
      "Status inquiry belum dapat diperbarui.",
    );
  }
}

export async function updateInquiryNotesAction(
  previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  void previousState;

  await requireAdminSession();

  const validationResult =
    updateInquiryNotesSchema.safeParse({
      inquiryCode: formData.get("inquiryCode"),

      internalNotes:
        formData.get("internalNotes") ?? "",
    });

  if (!validationResult.success) {
    return createActionState(
      "error",
      validationResult.error.issues[0]?.message ??
        "Catatan internal tidak valid.",
    );
  }

  const { inquiryCode, internalNotes } =
    validationResult.data;

  try {
    const db = getDb();

    const result =
      await db.investorInquiry.updateMany({
        where: {
          inquiryCode,
        },

        data: {
          internalNotes:
            internalNotes.length > 0
              ? internalNotes
              : null,
        },
      });

    if (result.count === 0) {
      return createActionState(
        "error",
        "Inquiry tidak ditemukan.",
      );
    }

    revalidateInquiryPages(inquiryCode);

    return createActionState(
      "success",
      internalNotes
        ? "Catatan internal berhasil disimpan."
        : "Catatan internal berhasil dikosongkan.",
    );
  } catch (error) {
    console.error(
      "[updateInquiryNotesAction]",
      error,
    );

    return createActionState(
      "error",
      "Catatan internal belum dapat disimpan.",
    );
  }
}