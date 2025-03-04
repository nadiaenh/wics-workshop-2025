import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth/auth-error', request.url))
} 