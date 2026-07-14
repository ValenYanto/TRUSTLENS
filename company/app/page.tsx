import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { BusinessSection } from "@/src/components/marketing/business-section";
import { CredibilityStrip } from "@/src/components/marketing/credibility-strip";
import { HeroSection } from "@/src/components/marketing/hero-section";
import { HowItWorksSection } from "@/src/components/marketing/how-it-works-section";
import { InvestorCtaSection } from "@/src/components/marketing/investor-cta-section";
import { ProblemPreview } from "@/src/components/marketing/problem-preview";
import { ProductShowcaseSection } from "@/src/components/marketing/product-showcase-section";
import { RoadmapSection } from "@/src/components/marketing/roadmap-section";
import { SolutionSection } from "@/src/components/marketing/solution-section";
import { TeamSection } from "@/src/components/marketing/team-section";
import { TechnologySection } from "@/src/components/marketing/technology-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
        <CredibilityStrip />
        <ProblemPreview />
        <SolutionSection />
        <HowItWorksSection />
        <TechnologySection />
        <ProductShowcaseSection />
        <BusinessSection />
        <RoadmapSection />
        <TeamSection />
        <InvestorCtaSection />
      </main>

      <SiteFooter />
    </>
  );
}