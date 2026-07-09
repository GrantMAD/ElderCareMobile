import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Alert } from '../types/app'

export function useRealtimeAlerts(
  familyId: string | null,
  onAlert: (alert: Alert) => void
) {
  useEffect(() => {
    if (!familyId) return

    // Append random ID to prevent React Strict Mode unmount/remount races where
    // Supabase returns an old channel that is already subscribed.
    const channel = supabase.channel(`family-alerts-${familyId}-${Math.random().toString(36).substring(7)}`)

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'emergency_alerts',
        filter: `family_id=eq.${familyId}`,
      },
      (payload) => {
        onAlert(payload.new as Alert)
      }
    )

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'emergency_alerts',
        filter: `family_id=eq.${familyId}`,
      },
      () => {
        // Intentionally left blank; parent hooks can refresh their own state.
      }
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [familyId, onAlert])
}
