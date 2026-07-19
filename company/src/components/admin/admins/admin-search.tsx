import Link from "next/link";
import {
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminSearchProps = {
  search: string;
};

export function AdminSearch({
  search,
}: AdminSearchProps) {
  return (
    <form
      action="/admin/admins"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row"
      method="get"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          className="pl-10"
          defaultValue={search}
          name="search"
          placeholder="Cari nama atau email admin..."
          type="search"
        />
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 sm:flex-none"
          type="submit"
        >
          <Search className="size-4" />
          Cari
        </Button>

        <Button
          asChild
          aria-label="Reset pencarian"
          variant="outline"
        >
          <Link href="/admin/admins">
            <RotateCcw className="size-4" />
            Reset
          </Link>
        </Button>
      </div>
    </form>
  );
}