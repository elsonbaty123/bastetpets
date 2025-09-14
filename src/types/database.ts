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
          name: string | null
          email: string | null
          phone: string | null
          city: string | null
          address: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          city?: string | null
          address?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          city?: string | null
          address?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      cats: {
        Row: {
          id: string
          user_id: string
          name: string
          sex: 'male' | 'female'
          age_months: number
          weight_kg: number
          breed: string | null
          neutered: boolean
          activity_level: 'low' | 'normal' | 'high'
          body_condition_score: number
          allergies: string[]
          health_issues: string[]
          food_preferences: Json
          disliked_ingredients: string[]
          feeding_times_per_day: number
          notes: string | null
          medical_files_folder: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sex: 'male' | 'female'
          age_months: number
          weight_kg: number
          breed?: string | null
          neutered?: boolean
          activity_level?: 'low' | 'normal' | 'high'
          body_condition_score?: number
          allergies?: string[]
          health_issues?: string[]
          food_preferences?: Json
          disliked_ingredients?: string[]
          feeding_times_per_day?: number
          notes?: string | null
          medical_files_folder?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sex?: 'male' | 'female'
          age_months?: number
          weight_kg?: number
          breed?: string | null
          neutered?: boolean
          activity_level?: 'low' | 'normal' | 'high'
          body_condition_score?: number
          allergies?: string[]
          health_issues?: string[]
          food_preferences?: Json
          disliked_ingredients?: string[]
          feeding_times_per_day?: number
          notes?: string | null
          medical_files_folder?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'paused' | 'canceled'
          start_date: string
          next_renewal_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'paused' | 'canceled'
          start_date: string
          next_renewal_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'paused' | 'canceled'
          start_date?: string
          next_renewal_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          total_price: number
          currency: string
          status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled'
          address: string
          city: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          total_price: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled'
          address: string
          city: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          total_price?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled'
          address?: string
          city?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          cat_id: string
          daily_calories: number
          daily_grams: number
          menu_rotation: string[]
          add_ons: string[]
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          cat_id: string
          daily_calories: number
          daily_grams: number
          menu_rotation?: string[]
          add_ons?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          cat_id?: string
          daily_calories?: number
          daily_grams?: number
          menu_rotation?: string[]
          add_ons?: string[]
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          order_id: string
          type: 'whatsapp' | 'email'
          status: 'queued' | 'sent' | 'failed'
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          type: 'whatsapp' | 'email'
          status?: 'queued' | 'sent' | 'failed'
          payload: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          type?: 'whatsapp' | 'email'
          status?: 'queued' | 'sent' | 'failed'
          payload?: Json
          created_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          admin_email: string
          admin_whatsapp_number_e164: string
          base_url: string
          cities_served: string[]
          currency: string
          calorie_density_kcal_per_100g: number
          whatsapp_cloud_api_enabled: boolean
          whatsapp_cloud_api_access_token: string | null
          whatsapp_phone_number_id: string | null
          brand_logo_path: string | null
          brand_logo_url: string | null
          brand_theme: Json | null
          brand_fonts: Json | null
          brand_primary_hex: string | null
          brand_og_image_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_email: string
          admin_whatsapp_number_e164: string
          base_url: string
          cities_served?: string[]
          currency?: string
          calorie_density_kcal_per_100g?: number
          whatsapp_cloud_api_enabled?: boolean
          whatsapp_cloud_api_access_token?: string | null
          whatsapp_phone_number_id?: string | null
          brand_logo_path?: string | null
          brand_logo_url?: string | null
          brand_theme?: Json | null
          brand_fonts?: Json | null
          brand_primary_hex?: string | null
          brand_og_image_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_email?: string
          admin_whatsapp_number_e164?: string
          base_url?: string
          cities_served?: string[]
          currency?: string
          calorie_density_kcal_per_100g?: number
          whatsapp_cloud_api_enabled?: boolean
          whatsapp_cloud_api_access_token?: string | null
          whatsapp_phone_number_id?: string | null
          brand_logo_path?: string | null
          brand_logo_url?: string | null
          brand_theme?: Json | null
          brand_fonts?: Json | null
          brand_primary_hex?: string | null
          brand_og_image_path?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}