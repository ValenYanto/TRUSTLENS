import {
  Clock3,
  Network,
  ShieldOff,
} from "lucide-react";

import { Container } from "@/src/components/shared/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const problems = [
  {
    icon: Network,
    title: "Fraud tidak lagi berdiri sendiri",
    description:
      "Pola fraud modern membentuk jaringan kompleks yang menghubungkan akun, perangkat, merchant, alamat IP, dan negara.",
  },
  {
    icon: ShieldOff,
    title: "Data tidak dapat dibagikan sembarangan",
    description:
      "Institusi keuangan membutuhkan kolaborasi, tetapi tetap harus menjaga data transaksi dan identitas nasabah.",
  },
  {
    icon: Clock3,
    title: "Sistem konvensional terlambat bereaksi",
    description:
      "Rule statis dan batch processing kesulitan mengikuti pola penipuan baru yang bergerak secara real-time.",
  },
] as const;

export function ProblemPreview() {
  return (
    <section
      className="relative border-y border-border bg-card/30 py-24 sm:py-30"
      id="masalah"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Tantangan industri
            </p>

            <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
              Sistem lama melihat transaksi. TrustLens melihat{" "}
              <span className="text-primary">hubungannya.</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
              Fraud modern memanfaatkan banyak identitas dan saluran.
              Menganalisis satu transaksi secara terpisah tidak lagi cukup
              untuk menemukan jaringan risiko yang tersembunyi.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((problem) => {
              const Icon = problem.icon;

              return (
                <Card
                  className="group border-border bg-card/80 transition duration-300 hover:-translate-y-1 hover:border-primary/30"
                  key={problem.title}
                >
                  <CardHeader>
                    <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <CardTitle className="font-display text-lg leading-6">
                      {problem.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}