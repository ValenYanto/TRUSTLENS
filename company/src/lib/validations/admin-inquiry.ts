import { z } from "zod";

import { inquiryStatusValues } from "@/src/lib/investor-inquiries/inquiry-labels";

const inquiryCodeSchema = z
  .string()
  .trim()
  .min(1, "Kode inquiry wajib tersedia.")
  .max(32, "Kode inquiry tidak valid.");

export const updateInquiryStatusSchema = z.object({
  inquiryCode: inquiryCodeSchema,

  status: z.enum(inquiryStatusValues, {
    message: "Status inquiry tidak valid.",
  }),
});

export const updateInquiryNotesSchema = z.object({
  inquiryCode: inquiryCodeSchema,

  internalNotes: z
    .string()
    .trim()
    .max(
      5000,
      "Catatan internal maksimal 5.000 karakter.",
    ),
});