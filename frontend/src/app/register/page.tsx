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
import { registerUser } from "@/lib/auth";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            confirm_password: "",
            role: "ANALYST",
            institution_name: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        try {
            await registerUser({
                full_name: values.full_name,
                email: values.email,
                password: values.password,
                role: values.role,
                institution_name: values.institution_name || null,
            });
            toast.success("Akun berhasil dibuat. Silakan masuk.");
            router.push("/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal mendaftar");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <AppLogo />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button asChild variant="ghost" className="rounded-md">
                        <Link href="/login">Masuk</Link>
                    </Button>
                </div>
            </header>

            <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="hidden lg:block">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Buat akses analyst</p>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                        Buat akun TrustLens
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                        Daftarkan akun untuk mencoba dasbor deteksi fraud.
                    </p>
                </div>

                <Card className="mx-auto w-full max-w-xl border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">
                    <CardContent className="p-6 md:p-8">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Daftar</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Daftarkan akun untuk mencoba dasbor deteksi fraud.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Nama</Label>
                                <Input id="full_name" placeholder="Nama analyst" {...register("full_name")} />
                                {errors.full_name && <p className="text-sm text-red-600 dark:text-red-300">{errors.full_name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="analyst@institution.co.id" {...register("email")} />
                                {errors.email && <p className="text-sm text-red-600 dark:text-red-300">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Kata sandi</Label>
                                    <Input id="password" type="password" placeholder="Minimal 6 karakter" {...register("password")} />
                                    {errors.password && <p className="text-sm text-red-600 dark:text-red-300">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm_password">Konfirmasi kata sandi</Label>
                                    <Input id="confirm_password" type="password" placeholder="Ulangi kata sandi" {...register("confirm_password")} />
                                    {errors.confirm_password && <p className="text-sm text-red-600 dark:text-red-300">{errors.confirm_password.message}</p>}
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Peran</Label>
                                    <select id="role" className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" {...register("role")}>
                                        <option value="ANALYST">Analyst</option>
                                        <option value="INSTITUTION">Institusi</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institution_name">Institusi name</Label>
                                <Input id="institution_name" placeholder="Bank atau organisasi" {...register("institution_name")} />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="h-11 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Daftar
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            Sudah punya akun? <Link href="/login" className="font-medium text-cyan-700 hover:underline dark:text-cyan-300">Masuk</Link>
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
