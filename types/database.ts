// =============================================================================
// Supabase Database Types (STUB)
// =============================================================================
// This file is a typed stub that mirrors the schema defined in ELDER_CARE_COMPANION_GUIDE.md.
// REPLACE this file with the auto-generated output by running:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
// =============================================================================

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
          email: string
          phone: string | null
          role: 'elder' | 'family_member' | 'doctor' | 'admin'
          full_name: string | null
          avatar_url: string | null
          timezone: string
          expo_push_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          role: 'elder' | 'family_member' | 'doctor' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          expo_push_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          role?: 'elder' | 'family_member' | 'doctor' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          expo_push_token?: string | null
          updated_at?: string
        }
        Relationships: any[]
      }
      families: {
        Row: {
          id: string
          name: string | null
          subscription_tier: 'free' | 'basic' | 'premium'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          invite_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          invite_code?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          invite_code?: string | null
        }
        Relationships: any[]
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'elder' | 'caregiver' | 'observer'
          is_primary_caregiver: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role: 'elder' | 'caregiver' | 'observer'
          is_primary_caregiver?: boolean
          joined_at?: string
        }
        Update: {
          role?: 'elder' | 'caregiver' | 'observer'
          is_primary_caregiver?: boolean
        }
        Relationships: any[]
      }
      medications: {
        Row: {
          id: string
          elder_id: string
          name: string
          dosage: string | null
          instructions: string | null
          prescribed_by: string | null
          is_critical: boolean
          created_at: string
        }
        Insert: {
          id?: string
          elder_id: string
          name: string
          dosage?: string | null
          instructions?: string | null
          prescribed_by?: string | null
          is_critical?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          dosage?: string | null
          instructions?: string | null
          prescribed_by?: string | null
          is_critical?: boolean
        }
        Relationships: any[]
      }
      medication_schedules: {
        Row: {
          id: string
          medication_id: string
          frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed' | 'custom'
          times_of_day: string[]
          days_of_week: number[] | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          medication_id: string
          frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed' | 'custom'
          times_of_day: string[]
          days_of_week?: number[] | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
        }
        Update: {
          frequency?: 'daily' | 'twice_daily' | 'weekly' | 'as_needed' | 'custom'
          times_of_day?: string[]
          days_of_week?: number[] | null
          end_date?: string | null
          is_active?: boolean
        }
        Relationships: any[]
      }
      medication_logs: {
        Row: {
          id: string
          schedule_id: string | null
          elder_id: string
          scheduled_time: string | null
          action: 'taken' | 'skipped' | 'snoozed'
          logged_at: string
          note: string | null
        }
        Insert: {
          id?: string
          schedule_id?: string | null
          elder_id: string
          scheduled_time?: string | null
          action: 'taken' | 'skipped' | 'snoozed'
          logged_at?: string
          note?: string | null
        }
        Update: {
          note?: string | null
        }
        Relationships: any[]
      }
      wellness_checkins: {
        Row: {
          id: string
          elder_id: string
          scheduled_time: string | null
          completed_at: string | null
          mood_score: number | null
          pain_score: number | null
          energy_score: number | null
          notes: string | null
          status: 'pending' | 'completed' | 'missed'
        }
        Insert: {
          id?: string
          elder_id: string
          scheduled_time?: string | null
          completed_at?: string | null
          mood_score?: number | null
          pain_score?: number | null
          energy_score?: number | null
          notes?: string | null
          status?: 'pending' | 'completed' | 'missed'
        }
        Update: {
          completed_at?: string | null
          mood_score?: number | null
          pain_score?: number | null
          energy_score?: number | null
          notes?: string | null
          status?: 'pending' | 'completed' | 'missed'
        }
        Relationships: any[]
      }
      appointments: {
        Row: {
          id: string
          elder_id: string
          doctor_name: string | null
          specialty: string | null
          location: string | null
          appointment_date: string | null
          notes: string | null
          reminder_sent: boolean
          status: 'upcoming' | 'completed' | 'cancelled'
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          elder_id: string
          doctor_name?: string | null
          specialty?: string | null
          location?: string | null
          appointment_date?: string | null
          notes?: string | null
          reminder_sent?: boolean
          status?: 'upcoming' | 'completed' | 'cancelled'
          created_by?: string | null
          created_at?: string
        }
        Update: {
          doctor_name?: string | null
          specialty?: string | null
          location?: string | null
          appointment_date?: string | null
          notes?: string | null
          reminder_sent?: boolean
          status?: 'upcoming' | 'completed' | 'cancelled'
        }
        Relationships: any[]
      }
      emergency_alerts: {
        Row: {
          id: string
          elder_id: string
          family_id: string
          trigger_type: 'sos_button' | 'missed_checkin' | 'medication_missed' | 'fall_detected' | 'manual'
          severity: 'low' | 'medium' | 'high' | 'critical'
          message: string | null
          location_lat: number | null
          location_lng: number | null
          acknowledged_by: string | null
          acknowledged_at: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          elder_id: string
          family_id: string
          trigger_type: 'sos_button' | 'missed_checkin' | 'medication_missed' | 'fall_detected' | 'manual'
          severity: 'low' | 'medium' | 'high' | 'critical'
          message?: string | null
          location_lat?: number | null
          location_lng?: number | null
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
        }
        Relationships: any[]
      }
      location_sharing: {
        Row: {
          id: string
          elder_id: string
          is_enabled: boolean
          last_lat: number | null
          last_lng: number | null
          last_updated: string | null
          visible_to: string[] | null
        }
        Insert: {
          id?: string
          elder_id: string
          is_enabled?: boolean
          last_lat?: number | null
          last_lng?: number | null
          last_updated?: string | null
          visible_to?: string[] | null
        }
        Update: {
          is_enabled?: boolean
          last_lat?: number | null
          last_lng?: number | null
          last_updated?: string | null
          visible_to?: string[] | null
        }
        Relationships: any[]
      }
    }
    Views: Record<string, any>
    Functions: Record<string, any>
    Enums: Record<string, any>
  }
}
