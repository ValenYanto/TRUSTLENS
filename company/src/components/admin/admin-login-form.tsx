"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/src/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isPending, setIsPending] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const result =
        await authClient.signIn.email({
          email: email
            .trim()
            .toLowerCase(),

          password,

          rememberMe: true,
        });

      if (result.error) {
        toast.error(
          "Email atau kata sandi tidak valid.",
          {
            duration: 2000,
          },
        );

        return;
      }

      toast.success(
        "Login berhasil.",
        {
          duration: 2000,
        },
      );

      router.replace("/admin");
      router.refresh();
    } catch {
      toast.error(
        "Terjadi kesalahan saat login.",
        {
          duration: 2000,
        },
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="admin-email">
          Email admin
        </Label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            autoComplete="email"
            className="h-12 pl-10"
            disabled={isPending}
            id="admin-email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="admin@trustlens.local"
            required
            type="email"
            value={email}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="admin-password">
          Kata sandi
        </Label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            autoComplete="current-password"
            className="h-12 px-10"
            disabled={isPending}
            id="admin-password"
            minLength={12}
            onChange={(event) => {
              setPassword(
                event.target.value,
              );
            }}
            placeholder="Masukkan kata sandi"
            required
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
          />

          <button
            aria-label={
              showPassword
                ? "Sembunyikan kata sandi"
                : "Tampilkan kata sandi"
            }
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground"
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

      <Button
        className="h-12 w-full"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Masuk ke Dashboard
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Dashboard hanya dapat diakses oleh
        akun dengan role ADMIN.
      </p>
    </form>
  );
}