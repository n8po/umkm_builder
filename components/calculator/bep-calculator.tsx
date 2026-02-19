"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Package, Wrench, TrendingUp, AlertCircle,
    Lightbulb, DollarSign, FileDown, FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RpInput } from "./rp-input";
import { SectionCard } from "./section-card";
import { formatIDR } from "@/lib/cost-analysis/utils";
import type { BEPState } from "@/lib/cost-analysis/types";

export function BEPCalculator({ initialHPP }: { initialHPP: number }) {
    const [state, setState] = useState<BEPState>({
        hppPerUnit: initialHPP,
        rentCost: 0,
        salariesCost: 0,
        utilitiesCost: 0,
        marketingCost: 0,
        sellingPrice: 0,
    });

    // Sync HPP from HPP tab when it changes
    useEffect(() => {
        if (initialHPP > 0) setState((p) => ({ ...p, hppPerUnit: initialHPP }));
    }, [initialHPP]);

    const set = (field: keyof BEPState) => (v: number) =>
        setState((p) => ({ ...p, [field]: v }));

    const totalFixedMonthly = useMemo(
        () =>
            state.rentCost +
            state.salariesCost +
            state.utilitiesCost +
            state.marketingCost,
        [state.rentCost, state.salariesCost, state.utilitiesCost, state.marketingCost]
    );

    const contributionMargin = useMemo(
        () => state.sellingPrice - state.hppPerUnit,
        [state.sellingPrice, state.hppPerUnit]
    );

    const bep = useMemo(() => {
        if (contributionMargin <= 0)
            return { units: Infinity, currency: Infinity, isPossible: false };
        const units = Math.ceil(totalFixedMonthly / contributionMargin);
        return { units, currency: units * state.sellingPrice, isPossible: true };
    }, [totalFixedMonthly, contributionMargin, state.sellingPrice]);

    const handleDownloadPDF = async () => {
        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Hasil Perhitungan BEP (Break-Even Point)", 14, 18);
        autoTable(doc, {
            startY: 28,
            head: [["Komponen", "Nilai"]],
            body: [
                ["HPP per Unit", formatIDR(state.hppPerUnit)],
                ["Harga Jual per Unit", formatIDR(state.sellingPrice)],
                ["Margin Kontribusi per Unit", formatIDR(contributionMargin)],
                ["Total Biaya Tetap Bulanan", formatIDR(totalFixedMonthly)],
                [
                    "BEP (Unit/bulan)",
                    bep.isPossible
                        ? `${bep.units.toLocaleString("id-ID")} unit`
                        : "Tidak tercapai",
                ],
                [
                    "BEP (Rupiah/bulan)",
                    bep.isPossible ? formatIDR(bep.currency) : "Tidak tercapai",
                ],
            ],
        });
        doc.save("BEP-analisis.pdf");
    };

    const handleDownloadExcel = async () => {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const data = [
            ["Komponen", "Nilai (Rp)"],
            ["HPP per Unit", state.hppPerUnit],
            ["Harga Jual per Unit", state.sellingPrice],
            ["Margin Kontribusi per Unit", contributionMargin],
            ["Sewa Tempat", state.rentCost],
            ["Gaji Karyawan", state.salariesCost],
            ["Utilitas", state.utilitiesCost],
            ["Biaya Pemasaran", state.marketingCost],
            ["Total Biaya Tetap Bulanan", totalFixedMonthly],
            ["BEP Unit/bulan", bep.isPossible ? bep.units : "Tidak tercapai"],
            ["BEP Rupiah/bulan", bep.isPossible ? bep.currency : "Tidak tercapai"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Analisis BEP");
        XLSX.writeFile(wb, "BEP-analisis.xlsx");
    };

    return (
        <div className="space-y-4">
            {initialHPP > 0 && (
                <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">HPP otomatis diisi dari Tab HPP</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        HPP per unit: <strong>{formatIDR(initialHPP)}</strong> — diambil dari
                        hasil perhitungan tab HPP.
                    </AlertDescription>
                </Alert>
            )}

            {/* Biaya Variabel */}
            <SectionCard
                icon={<Package className="w-4 h-4" />}
                title="1. Biaya Variabel per Unit (HPP)"
            >
                <RpInput
                    label="HPP per Unit"
                    helperText="Isi manual, atau hitung otomatis dari tab Kalkulator HPP di atas."
                    value={state.hppPerUnit}
                    onChange={set("hppPerUnit")}
                    placeholder="0"
                />
            </SectionCard>

            {/* Biaya Tetap */}
            <SectionCard
                icon={<Wrench className="w-4 h-4" />}
                title="2. Biaya Tetap Operasional (Bulanan)"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RpInput label="Sewa Tempat" value={state.rentCost} onChange={set("rentCost")} />
                    <RpInput
                        label="Gaji Karyawan Tetap"
                        value={state.salariesCost}
                        onChange={set("salariesCost")}
                    />
                    <RpInput
                        label="Utilitas (Listrik/Air/Net)"
                        value={state.utilitiesCost}
                        onChange={set("utilitiesCost")}
                    />
                    <RpInput
                        label="Biaya Pemasaran"
                        value={state.marketingCost}
                        onChange={set("marketingCost")}
                    />
                </div>
                <Separator className="mt-4 mb-3" />
                <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">
                        Total Biaya Tetap Bulanan:
                    </span>
                    <span className="font-bold text-base text-slate-900">
                        {formatIDR(totalFixedMonthly)}
                    </span>
                </div>
            </SectionCard>

            {/* Harga Jual */}
            <SectionCard
                icon={<TrendingUp className="w-4 h-4" />}
                title="3. Target Harga Jual"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <RpInput
                        label="Harga Jual per Unit"
                        helperText="Berapa harga jual ke konsumen?"
                        value={state.sellingPrice}
                        onChange={set("sellingPrice")}
                    />
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <p className="text-xs text-muted-foreground mb-1">
                            Margin Kontribusi per Unit:
                        </p>
                        <span
                            className={`font-bold text-base ${contributionMargin > 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {formatIDR(contributionMargin)} / unit
                        </span>
                    </div>
                </div>
            </SectionCard>

            {/* Hasil BEP */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3 pt-5">
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" /> Hasil Analisis BEP
                        Bulanan
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 space-y-4">
                    {!bep.isPossible ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>BEP Tidak Dapat Dicapai!</AlertTitle>
                            <AlertDescription>
                                Harga jual lebih rendah atau sama dengan HPP per unit. Anda rugi di
                                setiap penjualan.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <p className="text-xs text-muted-foreground">
                                Target agar bisnis Anda mencapai titik impas (balik modal) setiap bulan:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-blue-100 p-1.5 rounded-full shrink-0">
                                            <Package className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <span className="text-slate-600 font-medium text-xs">
                                            Target Penjualan
                                        </span>
                                    </div>
                                    <div className="text-2xl font-extrabold text-slate-900">
                                        {bep.units.toLocaleString("id-ID")}{" "}
                                        <span className="text-sm font-medium text-slate-500">Unit/bln</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-green-100 p-1.5 rounded-full shrink-0">
                                            <DollarSign className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                        <span className="text-slate-600 font-medium text-xs">
                                            Target Omset
                                        </span>
                                    </div>
                                    <div className="text-xl font-extrabold text-slate-900 break-all">
                                        {formatIDR(bep.currency)}{" "}
                                        <span className="text-xs font-medium text-slate-500">/bln</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPDF}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <FileDown className="w-4 h-4 mr-2" /> Unduh PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadExcel}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Unduh Excel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
