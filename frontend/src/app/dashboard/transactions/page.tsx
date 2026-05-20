"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    Copy,
    Download,
    Filter,
    Loader2,
    RefreshCcw,
    Search,
    ShieldAlert,
    SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { compactId, formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TransactionItem = {
    id: string;
    transaction_reference: string;
    sender_account_id: string;
    receiver_account_id: string;
    device_id: string | null;
    merchant_id: string | null;
    amount: number;
    currency: string;
    channel: string;
    source_country: string;
    destination_country: string;
    ip_address: string | null;
    status: string;
    fraud_score: number;
    risk_level: "low" | "medium" | "high";
    transaction_time: string;
    created_at: string;
    sender_account?: {
        id: string;
        account_number: string;
        holder_name: string;
        risk_level: string;
    } | null;
    receiver_account?: {
        id: string;
        account_number: string;
        holder_name: string;
        risk_level: string;
    } | null;
    merchant?: {
        id: string;
        name: string;
        category: string | null;
        country_code: string | null;
        risk_level: string;
        is_blacklisted: boolean;
    } | null;
};

type TransactionsResponse = {
    total: number;
    limit: number;
    offset: number;
    items: TransactionItem[];
};

const riskOptions = ["all", "low", "medium", "high"] as const;
const statusOptions = ["all", "approved", "flagged", "blocked", "pending"] as const;

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [total, setTotal] = useState(0);
    const [riskLevel, setRiskLevel] = useState<(typeof riskOptions)[number]>("all");
    const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const queryPath = useMemo(() => {
        const params = new URLSearchParams();
        params.set("limit", "50");

        if (riskLevel !== "all") params.set("risk_level", riskLevel);
        if (status !== "all") params.set("status", status);

        return `/transactions?${params.toString()}`;
    }, [riskLevel, status]);

    async function loadTransactions() {
        setLoading(true);

        try {
            const data = await apiFetch<TransactionsResponse>(queryPath);
            setTransactions(data.items);
            setTotal(data.total);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryPath]);

    const filteredTransactions = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return transactions;

        return transactions.filter((transaction) => {
            return [
                transaction.transaction_reference,
                transaction.source_country,
                transaction.destination_country,
                transaction.channel,
                transaction.status,
                transaction.risk_level,
                transaction.sender_account?.holder_name,
                transaction.receiver_account?.holder_name,
                transaction.merchant?.name,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword));
        });
    }, [transactions, search]);

    function copyReference(reference: string) {
        navigator.clipboard.writeText(reference);
        toast.success("Transaction reference copied");
    }

    function exportCsv() {
        const headers = [
            "reference",
            "time",
            "sender",
            "receiver",
            "route",
            "amount",
            "fraud_score",
            "risk_level",
            "status",
        ];

        const rows = filteredTransactions.map((transaction) => [
            transaction.transaction_reference,
            transaction.transaction_time,
            transaction.sender_account?.holder_name || "-",
            transaction.receiver_account?.holder_name || "-",
            `${transaction.source_country}-${transaction.destination_country}`,
            transaction.amount,
            transaction.fraud_score,
            transaction.risk_level,
            transaction.status,
        ]);

        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "trustlens-transactions.csv";
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
                            REAL-TIME STREAM
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
                            / Ledger / Transaction Monitor
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-100">
                        TRANSACTIONS
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
                        Deep inspection of financial movements with fraud score, route
                        intelligence, account relation, and risk vector classification.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={exportCsv}
                        variant="outline"
                        className="rounded-sm border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button
                        onClick={loadTransactions}
                        className="rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Sync Node
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
                <div className="trust-panel-soft rounded-md p-4">
                    <p className="trust-label mb-3">Search Protocol</p>
                    <div className="flex h-11 items-center gap-3 rounded-sm bg-[#050b18] px-3">
                        <Search className="h-4 w-4 text-slate-500" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Hash / account / merchant / route..."
                            className="h-full border-0 bg-transparent px-0 text-slate-200 placeholder:text-slate-600 focus-visible:ring-0"
                        />
                    </div>
                </div>

                <FilterBox title="Risk Sensitivity" icon={<ShieldAlert className="h-4 w-4" />}>
                    <div className="flex flex-wrap gap-2">
                        {riskOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => setRiskLevel(option)}
                                className={cn(
                                    "rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]",
                                    riskLevel === option
                                        ? "border-cyan-300 bg-cyan-400/10 text-cyan-300"
                                        : "border-white/10 bg-[#050b18] text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </FilterBox>

                <FilterBox title="Status Filter" icon={<SlidersHorizontal className="h-4 w-4" />}>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => setStatus(option)}
                                className={cn(
                                    "rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]",
                                    status === option
                                        ? "border-cyan-300 bg-cyan-400/10 text-cyan-300"
                                        : "border-white/10 bg-[#050b18] text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </FilterBox>

                <FilterBox title="Node Load" icon={<Activity className="h-4 w-4" />}>
                    <div>
                        <p className="text-2xl font-black text-cyan-300">{total}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                            Matched transactions
                        </p>
                    </div>
                </FilterBox>
            </section>

            <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                <CardContent className="p-0">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                        <div className="text-sm uppercase tracking-[0.14em] text-slate-400">
                            Streaming: <span className="font-bold text-emerald-300">Active</span>
                            <span className="ml-6 text-slate-600">Matched: {filteredTransactions.length} records</span>
                        </div>
                        <Filter className="h-4 w-4 text-slate-500" />
                    </div>

                    {loading ? (
                        <div className="flex h-80 items-center justify-center text-slate-400">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
                            Loading transaction stream...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] text-left">
                                <thead className="bg-[#081120] text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Timestamp</th>
                                        <th className="px-6 py-4 font-medium">Transaction Hash</th>
                                        <th className="px-6 py-4 font-medium">Account Flow</th>
                                        <th className="px-6 py-4 font-medium">Route</th>
                                        <th className="px-6 py-4 font-medium">Value</th>
                                        <th className="px-6 py-4 font-medium">Risk Vector</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/5">
                                    {filteredTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="bg-slate-900/30 transition hover:bg-cyan-400/[0.04]"
                                        >
                                            <td className="px-6 py-5 align-top">
                                                <p className="text-sm text-slate-300">
                                                    {formatDateTime(transaction.transaction_time)}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-600">UTC+7</p>
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <button
                                                    onClick={() => copyReference(transaction.transaction_reference)}
                                                    className="flex items-center gap-2 font-mono text-sm text-cyan-300 hover:text-cyan-200"
                                                >
                                                    {compactId(transaction.transaction_reference)}
                                                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                                                </button>
                                                <p className="mt-1 text-xs text-slate-600">
                                                    {transaction.channel.replaceAll("_", " ")}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <p className="text-sm font-semibold text-slate-200">
                                                    {transaction.sender_account?.holder_name || "Unknown Sender"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    → {transaction.receiver_account?.holder_name || "Unknown Receiver"}
                                                </p>
                                                {transaction.merchant && (
                                                    <p className="mt-2 text-xs text-cyan-300">
                                                        {transaction.merchant.name}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <div className="inline-flex items-center rounded-sm border border-cyan-300/10 bg-cyan-400/5 px-3 py-1 font-mono text-sm text-slate-300">
                                                    {transaction.source_country}
                                                    <span className="mx-2 text-slate-600">→</span>
                                                    {transaction.destination_country}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <p className="font-bold text-slate-100">
                                                    {formatCurrency(transaction.amount, transaction.currency)}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-600">
                                                    {transaction.currency}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <RiskBadge risk={transaction.risk_level} score={transaction.fraud_score} />
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <StatusBadge status={transaction.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredTransactions.length === 0 && (
                                <div className="p-10 text-center text-slate-500">
                                    No transaction vectors matched your filter.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function FilterBox({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="trust-panel-soft rounded-md p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="trust-label">{title}</p>
                <span className="text-slate-500">{icon}</span>
            </div>
            {children}
        </div>
    );
}

function RiskBadge({ risk, score }: { risk: string; score: number }) {
    const style =
        risk === "high"
            ? "border-red-300/30 bg-red-400/10 text-red-200"
            : risk === "medium"
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                : "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";

    const label =
        risk === "high" ? "CRITICAL" : risk === "medium" ? "ELEVATED" : "NOMINAL";

    return (
        <div className={cn("inline-flex min-w-28 flex-col rounded-sm border px-3 py-2", style)}>
            <span className="text-[10px] font-black uppercase tracking-[0.14em]">{label}</span>
            <span className="font-mono text-sm">{Math.round(score * 100)}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const style =
        status === "blocked"
            ? "text-red-200"
            : status === "flagged"
                ? "text-cyan-200"
                : status === "approved"
                    ? "text-emerald-200"
                    : "text-slate-300";

    return (
        <span className={cn("text-xs font-bold uppercase tracking-[0.12em]", style)}>
            {status.replaceAll("_", " ")}
        </span>
    );
}