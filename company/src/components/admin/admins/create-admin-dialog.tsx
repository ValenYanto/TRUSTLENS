"use client";

import {
  type FormEvent,
  useRef,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createAdminUserAction } from "@/src/actions/admin/admin-users";
import { Button } from "@/components/ui/button";
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

export function CreateAdminDialog() {
  const router = useRouter();

  const formRef =
    useRef<HTMLFormElement>(null);

  const [open, setOpen] =
    useState(false);

  const [isPending, setIsPending] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(
      event.currentTarget,
    );

    setIsPending(true);

    try {
      const result =
        await createAdminUserAction(
          formData,
        );

      if (!result.success) {
        toast.error(result.message, {
          duration: 2000,
        });

        return;
      }

      toast.success(result.message, {
        duration: 2000,
      });

      formRef.current?.reset();
      setShowPassword(false);
      setShowConfirmation(false);
      setOpen(false);

      router.refresh();
    } catch {
      toast.error(
        "Terjadi kesalahan saat membuat akun admin.",
        {
          duration: 2000,
        },
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!isPending) {
          setOpen(value);
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Tambah Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="size-5 text-primary" />
          </div>

          <DialogTitle>
            Tambah Akun Admin
          </DialogTitle>

          <DialogDescription>
            Buat akun baru yang memiliki akses
            penuh ke dashboard internal TrustLens.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-5"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="grid gap-2">
            <Label htmlFor="create-admin-name">
              Nama lengkap
            </Label>

            <Input
              autoComplete="name"
              disabled={isPending}
              id="create-admin-name"
              name="name"
              placeholder="Nama admin"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-admin-email">
              Email
            </Label>

            <Input
              autoComplete="email"
              disabled={isPending}
              id="create-admin-email"
              name="email"
              placeholder="admin@trustlens.com"
              required
              type="email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-admin-password">
              Kata sandi
            </Label>

            <div className="relative">
              <Input
                autoComplete="new-password"
                className="pr-10"
                disabled={isPending}
                id="create-admin-password"
                minLength={12}
                name="password"
                placeholder="Minimal 12 karakter"
                required
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
              />

              <button
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => {
                  setShowPassword(
                    (current) => !current,
                  );
                }}
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-admin-confirm-password">
              Konfirmasi kata sandi
            </Label>

            <div className="relative">
              <Input
                autoComplete="new-password"
                className="pr-10"
                disabled={isPending}
                id="create-admin-confirm-password"
                minLength={12}
                name="confirmPassword"
                placeholder="Ulangi kata sandi"
                required
                type={
                  showConfirmation
                    ? "text"
                    : "password"
                }
              />

              <button
                aria-label={
                  showConfirmation
                    ? "Sembunyikan konfirmasi kata sandi"
                    : "Tampilkan konfirmasi kata sandi"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => {
                  setShowConfirmation(
                    (current) => !current,
                  );
                }}
                type="button"
              >
                {showConfirmation ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            Akun yang dibuat langsung mendapatkan
            role ADMIN. Registrasi publik tetap
            dinonaktifkan.
          </p>

          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              variant="outline"
            >
              Batal
            </Button>

            <Button
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Buat Akun Admin
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}