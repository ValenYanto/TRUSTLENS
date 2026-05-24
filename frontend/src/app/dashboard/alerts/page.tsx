"use client";

import { useEffect, useMemo, useState } from "react";
import {
    AlertOctagon,
    CheckCircle2,
    Clock,
    Eye,
    Filter,
    Loader2,
    RefreshCcw,
    ShieldAlert,
    Siren,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AlertItem = {
    id: string;
    transaction_id: string;
    alert_type: string;
    severity: "low" | "medium" | "high" | "critical";
    risk_score: number;
    reason: string | null;
    status: "terbuka" | "investigating" | "selesai" | "diabaikan";
    assigned_to: string | null;
    created_at: string;
    selesai_at: string | null;
    transaction?: {
        id: string;
        transaction_reference: string;
        amount: number;
        currency: string;
        source_country: string;
        destination_country: string;
        status: string;
        fraud_score: number;
        risk_level: string;
    } | null;
};

type AlertsResponse = {
    total: number;
    limit: number;
    darifset: number;
    items: AlertItem[];
};

const statusOptions = ["all", "terbuka", "investigating", "selesai", "diabaikan"] as const;
const severityOptions = ["all", "critical", "high", "medium", "low"] as const;

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
    const [severity, setSeverity] = useState<(typeof severityOptions)[number]>("all");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const queryPath = useMemo(() => {
        const params = new URLSearchParams();
        params.set("limit", "50");

        if (status !== "all") params.set("status", status);
        if (severity !== "all") params.set("severity", severity);

        return `/alerts?${params.toString()}`;
    }, [status, severity]);

    async function loadAlerts() {
        setLoading(true);

        try {
            const data = await apiFetch<AlertsResponse>(queryPath);
            setAlerts(data.items);
            setTotal(data.total);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal memuat peringatan");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(alertId: string, nextStatus: string) {
        setUpdatingId(alertId);

        try {
            await apiFetch(`/alerts/${alertId}/status?status=${nextStatus}&actor=Valen%20Yanto`, {
                method: "PATCH",
            });

            toast.success(`Status peringatan menjadi ${nextStatus}`);
            await loadAlerts();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui peringatan");
        } finally {
            setUpdatingId(null);
        }
    }

    useEffect(() => {
        loadAlerts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryPath]);

    const kritisCount = alerts.filter((alert) => alert.severity === "critical").length;
    const terbukaCount = alerts.filter((alert) => alert.status === "terbuka").length;
    const investigatingCount = alerts.filter((alert) => alert.status === "investigating").length;

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Badge className="rounded-sm bg-red-400/10 text-red-200 hover:bg-red-400/10">
                            Peringatan fraud
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
                            / Antrian investigasi
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-100">
                        Peringatan
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
                        Tinjau peringatan fraud, ubah status investigasi, dan lihat alasan risiko dari mesin scoring TrustLens.
                    </p>
                </div>

                <Button
                    onClick={loadAlerts}
                    className="rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Muat ulang
                </Button>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                <AlertMetric
                    label="Peringatan kritis"
                    value={kritisCount}
                    icon={<Siren className="h-8 w-8 text-red-200" />}
                    tone="red"
                />
                <AlertMetric
                    label="Kasus terbuka"
                    value={terbukaCount}
                    icon={<ShieldAlert className="h-8 w-8 text-cyan-300" />}
                    tone="cyan"
                />
                <AlertMetric
                    label="Investigasi"
                    value={investigatingCount}
                    icon={<Eye className="h-8 w-8 text-emerald-300" />}
                    tone="emerald"
                />
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <FilterPanel title="Filter status" icon={<Filter className="h-4 w-4" />}>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <FilterButton
                                key={option}
                                active={status === option}
                                onClick={() => setStatus(option)}
                            >
                                {option}
                            </FilterButton>
                        ))}
                    </div>
                </FilterPanel>

                <FilterPanel title="Filter tingkat" icon={<AlertOctagon className="h-4 w-4" />}>
                    <div className="flex flex-wrap gap-2">
                        {severityOptions.map((option) => (
                            <FilterButton
                                key={option}
                                active={severity === option}
                                onClick={() => setSeverity(option)}
                            >
                                {option}
                            </FilterButton>
                        ))}
                    </div>
                </FilterPanel>
            </section>

            <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                <CardContent className="p-0">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                        <div className="text-sm uppercase tracking-[0.14em] text-slate-400">
                            Antrian: <span className="font-bold text-red-200">{total}</span>
                            <span className="ml-6 text-slate-600">Mode: review analyst</span>
                        </div>
                        <AlertOctagon className="h-4 w-4 text-red-200" />
                    </div>

                    {loading ? (
                        <div className="flex h-80 items-center justify-center text-slate-400">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
                            Memuat peringatan...
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">
                            Tidak ada peringatan sesuai filter.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {alerts.map((alert) => (
                                <AlertRow
                                    key={alert.id}
                                    alert={alert}
                                    updating={updatingId === alert.id}
                                    onUpdateStatus={updateStatus}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function AlertMetric({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone: "red" | "cyan" | "emerald";
}) {
    const color = {
        red: "text-red-200",
        cyan: "text-cyan-300",
        emerald: "text-emerald-300",
    }[tone];

    return (
        <Card className="trust-panel rounded-xl border-cyan-300/10 text-slate-100">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="trust-label">{label}</p>
                        <p className={cn("mt-4 text-4xl font-black", color)}>{value}</p>
                    </div>
                    {icon}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.1em] text-slate-600">
                    Dari mesin peringatan
                </p>
            </CardContent>
        </Card>
    );
}

function FilterPanel({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="trust-panel-sdarit rounded-md p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="trust-label">{title}</p>
                <span className="text-slate-500">{icon}</span>
            </div>
            {children}
        </div>
    );
}

function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]",
                active
                    ? "border-cyan-300 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-[#050b18] text-slate-500 hover:text-slate-300"
            )}
        >
            {children}
        </button>
    );
}

function AlertRow({
    alert,
    updating,
    onUpdateStatus,
}: {
    alert: AlertItem;
    updating: boolean;
    onUpdateStatus: (alertId: string, status: string) => void;
}) {
    const border =
        alert.severity === "critical"
            ? "border-l-red-300"
            : alert.severity === "high"
                ? "border-l-orange-300"
                : alert.severity === "medium"
                    ? "border-l-cyan-300"
                    : "border-l-emerald-300";

    return (
        <div className={cn("border-l-4 p-6 transition hover:bg-cyan-400/[0.03]", border)}>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <SeverityBadge severity={alert.severity} />
                        <StatusBadge status={alert.status} />
                        <span className="trust-mono text-xs text-slate-600">
                            {formatDateTime(alert.created_at)}
                        </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-100">
                        {alert.alert_type.replaceAll("_", " ").toUpperCase()}
                    </h3>

                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
                        {alert.reason || "Pola mencurigakan terdeteksi oleh TrustLens."}
                    </p>

                    {alert.transaction && (
                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                            <InfoBox label="Referensi" value={alert.transaction.transaction_reference} mono />
                            <InfoBox
                                label="Nominal"
                                value={formatCurrency(alert.transaction.amount, alert.transaction.currency)}
                            />
                            <InfoBox
                                label="Rute"
                                value={`${alert.transaction.source_country} → ${alert.transaction.destination_country}`}
                                mono
                            />
                            <InfoBox label="Skor Fraud" value={`${Math.round(alert.risk_score * 100)}`} mono />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 xl:w-52 xl:flex-col">
                    <Button
                        disabled={updating || alert.status === "investigating"}
                        onClick={() => onUpdateStatus(alert.id, "investigating")}
                        variant="outline"
                        className="rounded-sm border-cyan-300/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        Investigasi
                    </Button>

                    <Button
                        disabled={updating || alert.status === "selesai"}
                        onClick={() => onUpdateStatus(alert.id, "selesai")}
                        variant="outline"
                        className="rounded-sm border-emerald-300/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Selesaikan
                    </Button>

                    <Button
                        disabled={updating || alert.status === "diabaikan"}
                        onClick={() => onUpdateStatus(alert.id, "diabaikan")}
                        variant="outline"
                        className="rounded-sm border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Abaikan
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const style =
        severity === "critical"
            ? "border-red-300/30 bg-red-400/10 text-red-200"
            : severity === "high"
                ? "border-orange-300/30 bg-orange-400/10 text-orange-200"
                : severity === "medium"
                    ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                    : "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";

    return (
        <span className={cn("rounded-sm border px-3 py-1 text-xs font-black uppercase tracking-[0.12em]", style)}>
            {severity}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className="rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
            {status}
        </span>
    );
}

function InfoBox({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="rounded-sm border border-white/10 bg-[#050b18] p-3">
            <p className="trust-label">{label}</p>
            <p className={cn("mt-2 truncate text-sm text-slate-200", mono && "trust-mono")}>
                {value}
            </p>
        </div>
    );
}