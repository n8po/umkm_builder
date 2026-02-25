import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "umkm_access_token";
const REFRESH_COOKIE = "umkm_refresh_token";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = (await request.json()) as { accessToken?: string; refreshToken?: string };

    if (!accessToken) {
      return NextResponse.json({ error: "accessToken wajib diisi" }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    if (refreshToken) {
      response.cookies.set(REFRESH_COOKIE,
        refreshToken,
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }
      )
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!token) {
    // Tidak ada access token — coba refresh jika ada refresh token
    if (!refreshToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Coba refresh
    return await tryRefresh(refreshToken);
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const exp = typeof payload.exp === "number" ? payload.exp : null;
  if (exp && Date.now() >= exp * 1000) {
    // Access token expired — coba refresh
    if (refreshToken) {
      return await tryRefresh(refreshToken);
    }

    // Tidak ada refresh token, bersihkan cookie
    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: payload.sub ?? null,
        email: payload.email ?? null,
      },
    },
    { status: 200 }
  );
}

/**
 * Panggil backend /api/auth/refresh untuk dapatkan token baru,
 * lalu set cookies dan return session data.
 */
async function tryRefresh(refreshToken: string): Promise<NextResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      // Refresh gagal — token tidak valid/expired, bersihkan semua cookie
      const response = NextResponse.json({ authenticated: false }, { status: 200 });
      response.cookies.delete(COOKIE_NAME);
      response.cookies.delete(REFRESH_COOKIE);
      return response;
    }

    const data = await res.json();
    const newAccessToken: string = data.access_token;
    const newRefreshToken: string = data.refresh_token;

    // Decode payload dari access token baru
    const payload = decodeJwtPayload(newAccessToken);

    const response = NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload?.sub ?? null,
          email: payload?.email ?? null,
        },
      },
      { status: 200 }
    );

    // Set cookies baru
    response.cookies.set(COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(REFRESH_COOKIE, newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.delete(COOKIE_NAME);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

