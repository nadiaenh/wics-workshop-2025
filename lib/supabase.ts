import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

/**
 * Initialize Supabase client with environment variables
 * SUPABASE_URL: The URL of your Supabase project
 * SUPABASE_KEY: The anon/public key (NOT the service role key)
 */
export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

/**
 * Represents a chat conversation in the database
 * @property {string} id - Unique identifier for the conversation
 * @property {string} created_at - ISO timestamp of when the conversation was created
 * @property {string} user_id - UUID of the user who owns the conversation
 */
export type Conversation = {
    id: string
    created_at: string
    user_id: string
}

/**
 * Represents a message within a conversation
 * @property {string} id - Unique identifier for the message
 * @property {string} conversation_id - Reference to the parent conversation
 * @property {("user"|"assistant"|"system")} role - The role of the message sender
 * @property {string} content - The actual message content
 * @property {string} created_at - ISO timestamp of when the message was created
 */
export type Message = {
    id: string
    conversation_id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at: string
}

