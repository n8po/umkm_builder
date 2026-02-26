"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Eye, EyeOff, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/lib/services";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Supabase mengirim token via URL fragment (#access_token=...&refresh_token=...)
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        // Supabase mengirim token di URL hash fragment
        const hash = window.location.hash.substring(1); // buang '#'
        const params = new URLSearchParams(hash);

        const at = params.get("access_token");
        const rt = params.get("refresh_token");

        if (at) setAccessToken(at);
        if (rt) setRefreshToken(rt);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Password baru harus diisi.");
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak sama.");
            return;
        }

        if (!accessToken || !refreshToken) {
            setError("Link reset tidak valid atau sudah kedaluwarsa. Silakan minta link baru.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await authService.resetPassword({
                new_password: password,
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (!data?.ok) {
                setError(data?.detail || "Gagal mereset password.");
                return;
            }

            setIsSuccess(true);
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
                        Buat password baru untuk akun kamu
                    </p>
                </div>

                <Card className="border-neutral-200 shadow-md">
                    {isSuccess ? (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="size-6 text-green-600" />
                                </div>
                                <CardTitle className="text-xl text-neutral-900">
                                    Password Berhasil Direset!
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Password kamu sudah berhasil diperbarui. Silakan masuk
                                    menggunakan password baru kamu.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                                    onClick={() => router.push("/login")}
                                >
                                    Masuk Sekarang
                                </Button>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-neutral-900">
                                    Reset Password
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Masukkan password baru untuk akun kamu
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Error message */}
                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-neutral-700">
                                            Password Baru
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Minimal 8 karakter"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 pr-10 border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-neutral-200"
                                                disabled={isLoading}
                                                required
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password" className="text-neutral-700">
                                            Konfirmasi Password Baru
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Ketik ulang password baru"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 pr-10 border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-neutral-200"
                                                disabled={isLoading}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
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
                                                Memperbarui...
                                            </>
                                        ) : (
                                            "Simpan Password Baru"
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
