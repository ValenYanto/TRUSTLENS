import type { Metadata } from "next";
import {
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { AdminAccountCard } from "@/src/components/admin/admins/admin-account-card";
import { AdminPagination } from "@/src/components/admin/admins/admin-pagination";
import { AdminSearch } from "@/src/components/admin/admins/admin-search";
import { CreateAdminDialog } from "@/src/components/admin/admins/create-admin-dialog";
import { requireAdminSession } from "@/src/lib/auth-session";
import { getAdminUsers } from "@/src/lib/admin-users/get-admin-users";

export const metadata: Metadata = {
  title: "Akun Admin",
};

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
  }>;
};

function getSingleSearchParam(
  value?: string | string[],
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session =
    await requireAdminSession();

  const params = await searchParams;

  const result = await getAdminUsers({
    currentUserId: session.user.id,

    page: getSingleSearchParam(
      params.page,
    ),

    search: getSingleSearchParam(
      params.search,
    ),
  });

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Access Management
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Akun Admin
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Buat dan kelola akun yang memiliki
            akses ke dashboard internal TrustLens.
          </p>
        </div>

        <CreateAdminDialog />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <UsersRound className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total akun ditemukan
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold">
              {result.pagination.totalItems}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Admin aktif
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold">
              {result.activeAdminCount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <AdminSearch
          search={result.filters.search}
        />
      </section>

      {result.filters.search ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="size-4" />
          Menampilkan hasil pencarian akun admin.
        </div>
      ) : null}

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {result.items.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <UsersRound className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-4 font-display text-lg font-bold">
              Akun admin tidak ditemukan
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tidak ada akun yang cocok dengan
              pencarian tersebut.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 lg:grid-cols-2">
            {result.items.map((user) => (
              <AdminAccountCard
                activeAdminCount={
                  result.activeAdminCount
                }
                key={user.id}
                user={user}
              />
            ))}
          </div>
        )}

        <AdminPagination
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
          totalItems={
            result.pagination.totalItems
          }
          totalPages={
            result.pagination.totalPages
          }
        />
      </section>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="font-semibold">
          Proteksi akun
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Akun yang sedang digunakan dan admin
          utama tidak dapat dinonaktifkan atau
          dihapus. Sistem juga mencegah penghapusan
          maupun penonaktifan admin aktif terakhir.
        </p>
      </div>
    </div>
  );
}