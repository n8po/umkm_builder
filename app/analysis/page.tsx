"use client";

import React, { useState, useMemo } from "react";
import { Calculator, DollarSign, Package, TrendingUp, AlertCircle } from "lucide-react";

// --- Tipe Data State ---
interface CalculatorState {
  // HPP per Unit (Variable Costs)
  rawMaterial: number;
  directLabor: number;
  overheadPerUnit: number;
  // Biaya Tetap Bulanan (Fixed Costs)
  rentCost: number;
  salariesCost: number;
  utilitiesCost: number;
  marketingCost: number;
  // Harga Jual
  sellingPrice: number;
}

const initialState: CalculatorState = {
  rawMaterial: 0,
  directLabor: 0,
  overheadPerUnit: 0,
  rentCost: 0,
  salariesCost: 0,
  utilitiesCost: 0,
  marketingCost: 0,
  sellingPrice: 0,
};

export default function BusinessCalculator() {
  const [values, setValues] = useState<CalculatorState>(initialState);

  // --- Handler Perubahan Input ---
  // Fungsi generik untuk menangani input angka
  const handleInputChange = (field: keyof CalculatorState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setValues((prev) => ({
      ...prev,
      [field]: isNaN(val) || val < 0 ? 0 : val, // Mencegah NaN atau angka negatif
    }));
  };

  // --- Logika Perhitungan (Menggunakan useMemo agar efisien) ---

  // 1. Hitung Total HPP per Unit (Total Variable Cost)
  const totalHPPPerUnit = useMemo(() => {
    return values.rawMaterial + values.directLabor + values.overheadPerUnit;
  }, [values.rawMaterial, values.directLabor, values.overheadPerUnit]);

  // 2. Hitung Total Biaya Tetap Bulanan (Total Fixed Cost)
  const totalFixedMonthly = useMemo(() => {
    return values.rentCost + values.salariesCost + values.utilitiesCost + values.marketingCost;
  }, [values.rentCost, values.salariesCost, values.utilitiesCost, values.marketingCost]);

  // 3. Hitung Margin Kontribusi (Harga Jual - HPP Unit)
  const contributionMargin = useMemo(() => {
    return values.sellingPrice - totalHPPPerUnit;
  }, [values.sellingPrice, totalHPPPerUnit]);

  // 4. Hitung BEP
  const bepCalculation = useMemo(() => {
    // Validasi: Jika margin kontribusi <= 0, tidak mungkin mencapai BEP (jual rugi atau impas per unit)
    if (contributionMargin <= 0) {
      return { units: Infinity, currency: Infinity, isPossible: false };
    }

    // Rumus BEP Unit = Biaya Tetap / Margin Kontribusi
    const units = Math.ceil(totalFixedMonthly / contributionMargin); // Dibulatkan ke atas karena tidak bisa jual 0.5 unit
    
    // Rumus BEP Rupiah = BEP Unit * Harga Jual
    const currency = units * values.sellingPrice;

    return { units, currency, isPossible: true };
  }, [totalFixedMonthly, contributionMargin, values.sellingPrice]);


  // --- Helper untuk Format Rupiah ---
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* --- Header --- */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Calculator className="w-8 h-8" />
          Kalkulator HPP & BEP
        </h2>
        <p className="text-slate-500 mt-2">
          Hitung Harga Pokok Penjualan per unit dan Titik Impas (Break-Even Point) bulanan bisnis Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- KOLOM KIRI & TENGAH: INPUT DATA (Span 2 kolom di layar besar) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bagian 1: HPP Unit */}
          <Card title="1. Biaya Variabel per Unit (HPP Unit)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                label="Bahan Baku Langsung"
                helperText="Biaya material untuk 1 produk."
                value={values.rawMaterial}
                onChange={handleInputChange("rawMaterial")}
              />
              <NumberInput
                label="Tenaga Kerja Langsung"
                helperText="Upah pengerjaan untuk 1 produk."
                value={values.directLabor}
                onChange={handleInputChange("directLabor")}
              />
              <NumberInput
                label="Overhead/Kemasan"
                helperText="Biaya lain yang nempel di 1 produk."
                value={values.overheadPerUnit}
                onChange={handleInputChange("overheadPerUnit")}
              />
            </div>
            <div className="mt-4 p-3 bg-slate-100 rounded-lg flex justify-between items-center border border-slate-200">
                <span className="font-semibold text-slate-700">Total HPP per Unit:</span>
                <span className="font-bold text-lg text-slate-900">{formatIDR(totalHPPPerUnit)}</span>
            </div>
          </Card>

           {/* Bagian 2: Biaya Tetap */}
           <Card title="2. Biaya Tetap Operasional (Bulanan)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Sewa Tempat"
                value={values.rentCost}
                onChange={handleInputChange("rentCost")}
              />
              <NumberInput
                label="Gaji Karyawan Tetap"
                value={values.salariesCost}
                onChange={handleInputChange("salariesCost")}
              />
              <NumberInput
                label="Utilitas (Listrik/Air/Net)"
                value={values.utilitiesCost}
                onChange={handleInputChange("utilitiesCost")}
              />
              <NumberInput
                label="Biaya Pemasaran"
                value={values.marketingCost}
                onChange={handleInputChange("marketingCost")}
              />
            </div>
             <div className="mt-4 p-3 bg-slate-100 rounded-lg flex justify-between items-center border border-slate-200">
                <span className="font-semibold text-slate-700">Total Biaya Tetap Bulanan:</span>
                <span className="font-bold text-lg text-slate-900">{formatIDR(totalFixedMonthly)}</span>
            </div>
          </Card>

           {/* Bagian 3: Harga Jual */}
           <Card title="3. Target Harga Jual">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <NumberInput
                  label="Harga Jual per Unit"
                  helperText="Berapa harga jual ke konsumen?"
                  value={values.sellingPrice}
                  onChange={handleInputChange("sellingPrice")}
                  className="text-lg font-semibold"
                />
                <div className="mb-2 p-2 text-sm rounded text-slate-600 bg-slate-50 border">
                    Margin Kontribusi Anda: <br/>
                    <span className={`font-bold ${contributionMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatIDR(contributionMargin)} / unit
                    </span>
                </div>
             </div>
           </Card>
        </div>

        {/* --- KOLOM KANAN: HASIL (STICKY) --- */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-8">
              <Card className="bg-slate-900 text-white border-slate-800 shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      Analisis BEP Bulanan
                  </h3>

                  {/* Alert jika BEP tidak mungkin */}
                  {!bepCalculation.isPossible ? (
                       <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200 flex gap-3 items-start mb-4">
                       <AlertCircle className="w-6 h-6 shrink-0" />
                       <div className="text-sm">
                         <p className="font-bold">BEP Tidak Dapat Dicapai!</p>
                         <p>Harga jual Anda lebih rendah atau sama dengan HPP per unit. Anda rugi di setiap penjualan.</p>
                       </div>
                     </div>
                  ) : (
                   <>
                      <p className="text-slate-300 text-sm mb-4">
                          Agar bisnis Anda mencapai titik impas (balik modal) setiap bulannya, Anda harus mencapai target berikut:
                      </p>

                      {/* Hasil 1: Unit */}
                      <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-500/20 p-2 rounded-full">
                                <Package className="w-5 h-5 text-blue-400" />
                              </div>
                              <span className="text-slate-300 font-medium">Target Penjualan (Unit)</span>
                          </div>
                          <div className="text-4xl font-extrabold text-white tracking-tight">
                              {bepCalculation.units.toLocaleString('id-ID')} <span className="text-xl font-medium text-slate-400">Unit/bln</span>
                          </div>
                      </div>

                      {/* Hasil 2: Rupiah */}
                       <div className="mb-4 p-4 rounded-2xl bg-white/10 border border-white/20">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="bg-green-500/20 p-2 rounded-full">
                                <DollarSign className="w-5 h-5 text-green-400" />
                              </div>
                              <span className="text-slate-300 font-medium">Target Omset (Rupiah)</span>
                          </div>
                          <div className="text-3xl font-extrabold text-green-400 tracking-tight break-words">
                              {formatIDR(bepCalculation.currency)} <span className="text-sm font-medium text-slate-400">/bln</span>
                          </div>
                      </div>
                   </>
                  )}
              </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN UI SEDERHANA (Inline agar mudah dicopy) ---

// 1. Card Wrapper
function Card({ children, title, className = "" }: { children: React.ReactNode; title?: string; className?: string }) {
    return (
      <div className={`bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 ${className}`}>
        {title && <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h3>}
        {children}
      </div>
    );
  }
  
// 2. Input Number dengan Label & Simbol Rp
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helperText?: string;
}

function NumberInput({ label, helperText, className = "", ...props }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
            Rp
        </span>
        <input
            type="number"
            min="0"
            className={`flex h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
            onFocus={(e) => e.target.select()} // Auto-select saat diklik agar mudah diganti
            {...props}
        />
      </div>
      {helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}