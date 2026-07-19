"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  Ban,
  CalendarDays,
  Edit3,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  banAdminUserAction,
  deleteAdminUserAction,
  resetAdminPasswordAction,
  revokeAdminSessionsAction,
  unbanAdminUserAction,
  updateAdminUserAction,
} from "@/src/actions/admin/admin-users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminUserActionResult,
  AdminUserListItem,
} from "@/src/lib/admin-users/admin-user-types";

type AdminAccountCardProps = {
  user: AdminUserListItem;
  activeAdminCount: number;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "long",
      timeZone: "Asia/Jakarta",
    },
  ).format(date);
}

export function AdminAccountCard({
  user,
  activeAdminCount,
}: AdminAccountCardProps) {
  const router = useRouter();

  const [pendingAction, setPendingAction] =
    useState<string | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [passwordOpen, setPasswordOpen] =
    useState(false);

  const [banOpen, setBanOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const emailLocked =
    user.isCurrentUser ||
    user.isPrimaryAdmin;

  const cannotDeactivate =
    user.isCurrentUser ||
    user.isPrimaryAdmin ||
    activeAdminCount <= 1;

  const cannotDelete =
    user.isCurrentUser ||
    user.isPrimaryAdmin ||
    (!user.banned &&
      activeAdminCount <= 1);

  async function executeAction(
    actionName: string,
    action: () => Promise<AdminUserActionResult>,
    onSuccess?: () => void,
  ) {
    if (pendingAction) {
      return;
    }

    setPendingAction(actionName);

    try {
      const result = await action();

      if (!result.success) {
        toast.error(result.message, {
          duration: 2000,
        });

        return;
      }

      toast.success(result.message, {
        duration: 2000,
      });

      onSuccess?.();
      router.refresh();
    } catch {
      toast.error(
        "Terjadi kesalahan saat memproses akun admin.",
        {
          duration: 2000,
        },
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEdit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    await executeAction(
      "edit",
      () =>
        updateAdminUserAction(formData),
      () => setEditOpen(false),
    );
  }

  async function handleResetPassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    await executeAction(
      "password",
      () =>
        resetAdminPasswordAction(
          formData,
        ),
      () => setPasswordOpen(false),
    );
  }

  async function handleBan(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    await executeAction(
      "ban",
      () =>
        banAdminUserAction(formData),
      () => setBanOpen(false),
    );
  }

  async function handleDelete(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    await executeAction(
      "delete",
      () =>
        deleteAdminUserAction(formData),
      () => setDeleteOpen(false),
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate">
              {user.name}
            </CardTitle>

            <p className="mt-1 break-all text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div
            className={[
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              user.banned
                ? "bg-destructive/10"
                : "bg-primary/10",
            ].join(" ")}
          >
            {user.banned ? (
              <ShieldOff className="size-5 text-destructive" />
            ) : (
              <ShieldCheck className="size-5 text-primary" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant={
              user.banned
                ? "destructive"
                : "default"
            }
          >
            {user.banned
              ? "Dinonaktifkan"
              : "Aktif"}
          </Badge>

          {user.isCurrentUser ? (
            <Badge variant="secondary">
              Akun Anda
            </Badge>
          ) : null}

          {user.isPrimaryAdmin ? (
            <Badge variant="outline">
              Admin Utama
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 pt-6">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Role
            </span>

            <span className="font-semibold uppercase">
              ADMIN
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Sesi aktif
            </span>

            <span className="font-semibold">
              {user.sessionCount}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Dibuat
            </span>

            <span className="text-right font-medium">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>

        {user.banned &&
        user.banReason ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-destructive">
              Alasan penonaktifan
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {user.banReason}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <Dialog
            onOpenChange={setEditOpen}
            open={editOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
              >
                <Edit3 className="size-4" />
                Edit
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit Akun Admin
                </DialogTitle>

                <DialogDescription>
                  Perbarui nama dan email akun
                  admin.
                </DialogDescription>
              </DialogHeader>

              <form
                className="grid gap-5"
                onSubmit={handleEdit}
              >
                <input
                  name="userId"
                  type="hidden"
                  value={user.id}
                />

                <div className="grid gap-2">
                  <Label
                    htmlFor={`admin-name-${user.id}`}
                  >
                    Nama lengkap
                  </Label>

                  <Input
                    defaultValue={user.name}
                    disabled={
                      pendingAction === "edit"
                    }
                    id={`admin-name-${user.id}`}
                    name="name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor={`admin-email-${user.id}`}
                  >
                    Email
                  </Label>

                  {emailLocked ? (
                    <>
                      <Input
                        disabled
                        id={`admin-email-${user.id}`}
                        value={user.email}
                      />

                      <input
                        name="email"
                        type="hidden"
                        value={user.email}
                      />

                      <p className="text-xs text-muted-foreground">
                        Email akun ini dikunci untuk
                        menjaga akses administrator.
                      </p>
                    </>
                  ) : (
                    <Input
                      defaultValue={user.email}
                      disabled={
                        pendingAction ===
                        "edit"
                      }
                      id={`admin-email-${user.id}`}
                      name="email"
                      required
                      type="email"
                    />
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={() =>
                      setEditOpen(false)
                    }
                    type="button"
                    variant="outline"
                  >
                    Batal
                  </Button>

                  <Button
                    disabled={
                      pendingAction === "edit"
                    }
                    type="submit"
                  >
                    {pendingAction ===
                    "edit" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Edit3 className="size-4" />
                    )}

                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            onOpenChange={setPasswordOpen}
            open={passwordOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={user.isCurrentUser}
                size="sm"
                variant="outline"
              >
                <KeyRound className="size-4" />
                Password
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Reset Kata Sandi
                </DialogTitle>

                <DialogDescription>
                  Seluruh sesi aktif akun akan
                  dicabut setelah password diganti.
                </DialogDescription>
              </DialogHeader>

              <form
                className="grid gap-5"
                onSubmit={
                  handleResetPassword
                }
              >
                <input
                  name="userId"
                  type="hidden"
                  value={user.id}
                />

                <div className="grid gap-2">
                  <Label
                    htmlFor={`new-password-${user.id}`}
                  >
                    Kata sandi baru
                  </Label>

                  <Input
                    autoComplete="new-password"
                    disabled={
                      pendingAction ===
                      "password"
                    }
                    id={`new-password-${user.id}`}
                    minLength={12}
                    name="newPassword"
                    required
                    type="password"
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor={`confirm-password-${user.id}`}
                  >
                    Konfirmasi kata sandi
                  </Label>

                  <Input
                    autoComplete="new-password"
                    disabled={
                      pendingAction ===
                      "password"
                    }
                    id={`confirm-password-${user.id}`}
                    minLength={12}
                    name="confirmPassword"
                    required
                    type="password"
                  />
                </div>

                <DialogFooter>
                  <Button
                    onClick={() =>
                      setPasswordOpen(false)
                    }
                    type="button"
                    variant="outline"
                  >
                    Batal
                  </Button>

                  <Button
                    disabled={
                      pendingAction ===
                      "password"
                    }
                    type="submit"
                  >
                    {pendingAction ===
                    "password" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <KeyRound className="size-4" />
                    )}

                    Reset Password
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {user.banned ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                >
                  <UserCheck className="size-4" />
                  Aktifkan
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Aktifkan akun admin?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    {user.name} akan dapat login
                    kembali ke dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Batal
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => {
                      const formData =
                        new FormData();

                      formData.set(
                        "userId",
                        user.id,
                      );

                      void executeAction(
                        "unban",
                        () =>
                          unbanAdminUserAction(
                            formData,
                          ),
                      );
                    }}
                  >
                    Aktifkan Akun
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Dialog
              onOpenChange={setBanOpen}
              open={banOpen}
            >
              <DialogTrigger asChild>
                <Button
                  disabled={cannotDeactivate}
                  size="sm"
                  variant="outline"
                >
                  <Ban className="size-4" />
                  Nonaktifkan
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Nonaktifkan Akun Admin
                  </DialogTitle>

                  <DialogDescription>
                    Akun akan kehilangan akses dan
                    seluruh sesi aktifnya akan
                    dicabut.
                  </DialogDescription>
                </DialogHeader>

                <form
                  className="grid gap-5"
                  onSubmit={handleBan}
                >
                  <input
                    name="userId"
                    type="hidden"
                    value={user.id}
                  />

                  <div className="grid gap-2">
                    <Label
                      htmlFor={`ban-reason-${user.id}`}
                    >
                      Alasan penonaktifan
                    </Label>

                    <Textarea
                      disabled={
                        pendingAction === "ban"
                      }
                      id={`ban-reason-${user.id}`}
                      maxLength={250}
                      name="banReason"
                      placeholder="Contoh: Tidak lagi menjadi bagian dari tim TrustLens."
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() =>
                        setBanOpen(false)
                      }
                      type="button"
                      variant="outline"
                    >
                      Batal
                    </Button>

                    <Button
                      disabled={
                        pendingAction === "ban"
                      }
                      type="submit"
                      variant="destructive"
                    >
                      {pendingAction ===
                      "ban" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Ban className="size-4" />
                      )}

                      Nonaktifkan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={
                  user.isCurrentUser ||
                  user.sessionCount === 0
                }
                size="sm"
                variant="outline"
              >
                <LogOut className="size-4" />
                Cabut Sesi
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Cabut seluruh sesi?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {user.name} akan keluar dari
                  seluruh perangkat dan perlu login
                  kembali.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Batal
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    const formData =
                      new FormData();

                    formData.set(
                      "userId",
                      user.id,
                    );

                    void executeAction(
                      "sessions",
                      () =>
                        revokeAdminSessionsAction(
                          formData,
                        ),
                    );
                  }}
                >
                  Cabut Seluruh Sesi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Dialog
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="w-full"
              disabled={cannotDelete}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Hapus Akun Permanen
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Hapus Akun Admin
              </DialogTitle>

              <DialogDescription>
                Tindakan ini menghapus akun,
                credential, dan seluruh sesi secara
                permanen. Tindakan tidak dapat
                dibatalkan.
              </DialogDescription>
            </DialogHeader>

            <form
              className="grid gap-5"
              onSubmit={handleDelete}
            >
              <input
                name="userId"
                type="hidden"
                value={user.id}
              />

              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive">
                  {user.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor={`delete-confirmation-${user.id}`}
                >
                  Ketik HAPUS untuk mengonfirmasi
                </Label>

                <Input
                  autoComplete="off"
                  disabled={
                    pendingAction === "delete"
                  }
                  id={`delete-confirmation-${user.id}`}
                  name="confirmation"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  onClick={() =>
                    setDeleteOpen(false)
                  }
                  type="button"
                  variant="outline"
                >
                  Batal
                </Button>

                <Button
                  disabled={
                    pendingAction === "delete"
                  }
                  type="submit"
                  variant="destructive"
                >
                  {pendingAction ===
                  "delete" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}

                  Hapus Permanen
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {user.isCurrentUser ? (
          <p className="text-xs leading-5 text-muted-foreground">
            Akun yang sedang digunakan tidak dapat
            dinonaktifkan, dihapus, direset
            password, atau dicabut seluruh sesinya.
          </p>
        ) : null}

        {user.isPrimaryAdmin ? (
          <p className="text-xs leading-5 text-muted-foreground">
            Admin utama dilindungi dari perubahan
            email, penonaktifan, dan penghapusan.
          </p>
        ) : null}

        <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          Terakhir diperbarui{" "}
          {formatDate(user.updatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}