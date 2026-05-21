"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    AlertTriangle,
    Bot,
    CheckCircle2,
    Cpu,
    Loader2,
    Play,
    Radar,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import {
    simulationSchema,
    type SimulationFormInput,
    type SimulationFormValues,
} from "@/lib/validations/simulation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DemoOptions = {
    accounts: {
        id: string;
        account_number: string;
        holder_name: string;
        risk_level: string;
    }[];
    devices: {
        id: string;
        device_fingerprint: string;
        risk_level: string;
        is_blacklisted: boolean;
    }[];
    merchants: {
        id: string;
        name: string;
        category: string | null;
        risk_level: string;
        is_blacklisted: boolean;
    }[];
};

type SimulationResult = {
    message: string;
    transaction_id: string;
    transaction_reference: string;
    fraud_score: number;
    risk_level: "low" | "medium" | "high";
    status: string;
    alert_created: boolean;

    ml_model_used: boolean;
    ml_score: number | null;

    tabular_ml_model_used?: boolean;
    tabular_ml_score?: number | null;
    tabular_model_version?: string | null;
};

const channels = [
    "mobile_banking",
    "internet_banking",
    "payment_gateway",
    "atm",
    "e_wallet",
];

const countries = ["ID", "SG", "MY", "PH", "VN", "US", "RU", "NG"];

export default function SimulationPage() {
    const [options, setOptions] = useState<DemoOptions | null>(null);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SimulationFormInput, unknown, SimulationFormValues>({
        resolver: zodResolver(simulationSchema),
        defaultValues: {
            sender_account_id: "",
            receiver_account_id: "",
            device_id: "",
            merchant_id: "",
            amount: 120000000,
            currency: "IDR",
            channel: "mobile_banking",
            source_country: "ID",
            destination_country: "RU",
            ip_address: "185.220.101.44",
        },
    });

    const watchedAmount = watch("amount");
    const watchedSource = watch("source_country");
    const watchedDestination = watch("destination_country");

    useEffect(() => {
        async function loadOptions() {
            try {
                const data = await apiFetch<DemoOptions>("/transactions/demo/options");
                setOptions(data);

                if (data.accounts.length >= 2) {
                    const defaultSender =
                        data.accounts.find((account) => account.risk_level === "low") ||
                        data.accounts[0];

                    const defaultReceiver =
                        data.accounts.find((account) => account.risk_level === "high") ||
                        data.accounts[1];

                    setValue("sender_account_id", defaultSender.id);
                    setValue("receiver_account_id", defaultReceiver.id);
                }

                const highRiskDevice =
                    data.devices.find((device) => device.is_blacklisted) || data.devices[0];

                const highRiskMerchant =
                    data.merchants.find((merchant) => merchant.risk_level === "high") ||
                    data.merchants[0];

                if (highRiskDevice) setValue("device_id", highRiskDevice.id);
                if (highRiskMerchant) setValue("merchant_id", highRiskMerchant.id);
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Failed to load demo options"
                );
            } finally {
                setLoadingOptions(false);
            }
        }

        loadOptions();
    }, [setValue]);

    const previewRisk = useMemo(() => {
        let score = 8;

        if (Number(watchedAmount) >= 100000000) score += 35;
        else if (Number(watchedAmount) >= 50000000) score += 25;
        else if (Number(watchedAmount) >= 10000000) score += 12;

        if (watchedSource !== watchedDestination) score += 18;

        return Math.min(score, 99);
    }, [watchedAmount, watchedSource, watchedDestination]);

    async function onSubmit(values: SimulationFormValues) {
        setResult(null);

        try {
            const payload = {
                ...values,
                amount: Number(values.amount),
            };

            const data = await apiFetch<SimulationResult>("/transactions", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setResult(data);
            toast.success("Simulation executed successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Simulation failed");
        }
    }

    if (loadingOptions) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
                Loading simulation environment...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
                            FRAUD LAB
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
                            / Simulation / Inference Node
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-100">
                        SIMULATION
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
                        Inject a synthetic transaction into TrustLens. The backend will score
                        it using a risk-aware ensemble: business rule guard plus the trained
                        PaySim XGBoost fraud model.
                    </p>
                </div>

                <div className="trust-panel-soft rounded-md px-5 py-4">
                    <p className="trust-label">Preview Rule Vector</p>
                    <p className="mt-2 text-3xl font-black text-cyan-300">{previewRisk}</p>
                </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_380px]">
                <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    New Simulation Payload
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Configure transaction attributes for fraud scoring.
                                </p>
                            </div>
                            <Radar className="h-5 w-5 text-cyan-300" />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <SelectField
                                    label="Sender Account"
                                    error={errors.sender_account_id?.message}
                                    {...register("sender_account_id")}
                                >
                                    <option value="">Select sender</option>
                                    {options?.accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.holder_name} · {account.risk_level}
                                        </option>
                                    ))}
                                </SelectField>

                                <SelectField
                                    label="Receiver Account"
                                    error={errors.receiver_account_id?.message}
                                    {...register("receiver_account_id")}
                                >
                                    <option value="">Select receiver</option>
                                    {options?.accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.holder_name} · {account.risk_level}
                                        </option>
                                    ))}
                                </SelectField>

                                <SelectField
                                    label="Device Fingerprint"
                                    error={errors.device_id?.message}
                                    {...register("device_id")}
                                >
                                    <option value="">Select device</option>
                                    {options?.devices.map((device) => (
                                        <option key={device.id} value={device.id}>
                                            {device.device_fingerprint} · {device.risk_level}
                                            {device.is_blacklisted ? " · blacklisted" : ""}
                                        </option>
                                    ))}
                                </SelectField>

                                <SelectField
                                    label="Merchant Node"
                                    error={errors.merchant_id?.message}
                                    {...register("merchant_id")}
                                >
                                    <option value="">Select merchant</option>
                                    {options?.merchants.map((merchant) => (
                                        <option key={merchant.id} value={merchant.id}>
                                            {merchant.name} · {merchant.risk_level}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <TextField
                                    label="Amount"
                                    type="number"
                                    error={errors.amount?.message}
                                    {...register("amount")}
                                />

                                <SelectField
                                    label="Currency"
                                    error={errors.currency?.message}
                                    {...register("currency")}
                                >
                                    <option value="IDR">IDR</option>
                                    <option value="USD">USD</option>
                                    <option value="SGD">SGD</option>
                                </SelectField>

                                <SelectField
                                    label="Channel"
                                    error={errors.channel?.message}
                                    {...register("channel")}
                                >
                                    {channels.map((channel) => (
                                        <option key={channel} value={channel}>
                                            {channel.replaceAll("_", " ")}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <SelectField
                                    label="Source Country"
                                    error={errors.source_country?.message}
                                    {...register("source_country")}
                                >
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </SelectField>

                                <SelectField
                                    label="Destination Country"
                                    error={errors.destination_country?.message}
                                    {...register("destination_country")}
                                >
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </SelectField>

                                <TextField
                                    label="IP Address"
                                    error={errors.ip_address?.message}
                                    {...register("ip_address")}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-sm bg-cyan-400 font-black uppercase tracking-[0.1em] text-[#06111f] hover:bg-cyan-300"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Running inference...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" />
                                        Execute Simulation
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="trust-label">Engine Stack</p>
                                    <h3 className="mt-3 text-2xl font-black text-slate-100">
                                        Risk-Aware Ensemble
                                    </h3>
                                </div>
                                <Cpu className="h-8 w-8 text-cyan-300" />
                            </div>

                            <div className="mt-6 space-y-3">
                                <EngineRow icon={<Zap />} label="Rule Engine" value="Risk Guard" />
                                <EngineRow icon={<Bot />} label="PaySim XGBoost" value="Active Model" />
                                <EngineRow icon={<Sparkles />} label="Ensemble Mode" value="Max Guard" />
                            </div>

                            <div className="mt-5 rounded-sm border border-cyan-300/10 bg-cyan-400/5 p-4 text-sm leading-6 text-slate-400">
                                The trained PaySim model contributes probability, while rule-based
                                red flags remain protected to prevent domain mismatch suppression.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                        <CardContent className="p-6">
                            <p className="trust-label">Simulation Result</p>

                            {!result ? (
                                <div className="mt-6 rounded-md border border-white/10 bg-[#050b18] p-6 text-sm leading-6 text-slate-500">
                                    No simulation executed yet. Submit a transaction payload to
                                    generate fraud score and alert decision.
                                </div>
                            ) : (
                                <ResultPanel result={result} amount={Number(watchedAmount || 0)} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

type FieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
};

function SelectField({ label, error, children, ...props }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label className="trust-label">{label}</Label>
            <select
                {...props}
                className="h-12 w-full rounded-sm border border-white/10 bg-[#050b18] px-3 text-sm text-slate-100 outline-none ring-cyan-300/30 focus:ring-2"
            >
                {children}
            </select>
            {error && <p className="text-sm text-red-200">{error}</p>}
        </div>
    );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

function TextField({ label, error, ...props }: TextFieldProps) {
    return (
        <div className="space-y-2">
            <Label className="trust-label">{label}</Label>
            <Input
                {...props}
                className="h-12 rounded-sm border-white/10 bg-[#050b18] text-slate-100 placeholder:text-slate-600"
            />
            {error && <p className="text-sm text-red-200">{error}</p>}
        </div>
    );
}

function EngineRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-[#050b18] p-3">
            <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-cyan-300 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
                {label}
            </div>
            <span className="trust-mono text-sm text-slate-500">{value}</span>
        </div>
    );
}

function ResultPanel({
    result,
    amount,
}: {
    result: SimulationResult;
    amount: number;
}) {
    const score = Math.round(result.fraud_score * 100);

    return (
        <div className="mt-6 space-y-5">
            <div
                className={cn(
                    "rounded-md border p-5",
                    result.risk_level === "high"
                        ? "border-red-300/30 bg-red-400/10"
                        : result.risk_level === "medium"
                            ? "border-cyan-300/30 bg-cyan-400/10"
                            : "border-emerald-300/30 bg-emerald-400/10"
                )}
            >
                <div className="flex items-center justify-between">
                    <p className="trust-label">Fraud Score</p>
                    {result.alert_created ? (
                        <AlertTriangle className="h-5 w-5 text-red-200" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    )}
                </div>

                <p className="mt-4 text-5xl font-black text-slate-100">{score}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.1em] text-slate-400">
                    {result.risk_level} · {result.status}
                </p>
            </div>

            <div className="grid gap-3">
                <ResultRow label="Reference" value={result.transaction_reference} mono />
                <ResultRow label="Amount" value={formatCurrency(amount)} />
                <ResultRow
                    label="Trained ML"
                    value={result.tabular_ml_model_used ? "PAYSIM XGBOOST ACTIVE" : "NOT ACTIVE"}
                />
                <ResultRow
                    label="Tabular ML Score"
                    value={
                        result.tabular_ml_score !== null && result.tabular_ml_score !== undefined
                            ? String(result.tabular_ml_score)
                            : "-"
                    }
                    mono
                />
                <ResultRow
                    label="Model Version"
                    value={result.tabular_model_version || "-"}
                    mono
                />
                <ResultRow
                    label="Alert Created"
                    value={result.alert_created ? "YES" : "NO"}
                />
            </div>
        </div>
    );
}

function ResultRow({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-sm border border-white/10 bg-[#050b18] px-4 py-3">
            <span className="trust-label shrink-0">{label}</span>
            <span
                className={cn(
                    "break-all text-right text-sm text-slate-200",
                    mono && "trust-mono"
                )}
            >
                {value}
            </span>
        </div>
    );
}