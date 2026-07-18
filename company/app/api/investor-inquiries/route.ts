import { NextResponse } from "next/server";

import { createInvestorInquiry } from "@/src/lib/investor-inquiries/create-inquiry";
import { investorInquirySchema } from "@/src/lib/validations/investor-inquiry";

export const runtime = "nodejs";

export async function POST(
  request: Request,
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Format permintaan tidak valid.",
      },
      {
        status: 400,
      },
    );
  }

  const validationResult =
    investorInquirySchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Data inquiry belum lengkap atau tidak valid.",
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      },
      {
        status: 422,
      },
    );
  }

  const { website, ...inquiryData } =
    validationResult.data;

  if (website) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Permintaan tidak dapat diproses.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const inquiry =
      await createInvestorInquiry(
        inquiryData,
      );

    return NextResponse.json(
      {
        success: true,
        data: {
          inquiryCode:
            inquiry.inquiryCode,
          createdAt:
            inquiry.createdAt.toISOString(),
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "[POST /api/investor-inquiries]",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Inquiry belum dapat disimpan. Silakan coba kembali.",
      },
      {
        status: 500,
      },
    );
  }
}