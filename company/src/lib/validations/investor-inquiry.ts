import { z } from "zod";

export const investorTypeValues = [
  "ANGEL_INVESTOR",
  "VENTURE_CAPITAL",
  "CORPORATE_VENTURE",
  "FINANCIAL_INSTITUTION",
  "STRATEGIC_PARTNER",
  "OTHER",
] as const;

export const interestTypeValues = [
  "EQUITY_INVESTMENT",
  "STRATEGIC_PARTNERSHIP",
  "PILOT_COLLABORATION",
  "TECHNOLOGY_PARTNERSHIP",
  "ADVISORY",
  "OTHER",
] as const;

export const investmentRangeValues = [
  "BELOW_100_MILLION",
  "BETWEEN_100_AND_500_MILLION",
  "BETWEEN_500_MILLION_AND_1_BILLION",
  "ABOVE_1_BILLION",
  "NOT_DECIDED",
] as const;

export const focusAreaValues = [
  "PRODUCT_DEVELOPMENT",
  "AI_AND_DATA",
  "INSTITUTIONAL_PILOT",
  "BUSINESS_EXPANSION",
  "SECURITY_AND_COMPLIANCE",
  "OTHER",
] as const;

export const investorTypeOptions = [
  {
    value: "ANGEL_INVESTOR",
    label: "Angel Investor",
  },
  {
    value: "VENTURE_CAPITAL",
    label: "Venture Capital",
  },
  {
    value: "CORPORATE_VENTURE",
    label: "Corporate Venture",
  },
  {
    value: "FINANCIAL_INSTITUTION",
    label: "Institusi Keuangan",
  },
  {
    value: "STRATEGIC_PARTNER",
    label: "Strategic Partner",
  },
  {
    value: "OTHER",
    label: "Lainnya",
  },
] as const;

export const interestTypeOptions = [
  {
    value: "EQUITY_INVESTMENT",
    label: "Equity Investment",
  },
  {
    value: "STRATEGIC_PARTNERSHIP",
    label: "Strategic Partnership",
  },
  {
    value: "PILOT_COLLABORATION",
    label: "Pilot Collaboration",
  },
  {
    value: "TECHNOLOGY_PARTNERSHIP",
    label: "Technology Partnership",
  },
  {
    value: "ADVISORY",
    label: "Advisory atau Mentorship",
  },
  {
    value: "OTHER",
    label: "Lainnya",
  },
] as const;

export const investmentRangeOptions = [
  {
    value: "BELOW_100_MILLION",
    label: "Di bawah Rp100 juta",
  },
  {
    value: "BETWEEN_100_AND_500_MILLION",
    label: "Rp100 juta – Rp500 juta",
  },
  {
    value: "BETWEEN_500_MILLION_AND_1_BILLION",
    label: "Rp500 juta – Rp1 miliar",
  },
  {
    value: "ABOVE_1_BILLION",
    label: "Di atas Rp1 miliar",
  },
  {
    value: "NOT_DECIDED",
    label: "Belum ditentukan",
  },
] as const;

export const focusAreaOptions = [
  {
    value: "PRODUCT_DEVELOPMENT",
    label: "Pengembangan produk",
  },
  {
    value: "AI_AND_DATA",
    label: "AI dan data infrastructure",
  },
  {
    value: "INSTITUTIONAL_PILOT",
    label: "Institutional pilot",
  },
  {
    value: "BUSINESS_EXPANSION",
    label: "Ekspansi bisnis",
  },
  {
    value: "SECURITY_AND_COMPLIANCE",
    label: "Security dan compliance",
  },
  {
    value: "OTHER",
    label: "Lainnya",
  },
] as const;

export const investorInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal terdiri dari 2 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),

  companyName: z
    .string()
    .trim()
    .min(2, "Nama perusahaan atau fund wajib diisi.")
    .max(120, "Nama perusahaan maksimal 120 karakter."),

  jobTitle: z
    .string()
    .trim()
    .min(2, "Jabatan wajib diisi.")
    .max(100, "Jabatan maksimal 100 karakter."),

  email: z
    .string()
    .trim()
    .email("Masukkan alamat email yang valid.")
    .max(150, "Alamat email maksimal 150 karakter."),

  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp terlalu pendek.")
    .max(25, "Nomor WhatsApp terlalu panjang.")
    .regex(
      /^[+]?[\d\s()-]+$/,
      "Nomor WhatsApp hanya boleh berisi angka dan simbol telepon.",
    ),

  country: z
    .string()
    .trim()
    .min(2, "Negara wajib diisi.")
    .max(80, "Nama negara maksimal 80 karakter."),

  investorType: z.enum(investorTypeValues, {
    message: "Pilih jenis investor.",
  }),

  interestType: z.enum(interestTypeValues, {
    message: "Pilih jenis ketertarikan.",
  }),

  investmentRange: z.enum(investmentRangeValues, {
    message: "Pilih kisaran investasi.",
  }),

  focusArea: z.enum(focusAreaValues, {
    message: "Pilih fokus ketertarikan.",
  }),

  preferredMeetingDate: z
    .string()
    .max(20, "Format tanggal tidak valid.")
    .optional(),

  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal terdiri dari 10 karakter.")
    .max(2000, "Pesan maksimal 2.000 karakter."),

  consentAccepted: z.boolean().refine((value) => value, {
    message: "Persetujuan pemrosesan data wajib diberikan.",
  }),
});

export type InvestorInquiryInput = z.input<
  typeof investorInquirySchema
>;