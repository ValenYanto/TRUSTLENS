import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InquiryPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  firstItem: number;
  lastItem: number;
  search: string;
  status?: string;
};

function buildPageHref({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status?: string;
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (search) {
    params.set("search", search);
  }

  if (status) {
    params.set("status", status);
  }

  const query = params.toString();

  return query
    ? `/admin/inquiries?${query}`
    : "/admin/inquiries";
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
) {
  const start = Math.max(
    1,
    currentPage - 2,
  );

  const end = Math.min(
    totalPages,
    currentPage + 2,
  );

  return Array.from(
    {
      length: end - start + 1,
    },
    (_, index) => start + index,
  );
}

export function InquiryPagination({
  currentPage,
  totalPages,
  totalItems,
  firstItem,
  lastItem,
  search,
  status,
}: InquiryPaginationProps) {
  const visiblePages = getVisiblePages(
    currentPage,
    totalPages,
  );

  return (
    <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {firstItem}
        </span>
        {" – "}
        <span className="font-semibold text-foreground">
          {lastItem}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-foreground">
          {totalItems}
        </span>{" "}
        inquiry
      </p>

      <nav
        aria-label="Pagination inquiry"
        className="flex items-center gap-1"
      >
        <Button
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
          size="icon-sm"
          variant="outline"
        >
          {currentPage > 1 ? (
            <Link
              aria-label="Halaman sebelumnya"
              href={buildPageHref({
                page: currentPage - 1,
                search,
                status,
              })}
            >
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </Button>

        {visiblePages.map((page) => (
          <Button
            asChild
            className={cn(
              page === currentPage &&
                "pointer-events-none",
            )}
            key={page}
            size="icon-sm"
            variant={
              page === currentPage
                ? "default"
                : "outline"
            }
          >
            <Link
              aria-current={
                page === currentPage
                  ? "page"
                  : undefined
              }
              href={buildPageHref({
                page,
                search,
                status,
              })}
            >
              {page}
            </Link>
          </Button>
        ))}

        <Button
          asChild={
            currentPage < totalPages
          }
          disabled={
            currentPage >= totalPages
          }
          size="icon-sm"
          variant="outline"
        >
          {currentPage < totalPages ? (
            <Link
              aria-label="Halaman berikutnya"
              href={buildPageHref({
                page: currentPage + 1,
                search,
                status,
              })}
            >
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </nav>
    </div>
  );
}