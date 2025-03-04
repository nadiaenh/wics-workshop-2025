import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// Initialize Supabase client
export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

// Type definitions for our database schema
export type Conversation = {
    id: string
    created_at: string
}

export type Message = {
    id: string
    conversation_id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at: string
}

