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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_plans: {
        Row: {
          actual_amount: number | null
          allocated_amount: number | null
          approved_at: string | null
          approved_by: string | null
          budget_category_id: string
          budget_year: number
          created_at: string | null
          created_by: string | null
          id: string
          institution_id: string
          planned_amount: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          allocated_amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          budget_category_id: string
          budget_year: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          institution_id: string
          planned_amount: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          allocated_amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          budget_category_id?: string
          budget_year?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          institution_id?: string
          planned_amount?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_plans_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_plans_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_plans_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string | null
          id: string
          institution_id: string
          period_end: string
          period_start: string
          planned_amount: number
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string | null
          id?: string
          institution_id: string
          period_end: string
          period_start: string
          planned_amount: number
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string | null
          id?: string
          institution_id?: string
          period_end?: string
          period_start?: string
          planned_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          account_type: string
          bank_name: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          institution_id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          account_type: string
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          account_type?: string
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_accounts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flows: {
        Row: {
          amount: number
          cash_account_id: string
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          reference_number: string | null
          related_transaction_id: string | null
          transaction_date: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          cash_account_id: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          reference_number?: string | null
          related_transaction_id?: string | null
          transaction_date?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          cash_account_id?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          reference_number?: string | null
          related_transaction_id?: string | null
          transaction_date?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flows_cash_account_id_fkey"
            columns: ["cash_account_id"]
            isOneToOne: false
            referencedRelation: "cash_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flows_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string | null
          current_stock: number | null
          id: string
          institution_id: string
          is_active: boolean | null
          item_code: string
          item_name: string
          minimum_stock: number | null
          unit: string
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          item_code: string
          item_name: string
          minimum_stock?: number | null
          unit: string
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          item_code?: string
          item_name?: string
          minimum_stock?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          inventory_item_id: string
          movement_type: string
          notes: string | null
          quantity: number
          reference_number: string | null
          total_value: number | null
          transaction_date: string | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id: string
          movement_type: string
          notes?: string | null
          quantity: number
          reference_number?: string | null
          total_value?: number | null
          transaction_date?: string | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reference_number?: string | null
          total_value?: number | null
          transaction_date?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          report_type: string
          template_config: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          report_type: string
          template_config: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          report_type?: string
          template_config?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      spp_payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_month: number
          payment_year: number
          receipt_number: string | null
          spp_structure_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_month: number
          payment_year: number
          receipt_number?: string | null
          spp_structure_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_month?: number
          payment_year?: number
          receipt_number?: string | null
          spp_structure_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spp_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spp_payments_spp_structure_id_fkey"
            columns: ["spp_structure_id"]
            isOneToOne: false
            referencedRelation: "spp_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spp_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      spp_structure: {
        Row: {
          academic_year: string
          class_grade: string
          created_at: string | null
          id: string
          institution_id: string
          is_active: boolean | null
          monthly_amount: number
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          class_grade: string
          created_at?: string | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          monthly_amount: number
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          class_grade?: string
          created_at?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          monthly_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spp_structure_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          class_grade: string
          created_at: string | null
          enrollment_date: string | null
          full_name: string
          id: string
          institution_id: string
          parent_name: string | null
          parent_phone: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          class_grade: string
          created_at?: string | null
          enrollment_date?: string | null
          full_name: string
          id?: string
          institution_id: string
          parent_name?: string | null
          parent_phone?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          class_grade?: string
          created_at?: string | null
          enrollment_date?: string | null
          full_name?: string
          id?: string
          institution_id?: string
          parent_name?: string | null
          parent_phone?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          institution_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description: string
          id?: string
          institution_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          institution_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      transparency_reports: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          institution_id: string | null
          is_published: boolean | null
          published_at: string | null
          report_period: string
          report_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          published_at?: string | null
          report_period: string
          report_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          published_at?: string | null
          report_period?: string
          report_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transparency_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transparency_reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
