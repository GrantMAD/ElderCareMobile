import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Medication, MedicationFormData } from '../types/app'

export function useMedications(elderId: string | null) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMedications = useCallback(async () => {
    if (!elderId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('medications')
      .select('*, medication_schedules(*)')
      .eq('elder_id', elderId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMedications(data.map((m: any) => ({
        ...m,
        schedules: m.medication_schedules
      })) as Medication[])
    }
    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchMedications()
  }, [fetchMedications])

  const addMedication = async (medData: MedicationFormData) => {
    if (!elderId) return null
    const { data: med, error: medError } = await supabase
      .from('medications')
      .insert({
        elder_id: elderId,
        name: medData.name,
        dosage: medData.dosage,
        instructions: medData.instructions,
        prescribed_by: medData.prescribed_by,
        is_critical: medData.is_critical,
      })
      .select()
      .single()

    if (medError || !med) return null

    await supabase.from('medication_schedules').insert({
      medication_id: (med as any).id,
      frequency: medData.frequency,
      times_of_day: medData.times_of_day,
      days_of_week: medData.days_of_week,
      start_date: medData.start_date,
      end_date: medData.end_date,
      is_active: true,
    })

    await fetchMedications()
    return med
  }

  const updateMedication = async (medId: string, updates: Partial<MedicationFormData>) => {
    const { error } = await supabase
      .from('medications')
      .update({
        name: updates.name,
        dosage: updates.dosage,
        instructions: updates.instructions,
        prescribed_by: updates.prescribed_by,
        is_critical: updates.is_critical,
      })
      .eq('id', medId)
      
    if (!error) {
       await fetchMedications()
    }
  }

  const deleteMedication = async (medId: string) => {
    const { error } = await supabase.from('medications').delete().eq('id', medId)
    if (!error) {
       setMedications(prev => prev.filter(m => m.id !== medId))
    }
  }

  return { medications, loading, addMedication, updateMedication, deleteMedication, refresh: fetchMedications }
}
