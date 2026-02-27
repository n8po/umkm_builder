import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get('umkm_access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Silakan login di pojok kanan atas untuk menggunakan AI' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    
    console.log('[generate-proxy] Sending request to FastAPI backend:', backendUrl);

    // Call FastAPI /api/chat/smart
    const response = await fetch(`${backendUrl}/api/chat/smart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message: body.prompt,
        business_category: "general"
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(errData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[generate-proxy] Error calling backend:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}