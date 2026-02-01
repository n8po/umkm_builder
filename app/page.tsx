import { Header } from "@/components/header";
import { DemoLayout } from "@/components/demo-layout";
import { Footer } from "@/components/footer";
import { FeatureSection } from "@/components/feature-section";
import { PricingCard } from "@/components/pricing-card";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <DemoLayout />
      <FeatureSection />
      <Testimonials />
      <div className="flex justify-center w-full py-20 px-4">
        <PricingCard />
      </div>
      <Footer />
    </>
  );
}
