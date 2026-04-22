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
      case_studies: {
        Row: {
          ad_budget: number | null
          business_goal: string | null
          client_logo_url: string | null
          client_name: string | null
          clients_count: number | null
          conclusion: string | null
          cost_per_lead: number | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          execution_details: string | null
          funnel_details: string | null
          id: string
          initial_situation: string | null
          leads_count: number | null
          offer_details: string | null
          positioning: string | null
          project_name: string
          revenue_after: string | null
          revenue_before: string | null
          revenue_generated: number | null
          roas: number | null
          roi: number | null
          sector_id: string | null
          short_problem: string | null
          slug: string
          status: Database["public"]["Enums"]["case_study_status"]
          strategy_angle: string | null
          targeting_details: string | null
          testimonial: string | null
          traffic_after: string | null
          traffic_before: string | null
          updated_at: string
          visibility_after: string | null
          visibility_before: string | null
        }
        Insert: {
          ad_budget?: number | null
          business_goal?: string | null
          client_logo_url?: string | null
          client_name?: string | null
          clients_count?: number | null
          conclusion?: string | null
          cost_per_lead?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          execution_details?: string | null
          funnel_details?: string | null
          id?: string
          initial_situation?: string | null
          leads_count?: number | null
          offer_details?: string | null
          positioning?: string | null
          project_name: string
          revenue_after?: string | null
          revenue_before?: string | null
          revenue_generated?: number | null
          roas?: number | null
          roi?: number | null
          sector_id?: string | null
          short_problem?: string | null
          slug: string
          status?: Database["public"]["Enums"]["case_study_status"]
          strategy_angle?: string | null
          targeting_details?: string | null
          testimonial?: string | null
          traffic_after?: string | null
          traffic_before?: string | null
          updated_at?: string
          visibility_after?: string | null
          visibility_before?: string | null
        }
        Update: {
          ad_budget?: number | null
          business_goal?: string | null
          client_logo_url?: string | null
          client_name?: string | null
          clients_count?: number | null
          conclusion?: string | null
          cost_per_lead?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          execution_details?: string | null
          funnel_details?: string | null
          id?: string
          initial_situation?: string | null
          leads_count?: number | null
          offer_details?: string | null
          positioning?: string | null
          project_name?: string
          revenue_after?: string | null
          revenue_before?: string | null
          revenue_generated?: number | null
          roas?: number | null
          roi?: number | null
          sector_id?: string | null
          short_problem?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["case_study_status"]
          strategy_angle?: string | null
          targeting_details?: string | null
          testimonial?: string | null
          traffic_after?: string | null
          traffic_before?: string | null
          updated_at?: string
          visibility_after?: string | null
          visibility_before?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_studies_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_media: {
        Row: {
          case_study_id: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          sort_order: number
          title: string | null
        }
        Insert: {
          case_study_id: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          media_type: Database["public"]["Enums"]["media_type"]
          sort_order?: number
          title?: string | null
        }
        Update: {
          case_study_id?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          sort_order?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_media_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_proofs: {
        Row: {
          case_study_id: string
          created_at: string
          file_url: string | null
          id: string
          note: string | null
          proof_type: Database["public"]["Enums"]["proof_type"]
          title: string | null
        }
        Insert: {
          case_study_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          note?: string | null
          proof_type: Database["public"]["Enums"]["proof_type"]
          title?: string | null
        }
        Update: {
          case_study_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          note?: string | null
          proof_type?: Database["public"]["Enums"]["proof_type"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_proofs_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_services: {
        Row: {
          case_study_id: string
          id: string
          service_id: string
        }
        Insert: {
          case_study_id: string
          id?: string
          service_id: string
        }
        Update: {
          case_study_id?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_study_services_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_study_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_settings: {
        Row: {
          accent_color: string
          address: string | null
          created_at: string
          cta_text: string | null
          email: string | null
          franchise_name: string
          id: string
          logo_url: string | null
          phone: string | null
          primary_color: string
          secondary_color: string
          updated_at: string
          whatsapp_url: string | null
        }
        Insert: {
          accent_color?: string
          address?: string | null
          created_at?: string
          cta_text?: string | null
          email?: string | null
          franchise_name?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          whatsapp_url?: string | null
        }
        Update: {
          accent_color?: string
          address?: string | null
          created_at?: string
          cta_text?: string | null
          email?: string | null
          franchise_name?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      global_stats: {
        Row: {
          average_roas: number
          id: string
          total_clients: number
          total_leads: number
          total_revenue: number
          total_views: number
          updated_at: string
        }
        Insert: {
          average_roas?: number
          id?: string
          total_clients?: number
          total_leads?: number
          total_revenue?: number
          total_views?: number
          updated_at?: string
        }
        Update: {
          average_roas?: number
          id?: string
          total_clients?: number
          total_leads?: number
          total_revenue?: number
          total_views?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          activity: string | null
          case_study_id: string | null
          created_at: string
          id: string
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          activity?: string | null
          case_study_id?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          activity?: string | null
          case_study_id?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      case_study_status: "draft" | "published" | "archived"
      media_type:
        | "image"
        | "video"
        | "screenshot"
        | "proof"
        | "ad_creative"
        | "ugc"
      proof_type:
        | "ads_manager"
        | "crm"
        | "lead_form"
        | "analytics"
        | "testimonial"
      user_role: "super_admin" | "admin" | "editor"
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
      case_study_status: ["draft", "published", "archived"],
      media_type: [
        "image",
        "video",
        "screenshot",
        "proof",
        "ad_creative",
        "ugc",
      ],
      proof_type: [
        "ads_manager",
        "crm",
        "lead_form",
        "analytics",
        "testimonial",
      ],
      user_role: ["super_admin", "admin", "editor"],
    },
  },
} as const
