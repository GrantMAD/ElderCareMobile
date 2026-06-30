import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Appointment, AppointmentFormData, AppointmentStatus } from '../types/app'

export function useAppointments(elderId: string | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    if (!elderId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('elder_id', elderId)
      .order('appointment_date', { ascending: true })

    if (!error && data) {
      setAppointments(data as Appointment[])
    }
    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const addAppointment = async (formData: AppointmentFormData) => {
    if (!elderId) return null
    const { data, error } = await supabase.from('appointments').insert({
      elder_id: elderId,
      doctor_name: formData.doctor_name,
      specialty: formData.specialty,
      location: formData.location,
      appointment_date: formData.appointment_date,
      notes: formData.notes,
      reminder_sent: false,
      status: 'upcoming' as AppointmentStatus
    }).select().single()

    if (!error) {
      await fetchAppointments()
      return data
    }
    return null
  }

  const updateAppointment = async (id: string, formData: Partial<AppointmentFormData>, status?: AppointmentStatus) => {
    const updates: any = { ...formData }
    if (status) updates.status = status
    
    const { error } = await supabase.from('appointments').update(updates).eq('id', id)
    if (!error) {
      await fetchAppointments()
    }
  }

  const cancelAppointment = async (id: string) => {
    await updateAppointment(id, {}, 'cancelled')
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming')
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')

  return { appointments, upcomingAppointments, pastAppointments, loading, addAppointment, updateAppointment, cancelAppointment, refresh: fetchAppointments }
}
