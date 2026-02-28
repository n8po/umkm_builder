import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import {
  ProductFeaturesSection,
  BusinessSection,
  FinalCtaSection,
} from "@/components/landing-feature-sections";
import { ProductDemoSection } from "@/components/landing-sections";

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/ai-chat");
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductDemoSection />
        <ProductFeaturesSection />
        <BusinessSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
