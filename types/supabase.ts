export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            conversations: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    role: "user" | "assistant" | "system"
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    role: "user" | "assistant" | "system"
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    role?: "user" | "assistant" | "system"
                    content?: string
                    created_at?: string
                }
            }
        }
    }
}

