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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          criteria: string
          description: string
          icon_url: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          created_at?: string
          criteria: string
          description: string
          icon_url?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          created_at?: string
          criteria?: string
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_data: Json | null
          certificate_name: string
          created_at: string
          id: string
          issued_date: string
          user_id: string
          verification_code: string
        }
        Insert: {
          certificate_data?: Json | null
          certificate_name: string
          created_at?: string
          id?: string
          issued_date: string
          user_id: string
          verification_code: string
        }
        Update: {
          certificate_data?: Json | null
          certificate_name?: string
          created_at?: string
          id?: string
          issued_date?: string
          user_id?: string
          verification_code?: string
        }
        Relationships: []
      }
      challenge_submissions: {
        Row: {
          challenge_id: string
          code: string
          id: string
          language: string
          status: string
          submitted_at: string
          test_results: Json | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          code: string
          id?: string
          language: string
          status: string
          submitted_at?: string
          test_results?: Json | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          code?: string
          id?: string
          language?: string
          status?: string
          submitted_at?: string
          test_results?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "coding_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_challenges: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          id: string
          points: number
          starter_code: string | null
          tags: string[] | null
          test_cases: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty: string
          id?: string
          points?: number
          starter_code?: string | null
          tags?: string[] | null
          test_cases: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          points?: number
          starter_code?: string | null
          tags?: string[] | null
          test_cases?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      competition_participants: {
        Row: {
          competition_id: string
          id: string
          joined_at: string
          rank: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          competition_id: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number | null
          user_id: string
        }
        Update: {
          competition_id?: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_participants_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string
          end_date: string
          id: string
          max_participants: number | null
          prize_pool: string | null
          start_date: string
          status: string
          title: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description: string
          end_date: string
          id?: string
          max_participants?: number | null
          prize_pool?: string | null
          start_date: string
          status?: string
          title: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          max_participants?: number | null
          prize_pool?: string | null
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      interview_attempts: {
        Row: {
          answers: Json
          created_at: string
          feedback: string | null
          id: string
          questions: Json
          role: string
          score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          feedback?: string | null
          id?: string
          questions: Json
          role: string
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          feedback?: string | null
          id?: string
          questions?: Json
          role?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_url: string | null
          category: string | null
          company: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          requirements: string[] | null
          salary_range: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          category?: string | null
          company: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          category?: string | null
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          college: string | null
          created_at: string
          email: string | null
          field_of_study: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          updated_at: string
          year_of_study: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          email?: string | null
          field_of_study?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          updated_at?: string
          year_of_study?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          college?: string | null
          created_at?: string
          email?: string | null
          field_of_study?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          updated_at?: string
          year_of_study?: string | null
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_tools: {
        Row: {
          created_at: string | null
          description: string | null
          documentation_url: string | null
          icon_url: string | null
          id: string
          name: string
          tool_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          icon_url?: string | null
          id?: string
          name: string
          tool_type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          tool_type?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          demo_url: string | null
          description: string | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          likes_count: number | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          likes_count?: number | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          likes_count?: number | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          ats_score: number | null
          content: string
          created_at: string
          id: string
          improved_content: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          content: string
          created_at?: string
          id?: string
          improved_content?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ats_score?: number | null
          content?: string
          created_at?: string
          id?: string
          improved_content?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string
          user_id: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string
          user_id?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
