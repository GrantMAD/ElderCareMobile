import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { FamilyDashboardData, WellnessCheckin, Appointment } from '../types/app'

/**
 * useFamilyDashboard — aggregates the key overview data shown on the family
 * dashboard home screen. All fetches run in parallel for performance.
 */
export function useFamilyDashboard(
  elderId: string | null,
  familyId: string | null
): FamilyDashboardData {
  const [elderName, setElderName] = useState<string | null>(null)
  const [lastCheckin, setLastCheckin] = useState<WellnessCheckin | null>(null)
  const [todayMeds, setTodayMeds] = useState({ taken: 0, total: 0 })
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [activeAlertCount, setActiveAlertCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!elderId || !familyId) {
      setLoading(false)
      return
    }

    async function fetchAll() {
      setLoading(true)

      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

      const [
        profileRes,
        checkinRes,
        medsLogRes,
        appointmentRes,
        alertsRes,
      ] = await Promise.all([
        // Elder's display name
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', elderId!)
          .single(),

        // Most recent check-in
        supabase
          .from('wellness_checkins')
          .select('*')
          .eq('elder_id', elderId!)
          .order('scheduled_time', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // Today's medication logs
        supabase
          .from('medication_logs')
          .select('action')
          .eq('elder_id', elderId!)
          .gte('logged_at', startOfDay)
          .lt('logged_at', endOfDay),

        // Next upcoming appointment
        supabase
          .from('appointments')
          .select('*')
          .eq('elder_id', elderId!)
          .eq('status', 'upcoming')
          .gte('appointment_date', new Date().toISOString())
          .order('appointment_date', { ascending: true })
          .limit(1)
          .maybeSingle(),

        // Unresolved (active) alerts
        supabase
          .from('emergency_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('family_id', familyId!)
          .is('resolved_at', null),
      ])

      setElderName((profileRes.data as any)?.full_name ?? null)
      setLastCheckin((checkinRes.data as any) ?? null)

      if (medsLogRes.data) {
        const taken = (medsLogRes.data as any[]).filter((l) => l.action === 'taken').length
        setTodayMeds({ taken, total: (medsLogRes.data as any[]).length })
      }

      setNextAppointment((appointmentRes.data as any) ?? null)
      setActiveAlertCount(alertsRes.count ?? 0)
      setLoading(false)
    }

    fetchAll()
  }, [elderId, familyId])

  return { elderName, lastCheckin, todayMeds, nextAppointment, activeAlertCount, loading }
}
