"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, GitBranch, Network, ShieldCheck, UserCheck } from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const solusi = [
    { title: "Skor Risiko Terpadu", description: "Menggabungkan rule guard, sinyal ML, dan ensemble agar risiko kuat tetap terlihat jelas.", icon: ShieldCheck },
    { title: "Analisis Relasi", description: "Melihat hubungan akun, perangkat, merchant, transaksi, dan negara untuk membantu investigasi.", icon: Network },
    { title: "Pembelajaran Adaptif", description: "Label dari analyst menjadi data umpan balik untuk model internal TrustLens.", icon: BrainCircuit },
    { title: "Alur Investigasi Analyst", description: "Peringatan, pelabelan, simulasi, dan log audit disusun sebagai workflow yang mudah dijelaskan.", icon: UserCheck },
];

const langkah = ["Transaksi masuk", "Skor dihitung", "Peringatan dibuat", "Analyst memberi label", "Model diperbarui"];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                    <AppLogo />
                    <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex dark:text-slate-400">
                        <a href="#fitur" className="hover:text-slate-950 dark:hover:text-white">Fitur</a>
                        <a href="#cara-kerja" className="hover:text-slate-950 dark:hover:text-white">Cara Kerja</a>
                        <a href="#ai" className="hover:text-slate-950 dark:hover:text-white">AI</a>
                        <Link href="/dashboard/simulation" className="hover:text-slate-950 dark:hover:text-white">Demo</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button asChild variant="outline" className="hidden rounded-md sm:inline-flex"><Link href="/login">Masuk</Link></Button>
                        <Button asChild className="rounded-md bg-slate-950 text-white hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"><Link href="/register">Mulai Sekarang</Link></Button>
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.10),transparent_28%)]" />
                <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">MVP Hackathon Bank Indonesia</div>
                        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl dark:text-white">Deteksi fraud transaksi dengan AI yang dapat dijelaskan.</h1>
                        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-400">TrustLens membantu institusi keuangan memantau transaksi, mendeteksi pola mencurigakan, dan mempercepat investigasi melalui risk guard, machine learning, graph intelligence, dan umpan balik analyst.</p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild className="h-11 rounded-md bg-cyan-700 px-5 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"><Link href="/dashboard">Buka Dasbor <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                            <Button asChild variant="outline" className="h-11 rounded-md"><Link href="/dashboard/simulation">Coba Simulasi</Link></Button>
                            <Button asChild variant="ghost" className="h-11 rounded-md"><Link href="/login">Masuk</Link></Button>
                        </div>
                    </div>

                    <Card className="border-slate-200 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                                <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ringkasan risiko</p><p className="text-sm text-slate-500 dark:text-slate-400">Mockup dasbor TrustLens</p></div>
                                <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                            </div>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <HeroMetric label="Skor Fraud" value="86" tone="red" />
                                <HeroMetric label="Peringatan Aktif" value="12" tone="amber" />
                                <HeroMetric label="Model AI Aktif" value="2" tone="cyan" />
                                <HeroMetric label="Relasi Berisiko" value="34" tone="emerald" />
                            </div>
                            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100">Keputusan: transaksi ditandai untuk investigasi analyst.</div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section id="fitur" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                <div className="max-w-3xl"><p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Masalah</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Fraud modern tidak cukup ditangani dengan aturan statis.</h2></div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {["Pola fraud berubah cepat dan sering menyebar lintas kanal.", "False positive membebani analyst dan memperlambat investigasi.", "Relasi akun, perangkat, merchant, dan negara sulit dianalisis manual."].map((item) => <Card key={item} className="border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"><CardContent className="p-6 text-sm leading-6 text-slate-600 dark:text-slate-400">{item}</CardContent></Card>)}
                </div>
            </section>

            <section className="bg-slate-50 py-16 dark:bg-white/[0.03]">
                <div className="mx-auto max-w-7xl px-4 md:px-6"><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Solusi</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Workflow fraud intelligence yang ringkas dan jelas.</h2><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{solusi.map((card) => { const Icon = card.icon; return <Card key={card.title} className="border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950"><CardContent className="p-6"><Icon className="h-7 w-7 text-cyan-700 dark:text-cyan-300" /><h3 className="mt-5 font-semibold text-slate-950 dark:text-white">{card.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.description}</p></CardContent></Card>; })}</div></div>
            </section>

            <section id="ai" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-2">
                <Card className="border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"><CardContent className="p-6"><GitBranch className="h-8 w-8 text-emerald-600 dark:text-emerald-300" /><h2 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">AI yang kredibel, tanpa overclaim.</h2><div className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-400"><p><strong className="text-slate-900 dark:text-slate-200">PaySim XGBoost</strong> menjadi sinyal benchmark fraud tabular publik.</p><p><strong className="text-slate-900 dark:text-slate-200">Model Adaptif TrustLens</strong> belajar dari label analyst di dalam MVP.</p><p><strong className="text-slate-900 dark:text-slate-200">GraphSAGE Elliptic</strong> digunakan sebagai prototype pembelajaran graph. Keputusan MVP tetap dijaga oleh risk-aware ensemble.</p></div></CardContent></Card>
                <Card id="cara-kerja" className="border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"><CardContent className="p-6"><CheckCircle2 className="h-8 w-8 text-cyan-700 dark:text-cyan-300" /><h2 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Cara kerja demo.</h2><div className="mt-6 space-y-3">{langkah.map((step, index) => <div key={step} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-700 text-xs font-bold text-white dark:bg-cyan-400 dark:text-slate-950">{index + 1}</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{step}</span></div>)}</div></CardContent></Card>
            </section>

            <footer className="border-t border-slate-200 bg-slate-50 py-8 dark:border-white/10 dark:bg-slate-950"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6"><div><p className="font-semibold text-slate-950 dark:text-white">TrustLens</p><p className="text-sm text-slate-500 dark:text-slate-400">MVP Hackathon Bank Indonesia</p></div><div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400"><Link href="/login" className="hover:text-cyan-700 dark:hover:text-cyan-300">Masuk</Link><Link href="/register" className="hover:text-cyan-700 dark:hover:text-cyan-300">Daftar</Link><Link href="/dashboard" className="hover:text-cyan-700 dark:hover:text-cyan-300">Dasbor</Link></div></div></footer>
        </main>
    );
}

function HeroMetric({ label, value, tone }: { label: string; value: string; tone: "red" | "amber" | "cyan" | "emerald" }) {
    const color = { red: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-400/10", amber: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-400/10", cyan: "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-400/10", emerald: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-400/10" }[tone];
    return <div className={`rounded-md p-4 ${color}`}><p className="text-sm font-medium">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
}
