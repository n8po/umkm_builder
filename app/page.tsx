import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import {
  ProductFeaturesSection,
  BusinessSection,
  FinalCtaSection,
} from "@/components/landing-feature-sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductFeaturesSection />
        <BusinessSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
