import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const next = searchParams.get('next') ?? '/ai-chat'

    if (accessToken) {
        const response = NextResponse.redirect(`${origin}${next}`)
        response.cookies.set('umkm_access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })
        if (refreshToken) {
            response.cookies.set('umkm_refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
            })
        }
        return response
    }

    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}

