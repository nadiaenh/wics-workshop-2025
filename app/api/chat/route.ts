import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
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

    // Convert the result to a streaming response
    return result.toDataStreamResponse({
        sendReasoning: false,
    })
}

