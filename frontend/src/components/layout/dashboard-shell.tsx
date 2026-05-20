"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Globe2,
    GitBranch,
    Home,
    LogOut,
    Radar,
    ShieldCheck,
    Tags,
    TerminalSquare,
} from "lucide-react";

import { logout, getStoredUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: Activity,
    },
    {
        title: "Alerts",
        href: "/dashboard/alerts",
        icon: AlertTriangle,
    },
    {
        title: "Graph Explorer",
        href: "/dashboard/graph",
        icon: GitBranch,
    },
    {
        title: "Cross-Border",
        href: "/dashboard/cross-border",
        icon: Globe2,
    },
    {
        title: "Labeling",
        href: "/dashboard/labeling",
        icon: Tags,
    },
    {
        title: "Simulation",
        href: "/dashboard/simulation",
        icon: Radar,
    },
    {
        title: "Audit Logs",
        href: "/dashboard/audit-logs",
        icon: TerminalSquare,
    },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = getStoredUser();

    function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/95 p-5 lg:block">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-lg font-bold tracking-tight">TrustLens</p>
                        <p className="text-xs text-slate-500">Fraud Intelligence</p>
                    </div>
                </Link>

                <nav className="mt-8 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                                    active
                                        ? "bg-emerald-400/10 text-emerald-300 shadow-sm"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-slate-100">
                        {user?.full_name || "TrustLens User"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {user?.role || "ANALYST"} · {user?.institution_name || "TrustLens Lab"}
                    </p>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="mt-3 w-full justify-start text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                                Real-time monitoring
                            </p>
                            <h1 className="mt-1 text-xl font-semibold text-slate-100">
                                TrustLens Command Center
                            </h1>
                        </div>

                        <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 md:flex">
                            <BarChart3 className="h-4 w-4 text-emerald-300" />
                            <div>
                                <p className="text-xs text-slate-500">Current role</p>
                                <p className="text-sm font-medium text-slate-200">
                                    {user?.role || "ANALYST"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-5 lg:p-8">{children}</main>
            </div>
        </div>
    );
}