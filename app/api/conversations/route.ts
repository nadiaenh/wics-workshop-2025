import { supabase } from "../../../lib/supabase"
import { NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /api/conversations
 * Retrieves all conversations with their associated messages.
 * Messages are ordered by creation date in descending order (newest first).
 * Only returns conversations owned by the authenticated user.
 * 
 * @returns {Promise<NextResponse>} JSON response containing an array of conversations
 * Each conversation includes:
 * - Basic conversation metadata
 * - Associated messages with their id, role, content, and timestamp
 */
export async function GET(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

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
 * Creates a new conversation and optionally adds initial messages to it.
 * The conversation is automatically associated with the authenticated user.
 * 
 * @param request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing the created conversation
 * 
 * Example request body:
 * {
 *   "messages": [
 *     { "role": "user", "content": "Hello!" },
 *     { "role": "assistant", "content": "Hi there!" }
 *   ]
 * }
 */
export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { messages } = await request.json()

        // Create conversation with user_id
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .insert([{ user_id: user.id }])
            .select()
            .single()

        if (conversationError) throw conversationError

        if (messages && messages.length > 0) {
            const formattedMessages = messages.map((message: any) => ({
                conversation_id: conversation.id,
                role: message.role,
                content: message.content,
            }))

            const { error: messagesError } = await supabase.from("messages").insert(formattedMessages)

            if (messagesError) throw messagesError
        }

        return NextResponse.json(conversation)
    } catch (error) {
        console.error("Error creating conversation:", error)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }
}

