"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Ban, BarChart3, Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

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
    risk_distribution: { low: number; medium: number; high: number };
    status_distribution: { approved: number; flagged: number; blocked: number; pending: number };
};

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        apiFetch<DashboardSummary>("/dashboard/summary")
            .then((data) => { if (active) setSummary(data); })
            .catch((error) => toast.error(error instanceof Error ? error.message : "Gagal memuat ringkasan dasbor"))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    if (loading) {
        return <div className="flex min-h-[70vh] items-center justify-center text-slate-500 dark:text-slate-400"><Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-600 dark:text-cyan-300" />Memuat ringkasan dasbor...</div>;
    }

    if (!summary) {
        return <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">Gagal memuat ringkasan. Pastikan backend FastAPI sedang berjalan.</div>;
    }

    const riskTotal = Math.max(summary.total_transactions, 1);

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Ringkasan</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl dark:text-white">Dasbor intelijen fraud</h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">Ringkasan transaksi, peringatan, aktivitas berisiko tinggi, dan performa skor fraud TrustLens.</p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <MetricCard label="Total transaksi" value={summary.total_transactions.toLocaleString()} detail="Diproses oleh TrustLens" icon={<BarChart3 />} />
                <MetricCard label="Peringatan aktif" value={summary.open_alerts.toLocaleString()} detail="Perlu ditinjau analyst" icon={<AlertTriangle />} tone="red" />
                <MetricCard label="Risiko tinggi" value={summary.high_risk_transactions.toLocaleString()} detail="Transaksi perlu perhatian" icon={<TrendingUp />} tone="amber" />
                <MetricCard label="Diblokir" value={summary.blocked_transactions.toLocaleString()} detail="Dicegah atau dihentikan" icon={<Ban />} tone="red" />
                <MetricCard label="Rata-rata skor fraud" value={summary.average_fraud_score.toFixed(2)} detail="Skala 0,00 hingga 1,00" icon={<ShieldCheck />} tone="emerald" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <Card className="trust-panel rounded-md"><CardContent className="p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-950 dark:text-white">Distribusi risiko</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Distribusi transaksi berdasarkan tingkat risiko akhir.</p></div><ShieldCheck className="h-5 w-5 text-cyan-700 dark:text-cyan-300" /></div><div className="mt-6 space-y-5"><RiskBar label="Rendah" value={summary.risk_distribution.low} total={riskTotal} tone="emerald" /><RiskBar label="Sedang" value={summary.risk_distribution.medium} total={riskTotal} tone="cyan" /><RiskBar label="Tinggi" value={summary.risk_distribution.high} total={riskTotal} tone="red" /></div></CardContent></Card>
                <Card className="trust-panel rounded-md"><CardContent className="p-6"><h2 className="text-xl font-semibold text-slate-950 dark:text-white">Konteks operasional</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Angka penting yang mudah dipahami oleh analyst dan juri.</p><div className="mt-5 space-y-3"><Insight label="Beban peringatan" value={`${summary.open_alerts} terbuka dari ${summary.total_alerts} peringatan`} /><Insight label="Hasil scoring" value={`${summary.status_distribution.flagged} ditandai dan ${summary.status_distribution.blocked} diblokir`} /><Insight label="Cakupan entitas" value={`${summary.total_accounts} akun, ${summary.total_devices} perangkat, ${summary.total_merchants} merchant`} /></div></CardContent></Card>
            </section>
        </div>
    );
}

function MetricCard({ label, value, detail, icon, tone = "cyan" }: { label: string; value: string; detail: string; icon: React.ReactNode; tone?: "cyan" | "red" | "amber" | "emerald" }) {
    const color = { cyan: "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-400/10", red: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-400/10", amber: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-400/10", emerald: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-400/10" }[tone];
    return <Card className="trust-panel rounded-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p><p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p></div><div className={`rounded-md p-2 [&_svg]:h-5 [&_svg]:w-5 ${color}`}>{icon}</div></div><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{detail}</p></CardContent></Card>;
}

function RiskBar({ label, value, total, tone }: { label: string; value: number; total: number; tone: "emerald" | "cyan" | "red" }) {
    const percent = Math.round((value / total) * 100);
    const color = { emerald: "bg-emerald-500", cyan: "bg-cyan-500", red: "bg-red-500" }[tone];
    return <div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-slate-700 dark:text-slate-300">{label}</span><span className="text-slate-500 dark:text-slate-400">{value.toLocaleString()} · {percent}%</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div></div>;
}

function Insight({ label, value }: { label: string; value: string }) {
    return <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm text-slate-800 dark:text-slate-200">{value}</p></div>;
}
