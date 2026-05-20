"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Ban,
    Gauge,
    Landmark,
    Loader2,
    ShieldAlert,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DashboardSummary = {
    total_transactions: number;
    total_accounts: number;
    total_devices: number;
    total_merchants: number;
    total_alerts: number;
    open_alerts: number;
    high_risk_transactions: number;
    blocked_transactions: number;
    average_fraud_score: number;
    risk_distribution: {
        low: number;
        medium: number;
        high: number;
    };
    status_distribution: {
        approved: number;
        flagged: number;
        blocked: number;
        pending: number;
    };
};

const cards = [
    {
        key: "total_transactions",
        title: "Total Transactions",
        icon: Activity,
        suffix: "",
    },
    {
        key: "total_alerts",
        title: "Total Alerts",
        icon: AlertTriangle,
        suffix: "",
    },
    {
        key: "high_risk_transactions",
        title: "High Risk",
        icon: ShieldAlert,
        suffix: "",
    },
    {
        key: "blocked_transactions",
        title: "Blocked",
        icon: Ban,
        suffix: "",
    },
] as const;

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadSummary() {
        try {
            const data = await apiFetch<DashboardSummary>("/dashboard/summary");
            setSummary(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading dashboard summary...
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
                Failed to load dashboard summary. Make sure FastAPI backend is running.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl">
                <div className="max-w-3xl">
                    <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                        TrustLens MVP
                    </Badge>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                        Real-time fraud intelligence for financial transactions.
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-slate-400 md:text-base">
                        Monitor fraud scores, detect high-risk patterns, analyze cross-border
                        transaction behavior, and validate alerts through analyst labeling.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((item) => {
                    const Icon = item.icon;
                    const value = summary[item.key];

                    return (
                        <Card
                            key={item.key}
                            className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    {item.title}
                                </CardTitle>
                                <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-50">{value}</div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Synced from TrustLens backend
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card className="border-white/10 bg-slate-900/70 text-slate-100 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Gauge className="h-5 w-5 text-emerald-300" />
                            Risk Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RiskRow label="Low Risk" value={summary.risk_distribution.low} total={summary.total_transactions} />
                        <RiskRow label="Medium Risk" value={summary.risk_distribution.medium} total={summary.total_transactions} />
                        <RiskRow label="High Risk" value={summary.risk_distribution.high} total={summary.total_transactions} />
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/70 text-slate-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Landmark className="h-5 w-5 text-emerald-300" />
                            Intelligence Snapshot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <p className="text-sm text-slate-400">Average Fraud Score</p>
                            <p className="mt-1 text-3xl font-bold text-emerald-300">
                                {summary.average_fraud_score}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <MiniStat label="Accounts" value={summary.total_accounts} />
                            <MiniStat label="Devices" value={summary.total_devices} />
                            <MiniStat label="Merchants" value={summary.total_merchants} />
                            <MiniStat label="Open Alerts" value={summary.open_alerts} />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

function RiskRow({
    label,
    value,
    total,
}: {
    label: string;
    value: number;
    total: number;
}) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-500">
                    {value} · {percent}%
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
        </div>
    );
}