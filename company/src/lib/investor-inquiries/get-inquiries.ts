import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { getDb } from "@/src/lib/db";
import {
  isInquiryStatus,
  type InquiryStatusValue,
} from "@/src/lib/investor-inquiries/inquiry-labels";

export const INQUIRY_PAGE_SIZE = 10;

type GetInvestorInquiriesInput = {
  page?: string;
  search?: string;
  status?: string;
};

function parsePage(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return 1;
  }

  return parsed;
}

function normalizeSearch(value?: string) {
  return value?.trim().slice(0, 100) ?? "";
}

function normalizeStatus(
  value?: string,
): InquiryStatusValue | undefined {
  return isInquiryStatus(value)
    ? value
    : undefined;
}

export async function getInvestorInquiries({
  page,
  search,
  status,
}: GetInvestorInquiriesInput) {
  const db = getDb();

  const requestedPage = parsePage(page);
  const normalizedSearch =
    normalizeSearch(search);
  const normalizedStatus =
    normalizeStatus(status);

  const where: Prisma.InvestorInquiryWhereInput =
    {
      ...(normalizedStatus
        ? {
            status: normalizedStatus,
          }
        : {}),

      ...(normalizedSearch
        ? {
            OR: [
              {
                inquiryCode: {
                  contains:
                    normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                fullName: {
                  contains:
                    normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                companyName: {
                  contains:
                    normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains:
                    normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                whatsapp: {
                  contains:
                    normalizedSearch,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

  const totalItems =
    await db.investorInquiry.count({
      where,
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / INQUIRY_PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages,
  );

  const items =
    await db.investorInquiry.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      skip:
        (currentPage - 1) *
        INQUIRY_PAGE_SIZE,

      take: INQUIRY_PAGE_SIZE,

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
        status: true,
        createdAt: true,
      },
    });

  return {
    items,

    filters: {
      search: normalizedSearch,
      status: normalizedStatus,
    },

    pagination: {
      currentPage,
      pageSize: INQUIRY_PAGE_SIZE,
      totalItems,
      totalPages,
      firstItem:
        totalItems === 0
          ? 0
          : (currentPage - 1) *
              INQUIRY_PAGE_SIZE +
            1,
      lastItem: Math.min(
        currentPage * INQUIRY_PAGE_SIZE,
        totalItems,
      ),
    },
  };
}

export type InvestorInquiryListResult =
  Awaited<
    ReturnType<typeof getInvestorInquiries>
  >;

export type InvestorInquiryListItem =
  InvestorInquiryListResult["items"][number];