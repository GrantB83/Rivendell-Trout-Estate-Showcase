export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_suggestions: {
        Row: {
          activity_name: string
          created_at: string
          description: string
          id: string
          updated_at: string
        }
        Insert: {
          activity_name: string
          created_at?: string
          description: string
          id?: string
          updated_at?: string
        }
        Update: {
          activity_name?: string
          created_at?: string
          description?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_communications: {
        Row: {
          created_at: string
          id: string
          is_processed: boolean | null
          message_payload: Json
          message_type: string
          priority: string | null
          processed_at: string | null
          recipient_agent: string
          sender_agent: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_processed?: boolean | null
          message_payload: Json
          message_type: string
          priority?: string | null
          processed_at?: string | null
          recipient_agent: string
          sender_agent: string
        }
        Update: {
          created_at?: string
          id?: string
          is_processed?: boolean | null
          message_payload?: Json
          message_type?: string
          priority?: string | null
          processed_at?: string | null
          recipient_agent?: string
          sender_agent?: string
        }
        Relationships: []
      }
      agent_configurations: {
        Row: {
          agent_name: string
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          version: number
        }
        Insert: {
          agent_name: string
          configuration: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          version?: number
        }
        Update: {
          agent_name?: string
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      agent_learning_data: {
        Row: {
          agent_name: string
          confidence_score: number | null
          created_at: string
          data_payload: Json
          data_type: string
          id: string
          is_processed: boolean | null
        }
        Insert: {
          agent_name: string
          confidence_score?: number | null
          created_at?: string
          data_payload: Json
          data_type: string
          id?: string
          is_processed?: boolean | null
        }
        Update: {
          agent_name?: string
          confidence_score?: number | null
          created_at?: string
          data_payload?: Json
          data_type?: string
          id?: string
          is_processed?: boolean | null
        }
        Relationships: []
      }
      agent_optimizations: {
        Row: {
          agent_name: string
          created_at: string
          id: string
          new_config: Json | null
          optimization_type: string
          performance_impact: number | null
          previous_config: Json | null
          reason: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string
          id?: string
          new_config?: Json | null
          optimization_type: string
          performance_impact?: number | null
          previous_config?: Json | null
          reason?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string
          id?: string
          new_config?: Json | null
          optimization_type?: string
          performance_impact?: number | null
          previous_config?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      agent_performance: {
        Row: {
          agent_name: string
          context: Json | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          recorded_at: string
        }
        Insert: {
          agent_name: string
          context?: Json | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          recorded_at?: string
        }
        Update: {
          agent_name?: string
          context?: Json | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          recorded_at?: string
        }
        Relationships: []
      }
      agent_safety_logs: {
        Row: {
          action_data: Json
          action_type: string
          agent_name: string
          created_at: string
          id: string
          notes: string | null
          reviewer_id: string | null
          safety_score: number | null
          validation_result: string
        }
        Insert: {
          action_data: Json
          action_type: string
          agent_name: string
          created_at?: string
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          safety_score?: number | null
          validation_result: string
        }
        Update: {
          action_data?: Json
          action_type?: string
          agent_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          safety_score?: number | null
          validation_result?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_performance: {
        Row: {
          content_id: string
          content_type: string
          conversion_rate: number | null
          engagement_rate: number | null
          id: string
          keyword_rankings: Json | null
          recorded_at: string
          seo_score: number | null
          title: string | null
          url: string | null
          user_feedback: Json | null
          views: number | null
        }
        Insert: {
          content_id: string
          content_type: string
          conversion_rate?: number | null
          engagement_rate?: number | null
          id?: string
          keyword_rankings?: Json | null
          recorded_at?: string
          seo_score?: number | null
          title?: string | null
          url?: string | null
          user_feedback?: Json | null
          views?: number | null
        }
        Update: {
          content_id?: string
          content_type?: string
          conversion_rate?: number | null
          engagement_rate?: number | null
          id?: string
          keyword_rankings?: Json | null
          recorded_at?: string
          seo_score?: number | null
          title?: string | null
          url?: string | null
          user_feedback?: Json | null
          views?: number | null
        }
        Relationships: []
      }
      cottage_directions: {
        Row: {
          cottage_name: string
          created_at: string
          directions: string
          id: string
          updated_at: string
        }
        Insert: {
          cottage_name: string
          created_at?: string
          directions: string
          id?: string
          updated_at?: string
        }
        Update: {
          cottage_name?: string
          created_at?: string
          directions?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gate_codes: {
        Row: {
          code: string
          cottage_name: string
          created_at: string
          end_date: string
          id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          code: string
          cottage_name: string
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          updated_at?: string
        }
        Update: {
          code?: string
          cottage_name?: string
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      guest_experience_insights: {
        Row: {
          actionable: boolean | null
          confidence_score: number | null
          created_at: string
          id: string
          implemented: boolean | null
          insight_data: Json
          insight_type: string
        }
        Insert: {
          actionable?: boolean | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          implemented?: boolean | null
          insight_data: Json
          insight_type: string
        }
        Update: {
          actionable?: boolean | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          implemented?: boolean | null
          insight_data?: Json
          insight_type?: string
        }
        Relationships: []
      }
      guest_identities: {
        Row: {
          communication_preferences: Json | null
          contact_number: string
          created_at: string
          email: string | null
          excluded_at: string | null
          excluded_by: string | null
          exclusion_reason: string | null
          first_booking_date: string
          id: string
          last_booking_date: string
          marketing_consent: boolean | null
          marketing_excluded: boolean | null
          notes: string | null
          preferred_cottage: string | null
          primary_name: string
          primary_surname: string
          total_bookings: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          communication_preferences?: Json | null
          contact_number: string
          created_at?: string
          email?: string | null
          excluded_at?: string | null
          excluded_by?: string | null
          exclusion_reason?: string | null
          first_booking_date: string
          id?: string
          last_booking_date: string
          marketing_consent?: boolean | null
          marketing_excluded?: boolean | null
          notes?: string | null
          preferred_cottage?: string | null
          primary_name: string
          primary_surname: string
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          communication_preferences?: Json | null
          contact_number?: string
          created_at?: string
          email?: string | null
          excluded_at?: string | null
          excluded_by?: string | null
          exclusion_reason?: string | null
          first_booking_date?: string
          id?: string
          last_booking_date?: string
          marketing_consent?: boolean | null
          marketing_excluded?: boolean | null
          notes?: string | null
          preferred_cottage?: string | null
          primary_name?: string
          primary_surname?: string
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_identities_excluded_by_fkey"
            columns: ["excluded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          booking_number: string
          check_in_date: string
          check_out_date: string
          communication_preferences: Json | null
          contact_number: string
          cottage_name: string
          created_at: string
          guest_identity_id: string | null
          id: string
          marketing_consent: boolean | null
          name: string
          surname: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_number: string
          check_in_date: string
          check_out_date: string
          communication_preferences?: Json | null
          contact_number: string
          cottage_name: string
          created_at?: string
          guest_identity_id?: string | null
          id?: string
          marketing_consent?: boolean | null
          name: string
          surname: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_number?: string
          check_in_date?: string
          check_out_date?: string
          communication_preferences?: Json | null
          contact_number?: string
          cottage_name?: string
          created_at?: string
          guest_identity_id?: string | null
          id?: string
          marketing_consent?: boolean | null
          name?: string
          surname?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_guest_identity_id_fkey"
            columns: ["guest_identity_id"]
            isOneToOne: false
            referencedRelation: "guest_identities"
            referencedColumns: ["id"]
          },
        ]
      }
      import_column_mappings: {
        Row: {
          column_mappings: Json
          created_at: string
          id: string
          mapping_name: string
          updated_at: string
        }
        Insert: {
          column_mappings: Json
          created_at?: string
          id?: string
          mapping_name: string
          updated_at?: string
        }
        Update: {
          column_mappings?: Json
          created_at?: string
          id?: string
          mapping_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_exclusion_audit: {
        Row: {
          action: string
          guest_identity_id: string
          id: string
          new_reason: string | null
          new_status: boolean | null
          notes: string | null
          performed_at: string
          performed_by: string
          previous_reason: string | null
          previous_status: boolean | null
        }
        Insert: {
          action: string
          guest_identity_id: string
          id?: string
          new_reason?: string | null
          new_status?: boolean | null
          notes?: string | null
          performed_at?: string
          performed_by: string
          previous_reason?: string | null
          previous_status?: boolean | null
        }
        Update: {
          action?: string
          guest_identity_id?: string
          id?: string
          new_reason?: string | null
          new_status?: boolean | null
          notes?: string | null
          performed_at?: string
          performed_by?: string
          previous_reason?: string | null
          previous_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_exclusion_audit_guest_identity_id_fkey"
            columns: ["guest_identity_id"]
            isOneToOne: false
            referencedRelation: "guest_identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_exclusion_audit_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_exclusion_reasons: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          reason_code: string
          reason_description: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reason_code: string
          reason_description: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reason_code?: string
          reason_description?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_optimization_data: {
        Row: {
          confidence_level: number | null
          context: Json | null
          id: string
          metric_type: string
          metric_value: number
          recorded_at: string
          trend_direction: string | null
        }
        Insert: {
          confidence_level?: number | null
          context?: Json | null
          id?: string
          metric_type: string
          metric_value: number
          recorded_at?: string
          trend_direction?: string | null
        }
        Update: {
          confidence_level?: number | null
          context?: Json | null
          id?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          trend_direction?: string | null
        }
        Relationships: []
      }
      seo_opportunities: {
        Row: {
          created_at: string
          current_ranking: number | null
          difficulty_score: number | null
          id: string
          is_implemented: boolean | null
          keyword: string
          opportunity_score: number | null
          search_volume: number | null
          suggested_actions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_ranking?: number | null
          difficulty_score?: number | null
          id?: string
          is_implemented?: boolean | null
          keyword: string
          opportunity_score?: number | null
          search_volume?: number | null
          suggested_actions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_ranking?: number | null
          difficulty_score?: number | null
          id?: string
          is_implemented?: boolean | null
          keyword?: string
          opportunity_score?: number | null
          search_volume?: number | null
          suggested_actions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          notes: string | null
          request_type: Database["public"]["Enums"]["service_request_type"]
          status: Database["public"]["Enums"]["service_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          notes?: string | null
          request_type: Database["public"]["Enums"]["service_request_type"]
          status?: Database["public"]["Enums"]["service_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          notes?: string | null
          request_type?: Database["public"]["Enums"]["service_request_type"]
          status?: Database["public"]["Enums"]["service_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_id: string
          message_type: string
          recipient_phone: string
          sender_phone: string
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_id: string
          message_type?: string
          recipient_phone: string
          sender_phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_id?: string
          message_type?: string
          recipient_phone?: string
          sender_phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_marketing_exclusion: {
        Args: {
          guest_identity_id: string
          excluded: boolean
          reason?: string
          notes?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      service_request_status:
        | "pending"
        | "in_progress"
        | "delivered"
        | "cancelled"
      service_request_type:
        | "firewood"
        | "braai_pack"
        | "breakfast_basket"
        | "cleaning"
        | "other"
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
      service_request_status: [
        "pending",
        "in_progress",
        "delivered",
        "cancelled",
      ],
      service_request_type: [
        "firewood",
        "braai_pack",
        "breakfast_basket",
        "cleaning",
        "other",
      ],
    },
  },
} as const
