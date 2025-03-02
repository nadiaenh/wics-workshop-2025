import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// GET /api/conversations/[id]/messages
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

// POST /api/conversations/[id]/messages
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

