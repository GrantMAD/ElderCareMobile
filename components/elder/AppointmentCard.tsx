import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card } from '../shared/Card'
import { Colors } from '../../constants/colors'
import type { Appointment } from '../../types/app'

interface AppointmentCardProps {
  appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const dateObj = new Date(appointment.appointment_date || '')
  const isValidDate = !isNaN(dateObj.getTime())
  
  return (
    <Card style={styles.card}>
      {isValidDate && (
        <View style={styles.header}>
          <Text style={styles.date}>
            {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.time}>
            {dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </Text>
        </View>
      )}
      
      <Text style={styles.doctor}>
        {appointment.doctor_name ? `Dr. ${appointment.doctor_name}` : 'Doctor Appointment'}
      </Text>
      
      {appointment.specialty ? (
        <Text style={styles.specialty}>{appointment.specialty}</Text>
      ) : null}
      
      {appointment.location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location:</Text>
          <Text style={styles.location}>{appointment.location}</Text>
        </View>
      ) : null}
      
      {appointment.notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notes}>{appointment.notes}</Text>
        </View>
      ) : null}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  doctor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 20,
    color: Colors.textLight,
    marginBottom: 16,
  },
  locationContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  location: {
    fontSize: 20,
    color: Colors.text,
  },
  notesContainer: {
    marginTop: 8,
  },
  notes: {
    fontSize: 18,
    color: Colors.textLight,
    fontStyle: 'italic',
  }
})
