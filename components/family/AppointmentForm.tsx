import React, { useMemo, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { Button } from '../shared/Button'
import type { Appointment, AppointmentFormData } from '../../types/app'

const isWeb = Platform.OS === 'web'
const DateTimePicker = !isWeb ? require('@react-native-community/datetimepicker').default : null

interface AppointmentFormProps {
  visible: boolean
  appointment?: Appointment | null
  onClose: () => void
  onSubmit: (data: AppointmentFormData) => Promise<void>
}

export function AppointmentForm({ visible, appointment, onClose, onSubmit }: AppointmentFormProps) {
  const [doctorName, setDoctorName] = useState(appointment?.doctor_name ?? '')
  const [specialty, setSpecialty] = useState(appointment?.specialty ?? '')
  const [location, setLocation] = useState(appointment?.location ?? '')
  const [notes, setNotes] = useState(appointment?.notes ?? '')
  const [appointmentDate, setAppointmentDate] = useState(
    appointment?.appointment_date ? new Date(appointment.appointment_date) : new Date()
  )
  const [showPicker, setShowPicker] = useState(false)

  const isEditing = useMemo(() => !!appointment, [appointment])

  function formatDateTimeInput(date: Date) {
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  function handleWebDateChange(event: { target: { value: string } }) {
    const nextDate = new Date(event.target.value)
    if (!Number.isNaN(nextDate.getTime())) {
      setAppointmentDate(nextDate)
    }
  }

  async function handleSubmit() {
    await onSubmit({
      doctor_name: doctorName,
      specialty,
      location,
      appointment_date: appointmentDate.toISOString(),
      notes,
    })
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{isEditing ? 'Edit appointment' : 'Add appointment'}</Text>

          <TextInput
            style={styles.input}
            value={doctorName}
            onChangeText={setDoctorName}
            placeholder="Doctor name"
          />
          <TextInput
            style={styles.input}
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="Specialty"
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
          />
          <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
            <Text>{appointmentDate.toLocaleString()}</Text>
          </Pressable>
          {showPicker && !isWeb && DateTimePicker ? (
            <DateTimePicker
              value={appointmentDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_: unknown, date?: Date) => {
                setShowPicker(false)
                if (date) setAppointmentDate(date)
              }}
            />
          ) : showPicker && isWeb ? (
            <View style={styles.webPickerBlock}>
              <Text style={styles.webPickerLabel}>Choose date and time</Text>
              <input
                type="datetime-local"
                value={formatDateTimeInput(appointmentDate)}
                onChange={handleWebDateChange}
                style={styles.webPickerInput}
              />
            </View>
          ) : null}
          <TextInput
            style={[styles.input, styles.notes]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            multiline
          />

          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" size="md" onPress={onClose} />
            <Button label={isEditing ? 'Save' : 'Add'} variant="primary" size="md" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
  },
  card: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.text,
  },
  notes: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  webPickerBlock: {
    gap: 6,
  },
  webPickerLabel: {
    fontSize: 14,
    color: Colors.textSecondary ?? Colors.text,
  },
  webPickerInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
})
