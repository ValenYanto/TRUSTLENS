"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ModeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button
        aria-label="Memuat pengaturan tema"
        disabled
        size="icon"
        tabIndex={-1}
        type="button"
        variant="outline"
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  const accessibleLabel = isDark
    ? "Aktifkan mode terang"
    : "Aktifkan mode gelap";

  return (
    <Button
      aria-label={accessibleLabel}
      onClick={toggleTheme}
      size="icon"
      title={accessibleLabel}
      type="button"
      variant="outline"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}

      <span className="sr-only">
        {accessibleLabel}
      </span>
    </Button>
  );
}