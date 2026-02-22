import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('umkm_access_token')?.value

    const protectedPrefixes = ['/ai-chat', '/cost-analysis']
    const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/ai-chat', request.url))
    }

    return NextResponse.next({ request })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
