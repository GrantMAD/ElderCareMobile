import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { AppointmentForm } from '../../components/family/AppointmentForm'
import { Button } from '../../components/shared/Button'
import { Card } from '../../components/shared/Card'
import { useAppointments } from '../../hooks/useAppointments'
import { useSession } from '../../hooks/useSession'
import type { Appointment, AppointmentFormData } from '../../types/app'

export default function FamilyAppointmentsScreen() {
  const { elderId } = useSession()
  const { upcomingAppointments, pastAppointments, addAppointment, updateAppointment, loading } = useAppointments(elderId)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  async function handleSubmit(data: AppointmentFormData) {
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, data)
    } else {
      await addAppointment(data)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Appointments</Text>
          <Button label="Add" variant="primary" size="sm" onPress={() => setShowForm(true)} />
        </View>

        {loading ? <Text style={styles.empty}>Loading appointments…</Text> : null}

        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingAppointments.length === 0 ? <Text style={styles.empty}>No upcoming visits.</Text> : upcomingAppointments.map((appointment) => (
          <Card key={appointment.id} style={styles.itemCard} padding="md">
            <Text style={styles.doctor}>{appointment.doctor_name ?? 'Care visit'}</Text>
            <Text style={styles.meta}>{appointment.specialty ?? 'General care'}</Text>
            <Text style={styles.meta}>{new Date(appointment.appointment_date ?? '').toLocaleString()}</Text>
            <Button label="Edit" variant="secondary" size="sm" onPress={() => { setEditingAppointment(appointment); setShowForm(true) }} />
          </Card>
        ))}

        <Text style={styles.sectionTitle}>History</Text>
        {pastAppointments.length === 0 ? <Text style={styles.empty}>No past visits.</Text> : pastAppointments.map((appointment) => (
          <Card key={appointment.id} style={styles.itemCard} padding="md">
            <Text style={styles.doctor}>{appointment.doctor_name ?? 'Care visit'}</Text>
            <Text style={styles.meta}>{appointment.specialty ?? 'General care'}</Text>
            <Text style={styles.meta}>{new Date(appointment.appointment_date ?? '').toLocaleString()}</Text>
          </Card>
        ))}
      </ScrollView>

      <AppointmentForm
        visible={showForm}
        appointment={editingAppointment}
        onClose={() => {
          setShowForm(false)
          setEditingAppointment(null)
        }}
        onSubmit={handleSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginTop: 6 },
  itemCard: { gap: 6 },
  doctor: { fontSize: 16, fontWeight: '700', color: Colors.text },
  meta: { color: Colors.textSecondary },
  empty: { color: Colors.textSecondary, paddingVertical: 8 },
})
