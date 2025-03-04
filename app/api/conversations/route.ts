import { supabase } from "../../../lib/supabase"
import { NextResponse } from "next/server"

// GET /api/conversations
export async function GET(request: Request) {
    try {
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
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json(conversations)
    } catch (error) {
        console.error("Error fetching conversations:", error)
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }
}

// POST /api/conversations
export async function POST(request: Request) {
    try {
        const { messages } = await request.json()

        // Start a Supabase transaction
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .insert([{}])
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

