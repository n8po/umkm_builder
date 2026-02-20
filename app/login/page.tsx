"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Step = "email" | "password";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Step 1: Cek apakah email terdaftar
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email harus diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.exists) {
        // Email ditemukan → tampilkan form password
        setStep("password");
      } else {
        // Email belum terdaftar → beri notifikasi & arahkan ke register
        toast.info("Akun belum terdaftar", {
          description: "Kamu akan diarahkan ke halaman pendaftaran.",
        });
        setTimeout(() => {
          router.push(`/register?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Login dengan password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password harus diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Password salah. Silakan coba lagi.");
        return;
      }

      router.push("/ai-chat");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login dengan Google
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?from=login`,
      },
    });

    if (error) {
      setError("Gagal login dengan Google. Silakan coba lagi.");
      setIsGoogleLoading(false);
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
            Masuk ke akun kamu untuk melanjutkan
          </p>
        </div>

        <Card className="border-neutral-200 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-neutral-900">
              {step === "email" ? "Masuk" : "Masukkan Password"}
            </CardTitle>
            <CardDescription className="text-neutral-500">
              {step === "email"
                ? "Masukkan email kamu untuk melanjutkan"
                : `Masuk sebagai ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* STEP 1: Input Email */}
            {step === "email" && (
              <form onSubmit={handleCheckEmail} className="space-y-4">
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
                      Memeriksa...
                    </>
                  ) : (
                    "Lanjutkan"
                  )}
                </Button>
              </form>
            )}

            {/* STEP 2: Input Password */}
            {step === "password" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-700">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Lupa password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
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

                <Button
                  type="submit"
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                {/* Kembali ke step email */}
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); setPassword(""); }}
                  className="flex w-full items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  Gunakan email lain
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-neutral-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-neutral-400">
                atau masuk dengan
              </span>
            </div>

            {/* Google login */}
            <Button
              variant="outline"
              className="w-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
              disabled={isLoading || isGoogleLoading}
              onClick={handleGoogleLogin}
            >
              {isGoogleLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Masuk dengan Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-neutral-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-medium text-neutral-900 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Dengan masuk, kamu menyetujui{" "}
          <Link href="#" className="underline hover:text-neutral-600">
            Ketentuan Layanan
          </Link>{" "}
          dan{" "}
          <Link href="#" className="underline hover:text-neutral-600">
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </div>
  );
}
