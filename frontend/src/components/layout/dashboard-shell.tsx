"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Activity,
    AlertTriangle,
    Bell,
    Database,
    FlaskConical,
    Globe2,
    HelpCircle,
    History,
    LayoutDashboard,
    LogOut,
    Map,
    Network,
    Search,
    Settings,
    Shield,
    Tags,
    UserRound,
} from "lucide-react";

import { getStoredUser, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const topNav = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Transactions", href: "/dashboard/transactions" },
    { title: "Alerts", href: "/dashboard/alerts" },
    { title: "Graph Explorer", href: "/dashboard/graph" },
];

const sideNav = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Intelligence", href: "/dashboard/cross-border", icon: Globe2 },
    { title: "Labeling", href: "/dashboard/labeling", icon: Database },
    { title: "Simulation", href: "/dashboard/simulation", icon: FlaskConical },
    { title: "Risk Map", href: "/dashboard/cross-border", icon: Map },
    { title: "Audit Log", href: "/dashboard/audit-logs", icon: History },
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
        <div className="min-h-screen bg-[#050b18] text-slate-100 trust-grid-bg">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[295px] border-r border-cyan-300/10 bg-[#0b1220]/95 lg:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-[88px] items-center gap-3 border-b border-cyan-300/10 px-7">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 trust-glow">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-[0.16em] text-cyan-300">
                                SENTINEL CORE
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                V4.2 Secure Node
                            </p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2 px-6 py-7">
                        {sideNav.map((item) => {
                            const Icon = item.icon;
                            const active =
                                item.href === "/dashboard"
                                    ? pathname === "/dashboard"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-4 rounded-sm border-l-2 px-4 py-3 text-sm font-medium transition",
                                        active
                                            ? "border-cyan-300 bg-cyan-400/10 text-cyan-300"
                                            : "border-transparent text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-6 pb-7">
                        <Button className="mb-7 w-full rounded-md bg-cyan-400 text-[#06111f] hover:bg-cyan-300">
                            + New Simulation
                        </Button>

                        <div className="space-y-4 border-t border-white/10 pt-6">
                            <button className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-300">
                                <HelpCircle className="h-4 w-4" />
                                Help
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 text-sm text-slate-500 hover:text-red-300"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-[295px]">
                <header className="sticky top-0 z-20 flex h-[88px] items-center justify-between border-b border-cyan-300/10 bg-[#081120]/90 px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-xl font-black text-cyan-400">
                            TRUSTLENS
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex">
                            {topNav.map((item) => {
                                const active =
                                    item.href === "/dashboard"
                                        ? pathname === "/dashboard"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "border-b-2 pb-2 text-sm font-medium transition",
                                            active
                                                ? "border-cyan-400 text-cyan-300"
                                                : "border-transparent text-slate-400 hover:text-slate-100"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden h-10 w-72 items-center gap-3 rounded-md bg-[#050b18] px-3 text-slate-500 md:flex">
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Search systems...</span>
                        </div>

                        <Bell className="h-5 w-5 text-slate-400" />
                        <Settings className="h-5 w-5 text-slate-400" />

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <UserRound className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-88px)] px-8 py-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}