import { NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /api/conversations
 * 
 * Retrieves all conversations for the currently logged-in user.
 * Each conversation includes its messages, ordered by creation date.
 * 
 * Authentication:
 * - Requires a valid Supabase session cookie
 * - Returns 401 if not authenticated
 * 
 * @returns {Promise<NextResponse>} JSON array of conversations with their messages
 */
export async function GET(request: Request) {
    try {
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

        // Verify user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch conversations with their messages
        const { data: conversations, error } = await supabase
            .from("conversations")
            .select(`
                *,
                messages(
                    id,
                    role,
                    content,
                    created_at
                )
            `)
            .eq('user_id', user.id)
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json(conversations)
    } catch (error) {
        console.error("Error fetching conversations:", error)
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }
}

/**
 * POST /api/conversations
 * 
 * Creates a new conversation for the currently logged-in user.
 * Optionally adds initial messages to the conversation.
 * 
 * Authentication:
 * - Requires a valid Supabase session cookie
 * - Returns 401 if not authenticated
 * 
 * @param request - Request body can include an array of initial messages
 * @returns {Promise<NextResponse>} JSON object of the created conversation
 */
export async function POST(request: Request) {
    try {
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

        // Verify user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { messages } = await request.json()

        // Create conversation linked to user
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .insert([{ user_id: user.id }])
            .select()
            .single()

        if (conversationError) throw conversationError

        // Add initial messages if provided
        if (messages && messages.length > 0) {
            const formattedMessages = messages.map((message: any) => ({
                conversation_id: conversation.id,
                role: message.role,
                content: message.content,
            }))

            const { error: messagesError } = await supabase
                .from("messages")
                .insert(formattedMessages)

            if (messagesError) throw messagesError
        }

        return NextResponse.json(conversation)
    } catch (error) {
        console.error("Error creating conversation:", error)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }
}

