import React from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { AppointmentCard } from '../../components/elder/AppointmentCard'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { useAppointments } from '../../hooks/useAppointments'

export default function AppointmentsScreen() {
  const { elderId } = useSession()
  const { upcomingAppointments, refresh, loading } = useAppointments(elderId)

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <Text style={styles.title}>Upcoming Visits</Text>
      
      {upcomingAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.empty}>No upcoming appointments!</Text>
        </View>
      ) : (
        upcomingAppointments.map(appt => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  empty: {
    fontSize: 24,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  }
})
