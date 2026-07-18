import type { Metadata } from "next";
import {
  Inbox,
  Search,
} from "lucide-react";

import { InquiryFilters } from "@/src/components/admin/inquiries/inquiry-filters";
import { InquiryPagination } from "@/src/components/admin/inquiries/inquiry-pagination";
import { InquiryTable } from "@/src/components/admin/inquiries/inquiry-table";
import { getInvestorInquiries } from "@/src/lib/investor-inquiries/get-inquiries";
import { requireAdminSession } from "@/src/lib/auth-session";

export const metadata: Metadata = {
  title: "Investor Inquiries",
};

type InquiriesPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
  }>;
};

function getSingleSearchParam(
  value?: string | string[],
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export default async function InquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  await requireAdminSession();

  const params = await searchParams;

  const result =
    await getInvestorInquiries({
      page: getSingleSearchParam(
        params.page,
      ),

      search: getSingleSearchParam(
        params.search,
      ),

      status: getSingleSearchParam(
        params.status,
      ),
    });

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Investor Management
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Investor Inquiries
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Cari dan tinjau seluruh inquiry investor
            yang diterima melalui company profile
            TrustLens.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Inbox className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hasil ditemukan
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold">
              {
                result.pagination
                  .totalItems
              }
            </p>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <InquiryFilters
          search={result.filters.search}
          status={result.filters.status}
        />
      </section>

      {result.filters.search ||
      result.filters.status ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="size-4" />

          <span>
            Menampilkan hasil berdasarkan filter
            yang aktif.
          </span>
        </div>
      ) : null}

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <InquiryTable
          inquiries={result.items}
        />

        <InquiryPagination
          currentPage={
            result.pagination.currentPage
          }
          firstItem={
            result.pagination.firstItem
          }
          lastItem={
            result.pagination.lastItem
          }
          search={result.filters.search}
          status={result.filters.status}
          totalItems={
            result.pagination.totalItems
          }
          totalPages={
            result.pagination.totalPages
          }
        />
      </section>
    </div>
  );
}