import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  firstItem: number;
  lastItem: number;
  search: string;
};

function buildPageHref({
  page,
  search,
}: {
  page: number;
  search: string;
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();

  return query
    ? `/admin/admins?${query}`
    : "/admin/admins";
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  firstItem,
  lastItem,
  search,
}: AdminPaginationProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
        akun
      </p>

      <div className="flex items-center gap-2">
        <Button
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
          size="sm"
          variant="outline"
        >
          {currentPage > 1 ? (
            <Link
              href={buildPageHref({
                page: currentPage - 1,
                search,
              })}
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
              Sebelumnya
            </span>
          )}
        </Button>

        <span className="px-2 text-sm font-semibold">
          {currentPage} / {totalPages}
        </span>

        <Button
          asChild={
            currentPage < totalPages
          }
          disabled={
            currentPage >= totalPages
          }
          size="sm"
          variant="outline"
        >
          {currentPage < totalPages ? (
            <Link
              href={buildPageHref({
                page: currentPage + 1,
                search,
              })}
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              Berikutnya
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}