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
        <main className="relative min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(21,184,255,0.16),_transparent_34%),linear-gradient(135deg,_rgba(21,184,255,0.06),_transparent_35%)]" />
            <div className="absolute inset-0 trust-grid-bg opacity-40" />

            <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tight text-cyan-400">
                        TRUSTLENS
                    </h1>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Secure Protocol Active
                    </div>
                </div>

                <Card className="w-full max-w-xl overflow-hidden rounded-sm border-cyan-300/10 bg-[#0b1220]/95 text-slate-100 shadow-2xl trust-glow">
                    <CardHeader className="border-b border-white/10 bg-white/[0.04]">
                        <div className="flex items-center justify-between">
                            <CardTitle className="trust-label text-slate-300">
                                System Authentication
                            </CardTitle>
                            <span className="text-xs font-medium text-cyan-400">NODE_TX_4492</span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <div className="mb-8 rounded-sm border border-red-300/30 bg-red-400/10 p-5">
                            <div className="flex gap-4">
                                <ShieldCheck className="mt-1 h-6 w-6 text-red-200" />
                                <div>
                                    <h2 className="font-bold uppercase text-red-100">
                                        Level 4 Security Clearance Required
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        Unauthorized access attempts are logged and reported to the
                                        TrustLens intelligence core.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="trust-label">Personnel System ID</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    className="h-14 rounded-sm border-white/10 bg-[#050b18] text-slate-100"
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="trust-label">Biometric Token Hash</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    className="h-14 rounded-sm border-white/10 bg-[#050b18] text-slate-100"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-14 w-full rounded-sm bg-cyan-400 font-bold uppercase tracking-[0.18em] text-[#06111f] hover:bg-cyan-300"
                                disabled={loading}
                            >
                                {loading ? "Initializing..." : "Initialize Decryption"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full rounded-sm border-white/10 bg-transparent uppercase tracking-[0.18em] text-slate-400 hover:bg-white/5"
                            >
                                Emergency Access Bypass
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}