"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    DatabaseZap,
    GitBranch,
    Loader2,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ModelMetrics = {
    threshold?: number;
    roc_auc?: number | null;
    pr_auc?: number | null;
    precision?: number | null;
    recall?: number | null;
    f1?: number | null;
    false_positive_rate?: number | null;
    false_negative_rate?: number | null;
    confusion_matrix?: {
        tn: number;
        fp: number;
        fn: number;
        tp: number;
    } | null;
    dataset_rows?: number;
    train_rows?: number;
    test_rows?: number;
    fraud_count?: number;
    legitimate_count?: number;
    fraud_ratio?: number;
    model_family?: string;
    dataset_name?: string;
    model_name?: string;
    version?: string;
    created_at?: string;
    warning?: string | null;
    graph_nodes?: number;
    graph_edges?: number;
    labelled_count?: number;
    validation_rows?: number;
    hidden_dim?: number;
    epochs?: number;
};

type MlModelsResponse = {
    items: ModelMetrics[];
};

type MlStatusResponse = {
    baseline_model: {
        model_available: boolean;
        model_path?: string;
    };
    active_tabular_model: ModelMetrics | null;
};

type MlMetricsResponse = {
    model_available: boolean;
    active_model?: ModelMetrics;
};

type AdaptiveStatusResponse = {
    adaptive_learning_enabled: boolean;
    active_model: ModelMetrics | null;
    new_labels_since_last_training: number;
    min_labels_required: number;
    ready_for_retraining: boolean;
    recommended_action: string;
};

type TrainResponse = {
    message?: string;
    retrained?: boolean;
    result?: ModelMetrics;
    training_result?: ModelMetrics;
    reason?: string;
    new_labels_since_last_training?: number;
    min_labels_required?: number;
};

export default function MlMonitorPage() {
    const [mlStatus, setMlStatus] = useState<MlStatusResponse | null>(null);
    const [mlMetrics, setMlMetrics] = useState<MlMetricsResponse | null>(null);
    const [adaptiveStatus, setAdaptiveStatus] =
        useState<AdaptiveStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [trainingAction, setTrainingAction] = useState<string | null>(null);
    const [models, setModels] = useState<ModelMetrics[]>([]);

    async function loadData() {
        setLoading(true);

        try {
            const [statusData, metricsData, adaptiveData, modelsData] = await Promise.all([
                apiFetch<MlStatusResponse>("/ml/status"),
                apiFetch<MlMetricsResponse>("/ml/metrics"),
                apiFetch<AdaptiveStatusResponse>("/ml/adaptive/status"),
                apiFetch<MlModelsResponse>("/ml/models"),
            ]);
            setMlStatus(statusData);
            setMlMetrics(metricsData);
            setAdaptiveStatus(adaptiveData);
            setModels(modelsData.items ?? []);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal memuat Monitor AI");
        } finally {
            setLoading(false);
        }
    }

    async function trainPaySim() {
        setTrainingAction("paysim");

        try {
            await apiFetch<TrainResponse>("/ml/train/paysim?model=xgboost&limit_rows=200000", {
                method: "POST",
            });

            toast.success("PaySim XGBoost model trained successfully");
            await loadData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal melatih model PaySim");
        } finally {
            setTrainingAction(null);
        }
    }

    async function trainInternal() {
        setTrainingAction("internal");

        try {
            await apiFetch<TrainResponse>("/ml/train/trustlens?min_samples=5", {
                method: "POST",
            });

            toast.success("TrustLens internal adaptive model trained successfully");
            await loadData();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal melatih model adaptif TrustLens"
            );
        } finally {
            setTrainingAction(null);
        }
    }

    async function adaptiveRetrain(force = false) {
        setTrainingAction(force ? "force-retrain" : "adaptive-retrain");

        try {
            const data = await apiFetch<TrainResponse>(
                `/ml/adaptive/retrain${force ? "?force=true" : ""}`,
                { method: "POST" }
            );

            if (data.retrained === false) {
                toast.warning(data.reason || "Adaptive retraining skipped");
            } else {
                toast.success("Adaptive retraining completed");
            }

            await loadData();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Adaptive retraining failed");
        } finally {
            setTrainingAction(null);
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadData();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const activeModel = mlMetrics?.active_model || mlStatus?.active_tabular_model || null;
    const internalModel = models.find(
        (model) => model.dataset_name === "trustlens_internal"
    );

    const readinessPercent = useMemo(() => {
        if (!adaptiveStatus) return 0;

        return Math.min(
            100,
            Math.round(
                (adaptiveStatus.new_labels_since_last_training /
                    adaptiveStatus.min_labels_required) *
                100
            )
        );
    }, [adaptiveStatus]);

    const graphModel = models.find(
        (model) => model.dataset_name === "elliptic" && model.model_name === "graphsage"
    );

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
                Memuat monitor AI...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
                            Operasional model
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
                            / PaySim / Pembelajaran adaptif / Prototype graph
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-100">
                        Monitor AI
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
                        Pantau performa model AI TrustLens, kesiapan retraining, dan versi model yang digunakan dalam scoring fraud.
                    </p>
                </div>

                <Button
                    onClick={loadData}
                    variant="outline"
                    className="rounded-sm border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Muat ulang
                </Button>
            </section>

            <section className="grid gap-6 md:grid-cols-4">
                <MlMetric
                    label="ROC-AUC"
                    value={formatMetric(activeModel?.roc_auc)}
                    icon={<Activity className="h-8 w-8 text-cyan-300" />}
                />
                <MlMetric
                    label="PR-AUC"
                    value={formatMetric(activeModel?.pr_auc)}
                    icon={<Sparkles className="h-8 w-8 text-emerald-300" />}
                />
                <MlMetric
                    label="Recall"
                    value={formatMetric(activeModel?.recall)}
                    icon={<ShieldCheck className="h-8 w-8 text-blue-200" />}
                />
                <MlMetric
                    label="F1 Score"
                    value={formatMetric(activeModel?.f1)}
                    icon={<BrainCircuit className="h-8 w-8 text-red-200" />}
                />
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_390px]">
                <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    Model Tabular Publik: PaySim XGBoost
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Model benchmark publik PaySim XGBoost sebagai sinyal fraud tabular.
                                </p>
                            </div>
                            <DatabaseZap className="h-5 w-5 text-cyan-300" />
                        </div>

                        {!activeModel ? (
                            <div className="p-8 text-sm text-slate-500">
                                Belum ada model tabular aktif. Latih PaySim XGBoost terlebih dahulu.
                            </div>
                        ) : (
                            <div className="grid gap-5 p-6 md:grid-cols-2">
                                <InfoBox label="Dataset" value={activeModel.dataset_name || "-"} />
                                <InfoBox label="Model" value={activeModel.model_name || "-"} />
                                <InfoBox label="Keluarga model" value={activeModel.model_family || "-"} />
                                <InfoBox label="Versi" value={compactVersi(activeModel.version)} mono />
                                <InfoBox
                                    label="Jumlah data"
                                    value={String(activeModel.dataset_rows ?? "-")}
                                    mono
                                />
                                <InfoBox
                                    label="Rasio fraud"
                                    value={
                                        activeModel.fraud_ratio !== undefined
                                            ? `${(activeModel.fraud_ratio * 100).toFixed(4)}%`
                                            : "-"
                                    }
                                    mono
                                />
                                <InfoBox label="ROC-AUC" value={formatMetric(activeModel.roc_auc)} mono />
                                <InfoBox label="PR-AUC" value={formatMetric(activeModel.pr_auc)} mono />
                                <InfoBox label="Presisi" value={formatMetric(activeModel.precision)} mono />
                                <InfoBox label="Recall" value={formatMetric(activeModel.recall)} mono />
                                <InfoBox label="F1" value={formatMetric(activeModel.f1)} mono />
                                <InfoBox
                                    label="FPR"
                                    value={formatMetric(activeModel.false_positive_rate)}
                                    mono
                                />
                                <InfoBox
                                    label="FNR"
                                    value={formatMetric(activeModel.false_negative_rate)}
                                    mono
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="trust-label">Pembelajaran adaptif</p>
                                <h3 className="mt-3 text-2xl font-black text-slate-100">
                                    {adaptiveStatus?.ready_for_retraining ? "Siap" : "Mengumpulkan label"}
                                </h3>
                            </div>

                            {adaptiveStatus?.ready_for_retraining ? (
                                <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-cyan-300" />
                            )}
                        </div>

                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-slate-400">Label baru</span>
                                <span className="trust-mono text-slate-300">
                                    {adaptiveStatus?.new_labels_since_last_training ?? 0}/
                                    {adaptiveStatus?.min_labels_required ?? 0}
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-[#050b18]">
                                <div
                                    className="h-full rounded-full bg-cyan-300"
                                    style={{ width: `${readinessPercent}%` }}
                                />
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                Rekomendasi aksi:{" "}
                                <span className="text-cyan-300">
                                    {adaptiveStatus?.recommended_action || "-"}
                                </span>
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                onClick={() => adaptiveRetrain(false)}
                                disabled={trainingAction !== null}
                                className="h-11 w-full rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
                            >
                                {trainingAction === "adaptive-retrain" ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="mr-2 h-4 w-4" />
                                )}
                                Retrain adaptif
                            </Button>

                            <Button
                                onClick={() => adaptiveRetrain(true)}
                                disabled={trainingAction !== null}
                                variant="outline"
                                className="h-11 w-full rounded-sm border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                            >
                                Paksa retrain
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-8 xl:grid-cols-[390px_1fr]">
                <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-6">
                        <p className="trust-label">Kontrol training</p>

                        <div className="mt-6 space-y-3">
                            <Button
                                onClick={trainPaySim}
                                disabled={trainingAction !== null}
                                className="h-12 w-full rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
                            >
                                {trainingAction === "paysim" ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <DatabaseZap className="mr-2 h-4 w-4" />
                                )}
                                Latih PaySim XGBoost
                            </Button>

                            <Button
                                onClick={trainInternal}
                                disabled={trainingAction !== null}
                                variant="outline"
                                className="h-12 w-full rounded-sm border-emerald-300/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                            >
                                {trainingAction === "internal" ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <GitBranch className="mr-2 h-4 w-4" />
                                )}
                                Train Model adaptif
                            </Button>
                        </div>

                        <div className="mt-6 rounded-sm border border-cyan-300/10 bg-cyan-400/5 p-4 text-sm leading-6 text-slate-400">
                            PaySim XGBoost dilatih dari dataset fraud publik. Model adaptif internal dilatih dari label analyst di TrustLens.
                        </div>
                    </CardContent>
                </Card>

                <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    Confusion matrix
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Evaluasi model publik aktif.
                                </p>
                            </div>
                            <BrainCircuit className="h-5 w-5 text-cyan-300" />
                        </div>

                        <div className="grid gap-4 p-6 md:grid-cols-4">
                            <ConfusionBox
                                label="True Negative"
                                value={activeModel?.confusion_matrix?.tn}
                                tone="emerald"
                            />
                            <ConfusionBox
                                label="False Positive"
                                value={activeModel?.confusion_matrix?.fp}
                                tone="cyan"
                            />
                            <ConfusionBox
                                label="False Negative"
                                value={activeModel?.confusion_matrix?.fn}
                                tone="red"
                            />
                            <ConfusionBox
                                label="True Positive"
                                value={activeModel?.confusion_matrix?.tp}
                                tone="emerald"
                            />
                        </div>

                        {activeModel?.warning && (
                            <div className="mx-6 mb-6 rounded-sm border border-orange-300/20 bg-orange-400/10 p-4 text-sm text-orange-100">
                                {activeModel.warning}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_390px]">
                <Card className="trust-panel overflow-hidden rounded-md border-emerald-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    Model Adaptif TrustLens: RandomForest
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Model dari label analyst sebagai sinyal adaptif lokal.
                                </p>
                            </div>
                            <GitBranch className="h-5 w-5 text-emerald-300" />
                        </div>

                        {!internalModel ? (
                            <div className="p-8 text-sm text-slate-500">
                                Belum ada artifact model adaptif TrustLens.
                            </div>
                        ) : (
                            <div className="grid gap-5 p-6 md:grid-cols-2">
                                <InfoBox label="Dataset" value={internalModel.dataset_name || "-"} />
                                <InfoBox label="Model" value={internalModel.model_name || "-"} />
                                <InfoBox label="Versi" value={compactVersi(internalModel.version)} mono />
                                <InfoBox label="Jumlah data" value={String(internalModel.dataset_rows ?? "-")} mono />
                                <InfoBox label="Jumlah fraud" value={String(internalModel.fraud_count ?? "-")} mono />
                                <InfoBox label="Jumlah sah" value={String(internalModel.legitimate_count ?? "-")} mono />
                                <InfoBox label="ROC-AUC" value={formatMetric(internalModel.roc_auc)} mono />
                                <InfoBox label="PR-AUC" value={formatMetric(internalModel.pr_auc)} mono />
                                <InfoBox label="Presisi" value={formatMetric(internalModel.precision)} mono />
                                <InfoBox label="Recall" value={formatMetric(internalModel.recall)} mono />
                                <InfoBox label="F1" value={formatMetric(internalModel.f1)} mono />
                            </div>
                        )}

                        {internalModel?.warning && (
                            <div className="mx-6 mb-6 rounded-sm border border-orange-300/20 bg-orange-400/10 p-4 text-sm leading-6 text-orange-100">
                                {internalModel.warning}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="trust-panel rounded-md border-emerald-300/10 text-slate-100">
                    <CardContent className="p-6">
                        <p className="trust-label">Peran model adaptif</p>

                        <div className="mt-6 space-y-3">
                            <InfoBox label="Jenis sinyal" value="Model adaptif dari human-in-the-loop" />
                            <InfoBox label="Sumber training" value="Transaksi PostgreSQL + label analyst" />
                            <InfoBox
                                label="Peran dalam MVP"
                                value="Sinyal pendukung; rule guard tetap menjaga red flag kuat"
                            />
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section className="grid gap-8 xl:grid-cols-[1fr_390px]">
                <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    Prototype Graph Learning: Elliptic GraphSAGE
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Prototype GraphSAGE untuk bukti pembelajaran graph.
                                </p>
                            </div>
                            <GitBranch className="h-5 w-5 text-cyan-300" />
                        </div>

                        {!graphModel ? (
                            <div className="p-8 text-sm text-slate-500">
                                Belum ada artifact GraphSAGE. Latih prototype Elliptic GraphSAGE dari backend.
                            </div>
                        ) : (
                            <div className="grid gap-5 p-6 md:grid-cols-2">
                                <InfoBox label="Dataset" value={graphModel.dataset_name || "-"} />
                                <InfoBox label="Model" value={graphModel.model_name || "-"} />
                                <InfoBox label="Keluarga model" value={graphModel.model_family || "-"} />
                                <InfoBox label="Versi" value={compactVersi(graphModel.version)} mono />
                                <InfoBox label="Node relasi" value={String(graphModel.graph_nodes ?? "-")} mono />
                                <InfoBox label="Edge relasi" value={String(graphModel.graph_edges ?? "-")} mono />
                                <InfoBox label="Node berlabel" value={String(graphModel.labelled_count ?? "-")} mono />
                                <InfoBox label="ROC-AUC" value={formatMetric(graphModel.roc_auc)} mono />
                                <InfoBox label="PR-AUC" value={formatMetric(graphModel.pr_auc)} mono />
                                <InfoBox label="Recall" value={formatMetric(graphModel.recall)} mono />
                                <InfoBox label="F1" value={formatMetric(graphModel.f1)} mono />
                            </div>
                        )}

                        {graphModel?.warning && (
                            <div className="mx-6 mb-6 rounded-sm border border-orange-300/20 bg-orange-400/10 p-4 text-sm leading-6 text-orange-100">
                                {graphModel.warning}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-6">
                        <p className="trust-label">Status graph learning</p>

                        <div className="mt-6 space-y-3">
                            <InfoBox
                                label="Arsitektur"
                                value="Manual PyTorch GraphSAGE"
                            />
                            <InfoBox
                                label="Epoch training"
                                value={String(graphModel?.epochs ?? "-")}
                                mono
                            />
                            <InfoBox
                                label="Hidden dim"
                                value={String(graphModel?.hidden_dim ?? "-")}
                                mono
                            />
                            <InfoBox
                                label="Node berlabel"
                                value={String(graphModel?.labelled_count ?? "-")}
                                mono
                            />
                        </div>

                        <div className="mt-6 rounded-sm border border-cyan-300/10 bg-cyan-400/5 p-4 text-sm leading-6 text-slate-400">
                            Dataset Elliptic berbasis transaksi kripto dan digunakan sebagai prototype pembelajaran graph, bukan model produksi langsung untuk transfer bank. Scoring MVP tetap memakai rule guard, PaySim XGBoost, dan model adaptif internal.
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

function MlMetric({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <Card className="trust-panel rounded-xl border-cyan-300/10 text-slate-100">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="trust-label">{label}</p>
                        <p className="mt-4 text-4xl font-black text-cyan-300">{value}</p>
                    </div>
                    {icon}
                </div>
            </CardContent>
        </Card>
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
        <div className="rounded-sm border border-white/10 bg-[#050b18] p-4">
            <p className="trust-label">{label}</p>
            <p
                className={cn(
                    "mt-2 break-words text-sm text-slate-200",
                    mono && "trust-mono text-xs"
                )}
            >
                {value}
            </p>
        </div>
    );
}

function ConfusionBox({
    label,
    value,
    tone,
}: {
    label: string;
    value?: number;
    tone: "emerald" | "cyan" | "red";
}) {
    const color = {
        emerald: "text-emerald-300",
        cyan: "text-cyan-300",
        red: "text-red-200",
    }[tone];

    return (
        <div className="rounded-sm border border-white/10 bg-[#050b18] p-5">
            <p className="trust-label">{label}</p>
            <p className={cn("mt-4 text-3xl font-black", color)}>
                {value ?? "-"}
            </p>
        </div>
    );
}

function formatMetric(value?: number | null) {
    if (value === null || value === undefined) return "-";
    return value.toFixed(4);
}

function compactVersi(value?: string | null) {
    if (!value) return "-";

    return value
        .replace("paysim_xgboost_", "xgb_")
        .replace("trustlens_internal_adaptive_random_forest_", "tl_rf_")
        .replace("elliptic_graphsage_", "elliptic_gs_");
}