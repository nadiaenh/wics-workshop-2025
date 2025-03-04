import { NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /api/conversations/[id]/messages
 * 
 * Retrieves all messages for a specific conversation.
 * Messages are ordered chronologically (oldest first).
 * 
 * Authentication:
 * - Requires a valid Supabase session cookie
 * - Returns 401 if not authenticated
 * - Only returns messages from conversations owned by the user
 * 
 * @param request - The incoming request
 * @param context - Contains the conversation ID parameter
 * @returns {Promise<NextResponse>} JSON array of messages
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id: conversationId } = await context.params

    if (!conversationId) {
        return NextResponse.json(
            { error: "Conversation ID is required" },
            { status: 400 }
        )
    }

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

        // Verify user owns the conversation
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .select("user_id")
            .eq("id", conversationId)
            .single()

        if (conversationError || !conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }

        if (conversation.user_id !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch messages for the conversation
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true })

        if (error) throw error

        return NextResponse.json(messages)
    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/conversations/[id]/messages
 * 
 * Creates a new message in a specific conversation.
 * 
 * Authentication:
 * - Requires a valid Supabase session cookie
 * - Returns 401 if not authenticated
 * - Only allows posting to conversations owned by the user
 * 
 * @param request - Contains the message data (role and content)
 * @param context - Contains the conversation ID parameter
 * @returns {Promise<NextResponse>} JSON object of the created message
 */
export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    const { id: conversationId } = await context.params

    if (!conversationId) {
        return NextResponse.json(
            { error: "Conversation ID is required" },
            { status: 400 }
        )
    }

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

        // Verify user owns the conversation
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .select("user_id")
            .eq("id", conversationId)
            .single()

        if (conversationError || !conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
        }

        if (conversation.user_id !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Create the new message
        const { role, content } = await request.json()
        const { data: message, error } = await supabase
            .from("messages")
            .insert([
                {
                    conversation_id: conversationId,
                    role,
                    content,
                },
            ])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(message)
    } catch (error) {
        console.error("Error creating message:", error)
        return NextResponse.json(
            { error: "Failed to create message" },
            { status: 500 }
        )
    }
}

