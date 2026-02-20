import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/ai-chat'
    const from = searchParams.get('from') // 'login' atau 'register'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Ambil data user setelah session dibuat
            const { data: { user } } = await supabase.auth.getUser()

            if (user && from === 'login') {
                // Hitung selisih waktu sejak akun dibuat
                const createdAt = new Date(user.created_at)
                const diffSeconds = (Date.now() - createdAt.getTime()) / 1000

                if (diffSeconds < 30) {
                    // User baru (baru saja dibuat) → coba login sebelum register
                    // Hapus session & arahkan ke register
                    await supabase.auth.signOut()
                    return NextResponse.redirect(
                        `${origin}/register?error=register_first&email=${encodeURIComponent(user.email ?? '')}`
                    )
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
