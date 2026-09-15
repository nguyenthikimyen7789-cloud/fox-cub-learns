export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      inputs: {
        Row: {
          created_at: string
          id: string
          raw_content: string | null
          source_type: Database["public"]["Enums"]["input_source_type"]
          source_url: string | null
          status: Database["public"]["Enums"]["input_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          raw_content?: string | null
          source_type: Database["public"]["Enums"]["input_source_type"]
          source_url?: string | null
          status?: Database["public"]["Enums"]["input_status"]
        }
        Update: {
          created_at?: string
          id?: string
          raw_content?: string | null
          source_type?: Database["public"]["Enums"]["input_source_type"]
          source_url?: string | null
          status?: Database["public"]["Enums"]["input_status"]
        }
        Relationships: []
      }
      lesson_games: {
        Row: {
          created_at: string
          game_data: Json
          game_type: string
          id: string
          lesson_id: string
        }
        Insert: {
          created_at?: string
          game_data?: Json
          game_type: string
          id?: string
          lesson_id: string
        }
        Update: {
          created_at?: string
          game_data?: Json
          game_type?: string
          id?: string
          lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_games_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_quizzes: {
        Row: {
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options?: Json
          question: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_readings: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          pinyin_content: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          pinyin_content?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          pinyin_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_readings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_vocabularies: {
        Row: {
          created_at: string
          example: string | null
          example_meaning: string | null
          id: string
          lesson_id: string
          meaning: string | null
          pronunciation: string | null
          word: string
          word_type: string | null
        }
        Insert: {
          created_at?: string
          example?: string | null
          example_meaning?: string | null
          id?: string
          lesson_id: string
          meaning?: string | null
          pronunciation?: string | null
          word: string
          word_type?: string | null
        }
        Update: {
          created_at?: string
          example?: string | null
          example_meaning?: string | null
          id?: string
          lesson_id?: string
          meaning?: string | null
          pronunciation?: string | null
          word?: string
          word_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_vocabularies_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_worksheets: {
        Row: {
          correct_answer: string | null
          created_at: string
          id: string
          lesson_id: string
          question: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          question: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_worksheets_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          id: string
          input_id: string | null
          language: Database["public"]["Enums"]["lesson_language"]
          level: string | null
          reasoning: string | null
          status: Database["public"]["Enums"]["lesson_status"]
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_id?: string | null
          language: Database["public"]["Enums"]["lesson_language"]
          level?: string | null
          reasoning?: string | null
          status?: Database["public"]["Enums"]["lesson_status"]
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          input_id?: string | null
          language?: Database["public"]["Enums"]["lesson_language"]
          level?: string | null
          reasoning?: string | null
          status?: Database["public"]["Enums"]["lesson_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "inputs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      input_source_type: "youtube" | "tiktok" | "audio" | "image" | "text"
      input_status: "pending" | "processing" | "completed" | "failed"
      lesson_language: "english" | "chinese"
      lesson_status: "draft" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      input_source_type: ["youtube", "tiktok", "audio", "image", "text"],
      input_status: ["pending", "processing", "completed", "failed"],
      lesson_language: ["english", "chinese"],
      lesson_status: ["draft", "published"],
    },
  },
} as const
