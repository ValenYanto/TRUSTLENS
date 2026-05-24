import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function AppLogo({
    href = "/",
    compact = false,
    className,
}: {
    href?: string;
    compact?: boolean;
    className?: string;
}) {
    return (
        <Link href={href} className={cn("flex items-center gap-3", className)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-600 text-white shadow-sm shadow-cyan-600/20 dark:bg-cyan-400 dark:text-slate-950">
                <ShieldCheck className="h-5 w-5" />
            </span>
            {!compact && (
                <span>
                    <span className="block text-base font-bold tracking-tight text-slate-950 dark:text-white">
                        TrustLens
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                        Intelijen Fraud
                    </span>
                </span>
            )}
        </Link>
    );
}
