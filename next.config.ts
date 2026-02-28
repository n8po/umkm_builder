import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'www.shadcnblocks.com',
      },
      {
        protocol: 'https',
        hostname: 'www.thiings.co',
      },
    ],
    localPatterns: [
      {
        pathname: '/assets/img/**',
      },
    ],
  },

  // ── Content Security Policy (CSP) ─────────────────────────
  // Mencegah XSS dengan memberi tahu browser:
  // "Hanya boleh menjalankan resource dari sumber-sumber ini."
  async headers() {
    // Domain yang diijinkan
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ivwklewvdbzkahenfgkb.supabase.co";
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    const cspDirectives = [
      // Default: hanya dari domain sendiri
      "default-src 'self'",

      // Script: domain sendiri + inline (dibutuhkan Next.js untuk hydration)
      // 'unsafe-eval' dibutuhkan untuk development mode Next.js
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,

      // Style: domain sendiri + inline (Tailwind CSS) + Google Fonts
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,

      // Font files: Google Fonts CDN
      `font-src 'self' https://fonts.gstatic.com data:`,

      // Gambar: domain sendiri + approved image sources
      `img-src 'self' data: blob: https://assets.aceternity.com https://randomuser.me https://www.shadcnblocks.com https://www.thiings.co ${supabaseUrl}`,

      // Fetch/XHR: domain sendiri + backend API + Supabase
      `connect-src 'self' ${backendUrl} ${supabaseUrl} https://*.supabase.co wss://*.supabase.co`,

      // Frame: untuk preview sandbox
      `frame-src 'self' blob: data: https://*.e2b.dev`,

      // Objek: blokir semua (Flash, Java applets, dll)
      "object-src 'none'",

      // Base URI: hanya domain sendiri
      "base-uri 'self'",

      // Form submission: hanya ke domain sendiri
      "form-action 'self'",

      // Frame ancestors: siapa yang boleh embed halaman ini
      "frame-ancestors 'self'",
    ];

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspDirectives.join("; "),
          },
          // Bonus: header keamanan tambahan
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;