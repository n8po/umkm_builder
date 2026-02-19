"use client";

import { useState } from "react";
import { Calculator, BarChart2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HPPCalculator } from "../../components/calculator/hpp-calculator";
import { BEPCalculator } from "../../components/calculator/bep-calculator";

export default function CostAnalysisPage() {
  const [hppResult, setHppResult] = useState(0);

  return (
    <>
      <Header />
      <main className="w-full max-w-4xl mx-auto px-4 pt-28 pb-8 sm:pt-32 sm:pb-10">

        {/* Page Header */}
        <div className="mb-8 text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Analisis Biaya Usaha
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Hitung HPP dan BEP bisnis Anda dengan mudah, lalu unduh hasilnya dalam PDF atau Excel.
          </p>
        </div>

        <Tabs defaultValue="hpp" className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 h-10">
            <TabsTrigger value="hpp" className="flex-1 sm:flex-none px-6 text-sm font-semibold flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Kalkulator HPP
            </TabsTrigger>
            <TabsTrigger value="bep" className="flex-1 sm:flex-none px-6 text-sm font-semibold flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Kalkulator BEP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hpp">
            <HPPCalculator onHPPCalculated={setHppResult} />
          </TabsContent>

          <TabsContent value="bep">
            <BEPCalculator initialHPP={hppResult} />
          </TabsContent>
        </Tabs>

      </main>
      <Footer />
    </>
  );
}