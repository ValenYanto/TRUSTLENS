"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileCheck2,
  Loader2,
  RefreshCcw,
  Search,
  ShieldAlert,
  Tags,
  TerminalSquare,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { compactId, formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { labelSchema, type LabelFormValues } from "@/lib/validations/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TransaksiItem = {
  id: string;
  transaction_reference: string;
  amount: number;
  currency: string;
  channel: string;
  source_country: string;
  destination_country: string;
  status: string;
  fraud_score: number;
  risk_level: "low" | "medium" | "high";
  transaction_time: string;
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
    risk_level: string;
    is_blacklisted: boolean;
  } | null;
};

type TransaksisResponse = {
  total: number;
  limit: number;
  darifset: number;
  items: TransaksiItem[];
};

type LabelItem = {
  id: string;
  transaction_id: string;
  label: "fraud" | "legitimate" | "suspicious";
  labelled_by: string | null;
  notes: string | null;
  created_at: string;
  transaction?: {
    id: string;
    transaction_reference: string;
    amount: number;
    currency: string;
    fraud_score: number;
    risk_level: string;
    status: string;
  } | null;
};

type LabelsResponse = {
  total: number;
  limit: number;
  darifset: number;
  items: LabelItem[];
};

type LabelResponse = {
  message: string;
  label_id: string;
  transaction_id: string;
  label: string;
  alert_updated: boolean;
};

const labelOptions = [
  {
    value: "fraud",
    title: "Fraud",
    description: "Aktivitas fraud terkonfirmasi.",
    icon: AlertTriangle,
  },
  {
    value: "suspicious",
    title: "Mencurigakan",
    description: "Perlu investigasi lanjutan.",
    icon: ShieldAlert,
  },
  {
    value: "legitimate",
    title: "Sah",
    description: "False positive atau transaksi aman.",
    icon: CheckCircle2,
  },
] as const;

export default function LabelingPage() {
  const [transactions, setTransaksis] = useState<TransaksiItem[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [selectedTransaksi, setSelectedTransaksi] =
    useState<TransaksiItem | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LabelFormValues>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      transaction_id: "",
      label: "suspicious",
      labelled_by: "Valen Yanto",
      notes: "",
    },
  });

  const selectedLabel = watch("label");

  async function loadData() {
    setLoading(true);

    try {
      const [transactionsData, labelsData] = await Promise.all([
        apiFetch<TransaksisResponse>("/transactions?limit=60"),
        apiFetch<LabelsResponse>("/labels?limit=20"),
      ]);

      setTransaksis(transactionsData.items);
      setLabels(labelsData.items);

      if (!selectedTransaksi && transactionsData.items.length > 0) {
        selectTransaksi(transactionsData.items[0]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat data pelabelan");
    } finally {
      setLoading(false);
    }
  }

  function selectTransaksi(transaction: TransaksiItem) {
    setSelectedTransaksi(transaction);
    setValue("transaction_id", transaction.id);
  }

  async function onSubmit(values: LabelFormValues) {
    try {
      const result = await apiFetch<LabelResponse>("/labels", {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast.success(
        result.alert_updated
          ? "Label disimpan dan status peringatan diperbarui"
          : "Label berhasil disimpan"
      );

      reset({
        transaction_id: values.transaction_id,
        label: "suspicious",
        labelled_by: values.labelled_by,
        notes: "",
      });

      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan label");
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTransaksis = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return transactions;

    return transactions.filter((transaction) => {
      return [
        transaction.transaction_reference,
        transaction.sender_account?.holder_name,
        transaction.receiver_account?.holder_name,
        transaction.merchant?.name,
        transaction.risk_level,
        transaction.status,
        transaction.source_country,
        transaction.destination_country,
      ]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(keyword));
    });
  }, [transactions, search]);

  const fraudLabels = labels.filter((item) => item.label === "fraud").length;
  const suspiciousLabels = labels.filter((item) => item.label === "suspicious").length;
  const legitimateLabels = labels.filter((item) => item.label === "legitimate").length;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
        Memuat antrian pelabelan...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
              Pelabelan analyst
            </Badge>
            <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
              / Human-in-the-loop / Antrian label
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-100">
            Pelabelan
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
            Validasi keputusan model dengan memberi label fraud, mencurigakan, atau sah. Label ini menjadi data pembelajaran model adaptif.
          </p>
        </div>

        <Button
          onClick={loadData}
          className="rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Muat ulang
        </Button>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <LabelMetric
          label="Label fraud"
          value={fraudLabels}
          icon={<AlertTriangle className="h-8 w-8 text-red-200" />}
          tone="red"
        />
        <LabelMetric
          label="Label mencurigakan"
          value={suspiciousLabels}
          icon={<ShieldAlert className="h-8 w-8 text-cyan-300" />}
          tone="cyan"
        />
        <LabelMetric
          label="Label sah"
          value={legitimateLabels}
          icon={<CheckCircle2 className="h-8 w-8 text-emerald-300" />}
          tone="emerald"
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[430px_1fr]">
        <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
          <CardContent className="p-0">
            <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                    Transaksi Queue
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Pilih satu transaksi untuk ditinjau.
                  </p>
                </div>
                <Database className="h-5 w-5 text-cyan-300" />
              </div>

              <div className="mt-4 flex h-11 items-center gap-3 rounded-sm bg-[#050b18] px-3">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari transaksi..."
                  className="h-full border-0 bg-transparent px-0 text-slate-200 placeholder:text-slate-600 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="max-h-[760px] overflow-y-auto">
              {filteredTransaksis.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => selectTransaksi(transaction)}
                  className={cn(
                    "w-full border-b border-white/5 p-5 text-left transition hover:bg-cyan-400/[0.04]",
                    selectedTransaksi?.id === transaction.id &&
                      "bg-cyan-400/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="trust-mono text-sm text-cyan-300">
                      {compactId(transaction.transaction_reference, 10, 4)}
                    </span>
                    <RisikoTag risk={transaction.risk_level} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-200">
                    {transaction.sender_account?.holder_name || "Pengirim tidak diketahui"}
                    <span className="mx-2 text-slate-600">→</span>
                    {transaction.receiver_account?.holder_name || "Penerima tidak diketahui"}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {transaction.source_country} → {transaction.destination_country}
                    </span>
                    <span>{Math.round(transaction.fraud_score * 100)}</span>
                  </div>
                </button>
              ))}

              {filteredTransaksis.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500">
                  Tidak ada transaksi sesuai pencarian.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                <div>
                  <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                    Form pelabelan
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Kirim keputusan analyst untuk transaksi terpilih.
                  </p>
                </div>
                <TerminalSquare className="h-5 w-5 text-cyan-300" />
              </div>

              {!selectedTransaksi ? (
                <div className="p-8 text-slate-500">
                  Pilih transaksi dari antrian.
                </div>
              ) : (
                <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
                  <TransaksiDetail transaction={selectedTransaksi} />

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <input type="hidden" {...register("transaction_id")} />

                    <div className="space-y-2">
                      <Label className="trust-label">Nama analyst</Label>
                      <Input
                        className="h-12 rounded-sm border-white/10 bg-[#050b18] text-slate-100"
                        {...register("labelled_by")}
                      />
                      {errors.labelled_by && (
                        <p className="text-sm text-red-200">
                          {errors.labelled_by.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="trust-label">Label klasifikasi</Label>

                      <div className="space-y-3">
                        {labelOptions.map((option) => {
                          const Icon = option.icon;
                          const active = selectedLabel === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setValue("label", option.value)}
                              className={cn(
                                "w-full rounded-sm border p-4 text-left transition",
                                active
                                  ? "border-cyan-300 bg-cyan-400/10"
                                  : "border-white/10 bg-[#050b18] hover:bg-white/[0.03]"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <Icon
                                  className={cn(
                                    "mt-1 h-5 w-5",
                                    option.value === "fraud"
                                      ? "text-red-200"
                                      : option.value === "legitimate"
                                        ? "text-emerald-300"
                                        : "text-cyan-300"
                                  )}
                                />
                                <div>
                                  <p className="font-bold uppercase tracking-[0.08em] text-slate-100">
                                    {option.title}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-slate-500">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {errors.label && (
                        <p className="text-sm text-red-200">
                          {errors.label.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="trust-label">Catatan analyst</Label>
                      <textarea
                        rows={5}
                        className="w-full rounded-sm border border-white/10 bg-[#050b18] px-3 py-3 text-sm text-slate-100 outline-none ring-cyan-300/30 placeholder:text-slate-600 focus:ring-2"
                        placeholder="Write evidence, graph pattern, or reason..."
                        {...register("notes")}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-13 w-full rounded-sm bg-cyan-400 font-bold uppercase tracking-[0.1em] text-[#06111f] hover:bg-cyan-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan label...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          Commit Classification
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
                <div>
                  <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                    Recent Ground Truth
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest analyst labels stored in TrustLens.
                  </p>
                </div>
                <FileCheck2 className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="divide-y divide-white/5">
                {labels.slice(0, 8).map((label) => (
                  <div key={label.id} className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <LabelChip label={label.label} />
                        <span className="trust-mono text-xs text-slate-600">
                          {formatDateTime(label.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {label.transaction?.transaction_reference || label.transaction_id}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      {label.labelled_by || "Unknown analyst"}
                    </p>
                  </div>
                ))}

                {labels.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No label history available.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function LabelMetric({
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
      </CardContent>
    </Card>
  );
}

function TransaksiDetail({ transaction }: { transaction: TransaksiItem }) {
  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-white/10 bg-[#050b18] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="trust-label">Selected Transaksi</p>
            <p className="mt-2 trust-mono text-lg font-bold text-cyan-300">
              {transaction.transaction_reference}
            </p>
          </div>
          <RisikoTag risk={transaction.risk_level} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <InfoBox
            label="Nominal"
            value={formatCurrency(transaction.amount, transaction.currency)}
          />
          <InfoBox
            label="Skor Fraud"
            value={`${Math.round(transaction.fraud_score * 100)}`}
            mono
          />
          <InfoBox
            label="Rute"
            value={`${transaction.source_country} → ${transaction.destination_country}`}
            mono
          />
          <InfoBox label="Status" value={transaction.status} />
          <InfoBox
            label="Sender"
            value={transaction.sender_account?.holder_name || "Unknown"}
          />
          <InfoBox
            label="Receiver"
            value={transaction.receiver_account?.holder_name || "Unknown"}
          />
          <InfoBox
            label="Merchant"
            value={transaction.merchant?.name || "No merchant"}
          />
          <InfoBox
            label="Waktu"
            value={formatDateTime(transaction.transaction_time)}
          />
        </div>
      </div>
    </div>
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
    <div className="rounded-sm border border-white/10 bg-white/[0.03] p-3">
      <p className="trust-label">{label}</p>
      <p className={cn("mt-2 truncate text-sm text-slate-200", mono && "trust-mono")}>
        {value}
      </p>
    </div>
  );
}

function RisikoTag({ risk }: { risk: string }) {
  const style =
    risk === "high"
      ? "border-red-300/30 bg-red-400/10 text-red-200"
      : risk === "medium"
        ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
        : "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";

  return (
    <span className={cn("rounded-sm border px-3 py-1 text-xs font-black uppercase tracking-[0.1em]", style)}>
      {risk}
    </span>
  );
}

function LabelChip({ label }: { label: string }) {
  const style =
    label === "fraud"
      ? "border-red-300/30 bg-red-400/10 text-red-200"
      : label === "legitimate"
        ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
        : "border-cyan-300/30 bg-cyan-400/10 text-cyan-200";

  return (
    <span className={cn("rounded-sm border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]", style)}>
      {label}
    </span>
  );
}
