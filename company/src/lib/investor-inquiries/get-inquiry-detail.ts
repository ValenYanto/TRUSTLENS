import "server-only";

import { getDb } from "@/src/lib/db";

export async function getInvestorInquiryByCode(
  inquiryCode: string,
) {
  const db = getDb();

  return db.investorInquiry.findUnique({
    where: {
      inquiryCode,
    },

    select: {
      id: true,
      inquiryCode: true,

      fullName: true,
      companyName: true,
      jobTitle: true,
      email: true,
      whatsapp: true,
      country: true,

      investorType: true,
      interestType: true,
      investmentRange: true,
      focusArea: true,

      preferredMeetingDate: true,
      message: true,
      consentAccepted: true,

      status: true,
      documentStatus: true,
      emailStatus: true,

      internalNotes: true,
      failureReason: true,

      pdfGeneratedAt: true,
      internalEmailSentAt: true,
      investorEmailSentAt: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

export type InvestorInquiryDetail =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getInvestorInquiryByCode
      >
    >
  >;