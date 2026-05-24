"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppLogo } from "@/components/layout/app-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export default function LoginPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "valen@trustlens.dev",
            password: "password123",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            await login(values.email, values.password);
            toast.success("Berhasil masuk ke TrustLens");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal masuk");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <AppLogo />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button asChild variant="ghost" className="rounded-md">
                        <Link href="/">Beranda</Link>
                    </Button>
                </div>
            </header>

            <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="hidden lg:block">
                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Akses analyst</p>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                        Masuk ke TrustLens
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                        Pantau risiko transaksi dan investigasi fraud dari satu tempat.
                    </p>
                    <div className="mt-8 grid max-w-xl gap-3">
                        {["Skor fraud berbasis risiko", "Pelabelan oleh analyst", "Intelijen relasi dan lintas negara"].map((item) => (
                            <div key={item} className="rounded-md border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="mx-auto w-full max-w-lg border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">
                    <CardContent className="p-6 md:p-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Masuk ke TrustLens</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                Pantau risiko transaksi dan investigasi fraud dari satu tempat.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="analyst@trustlens.dev" {...register("email")} />
                                {errors.email && <p className="text-sm text-red-600 dark:text-red-300">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata sandi</Label>
                                <Input id="password" type="password" placeholder="Masukkan kata sandi" {...register("password")} />
                                {errors.password && <p className="text-sm text-red-600 dark:text-red-300">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-md bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Masuk
                            </Button>
                        </form>

                        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                            Akun demo: <span className="font-medium text-slate-900 dark:text-slate-200">valen@trustlens.dev / password123</span>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            Belum punya akun? <Link href="/register" className="font-medium text-cyan-700 hover:underline dark:text-cyan-300">Daftar</Link>
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
