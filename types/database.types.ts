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
      categorias: {
        Row: {
          created_at: string
          id: string
          nombre: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          slug?: string
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          estado: Database["public"]["Enums"]["order_status"]
          id: string
          pedido_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          estado: Database["public"]["Enums"]["order_status"]
          id?: string
          pedido_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["order_status"]
          id?: string
          pedido_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_items: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          pedido_id: string
          precio_unitario: number
          producto_id: string | null
          producto_nombre: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          id?: string
          pedido_id: string
          precio_unitario: number
          producto_id?: string | null
          producto_nombre: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          pedido_id?: string
          precio_unitario?: number
          producto_id?: string | null
          producto_nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_nombre: string
          created_at: string
          delivery_fee: number
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          direccion: string | null
          estado: Database["public"]["Enums"]["order_status"]
          id: string
          notas: string | null
          payment_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          preference_id: string | null
          subtotal: number
          telefono: string
          total: number
          updated_at: string
        }
        Insert: {
          cliente_nombre: string
          created_at?: string
          delivery_fee?: number
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          direccion?: string | null
          estado?: Database["public"]["Enums"]["order_status"]
          id?: string
          notas?: string | null
          payment_id?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          preference_id?: string | null
          subtotal: number
          telefono: string
          total: number
          updated_at?: string
        }
        Update: {
          cliente_nombre?: string
          created_at?: string
          delivery_fee?: number
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          direccion?: string | null
          estado?: Database["public"]["Enums"]["order_status"]
          id?: string
          notas?: string | null
          payment_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          preference_id?: string | null
          subtotal?: number
          telefono?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          categoria_id: string
          created_at: string
          descripcion: string | null
          disponible: boolean
          id: string
          imagen_url: string | null
          nombre: string
          precio: number
          slug: string
          updated_at: string
        }
        Insert: {
          categoria_id: string
          created_at?: string
          descripcion?: string | null
          disponible?: boolean
          id?: string
          imagen_url?: string | null
          nombre: string
          precio: number
          slug: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string
          created_at?: string
          descripcion?: string | null
          disponible?: boolean
          id?: string
          imagen_url?: string | null
          nombre?: string
          precio?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          banner_url: string | null
          created_at: string
          delivery_enabled: boolean
          delivery_fee: number
          estimated_delivery_time: number
          facebook_url: string | null
          id: string
          instagram_url: string | null
          is_store_open: boolean
          logo_url: string | null
          minimum_order_amount: number
          primary_color: string | null
          store_name: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          delivery_enabled?: boolean
          delivery_fee?: number
          estimated_delivery_time?: number
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_store_open?: boolean
          logo_url?: string | null
          minimum_order_amount?: number
          primary_color?: string | null
          store_name: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          delivery_enabled?: boolean
          delivery_fee?: number
          estimated_delivery_time?: number
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_store_open?: boolean
          logo_url?: string | null
          minimum_order_amount?: number
          primary_color?: string | null
          store_name?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      delivery_type: "delivery" | "pickup"
      order_status:
        | "pendiente"
        | "en_preparacion"
        | "en_camino"
        | "entregado"
        | "cancelado"
      payment_method: "mercadopago" | "efectivo"
      payment_status: "pendiente" | "aprobado" | "rechazado"
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
      app_role: ["admin"],
      delivery_type: ["delivery", "pickup"],
      order_status: [
        "pendiente",
        "en_preparacion",
        "en_camino",
        "entregado",
        "cancelado",
      ],
      payment_method: ["mercadopago", "efectivo"],
      payment_status: ["pendiente", "aprobado", "rechazado"],
    },
  },
} as const
