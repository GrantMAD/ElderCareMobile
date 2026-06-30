import React from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { MedCard } from '../../components/elder/MedCard'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { useMedications } from '../../hooks/useMedications'
import { useMedicationLogs } from '../../hooks/useMedicationLogs'

export default function MedicationsScreen() {
  const { elderId } = useSession()
  const { medications, refresh: refreshMeds, loading: loadingMeds } = useMedications(elderId)
  const { logs, logDose, refresh: refreshLogs, loading: loadingLogs } = useMedicationLogs(elderId)

  const refreshing = loadingMeds || loadingLogs
  const onRefresh = React.useCallback(() => {
    refreshMeds()
    refreshLogs()
  }, [refreshMeds, refreshLogs])

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Today's Schedule</Text>
      
      {medications.length === 0 ? (
        <Text style={styles.empty}>No medications scheduled for today.</Text>
      ) : (
        medications.map(med => {
          const schedule = med.schedules?.[0]
          if (!schedule) return null
          
          return schedule.times_of_day.map(time => {
            const timeLog = logs.find(l => l.schedule_id === schedule.id && l.scheduled_time === time)
            
            return (
              <MedCard
                key={`${med.id}-${time}`}
                medication={med}
                schedule={schedule}
                scheduledTime={time}
                log={timeLog}
                onAction={(action) => logDose(schedule.id, action, time)}
              />
            )
          })
        })
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
  empty: {
    fontSize: 20,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 48,
  }
})
