"use client";

import { useState } from "react";
import {
  Loader2,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";

export function AdminSignOutButton() {
  const router = useRouter();

  const [isPending, setIsPending] =
    useState(false);

  async function handleSignOut() {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace(
              "/admin/login",
            );

            router.refresh();
          },
        },
      });

      toast.success(
        "Anda telah keluar.",
        {
          duration: 2000,
        },
      );
    } catch {
      toast.error(
        "Gagal keluar dari dashboard.",
        {
          duration: 2000,
        },
      );

      setIsPending(false);
    }
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleSignOut}
      size="sm"
      type="button"
      variant="outline"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}

      Keluar
    </Button>
  );
}