import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import {
  ProductFeaturesSection,
  BuiltForDevelopersSection,
  FinalCtaSection,
} from "@/components/landing-antigravity-sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductFeaturesSection />
        <BuiltForDevelopersSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
