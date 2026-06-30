// =============================================================================
// Union Types
// =============================================================================

export type UserRole = 'elder' | 'family_member' | 'doctor' | 'admin'
export type FamilyRole = 'elder' | 'caregiver' | 'observer'
export type SubscriptionTier = 'free' | 'basic' | 'premium'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertTrigger =
  | 'sos_button'
  | 'missed_checkin'
  | 'medication_missed'
  | 'fall_detected'
  | 'manual'
export type MedAction = 'taken' | 'skipped' | 'snoozed'
export type MedFrequency = 'daily' | 'twice_daily' | 'weekly' | 'as_needed' | 'custom'
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'
export type EnergyLevel = 'low' | 'medium' | 'high'
export type CheckinStatus = 'pending' | 'completed' | 'missed'

// =============================================================================
// Database Models
// =============================================================================

export interface Profile {
  id: string
  email: string
  phone?: string
  role: UserRole
  full_name?: string
  avatar_url?: string
  timezone: string
  expo_push_token?: string
  created_at: string
  updated_at: string
}

export interface Family {
  id: string
  name?: string
  subscription_tier: SubscriptionTier
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  user_id: string
  role: FamilyRole
  is_primary_caregiver: boolean
  joined_at: string
  profile?: Profile // joined
}

export interface Alert {
  id: string
  elder_id: string
  family_id: string
  trigger_type: AlertTrigger
  severity: AlertSeverity
  message?: string
  location_lat?: number
  location_lng?: number
  acknowledged_by?: string
  acknowledged_at?: string
  resolved_at?: string
  created_at: string
}

export interface Medication {
  id: string
  elder_id: string
  name: string
  dosage?: string
  instructions?: string
  prescribed_by?: string
  is_critical: boolean
  created_at: string
  schedules?: MedicationSchedule[]
}

export interface MedicationSchedule {
  id: string
  medication_id: string
  frequency: MedFrequency
  times_of_day: string[] // e.g. ['08:00', '20:00']
  days_of_week?: number[] // 0=Sun … 6=Sat
  start_date?: string
  end_date?: string
  is_active: boolean
}

export interface MedicationLog {
  id: string
  schedule_id?: string
  elder_id: string
  scheduled_time?: string
  action: MedAction
  logged_at: string
  note?: string
}

export interface WellnessCheckin {
  id: string
  elder_id: string
  scheduled_time?: string
  completed_at?: string
  mood_score?: number   // 1–5
  pain_score?: number   // 0–10
  energy_score?: number // 1 (low), 2 (medium), 3 (high)
  notes?: string
  status: CheckinStatus
}

export interface Appointment {
  id: string
  elder_id: string
  doctor_name?: string
  specialty?: string
  location?: string
  appointment_date?: string
  notes?: string
  reminder_sent: boolean
  status: AppointmentStatus
  created_by?: string
  created_at: string
}

export interface LocationSharing {
  id: string
  elder_id: string
  is_enabled: boolean
  last_lat?: number
  last_lng?: number
  last_updated?: string
  visible_to?: string[]
}

// =============================================================================
// App-level Context & Form Types
// =============================================================================

export interface SessionContext {
  user: Profile | null
  role: UserRole | null
  familyId: string | null
  elderId: string | null
  loading: boolean
}

export interface FamilyDashboardData {
  elderName: string | null
  lastCheckin: WellnessCheckin | null
  todayMeds: { taken: number; total: number }
  nextAppointment: Appointment | null
  activeAlertCount: number
  loading: boolean
}

export interface CheckInData {
  mood_score: number
  pain_score: number
  energy_score: number
  notes: string
}

export interface AppointmentFormData {
  doctor_name: string
  specialty: string
  location: string
  appointment_date: string
  notes: string
}

export interface MedicationFormData {
  name: string
  dosage: string
  instructions: string
  prescribed_by: string
  is_critical: boolean
  frequency: MedFrequency
  times_of_day: string[]
  days_of_week?: number[]
  start_date?: string
  end_date?: string
}

// Activity feed item (derived from multiple tables)
export interface ActivityItem {
  id: string
  type: 'checkin' | 'med_taken' | 'med_skipped' | 'appointment' | 'alert' | 'sos'
  timestamp: string
  description: string
  meta?: Record<string, unknown>
}
