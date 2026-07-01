import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ActivityItem } from '../types/app'

export function useActivityFeed(elderId: string | null) {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    if (!elderId) {
      setLoading(false)
      return
    }

    const safeElderId = elderId

    async function fetchFeed() {
      setLoading(true)
      const [checkinsRes, medsRes, appointmentsRes, alertsRes] = await Promise.all([
        supabase
          .from('wellness_checkins')
          .select('id, scheduled_time, completed_at, status, mood_score, pain_score, energy_score')
          .eq('elder_id', safeElderId)
          .order('scheduled_time', { ascending: false })
          .limit(8),
        supabase
          .from('medication_logs')
          .select('id, logged_at, action')
          .eq('elder_id', safeElderId)
          .order('logged_at', { ascending: false })
          .limit(8),
        supabase
          .from('appointments')
          .select('id, appointment_date, doctor_name, status')
          .eq('elder_id', safeElderId)
          .order('appointment_date', { ascending: false })
          .limit(8),
        supabase
          .from('emergency_alerts')
          .select('id, created_at, severity, trigger_type, resolved_at')
          .eq('elder_id', safeElderId)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      const feed: ActivityItem[] = []

      ;(checkinsRes.data as any[] | null)?.forEach((item) => {
        feed.push({
          id: `checkin-${item.id}`,
          type: 'checkin',
          timestamp: item.completed_at ?? item.scheduled_time ?? new Date().toISOString(),
          description: item.status === 'completed' ? 'Wellness check-in completed' : 'Wellness check-in pending',
          meta: { mood: item.mood_score, pain: item.pain_score, energy: item.energy_score },
        })
      })

      ;(medsRes.data as any[] | null)?.forEach((item) => {
        feed.push({
          id: `med-${item.id}`,
          type: item.action === 'taken' ? 'med_taken' : 'med_skipped',
          timestamp: item.logged_at,
          description: item.action === 'taken' ? 'Medication marked as taken' : 'Medication marked as skipped',
        })
      })

      ;(appointmentsRes.data as any[] | null)?.forEach((item) => {
        feed.push({
          id: `appointment-${item.id}`,
          type: 'appointment',
          timestamp: item.appointment_date ?? new Date().toISOString(),
          description: `Appointment ${item.status === 'upcoming' ? 'scheduled' : 'updated'} with ${item.doctor_name ?? 'care team'}`,
        })
      })

      ;(alertsRes.data as any[] | null)?.forEach((item) => {
        feed.push({
          id: `alert-${item.id}`,
          type: item.severity === 'critical' ? 'sos' : 'alert',
          timestamp: item.created_at,
          description: item.trigger_type === 'sos_button' ? 'SOS alert triggered' : 'New alert logged',
          meta: { severity: item.severity },
        })
      })

      feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setItems(feed)
      setVisibleCount(8)
      setLoading(false)
    }

    fetchFeed()
  }, [elderId])

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])

  return {
    items: visibleItems,
    allItems: items,
    loading,
    hasMore: visibleCount < items.length,
    loadMore: () => setVisibleCount((count) => count + 5),
    refresh: () => setVisibleCount(8),
  }
}
