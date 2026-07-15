import type { Metadata } from "next";

import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { InvestorForm } from "@/src/components/investor/investor-form";
import { InvestorHero } from "@/src/components/investor/investor-hero";
import { InvestorOverview } from "@/src/components/investor/investor-overview";

export const metadata: Metadata = {
  title: "Investor",

  description:
    "Pelajari peluang investasi dan kerja sama strategis bersama TrustLens, platform fraud intelligence berbasis Graph Neural Network dan Federated Learning.",

  openGraph: {
    title: "Investor | TrustLens",
    description:
      "Bangun masa depan keamanan finansial bersama TrustLens.",
    type: "website",
    locale: "id_ID",
  },
};

export default function InvestorsPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <InvestorHero />
        <InvestorOverview />
        <InvestorForm />
      </main>

      <SiteFooter />
    </>
  );
}