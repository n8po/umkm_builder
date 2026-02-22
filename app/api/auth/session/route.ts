import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "umkm_access_token";

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
    const { accessToken } = (await request.json()) as { accessToken?: string };

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

    return response;
  } catch {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const exp = typeof payload.exp === "number" ? payload.exp : null;
  if (exp && Date.now() >= exp * 1000) {
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

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
