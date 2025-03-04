import { supabase } from "../../../../lib/supabase"
import { NextResponse } from "next/server"

/**
 * DELETE /api/conversations/[id]
 * Deletes a specific conversation by its ID.
 * 
 * @param request - The incoming HTTP request
 * @param context - Contains the conversation ID in the URL parameters
 * @returns {Promise<NextResponse>} JSON response indicating success or failure
 * 
 * Example successful response:
 * {
 *   "success": true
 * }
 */
export async function DELETE(
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
        const { error } = await supabase
            .from("conversations")
            .delete()
            .eq("id", conversationId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting conversation:", error)
        return NextResponse.json(
            { error: "Failed to delete conversation" },
            { status: 500 }
        )
    }
} 