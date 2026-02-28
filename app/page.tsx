import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const token = cookieStore.get("umkm_access_token")?.value;

  if (token) {
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
