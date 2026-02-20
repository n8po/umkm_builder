import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    const { email } = await request.json()

    if (!email) {
        return NextResponse.json({ exists: false }, { status: 400 })
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
        return NextResponse.json({ exists: false }, { status: 500 })
    }

    const userExists = data.users.some(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
    )

    return NextResponse.json({ exists: userExists })
}
