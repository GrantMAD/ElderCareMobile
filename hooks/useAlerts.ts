import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Alert } from '../types/app'

export function useAlerts(familyId: string | null) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    if (!familyId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAlerts(data as Alert[])
    }

    setLoading(false)
  }, [familyId])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const activeAlerts = useMemo(() => alerts.filter((alert) => !alert.resolved_at), [alerts])

  const acknowledgeAlert = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    const updates: Partial<Alert> = {
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user?.id,
    }

    const { error } = await supabase.from('emergency_alerts').update({
      acknowledged_at: updates.acknowledged_at,
      acknowledged_by: updates.acknowledged_by,
    }).eq('id', id)

    if (!error) {
      await fetchAlerts()
    }
  }

  const resolveAlert = async (id: string) => {
    const { error } = await supabase
      .from('emergency_alerts')
      .update({ resolved_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      await fetchAlerts()
    }
  }

  return { alerts, activeAlerts, loading, acknowledgeAlert, resolveAlert, refresh: fetchAlerts }
}
