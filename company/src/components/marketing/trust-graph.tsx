"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

const normalNodes = [
  { cx: 82, cy: 96, delay: 0 },
  { cx: 142, cy: 58, delay: 0.3 },
  { cx: 211, cy: 96, delay: 0.6 },
  { cx: 103, cy: 169, delay: 0.9 },
  { cx: 202, cy: 184, delay: 1.2 },
] as const;

const paths = [
  "M82 96 L142 58",
  "M142 58 L211 96",
  "M82 96 L103 169",
  "M103 169 L202 184",
  "M202 184 L211 96",
  "M82 96 L211 96",
  "M142 58 L202 184",
] as const;

export function TrustGraph() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Live intelligence
          </p>

          <p className="mt-1 font-display text-sm font-bold text-foreground">
            Transaction Network
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Real-time
        </div>
      </div>

      <div className="relative min-h-78 overflow-hidden p-5">
        <div className="absolute inset-0 graph-grid opacity-40" />

        <svg
          aria-label="Visualisasi jaringan transaksi TrustLens"
          className="relative mx-auto h-56 w-full max-w-md overflow-visible"
          role="img"
          viewBox="0 0 290 230"
        >
          {paths.map((path, index) => (
            <motion.path
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: [0.2, 0.65, 0.2],
                      pathLength: [0.45, 1, 0.45],
                    }
              }
              className="stroke-primary/35"
              d={path}
              fill="none"
              initial={{
                opacity: 0.2,
                pathLength: 0.45,
              }}
              key={path}
              strokeLinecap="round"
              strokeWidth="1.4"
              transition={{
                delay: index * 0.12,
                duration: 3.8,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}

          {normalNodes.map((node) => (
            <g key={`${node.cx}-${node.cy}`}>
              <motion.circle
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: [0.14, 0.32, 0.14],
                        r: [12, 17, 12],
                      }
                }
                className="fill-primary"
                cx={node.cx}
                cy={node.cy}
                initial={{
                  opacity: 0.14,
                  r: 12,
                }}
                transition={{
                  delay: node.delay,
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              <circle
                className="fill-card stroke-primary"
                cx={node.cx}
                cy={node.cy}
                r="7"
                strokeWidth="2"
              />

              <circle
                className="fill-primary"
                cx={node.cx}
                cy={node.cy}
                r="2.5"
              />
            </g>
          ))}

          <motion.circle
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.2, 0.45, 0.2],
                    r: [18, 24, 18],
                  }
            }
            className="fill-destructive"
            cx="247"
            cy="148"
            initial={{
              opacity: 0.2,
              r: 18,
            }}
            transition={{
              duration: 2.4,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />

          <circle
            className="fill-card stroke-destructive"
            cx="247"
            cy="148"
            r="10"
            strokeWidth="2.5"
          />

          <circle
            className="fill-destructive"
            cx="247"
            cy="148"
            r="4"
          />

          <motion.path
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.25, 1, 0.25],
                    pathLength: [0, 1, 1],
                  }
            }
            className="stroke-destructive"
            d="M211 96 L247 148"
            fill="none"
            initial={{
              opacity: 0.25,
              pathLength: 0,
            }}
            strokeDasharray="4 5"
            strokeWidth="2"
            transition={{
              duration: 2.4,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </svg>

        <div className="relative grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <Activity className="size-4 text-primary" />

              <ArrowUpRight className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-5 font-display text-2xl font-extrabold">
              24.8K
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Transaksi dianalisis
            </p>
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <ShieldAlert className="size-4 text-destructive" />

              <span className="rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-bold uppercase text-destructive">
                High risk
              </span>
            </div>

            <p className="mt-5 font-display text-2xl font-extrabold">
              03
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Jaringan terdeteksi
            </p>
          </div>
        </div>

        <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <CheckCircle2 className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Privacy-preserving analysis
            </p>

            <p className="text-xs text-muted-foreground">
              Model belajar tanpa memindahkan data mentah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}