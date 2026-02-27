import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * /api/chat-ask — Proxy ke FastAPI /api/chat/generate
 * Mode "Tanya": hanya mengembalikan teks penjelasan AI,
 * TIDAK memicu sandbox/preview.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get('umkm_access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Silakan login untuk menggunakan AI' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${backendUrl}/api/chat/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: body.message,
        business_category: body.business_category || "general",
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(errData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response || "" });

  } catch (error) {
    console.error('[chat-ask] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
