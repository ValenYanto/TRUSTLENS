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

        setReady(true);
    }, [router]);

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
                Loading TrustLens dashboard...
            </div>
        );
    }

    return <DashboardShell>{children}</DashboardShell>;
}