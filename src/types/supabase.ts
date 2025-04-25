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
      orders: {
        Row: {
          id: string
          order_id: string
          date: string
          customer_name: string
          email: string
          phone: string | null
          product_name: string | null
          product_code: string | null
          size: string | null
          fit_type: string | null
          color: string | null
          price: number
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          order_id: string
          date: string
          customer_name: string
          email: string
          phone?: string | null
          product_name?: string | null
          product_code?: string | null
          size?: string | null
          fit_type?: string | null
          color?: string | null
          price: number
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          order_id?: string
          date?: string
          customer_name?: string
          email?: string
          phone?: string | null
          product_name?: string | null
          product_code?: string | null
          size?: string | null
          fit_type?: string | null
          color?: string | null
          price?: number
          created_at?: string
          user_id?: string
        }
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
  }
}