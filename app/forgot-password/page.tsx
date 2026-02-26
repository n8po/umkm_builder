"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/lib/services";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email harus diisi.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await authService.forgotPassword(email.trim().toLowerCase());

            if (!data?.ok) {
                setError(data?.detail || "Gagal mengirim link reset password.");
                return;
            }

            setIsSent(true);
        } catch (err: any) {
            setError(err?.detail || err?.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
            {/* Background pattern */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgb(100 116 139) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <Link href="/" className="flex items-center gap-2.5">
                        <LogoIcon className="size-8 text-neutral-900" />
                        <span className="text-xl font-bold text-neutral-900 tracking-tight">
                            UMKM Builder
                        </span>
                    </Link>
                    <p className="text-sm text-neutral-500">
                        Reset password akun kamu
                    </p>
                </div>

                <Card className="border-neutral-200 shadow-md">
                    {isSent ? (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="size-6 text-green-600" />
                                </div>
                                <CardTitle className="text-xl text-neutral-900">
                                    Email Terkirim!
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Kami sudah mengirim link reset password ke{" "}
                                    <span className="font-medium text-neutral-700">{email}</span>.
                                    Silakan cek kotak masuk atau folder spam kamu.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => {
                                        setIsSent(false);
                                        setEmail("");
                                    }}
                                >
                                    Kirim ulang ke email lain
                                </Button>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                    Kembali ke halaman masuk
                                </Link>
                            </CardFooter>
                        </>
                    ) : (
                        <>
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-neutral-900">
                                    Lupa Password
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Masukkan email kamu dan kami akan mengirimkan link untuk
                                    mereset password
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Error message */}
                                {error && (
                                    error.includes("Google") ? (
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 space-y-2">
                                            <p className="text-sm text-blue-700">{error}</p>
                                            <Link href="/login">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                                                >
                                                    Ke Halaman Login
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                            {error}
                                        </div>
                                    )
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-neutral-700">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="nama@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-neutral-200"
                                                disabled={isLoading}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            "Kirim Link Reset"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="justify-center">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                    Kembali ke halaman masuk
                                </Link>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
