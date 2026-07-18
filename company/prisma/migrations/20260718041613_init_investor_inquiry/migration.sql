-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('ANGEL_INVESTOR', 'VENTURE_CAPITAL', 'CORPORATE_VENTURE', 'FINANCIAL_INSTITUTION', 'STRATEGIC_PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentInterest" AS ENUM ('EQUITY_INVESTMENT', 'STRATEGIC_PARTNERSHIP', 'PILOT_COLLABORATION', 'TECHNOLOGY_PARTNERSHIP', 'ADVISORY', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentRange" AS ENUM ('BELOW_100_MILLION', 'BETWEEN_100_AND_500_MILLION', 'BETWEEN_500_MILLION_AND_1_BILLION', 'ABOVE_1_BILLION', 'NOT_DECIDED');

-- CreateEnum
CREATE TYPE "InvestorFocusArea" AS ENUM ('PRODUCT_DEVELOPMENT', 'AI_AND_DATA', 'INSTITUTIONAL_PILOT', 'BUSINESS_EXPANSION', 'SECURITY_AND_COMPLIANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestorInquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'MEETING_SCHEDULED', 'QUALIFIED', 'FOLLOW_UP', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'PROCESSING', 'GENERATED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'PARTIALLY_SENT', 'FAILED');

-- CreateTable
CREATE TABLE "investor_inquiries" (
    "id" TEXT NOT NULL,
    "inquiryCode" VARCHAR(32) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "companyName" VARCHAR(120) NOT NULL,
    "jobTitle" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "whatsapp" VARCHAR(30) NOT NULL,
    "country" VARCHAR(80) NOT NULL,
    "investorType" "InvestorType" NOT NULL,
    "interestType" "InvestmentInterest" NOT NULL,
    "investmentRange" "InvestmentRange" NOT NULL,
    "focusArea" "InvestorFocusArea" NOT NULL,
    "preferredMeetingDate" DATE,
    "message" TEXT NOT NULL,
    "consentAccepted" BOOLEAN NOT NULL,
    "status" "InvestorInquiryStatus" NOT NULL DEFAULT 'NEW',
    "documentStatus" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "emailStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "failureReason" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "internalEmailSentAt" TIMESTAMP(3),
    "investorEmailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investor_inquiries_inquiryCode_key" ON "investor_inquiries"("inquiryCode");

-- CreateIndex
CREATE INDEX "investor_inquiries_email_idx" ON "investor_inquiries"("email");

-- CreateIndex
CREATE INDEX "investor_inquiries_companyName_idx" ON "investor_inquiries"("companyName");

-- CreateIndex
CREATE INDEX "investor_inquiries_investorType_idx" ON "investor_inquiries"("investorType");

-- CreateIndex
CREATE INDEX "investor_inquiries_interestType_idx" ON "investor_inquiries"("interestType");

-- CreateIndex
CREATE INDEX "investor_inquiries_status_idx" ON "investor_inquiries"("status");

-- CreateIndex
CREATE INDEX "investor_inquiries_createdAt_idx" ON "investor_inquiries"("createdAt");
