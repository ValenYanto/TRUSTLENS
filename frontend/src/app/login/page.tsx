"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("valen@trustlens.dev");
    const [password, setPassword] = useState("password123");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Login successful");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_35%)]" />

            <div className="relative flex min-h-screen items-center justify-center px-4">
                <Card className="w-full max-w-md border-white/10 bg-slate-900/80 text-slate-100 shadow-2xl backdrop-blur">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold tracking-tight">
                                TrustLens
                            </CardTitle>
                            <CardDescription className="mt-2 text-slate-400">
                                Real-time fraud intelligence dashboard
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    className="border-white/10 bg-slate-950/70 text-slate-100"
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    className="border-white/10 bg-slate-950/70 text-slate-100"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>

                            <p className="text-center text-xs text-slate-500">
                                Demo account: valen@trustlens.dev / password123
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}