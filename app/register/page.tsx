"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { getBackendBaseUrl } from "@/lib/backend-url";
import { toast } from "sonner";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendBaseUrl = getBackendBaseUrl();

  // Isi email otomatis dan tampilkan error jika di-redirect dari halaman login
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) setEmail(decodeURIComponent(emailFromQuery));

    const errorParam = searchParams.get("error");
    if (errorParam === "register_first") {
      toast.error("Akun Google belum terdaftar", {
        description: "Silakan daftar akun baru terlebih dahulu.",
      });
      // Optional: keep setError if you want persistent error message in form too
      setError("Akun Google kamu belum terdaftar. Silakan daftar terlebih dahulu.");
    }
  }, [searchParams]);

  // Register dengan Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("Semua field harus diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.access_token) {
        setError(data?.detail || "Terjadi kesalahan saat mendaftar.");
        return;
      }

      toast.success("Akun berhasil dibuat!", {
        description: "Silakan masuk dengan email dan password kamu.",
      });
      setSuccess("Akun berhasil dibuat! Mengarahkan ke halaman login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Register/Login dengan Google
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");

    const callbackUrl = `${window.location.origin}/auth/callback`;
    const oauthStart = `${backendBaseUrl}/api/auth/oauth/google/login?next=${encodeURIComponent(callbackUrl)}`;
    window.location.href = oauthStart;
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
            Buat akun baru untuk mulai membangun
          </p>
        </div>

        <Card className="border-neutral-200 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-neutral-900">Daftar</CardTitle>
            <CardDescription className="text-neutral-500">
              Isi data berikut untuk membuat akun baru
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Success message */}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-500">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama lengkap kamu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-neutral-200"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-500">
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
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-500">
                  Password
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
                    minLength={8}
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

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Buat Akun"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator className="bg-neutral-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-neutral-400">
                atau daftar dengan
              </span>
            </div>

            {/* Google signup button */}
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
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Daftar dengan Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-neutral-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-medium text-neutral-900 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Dengan mendaftar, kamu menyetujui{" "}
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
