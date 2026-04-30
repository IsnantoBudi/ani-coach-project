export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          level: number
          exp: number
          mora: number | null
          primogems: number | null
          streak: number | null
          stat_str: number | null
          stat_int: number | null
          stat_vit: number | null
          stat_agi: number | null
          stat_chr: number | null
          stats: Json | null
          avatar_url: string | null
          avatar_frame: string | null
          last_login: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          level?: number
          exp?: number
          mora?: number | null
          primogems?: number | null
          streak?: number | null
          stat_str?: number | null
          stat_int?: number | null
          stat_vit?: number | null
          stat_agi?: number | null
          stat_chr?: number | null
          stats?: Json | null
          avatar_url?: string | null
          avatar_frame?: string | null
          last_login?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          level?: number
          exp?: number
          mora?: number | null
          primogems?: number | null
          streak?: number | null
          stat_str?: number | null
          stat_int?: number | null
          stat_vit?: number | null
          stat_agi?: number | null
          stat_chr?: number | null
          stats?: Json | null
          avatar_url?: string | null
          avatar_frame?: string | null
          last_login?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string | null
          duration: number | null
          intensity: string | null
          exp_gained: number | null
          boost_str: number | null
          boost_int: number | null
          boost_vit: number | null
          boost_agi: number | null
          boost_chr: number | null
          kaito_dialog: string | null
          kaito_expression: string | null
          logged_at: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category?: string | null
          duration?: number | null
          intensity?: string | null
          exp_gained?: number | null
          boost_str?: number | null
          boost_int?: number | null
          boost_vit?: number | null
          boost_agi?: number | null
          boost_chr?: number | null
          kaito_dialog?: string | null
          kaito_expression?: string | null
          logged_at?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string | null
          duration?: number | null
          intensity?: string | null
          exp_gained?: number | null
          boost_str?: number | null
          boost_int?: number | null
          boost_vit?: number | null
          boost_agi?: number | null
          boost_chr?: number | null
          kaito_dialog?: string | null
          kaito_expression?: string | null
          logged_at?: string | null
          description?: string | null
        }
        Relationships: []
      }
      quests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          difficulty: string | null
          exp_reward: number | null
          boost_str: number | null
          boost_int: number | null
          boost_vit: number | null
          boost_agi: number | null
          boost_chr: number | null
          status: "active" | "completed" | "expired"
          generated_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string | null
          difficulty?: string | null
          exp_reward?: number | null
          boost_str?: number | null
          boost_int?: number | null
          boost_vit?: number | null
          boost_agi?: number | null
          boost_chr?: number | null
          status?: "active" | "completed" | "expired"
          generated_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string | null
          difficulty?: string | null
          exp_reward?: number | null
          boost_str?: number | null
          boost_int?: number | null
          boost_vit?: number | null
          boost_agi?: number | null
          boost_chr?: number | null
          status?: "active" | "completed" | "expired"
          generated_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
