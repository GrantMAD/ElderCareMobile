import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MedicationLog, MedAction } from '../types/app'

export function useMedicationLogs(elderId: string | null) {
  const [logs, setLogs] = useState<MedicationLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    if (!elderId) return
    setLoading(true)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('elder_id', elderId)
      .gte('logged_at', startOfDay)
      .lt('logged_at', endOfDay)
      .order('logged_at', { ascending: false })

    if (!error && data) {
      setLogs(data as MedicationLog[])
    }
    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const logDose = async (scheduleId: string | null, action: MedAction, scheduledTime?: string, note?: string) => {
    if (!elderId) return
    const { error } = await supabase.from('medication_logs').insert({
      elder_id: elderId,
      schedule_id: scheduleId,
      scheduled_time: scheduledTime,
      action,
      note,
      logged_at: new Date().toISOString()
    })
    if (!error) {
      await fetchLogs()
    }
  }

  const takenCount = logs.filter(l => l.action === 'taken').length
  const todayAdherence = { taken: takenCount, total: logs.length }

  return { logs, loading, logDose, todayAdherence, refresh: fetchLogs }
}
