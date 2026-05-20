"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Globe2,
  Loader2,
  Map,
  Plane,
  Radar,
  Route,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type CrossBorderSummary = {
  total_transactions: number;
  domestic_transactions: number;
  cross_border_transactions: number;
  cross_border_rate: number;
  high_risk_cross_border: number;
  average_cross_border_fraud_score: number;
};

type RouteItem = {
  route: string;
  source_country: string;
  destination_country: string;
  transaction_count: number;
  average_fraud_score: number;
  high_risk_count: number;
  total_amount: number;
};

type RoutesResponse = {
  total: number;
  items: RouteItem[];
};

type CountryItem = {
  country_code: string;
  country_name: string;
  region: string | null;
  base_risk_level: string;
  base_risk_score: number;
  transaction_count: number;
  average_fraud_score: number;
  high_risk_count: number;
};

type CountriesResponse = {
  total: number;
  items: CountryItem[];
};

type HighRiskTransaction = {
  id: string;
  transaction_reference: string;
  amount: number;
  currency: string;
  route: string;
  source_country: string;
  destination_country: string;
  fraud_score: number;
  risk_level: string;
  status: string;
  transaction_time: string;
  sender_account?: {
    id: string;
    holder_name: string;
    account_number: string;
    risk_level: string;
  } | null;
  receiver_account?: {
    id: string;
    holder_name: string;
    account_number: string;
    risk_level: string;
  } | null;
};

type HighRiskResponse = {
  total: number;
  items: HighRiskTransaction[];
};

type TimelineItem = {
  date: string;
  transaction_count: number;
  average_fraud_score: number;
  high_risk_count: number;
};

type TimelineResponse = {
  items: TimelineItem[];
};

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
      const [
        summaryData,
        routesData,
        countriesData,
        highRiskData,
        timelineData,
      ] = await Promise.all([
        apiFetch<CrossBorderSummary>("/cross-border/summary"),
        apiFetch<RoutesResponse>("/cross-border/routes?limit=8"),
        apiFetch<CountriesResponse>("/cross-border/countries?limit=12"),
        apiFetch<HighRiskResponse>("/cross-border/high-risk-transactions?limit=8"),
        apiFetch<TimelineResponse>("/cross-border/timeline"),
      ]);

      setSummary(summaryData);
      setRoutes(routesData.items);
      setCountries(countriesData.items);
      setHighRisk(highRiskData.items);
      setTimeline(timelineData.items);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load cross-border intelligence"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
        Loading cross-border intelligence...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="trust-panel rounded-md p-6 text-red-200">
        Failed to load cross-border intelligence. Make sure backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
              CROSS-BORDER INTELLIGENCE
            </Badge>
            <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
              / Global Rail / Risk Routing
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-100">
            CROSS-BORDER
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
            Monitor international transaction routes, detect suspicious outbound
            patterns, and inspect countries with elevated fraud exposure.
          </p>
        </div>

        <div className="trust-panel-soft rounded-md px-5 py-4">
          <p className="trust-label">Average Cross-Border Score</p>
          <p className="mt-2 text-3xl font-black text-cyan-300">
            {summary.average_cross_border_fraud_score.toFixed(2)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <IntelMetric
          label="Cross-Border Tx"
          value={summary.cross_border_transactions}
          icon={<Globe2 className="h-8 w-8 text-cyan-300" />}
        />
        <IntelMetric
          label="Domestic Tx"
          value={summary.domestic_transactions}
          icon={<Map className="h-8 w-8 text-emerald-300" />}
        />
        <IntelMetric
          label="High-Risk Routes"
          value={summary.high_risk_cross_border}
          icon={<ShieldAlert className="h-8 w-8 text-red-200" />}
        />
        <IntelMetric
          label="Cross-Border Rate"
          value={`${Math.round(summary.cross_border_rate * 100)}%`}
          icon={<TrendingUp className="h-8 w-8 text-blue-200" />}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_390px]">
        <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-4">
              <div>
                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                  Global Route Intelligence
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ranked by average fraud score and suspicious route density.
                </p>
              </div>
              <Route className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              {routes.map((route) => (
                <RouteCard key={route.route} route={route} />
              ))}
            </div>

            {routes.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No cross-border routes detected yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="trust-label">Risk Map Panel</p>
                <h3 className="mt-2 text-2xl font-black text-slate-100">
                  Country Exposure
                </h3>
              </div>
              <Radar className="h-7 w-7 text-cyan-300" />
            </div>

            <div className="relative mt-7 h-56 overflow-hidden rounded-md border border-cyan-300/10 bg-[#050b18] trust-grid-bg">
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 bg-cyan-400/10 blur-sm" />
              <div className="absolute left-[18%] top-[30%] h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.8)]" />
              <div className="absolute left-[47%] top-[44%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(21,184,255,0.9)]" />
              <div className="absolute right-[20%] top-[28%] h-5 w-5 rounded-full bg-red-300 shadow-[0_0_28px_rgba(252,165,165,0.9)]" />
              <div className="absolute bottom-[24%] right-[34%] h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_20px_rgba(253,186,116,0.8)]" />

              <div className="absolute bottom-4 left-4 rounded-sm border border-white/10 bg-[#050b18]/80 px-3 py-2 text-xs text-slate-400">
                LIVE REGION SIGNALS
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {countries.slice(0, 6).map((country) => (
                <CountryRiskRow key={country.country_code} country={country} />
              ))}
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
                  High-Risk Cross-Border Stream
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Medium/high-risk transactions that crossed country boundaries.
                </p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-200" />
            </div>

            <div className="divide-y divide-white/5">
              {highRisk.map((transaction) => (
                <HighRiskRow key={transaction.id} transaction={transaction} />
              ))}
            </div>

            {highRisk.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No high-risk cross-border transaction detected.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
          <CardContent className="p-6">
            <p className="trust-label">Timeline Signal</p>
            <h3 className="mt-2 text-2xl font-black text-slate-100">
              Daily Risk Pulse
            </h3>

            <div className="mt-7 space-y-4">
              {timeline.slice(-7).map((item) => (
                <TimelineRow key={item.date} item={item} />
              ))}
            </div>

            {timeline.length === 0 && (
              <div className="mt-7 rounded-sm border border-white/10 bg-[#050b18] p-5 text-sm text-slate-500">
                No timeline data available.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function IntelMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
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
        <p className="mt-4 text-xs uppercase tracking-[0.1em] text-slate-600">
          Global intelligence feed
        </p>
      </CardContent>
    </Card>
  );
}

function RouteCard({ route }: { route: RouteItem }) {
  const riskTone =
    route.average_fraud_score >= 0.75
      ? "red"
      : route.average_fraud_score >= 0.45
        ? "cyan"
        : "emerald";

  return (
    <div className="rounded-md border border-white/10 bg-[#050b18] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CountryCode code={route.source_country} />
          <ArrowRight className="h-4 w-4 text-slate-600" />
          <CountryCode code={route.destination_country} />
        </div>

        <RiskPill tone={riskTone} value={Math.round(route.average_fraud_score * 100)} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniIntel label="Tx" value={route.transaction_count} />
        <MiniIntel label="High" value={route.high_risk_count} />
        <MiniIntel
          label="Value"
          value={formatCurrency(route.total_amount, "IDR").replace("Rp", "Rp ")}
        />
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-600">
        Route signature: {route.route}
      </p>
    </div>
  );
}

function CountryCode({ code }: { code: string }) {
  return (
    <span className="trust-mono rounded-sm border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-bold text-cyan-300">
      {code}
    </span>
  );
}

function RiskPill({ tone, value }: { tone: "red" | "cyan" | "emerald"; value: number }) {
  const style = {
    red: "border-red-300/30 bg-red-400/10 text-red-200",
    cyan: "border-cyan-300/30 bg-cyan-400/10 text-cyan-200",
    emerald: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  }[tone];

  return (
    <span className={cn("trust-mono rounded-sm border px-3 py-2 text-sm font-bold", style)}>
      {value}
    </span>
  );
}

function MiniIntel({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.03] p-3">
      <p className="trust-label">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}

function CountryRiskRow({ country }: { country: CountryItem }) {
  const tone =
    country.average_fraud_score >= 0.75 || country.base_risk_level === "high"
      ? "bg-red-300"
      : country.average_fraud_score >= 0.45 || country.base_risk_level === "medium"
        ? "bg-cyan-300"
        : "bg-emerald-300";

  return (
    <div className="flex items-center justify-between rounded-sm border border-white/10 bg-[#050b18] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={cn("h-2.5 w-2.5 rounded-full", tone)} />
        <div>
          <p className="text-sm font-bold text-slate-200">
            {country.country_code} · {country.country_name}
          </p>
          <p className="text-xs text-slate-600">{country.region || "Unknown region"}</p>
        </div>
      </div>

      <span className="trust-mono text-sm text-slate-400">
        {Math.round(country.average_fraud_score * 100)}
      </span>
    </div>
  );
}

function HighRiskRow({ transaction }: { transaction: HighRiskTransaction }) {
  return (
    <div className="p-5 transition hover:bg-cyan-400/[0.03]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="trust-mono text-sm text-cyan-300">
              {transaction.transaction_reference}
            </span>
            <span className="rounded-sm border border-red-300/30 bg-red-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-red-200">
              {transaction.risk_level}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            {transaction.sender_account?.holder_name || "Unknown sender"}
            <span className="mx-2 text-slate-600">→</span>
            {transaction.receiver_account?.holder_name || "Unknown receiver"}
          </p>

          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-600">
            {formatDateTime(transaction.transaction_time)}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="font-bold text-slate-100">
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
          <p className="mt-2 trust-mono text-sm text-cyan-300">
            {transaction.route}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  const percent = Math.min(Math.round(item.average_fraud_score * 100), 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">{item.date}</span>
        <span className="trust-mono text-slate-500">{percent}</span>
      </div>
      <div className="h-2 rounded-full bg-[#050b18]">
        <div
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
        <span>{item.transaction_count} tx</span>
        <span>{item.high_risk_count} high-risk</span>
      </div>
    </div>
  );
}
