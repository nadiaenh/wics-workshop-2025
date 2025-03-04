import { supabase } from "../../../../../lib/supabase"
import { NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /api/conversations/[id]/messages
 * Retrieves all messages for a specific conversation.
 * Messages are ordered by creation date in ascending order (oldest first).
 * 
 * @param request - The incoming HTTP request
 * @param context - Contains the conversation ID in the URL parameters
 * @returns {Promise<NextResponse>} JSON response containing an array of messages
 * 
 * Example response:
 * [
 *   {
 *     "id": "123",
 *     "conversation_id": "456",
 *     "role": "user",
 *     "content": "Hello!",
 *     "created_at": "2024-03-04T04:38:00Z"
 *   }
 * ]
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
 * Creates a new message in a specific conversation.
 * 
 * @param request - The incoming HTTP request containing the message data
 * @param context - Contains the conversation ID in the URL parameters
 * @returns {Promise<NextResponse>} JSON response containing the created message
 * 
 * Example request body:
 * {
 *   "role": "user",
 *   "content": "Hello, how are you?"
 * }
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

