export const inquiryStatusValues = [
  "NEW",
  "CONTACTED",
  "MEETING_SCHEDULED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CLOSED",
  "REJECTED",
] as const;

export type InquiryStatusValue =
  (typeof inquiryStatusValues)[number];

export const inquiryStatusOptions: readonly {
  value: InquiryStatusValue;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "Baru",
  },
  {
    value: "CONTACTED",
    label: "Sudah Dihubungi",
  },
  {
    value: "MEETING_SCHEDULED",
    label: "Meeting Terjadwal",
  },
  {
    value: "QUALIFIED",
    label: "Qualified",
  },
  {
    value: "FOLLOW_UP",
    label: "Follow Up",
  },
  {
    value: "CLOSED",
    label: "Selesai",
  },
  {
    value: "REJECTED",
    label: "Ditolak",
  },
];

const investorTypeLabels: Record<string, string> = {
  ANGEL_INVESTOR: "Angel Investor",
  VENTURE_CAPITAL: "Venture Capital",
  CORPORATE_VENTURE: "Corporate Venture",
  FINANCIAL_INSTITUTION: "Institusi Keuangan",
  STRATEGIC_PARTNER: "Strategic Partner",
  OTHER: "Lainnya",
};

const interestTypeLabels: Record<string, string> = {
  EQUITY_INVESTMENT: "Equity Investment",
  STRATEGIC_PARTNERSHIP: "Strategic Partnership",
  PILOT_COLLABORATION: "Pilot Collaboration",
  TECHNOLOGY_PARTNERSHIP:
    "Technology Partnership",
  ADVISORY: "Advisory atau Mentorship",
  OTHER: "Lainnya",
};

const investmentRangeLabels: Record<
  string,
  string
> = {
  BELOW_100_MILLION:
    "Di bawah Rp100 juta",
  BETWEEN_100_AND_500_MILLION:
    "Rp100 juta – Rp500 juta",
  BETWEEN_500_MILLION_AND_1_BILLION:
    "Rp500 juta – Rp1 miliar",
  ABOVE_1_BILLION:
    "Di atas Rp1 miliar",
  NOT_DECIDED: "Belum ditentukan",
};

const focusAreaLabels: Record<string, string> = {
  PRODUCT_DEVELOPMENT:
    "Pengembangan Produk",
  AI_AND_DATA:
    "AI dan Data Infrastructure",
  INSTITUTIONAL_PILOT:
    "Institutional Pilot",
  BUSINESS_EXPANSION:
    "Ekspansi Bisnis",
  SECURITY_AND_COMPLIANCE:
    "Security dan Compliance",
  OTHER: "Lainnya",
};

const documentStatusLabels: Record<
  string,
  string
> = {
  PENDING: "Menunggu",
  PROCESSING: "Diproses",
  GENERATED: "Sudah Dibuat",
  FAILED: "Gagal",
};

const emailStatusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  PROCESSING: "Diproses",
  SENT: "Terkirim",
  PARTIALLY_SENT: "Terkirim Sebagian",
  FAILED: "Gagal",
};

export function isInquiryStatus(
  value?: string,
): value is InquiryStatusValue {
  return inquiryStatusValues.includes(
    value as InquiryStatusValue,
  );
}

export function getInquiryStatusLabel(
  value: string,
) {
  return (
    inquiryStatusOptions.find(
      (option) => option.value === value,
    )?.label ?? value
  );
}

export function getInvestorTypeLabel(
  value: string,
) {
  return investorTypeLabels[value] ?? value;
}

export function getInterestTypeLabel(
  value: string,
) {
  return interestTypeLabels[value] ?? value;
}

export function getInvestmentRangeLabel(
  value: string,
) {
  return investmentRangeLabels[value] ?? value;
}

export function getFocusAreaLabel(
  value: string,
) {
  return focusAreaLabels[value] ?? value;
}

export function getDocumentStatusLabel(
  value: string,
) {
  return documentStatusLabels[value] ?? value;
}

export function getEmailStatusLabel(
  value: string,
) {
  return emailStatusLabels[value] ?? value;
}