"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    AlertTriangle,
    Bell,
    BrainCircuit,
    Database,
    FlaskConical,
    Globe2,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Network,
    Search,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { getStoredUser, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
    { title: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transaksi", href: "/dashboard/transactions", icon: Database },
    { title: "Peringatan", href: "/dashboard/alerts", icon: AlertTriangle },
    { title: "Simulasi", href: "/dashboard/simulation", icon: FlaskConical },
    { title: "Relasi", href: "/dashboard/graph", icon: Network },
    { title: "Lintas Negara", href: "/dashboard/cross-border", icon: Globe2 },
    { title: "Pelabelan", href: "/dashboard/labeling", icon: ShieldCheck },
    { title: "Monitor AI", href: "/dashboard/ml", icon: BrainCircuit },
    { title: "Log Audit", href: "/dashboard/audit-logs", icon: History },
];

const pageTitles: Record<string, string> = {
    "/dashboard": "Ringkasan",
    "/dashboard/transactions": "Transaksi",
    "/dashboard/alerts": "Peringatan",
    "/dashboard/simulation": "Simulasi",
    "/dashboard/graph": "Relasi",
    "/dashboard/cross-border": "Intelijen Lintas Negara",
    "/dashboard/labeling": "Alur Pelabelan",
    "/dashboard/ml": "Monitor AI",
    "/dashboard/audit-logs": "Log Audit",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const user = getStoredUser();
    const pageTitle = pageTitles[pathname] ?? "TrustLens";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/95 shadow-sm dark:border-white/10 dark:bg-slate-950/95 lg:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-white/10">
                        <AppLogo href="/dashboard" />
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-5">
                        <DashboardNav pathname={pathname} />
                    </nav>

                    <div className="border-t border-slate-200 p-4 dark:border-white/10">
                        <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                                    <UserRound className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {user?.full_name || "Analyst"}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {translateRole(user?.role)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={logout}
                            variant="outline"
                            className="w-full justify-start rounded-md border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6 dark:border-white/10 dark:bg-slate-950/85">
                    <div className="flex min-w-0 items-center gap-3">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-md lg:hidden">
                                    <Menu className="h-4 w-4" />
                                    <span className="sr-only">Buka navigasi</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 border-slate-200 bg-white p-0 dark:border-white/10 dark:bg-slate-950">
                                <SheetHeader className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle asChild>
                                            <AppLogo href="/dashboard" />
                                        </SheetTitle>
                                        <SheetClose asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Tutup navigasi</span>
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </SheetHeader>
                                <nav className="space-y-1 p-4">
                                    <DashboardNav pathname={pathname} mobile />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 md:text-base">
                                {pageTitle}
                            </p>
                            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                                Ruang kerja deteksi fraud dan intelijen transaksi
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden h-10 w-64 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] md:flex">
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Cari di dasbor</span>
                        </div>
                        <Button variant="outline" size="icon" className="hidden h-10 w-10 rounded-md border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 sm:inline-flex">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notifikasi</span>
                        </Button>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="min-h-[calc(100vh-4rem)] px-4 py-6 md:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}

function translateRole(role?: string) {
    if (role === "ADMIN") return "Admin";
    if (role === "INSTITUTION") return "Institusi";
    return "Analyst";
}

function DashboardNav({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
    return navItems.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        const link = (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                    active
                        ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-100"
                )}
            >
                <Icon className="h-4 w-4" />
                {item.title}
            </Link>
        );

        if (!mobile) return <div key={item.href}>{link}</div>;

        return (
            <SheetClose asChild key={item.href}>
                {link}
            </SheetClose>
        );
    });
}
