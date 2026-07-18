"use client";

import Link from "next/link";
import {
  Inbox,
  LayoutDashboard,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type AdminSidebarNavProps = {
  mobile?: boolean;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Investor Inquiries",
    href: "/admin/inquiries",
    icon: Inbox,
  },
] as const;

function isActiveRoute(
  pathname: string,
  href: string,
) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

export function AdminSidebarNav({
  mobile = false,
}: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        mobile
          ? "flex gap-2 overflow-x-auto"
          : "grid gap-1",
      )}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;

        const active = isActiveRoute(
          pathname,
          item.href,
        );

        return (
          <Link
            aria-current={
              active ? "page" : undefined
            }
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",

              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}