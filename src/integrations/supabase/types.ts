export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cohorts: {
        Row: {
          created_at: string | null
          current_students: number | null
          end_date: string
          id: string
          max_students: number | null
          name: string
          proficiency_level: Database["public"]["Enums"]["proficiency_level"]
          start_date: string
          status: string | null
          tutor_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_students?: number | null
          end_date: string
          id?: string
          max_students?: number | null
          name: string
          proficiency_level: Database["public"]["Enums"]["proficiency_level"]
          start_date: string
          status?: string | null
          tutor_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_students?: number | null
          end_date?: string
          id?: string
          max_students?: number | null
          name?: string
          proficiency_level?: Database["public"]["Enums"]["proficiency_level"]
          start_date?: string
          status?: string | null
          tutor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          email_data: Json | null
          email_type: string
          id: string
          recipient_id: string | null
          sent_at: string | null
        }
        Insert: {
          email_data?: Json | null
          email_type: string
          id?: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Update: {
          email_data?: Json | null
          email_type?: string
          id?: string
          recipient_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_test_results: {
        Row: {
          calculated_level: Database["public"]["Enums"]["proficiency_level"]
          completed_at: string | null
          id: string
          score_percentage: number
          student_id: string | null
          test_answers: Json
        }
        Insert: {
          calculated_level: Database["public"]["Enums"]["proficiency_level"]
          completed_at?: string | null
          id?: string
          score_percentage: number
          student_id?: string | null
          test_answers: Json
        }
        Update: {
          calculated_level?: Database["public"]["Enums"]["proficiency_level"]
          completed_at?: string | null
          id?: string
          score_percentage?: number
          student_id?: string | null
          test_answers?: Json
        }
        Relationships: [
          {
            foreignKeyName: "placement_test_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          program_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          program_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          program_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          assigned_cohort_id: string | null
          certificate_url: string | null
          content_access_level: number | null
          created_at: string | null
          current_level: Database["public"]["Enums"]["proficiency_level"] | null
          id: string
          learning_goals: string
          status: Database["public"]["Enums"]["student_status"] | null
          study_experience: string
          test_score: string | null
          test_timestamp: string | null
          test_type: Database["public"]["Enums"]["test_type"]
          took_proficiency_test: boolean
          updated_at: string | null
          used_in_app_test: boolean | null
        }
        Insert: {
          assigned_cohort_id?: string | null
          certificate_url?: string | null
          content_access_level?: number | null
          created_at?: string | null
          current_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          id: string
          learning_goals: string
          status?: Database["public"]["Enums"]["student_status"] | null
          study_experience: string
          test_score?: string | null
          test_timestamp?: string | null
          test_type?: Database["public"]["Enums"]["test_type"]
          took_proficiency_test: boolean
          updated_at?: string | null
          used_in_app_test?: boolean | null
        }
        Update: {
          assigned_cohort_id?: string | null
          certificate_url?: string | null
          content_access_level?: number | null
          created_at?: string | null
          current_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          id?: string
          learning_goals?: string
          status?: Database["public"]["Enums"]["student_status"] | null
          study_experience?: string
          test_score?: string | null
          test_timestamp?: string | null
          test_type?: Database["public"]["Enums"]["test_type"]
          took_proficiency_test?: boolean
          updated_at?: string | null
          used_in_app_test?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_assigned_cohort_id_fkey"
            columns: ["assigned_cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_assign_cohort: {
        Args: {
          student_id: string
          level: Database["public"]["Enums"]["proficiency_level"]
        }
        Returns: string
      }
      create_student_profile: {
        Args: {
          user_id: string
          study_exp: string
          goals: string
          took_test: boolean
          level?: Database["public"]["Enums"]["proficiency_level"]
          test_score_val?: string
          cert_url?: string
        }
        Returns: undefined
      }
      generate_program_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_student_status: {
        Args: {
          student_id: string
          new_status: Database["public"]["Enums"]["student_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      proficiency_level: "A1-A2" | "B1-B2" | "C1-C2"
      student_status: "pending_approval" | "approved" | "rejected"
      test_type: "external" | "internal_placement" | "none"
      user_role: "student" | "tutor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      proficiency_level: ["A1-A2", "B1-B2", "C1-C2"],
      student_status: ["pending_approval", "approved", "rejected"],
      test_type: ["external", "internal_placement", "none"],
      user_role: ["student", "tutor", "admin"],
    },
  },
} as const
