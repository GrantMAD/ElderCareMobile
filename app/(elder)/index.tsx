import React from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/colors'
import { SOSButton } from '../../components/elder/SOSButton'
import { Button } from '../../components/shared/Button'
import { useSession } from '../../hooks/useSession'
import { useMedications } from '../../hooks/useMedications'
import { useCheckins } from '../../hooks/useCheckins'
import { useAppointments } from '../../hooks/useAppointments'

export default function ElderDashboard() {
  const router = useRouter()
  const { elderId, familyId, loading: sessionLoading } = useSession()
  
  const { medications, refresh: refreshMeds, loading: loadingMeds } = useMedications(elderId)
  const { todaysCheckin, refresh: refreshCheckin, loading: loadingCheckin } = useCheckins(elderId)
  const { upcomingAppointments, refresh: refreshAppts, loading: loadingAppts } = useAppointments(elderId)

  const refreshing = loadingMeds || loadingCheckin || loadingAppts

  const onRefresh = React.useCallback(() => {
    refreshMeds()
    refreshCheckin()
    refreshAppts()
  }, [refreshMeds, refreshCheckin, refreshAppts])

  const nextAppt = upcomingAppointments[0]

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>Welcome Back</Text>
      
      <SOSButton elderId={elderId} familyId={familyId} disabled={sessionLoading} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Check-In</Text>
        {todaysCheckin ? (
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>✓ Completed for today</Text>
          </View>
        ) : (
          <Button 
            label="START CHECK-IN" 
            size="elder" 
            onPress={() => router.push('/(elder)/checkin')} 
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medications</Text>
        <Button 
          label={`VIEW MEDS (${medications.length})`} 
          variant="secondary" 
          size="elder" 
          onPress={() => router.push('/(elder)/medications')} 
        />
      </View>

      {nextAppt && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <View style={styles.apptCard}>
            <Text style={styles.apptDate}>
              {new Date(nextAppt.appointment_date!).toLocaleDateString()}
            </Text>
            <Text style={styles.apptDoc}>Dr. {nextAppt.doctor_name}</Text>
          </View>
          <Button 
            label="VIEW ALL" 
            variant="ghost" 
            size="lg" 
            onPress={() => router.push('/(elder)/appointments')} 
          />
        </View>
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
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    color: Colors.text,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  statusCard: {
    backgroundColor: '#f0fdf4',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.success,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
  },
  apptCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  apptDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  apptDoc: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  }
})
