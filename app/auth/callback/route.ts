import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * GET /auth/callback
 * 
 * Handles the OAuth callback from Supabase authentication.
 * Exchanges the temporary code for a session and redirects the user.
 * 
 * Flow:
 * 1. User signs in through Supabase Auth
 * 2. Supabase redirects back here with a temporary code
 * 3. We exchange that code for a session
 * 4. Redirect user to home page or error page
 * 
 * @param request - Contains the callback URL with the temporary code
 * @returns Redirects to / on success or /auth/auth-error on failure
 */
export const dynamic = 'force-dynamic'

function getSiteURL() {
    // In development, use localhost
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000'
    }

    // In production, get the host from request headers
    const headersList = headers()
    const host = headersList.get('host') || ''
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return `${protocol}://${host}`
}

export async function GET(request: Request) {
    const siteURL = getSiteURL()

    try {
        const requestUrl = new URL(request.url)
        const code = requestUrl.searchParams.get('code')

        if (!code) {
            console.error('No code provided in callback')
            return NextResponse.redirect(new URL(`${siteURL}/auth/auth-error`))
        }

        // Initialize Supabase with server-side auth
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

        // Exchange the temporary code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('Error exchanging code for session:', error)
            return NextResponse.redirect(new URL(`${siteURL}/auth/auth-error`))
        }

        // Successful authentication, redirect to home page
        return NextResponse.redirect(new URL(`${siteURL}`))
    } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        return NextResponse.redirect(new URL(`${siteURL}/auth/auth-error`))
    }
} 