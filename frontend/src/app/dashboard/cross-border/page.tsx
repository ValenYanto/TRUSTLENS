"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Globe2, Loader2, Map, Route, ShieldAlert, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type CrossBorderSummary = { total_transactions: number; domestic_transactions: number; cross_border_transactions: number; cross_border_rate: number; high_risk_cross_border: number; average_cross_border_fraud_score: number };
type RouteItem = { route: string; source_country: string; destination_country: string; transaction_count: number; average_fraud_score: number; high_risk_count: number; total_amount: number };
type RoutesResponse = { total: number; items: RouteItem[] };
type CountryItem = { country_code: string; country_name: string; region: string | null; base_risk_level: string; base_risk_score: number; transaction_count: number; average_fraud_score: number; high_risk_count: number };
type CountriesResponse = { total: number; items: CountryItem[] };
type HighRiskTransaction = { id: string; transaction_reference: string; amount: number; currency: string; route: string; source_country: string; destination_country: string; fraud_score: number; risk_level: string; status: string; transaction_time: string; sender_account?: { holder_name: string } | null; receiver_account?: { holder_name: string } | null };
type HighRiskResponse = { total: number; items: HighRiskTransaction[] };
type TimelineItem = { date: string; transaction_count: number; average_fraud_score: number; high_risk_count: number };
type TimelineResponse = { items: TimelineItem[] };

export default function CrossBorderPage() {
  const [summary, setSummary] = useState<CrossBorderSummary | null>(null);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [highRisk, setHighRisk] = useState<HighRiskTransaction[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [summaryData, routesData, countriesData, highRiskData, timelineData] = await Promise.all([
        apiFetch<CrossBorderSummary>("/cross-border/summary"),
        apiFetch<RoutesResponse>("/cross-border/routes?limit=8"),
        apiFetch<CountriesResponse>("/cross-border/countries?limit=12"),
        apiFetch<HighRiskResponse>("/cross-border/high-risk-transactions?limit=8"),
        apiFetch<TimelineResponse>("/cross-border/timeline"),
      ]);
      setSummary(summaryData); setRoutes(routesData.items); setCountries(countriesData.items); setHighRisk(highRiskData.items); setTimeline(timelineData.items);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal memuat intelijen lintas negara"); }
    finally { setLoading(false); }
  }

  useEffect(() => { const timer = window.setTimeout(loadData, 0); return () => window.clearTimeout(timer); }, []);

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center text-slate-500 dark:text-slate-400"><Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-600 dark:text-cyan-300" />Memuat intelijen lintas negara...</div>;
  if (!summary) return <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">Gagal memuat data lintas negara. Pastikan backend berjalan.</div>;

  return <div className="space-y-8">
    <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Lintas Negara</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl dark:text-white">Intelijen rute transaksi</h1><p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">Pantau rute transaksi lintas negara, pola mencurigakan, dan negara dengan eksposur risiko tinggi.</p></div><div className="rounded-md border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">Rata-rata skor lintas negara</p><p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{summary.average_cross_border_fraud_score.toFixed(2)}</p></div></section>
    <section className="grid gap-4 md:grid-cols-4"><Metric label="Transaksi lintas negara" value={summary.cross_border_transactions} icon={<Globe2 />} /><Metric label="Transaksi domestik" value={summary.domestic_transactions} icon={<Map />} tone="emerald" /><Metric label="Rute risiko tinggi" value={summary.high_risk_cross_border} icon={<ShieldAlert />} tone="red" /><Metric label="Rasio lintas negara" value={`${Math.round(summary.cross_border_rate * 100)}%`} icon={<TrendingUp />} /></section>
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]"><Card className="trust-panel rounded-md"><CardContent className="p-0"><Header title="Rute berisiko" desc="Rute diurutkan berdasarkan rata-rata skor fraud dan jumlah transaksi berisiko." icon={<Route className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />} /><div className="grid gap-4 p-5 md:grid-cols-2">{routes.map((route) => <RouteCard key={route.route} route={route} />)}</div>{routes.length === 0 && <Empty text="Belum ada rute lintas negara." />}</CardContent></Card><Card className="trust-panel rounded-md"><CardContent className="p-6"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Eksposur negara</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Negara dengan aktivitas dan skor fraud tertinggi.</p><div className="mt-5 space-y-3">{countries.slice(0, 7).map((country) => <CountryRow key={country.country_code} country={country} />)}</div></CardContent></Card></section>
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]"><Card className="trust-panel rounded-md"><CardContent className="p-0"><Header title="Transaksi lintas negara berisiko" desc="Transaksi sedang atau tinggi yang melewati batas negara." icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />} /><div className="divide-y divide-slate-200 dark:divide-white/10">{highRisk.map((transaction) => <HighRiskRow key={transaction.id} transaction={transaction} />)}</div>{highRisk.length === 0 && <Empty text="Tidak ada transaksi lintas negara berisiko tinggi." />}</CardContent></Card><Card className="trust-panel rounded-md"><CardContent className="p-6"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Tren harian</h2><div className="mt-6 space-y-4">{timeline.slice(-7).map((item) => <TimelineRow key={item.date} item={item} />)}</div>{timeline.length === 0 && <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">Belum ada data tren.</div>}</CardContent></Card></section>
  </div>;
}

function Header({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) { return <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10"><div><h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p></div>{icon}</div>; }
function Metric({ label, value, icon, tone = "cyan" }: { label: string; value: number | string; icon: React.ReactNode; tone?: "cyan" | "emerald" | "red" }) { const color={cyan:"text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-400/10",emerald:"text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-400/10",red:"text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-400/10"}[tone]; return <Card className="trust-panel rounded-md"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-600 dark:text-slate-400">{label}</p><p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p></div><div className={`rounded-md p-2 [&_svg]:h-5 [&_svg]:w-5 ${color}`}>{icon}</div></div></CardContent></Card>; }
function RouteCard({ route }: { route: RouteItem }) { const tone=route.average_fraud_score>=0.75?"red":route.average_fraud_score>=0.45?"amber":"emerald"; return <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Code>{route.source_country}</Code><ArrowRight className="h-4 w-4 text-slate-400" /><Code>{route.destination_country}</Code></div><RiskPill tone={tone} value={Math.round(route.average_fraud_score*100)} /></div><div className="mt-5 grid grid-cols-3 gap-3 text-sm"><Mini label="Transaksi" value={route.transaction_count} /><Mini label="Tinggi" value={route.high_risk_count} /><Mini label="Nominal" value={formatCurrency(route.total_amount,"IDR")} /></div><p className="mt-4 break-all text-xs text-slate-500 dark:text-slate-400">Rute: {route.route}</p></div>; }
function Code({ children }: { children: React.ReactNode }) { return <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">{children}</span>; }
function RiskPill({ tone, value }: { tone: "red" | "amber" | "emerald"; value: number }) { const cls={red:"bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300",amber:"bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",emerald:"bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"}[tone]; return <span className={cn("rounded-md px-3 py-1.5 font-mono text-sm font-semibold",cls)}>{value}</span>; }
function Mini({ label, value }: { label: string; value: number | string }) { return <div className="min-w-0"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 truncate font-medium text-slate-900 dark:text-slate-100">{value}</p></div>; }
function CountryRow({ country }: { country: CountryItem }) { return <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"><div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{country.country_code} · {country.country_name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{country.region || "Wilayah tidak diketahui"}</p></div><span className="font-mono text-sm text-slate-600 dark:text-slate-300">{Math.round(country.average_fraud_score*100)}</span></div>; }
function HighRiskRow({ transaction }: { transaction: HighRiskTransaction }) { return <div className="p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="break-all font-mono text-sm text-cyan-700 dark:text-cyan-300">{transaction.transaction_reference}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{transaction.sender_account?.holder_name || "Pengirim tidak diketahui"} → {transaction.receiver_account?.holder_name || "Penerima tidak diketahui"}</p><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(transaction.transaction_time)}</p></div><div className="md:text-right"><p className="font-semibold text-slate-950 dark:text-white">{formatCurrency(transaction.amount, transaction.currency)}</p><p className="mt-2 font-mono text-sm text-slate-500 dark:text-slate-400">{transaction.route}</p></div></div></div>; }
function TimelineRow({ item }: { item: TimelineItem }) { const percent=Math.min(Math.round(item.average_fraud_score*100),100); return <div><div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{item.date}</span><span className="font-mono text-slate-500 dark:text-slate-400">{percent}</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-cyan-500" style={{width:`${percent}%`}} /></div><div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>{item.transaction_count} transaksi</span><span>{item.high_risk_count} risiko tinggi</span></div></div>; }
function Empty({ text }: { text: string }) { return <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">{text}</div>; }
