import {
  BrainCircuit,
  Code2,
  Lightbulb,
  Presentation,
} from "lucide-react";

import { ScrollReveal } from "@/src/components/motion/scroll-reveal";
import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";

const teamMembers = [
  {
    initials: "AP",
    name: "Amanda Puja Nur Aini",
    role: "Team Lead",
    institution: "Telkom University",
    icon: Presentation,
    description:
      "Mengkoordinasikan arah inovasi, pengembangan tim, dan penyampaian strategi TrustLens.",
  },
  {
    initials: "JS",
    name: "Ja’far Shodiq Hibatullah",
    role: "Business & Strategy",
    institution: "Universitas Gadjah Mada",
    icon: Lightbulb,
    description:
      "Berfokus pada market positioning, business strategy, dan validasi kebutuhan industri.",
  },
  {
    initials: "AN",
    name: "Anas Nasuha",
    role: "Product & Experience",
    institution: "IPB University",
    icon: BrainCircuit,
    description:
      "Berfokus pada product development, pengalaman pengguna, dan penyampaian nilai produk.",
  },
  {
    initials: "VY",
    name: "Valentino Yohanes Yanto",
    role: "Engineering",
    institution: "IPB University",
    icon: Code2,
    description:
      "Berfokus pada implementasi teknis, integrasi sistem, dan pengembangan platform.",
  },
] as const;

export function TeamSection() {
  return (
    <section className="py-24 sm:py-30">
      <Container>
        <ScrollReveal>
          <SectionHeading
            align="center"
            description="Tim multidisiplin dengan kompetensi pada pengembangan perangkat lunak, artificial intelligence, analisis data, produk, dan strategi bisnis."
            eyebrow="The team"
            title="Dibangun oleh tim lintas disiplin dan universitas."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;

            return (
              <ScrollReveal
                delay={index * 0.07}
                key={member.name}
              >
                <article className="h-full rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/35">
                  <div className="flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/25 to-brand-blue/20 font-display text-lg font-extrabold text-primary">
                      {member.initials}
                    </div>

                    <Icon className="size-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-6 font-display text-lg font-bold">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-primary">
                    {member.role}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {member.institution}
                  </p>

                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    {member.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}