import { Header } from "@/components/header";
import { DemoLayout } from "@/components/demo-layout";
import { Footer } from "@/components/footer";
import { ExpandableMapSection } from "@/components/expandable-map-section";

export default function Home() {
  return (
    <>
      <Header />
      <DemoLayout />
      <ExpandableMapSection />
      <Footer />
    </>
  );
}
