"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        const timer = window.setTimeout(() => setReady(true), 0);
        return () => window.clearTimeout(timer);
    }, [router]);

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Memuat dasbor TrustLens...
            </div>
        );
    }

    return <DashboardShell>{children}</DashboardShell>;
}