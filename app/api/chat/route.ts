import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export const maxDuration = 30

/**
 * POST /api/chat
 * 
 * Processes chat messages and streams AI responses using Anthropic's Claude model.
 * 
 * Authentication:
 * - Requires a valid Supabase session cookie
 * - Returns 401 if not authenticated
 * 
 * @param req - Contains the messages to process
 * @returns Streaming response with the AI's reply
 */
export async function POST(req: Request) {
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

        // Verify Anthropic API key is set
        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "") {
            return NextResponse.json(
                { error: "ANTHROPIC_API_KEY environment variable is not set", code: "MISSING_API_KEY" },
                { status: 500 }
            )
        }

        // Process the chat request
        const { messages } = await req.json()

        const result = streamText({
            model: anthropic("claude-3-7-sonnet-20250219"),
            messages,
            system: "You are a helpful AI assistant. Provide clear, concise, and accurate information.",
            providerOptions: {
                anthropic: {
                    temperature: 0.7,
                    maxTokens: 1000,
                },
            },
        })

        // Return streaming response
        return result.toDataStreamResponse({
            sendReasoning: false,
        })
    } catch (error) {
        console.error("Error in chat endpoint:", error)
        return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
    }
}

