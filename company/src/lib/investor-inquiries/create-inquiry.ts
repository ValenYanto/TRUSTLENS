import { getDb } from "@/src/lib/db";
import { generateInquiryCode } from "@/src/lib/investor-inquiries/generate-inquiry-code";
import type { InvestorInquiryInput } from "@/src/lib/validations/investor-inquiry";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeWhatsapp(value: string) {
  const cleaned = value
    .trim()
    .replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("62")) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith("0")) {
    return `+62${cleaned.slice(1)}`;
  }

  return cleaned;
}

function parseMeetingDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function createInvestorInquiry(
  input: InvestorInquiryInput,
) {
  const db = getDb();

  const inquiry = await db.investorInquiry.create({
    data: {
      inquiryCode: generateInquiryCode(),

      fullName: input.fullName.trim(),
      companyName: input.companyName.trim(),
      jobTitle: input.jobTitle.trim(),

      email: normalizeEmail(input.email),
      whatsapp: normalizeWhatsapp(
        input.whatsapp,
      ),

      country: input.country.trim(),

      investorType: input.investorType,
      interestType: input.interestType,
      investmentRange: input.investmentRange,
      focusArea: input.focusArea,

      preferredMeetingDate:
        parseMeetingDate(
          input.preferredMeetingDate,
        ),

      message: input.message.trim(),
      consentAccepted:
        input.consentAccepted,
    },

    select: {
      inquiryCode: true,
      createdAt: true,
    },
  });

  return inquiry;
}