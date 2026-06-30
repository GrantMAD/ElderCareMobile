import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { WellnessCheckin, CheckInData } from '../types/app'

export function useCheckins(elderId: string | null) {
  const [checkins, setCheckins] = useState<WellnessCheckin[]>([])
  const [todaysCheckin, setTodaysCheckin] = useState<WellnessCheckin | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCheckins = useCallback(async () => {
    if (!elderId) return
    setLoading(true)
    
    const { data, error } = await supabase
      .from('wellness_checkins')
      .select('*')
      .eq('elder_id', elderId)
      .order('scheduled_time', { ascending: false })
      
    if (!error && data) {
      const allCheckins = data as WellnessCheckin[]
      setCheckins(allCheckins)
      
      // Find today's completed checkin
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      
      const todayCompleted = allCheckins.find(c => {
        if (!c.completed_at) return false
        const completedTime = new Date(c.completed_at).getTime()
        return completedTime >= startOfDay
      })
      
      setTodaysCheckin(todayCompleted || null)
    }
    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  const submitCheckin = async (data: CheckInData) => {
    if (!elderId) return
    
    const { error } = await supabase.from('wellness_checkins').insert({
      elder_id: elderId,
      mood_score: data.mood_score,
      pain_score: data.pain_score,
      energy_score: data.energy_score,
      notes: data.notes,
      status: 'completed',
      completed_at: new Date().toISOString(),
      scheduled_time: new Date().toISOString(), // For manual checkins
    })
    
    if (!error) {
      await fetchCheckins()
    }
  }

  return { checkins, todaysCheckin, loading, submitCheckin, refresh: fetchCheckins }
}
