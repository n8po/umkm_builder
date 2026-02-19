"use client";

import { useState, useMemo, useRef } from "react";
import {
    Calculator, ShoppingCart, Wrench, Box, Lightbulb,
    Zap, Plus, Trash2, RotateCcw, FileDown, FileSpreadsheet, Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RpInput } from "./rp-input";
import { SectionCard } from "./section-card";
import { formatIDR, newIngredient, EXAMPLE_HPP } from "@/lib/cost-analysis/utils";
import type { HPPState, Ingredient } from "@/lib/cost-analysis/types";

export function HPPCalculator({
    onHPPCalculated,
}: {
    onHPPCalculated: (hpp: number) => void;
}) {
    const [state, setState] = useState<HPPState>({
        productName: "",
        ingredients: [newIngredient()],
        laborCostPerUnit: 0,
        overheadCostPerUnit: 0,
        quantity: 0,
    });
    const [result, setResult] = useState<{
        totalBahan: number;
        totalOps: number;
        hppPerUnit: number;
    } | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const totalBahan = useMemo(
        () => state.ingredients.reduce((s, i) => s + i.price, 0),
        [state.ingredients]
    );

    const addIngredient = () =>
        setState((p) => ({ ...p, ingredients: [...p.ingredients, newIngredient()] }));

    const removeIngredient = (id: string) =>
        setState((p) => ({
            ...p,
            ingredients: p.ingredients.filter((i) => i.id !== id),
        }));

    const updateIngredient = (
        id: string,
        field: keyof Ingredient,
        value: string | number
    ) =>
        setState((p) => ({
            ...p,
            ingredients: p.ingredients.map((i) =>
                i.id === id ? { ...i, [field]: value } : i
            ),
        }));

    const handleCalculate = () => {
        if (state.quantity <= 0) return;
        const totalOps =
            (state.laborCostPerUnit + state.overheadCostPerUnit) * state.quantity;
        const hppPerUnit = (totalBahan + totalOps) / state.quantity;
        setResult({ totalBahan, totalOps, hppPerUnit });
        onHPPCalculated(hppPerUnit);
        setTimeout(
            () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            100
        );
    };

    const handleExample = () => setState(EXAMPLE_HPP);

    const handleReset = () => {
        setState({
            productName: "",
            ingredients: [newIngredient()],
            laborCostPerUnit: 0,
            overheadCostPerUnit: 0,
            quantity: 0,
        });
        setResult(null);
    };

    const handleDownloadPDF = async () => {
        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Hasil Perhitungan HPP — ${state.productName || "Produk"}`, 14, 18);
        doc.setFontSize(11);
        doc.text(`Jumlah Produk: ${state.quantity} unit`, 14, 28);

        autoTable(doc, {
            startY: 34,
            head: [["Nama Bahan", "Satuan", "Harga (Rp)"]],
            body: state.ingredients.map((i) => [i.name, i.unit, formatIDR(i.price)]),
            foot: [["", "Total Bahan", formatIDR(result?.totalBahan ?? 0)]],
        });

        const finalY = (doc as any).lastAutoTable.finalY + 8;
        autoTable(doc, {
            startY: finalY,
            head: [["Komponen", "Nilai"]],
            body: [
                ["Total Pembelian Bahan", formatIDR(result?.totalBahan ?? 0)],
                ["Total Biaya Operasional", formatIDR(result?.totalOps ?? 0)],
                ["HPP per Unit", formatIDR(result?.hppPerUnit ?? 0)],
                ["Harga Jual (margin 25%)", formatIDR((result?.hppPerUnit ?? 0) * 1.25)],
                ["Harga Jual (margin 35%)", formatIDR((result?.hppPerUnit ?? 0) * 1.35)],
                ["Harga Jual (margin 50%)", formatIDR((result?.hppPerUnit ?? 0) * 1.5)],
            ],
        });

        doc.save(`HPP-${state.productName || "produk"}.pdf`);
    };

    const handleDownloadExcel = async () => {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();

        const bahanData = [
            ["Nama Bahan", "Satuan", "Harga (Rp)"],
            ...state.ingredients.map((i) => [i.name, i.unit, i.price]),
            ["", "Total Bahan", result?.totalBahan ?? 0],
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(bahanData);
        XLSX.utils.book_append_sheet(wb, ws1, "Bahan");

        const hasilData = [
            ["Produk", state.productName],
            ["Jumlah Produk", state.quantity],
            [],
            ["Komponen", "Nilai (Rp)"],
            ["Total Pembelian Bahan", result?.totalBahan ?? 0],
            ["Total Biaya Operasional", result?.totalOps ?? 0],
            ["HPP per Unit", result?.hppPerUnit ?? 0],
            ["Harga Jual (margin 25%)", (result?.hppPerUnit ?? 0) * 1.25],
            ["Harga Jual (margin 35%)", (result?.hppPerUnit ?? 0) * 1.35],
            ["Harga Jual (margin 50%)", (result?.hppPerUnit ?? 0) * 1.5],
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(hasilData);
        XLSX.utils.book_append_sheet(wb, ws2, "Hasil HPP");

        XLSX.writeFile(wb, `HPP-${state.productName || "produk"}.xlsx`);
    };

    return (
        <div className="space-y-4">
            {/* Informasi Produk */}
            <SectionCard icon={<Calculator className="w-4 h-4" />} title="Informasi Produk">
                <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-semibold text-slate-700">Nama Produk</Label>
                    <Input
                        placeholder="Contoh: Es Teh, Nasi Goreng, Bakso"
                        value={state.productName}
                        onChange={(e) => setState((p) => ({ ...p, productName: e.target.value }))}
                        className="h-10"
                    />
                </div>
            </SectionCard>

            {/* Bahan yang Dibeli */}
            <SectionCard icon={<ShoppingCart className="w-4 h-4" />} title="Bahan yang Dibeli">
                <div className="space-y-3">
                    {/* Header row — hidden on mobile */}
                    <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-slate-500 px-1">
                        <span>Nama Bahan</span>
                        <span>Satuan</span>
                        <span>Harga Beli di Toko</span>
                        <span />
                    </div>

                    {state.ingredients.map((ing) => (
                        <div
                            key={ing.id}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start"
                        >
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs text-slate-500 sm:hidden">Nama Bahan</Label>
                                <Input
                                    placeholder="Contoh: Gula pasir, Teh celup"
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs text-slate-500 sm:hidden">Satuan</Label>
                                <Input
                                    placeholder="1kg, 1 liter"
                                    value={ing.unit}
                                    onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs text-slate-500 sm:hidden">Harga Beli</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10">
                                        Rp
                                    </span>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="10000"
                                        value={ing.price || ""}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            updateIngredient(ing.id, "price", isNaN(v) ? 0 : v);
                                        }}
                                        onFocus={(e) => e.target.select()}
                                        className="pl-10 h-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end pb-0 sm:pt-0 pt-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() =>
                                        state.ingredients.length > 1 && removeIngredient(ing.id)
                                    }
                                    disabled={state.ingredients.length === 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addIngredient}
                        className="mt-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Tambah Bahan
                    </Button>

                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-700">
                            Total Pembelian Bahan:
                        </span>
                        <span className="font-bold text-base text-slate-900">
                            {formatIDR(totalBahan)}
                        </span>
                    </div>
                </div>
            </SectionCard>

            {/* Biaya Operasional */}
            <SectionCard icon={<Wrench className="w-4 h-4" />} title="Biaya Operasional">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> Biaya Tenaga Kerja
                            per Unit (Rp)
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10">
                                Rp
                            </span>
                            <Input
                                type="number"
                                min="0"
                                value={state.laborCostPerUnit || ""}
                                placeholder="0"
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setState((p) => ({
                                        ...p,
                                        laborCostPerUnit: isNaN(v) || v < 0 ? 0 : v,
                                    }));
                                }}
                                onFocus={(e) => e.target.select()}
                                className="pl-10 h-10"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cara hitung: Gaji per hari ÷ jumlah produk per hari. Contoh: Rp 100.000
                            ÷ 500 = Rp 200
                        </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-blue-500" /> Biaya Overhead per Unit
                            (Rp)
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10">
                                Rp
                            </span>
                            <Input
                                type="number"
                                min="0"
                                value={state.overheadCostPerUnit || ""}
                                placeholder="0"
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setState((p) => ({
                                        ...p,
                                        overheadCostPerUnit: isNaN(v) || v < 0 ? 0 : v,
                                    }));
                                }}
                                onFocus={(e) => e.target.select()}
                                className="pl-10 h-10"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cara hitung: Total biaya bulanan (listrik, sewa, dll) ÷ jumlah produksi.
                            Contoh: Rp 2.000.000 ÷ 10.000 = Rp 200
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Jumlah Produk */}
            <SectionCard
                icon={<Box className="w-4 h-4" />}
                title="Jumlah Produk yang Dihasilkan"
            >
                <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-semibold text-slate-700">
                        Jumlah Produk (Unit)
                    </Label>
                    <Input
                        type="number"
                        min="1"
                        placeholder="Contoh: 100, 500, 1000"
                        value={state.quantity || ""}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setState((p) => ({ ...p, quantity: isNaN(v) ? 0 : v }));
                        }}
                        onFocus={(e) => e.target.select()}
                        className="h-10 max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0" /> Contoh: Dari
                        bahan yang dibeli bisa menghasilkan 100 gelas es teh
                    </p>
                </div>
            </SectionCard>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button
                    onClick={handleCalculate}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none min-w-[140px]"
                >
                    <Calculator className="w-4 h-4 mr-2" /> Hitung HPP
                </Button>
                <Button variant="outline" onClick={handleExample} className="text-slate-600">
                    <Lightbulb className="w-4 h-4 mr-2" /> Contoh
                </Button>
                <Button variant="ghost" onClick={handleReset} className="text-slate-500">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
            </div>

            {/* Hasil Perhitungan */}
            <div ref={resultRef}>
                <Card className="shadow-sm">
                    <CardHeader className="pb-3 pt-5">
                        <CardTitle className="text-sm sm:text-base font-bold text-slate-800">
                            Hasil Perhitungan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        {!result ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground gap-3">
                                <Calculator className="w-10 h-10 text-slate-300" />
                                <p className="text-sm">
                                    Lengkapi form untuk melihat hasil perhitungan HPP
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Summary rows */}
                                <div className="space-y-2">
                                    {[
                                        { label: "Total Pembelian Bahan", value: result.totalBahan },
                                        { label: "Total Biaya Operasional", value: result.totalOps },
                                    ].map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex justify-between items-center py-2 border-b border-slate-100"
                                        >
                                            <span className="text-sm text-slate-600">{label}</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {formatIDR(value)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3 mt-2">
                                        <span className="font-bold text-slate-800">HPP per Unit</span>
                                        <span className="font-extrabold text-xl text-blue-700">
                                            {formatIDR(result.hppPerUnit)}
                                        </span>
                                    </div>
                                </div>

                                {/* Margin suggestions */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                                        <Coins className="w-3.5 h-3.5 text-yellow-500" /> Pilih Margin
                                        Keuntungan
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { pct: 25, label: "Konservatif" },
                                            { pct: 35, label: "Standar" },
                                            { pct: 50, label: "Agresif" },
                                        ].map(({ pct, label }) => (
                                            <div
                                                key={pct}
                                                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center"
                                            >
                                                <Badge variant="secondary" className="mb-1 text-xs">
                                                    {label}
                                                </Badge>
                                                <p className="text-xs text-slate-500 mb-1">Margin {pct}%</p>
                                                <p className="font-bold text-slate-900 text-base">
                                                    {formatIDR(result.hppPerUnit * (1 + pct / 100))}
                                                </p>
                                                <p className="text-xs text-green-600 font-medium">
                                                    +{formatIDR(result.hppPerUnit * (pct / 100))}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Export buttons */}
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
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
