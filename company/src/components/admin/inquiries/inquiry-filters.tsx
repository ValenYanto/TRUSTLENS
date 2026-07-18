import Link from "next/link";
import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inquiryStatusOptions } from "@/src/lib/investor-inquiries/inquiry-labels";

type InquiryFiltersProps = {
  search: string;
  status?: string;
};

export function InquiryFilters({
  search,
  status,
}: InquiryFiltersProps) {
  return (
    <form
      action="/admin/inquiries"
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_15rem_auto]"
      method="get"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          className="pl-10"
          defaultValue={search}
          name="search"
          placeholder="Cari nama, perusahaan, email, WhatsApp, atau kode inquiry..."
          type="search"
        />
      </div>

      <div className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

        <select
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
          defaultValue={status ?? ""}
          name="status"
        >
          <option value="">
            Semua status
          </option>

          {inquiryStatusOptions.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 md:flex-none"
          type="submit"
        >
          <Search className="size-4" />
          Terapkan
        </Button>

        <Button
          asChild
          aria-label="Reset filter"
          type="button"
          variant="outline"
        >
          <Link href="/admin/inquiries">
            <RotateCcw className="size-4" />
            <span className="md:hidden">
              Reset
            </span>
          </Link>
        </Button>
      </div>
    </form>
  );
}