import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { CheckInFlow } from '../../components/elder/CheckInFlow'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { useCheckins } from '../../hooks/useCheckins'
import { Button } from '../../components/shared/Button'

export default function CheckinScreen() {
  const router = useRouter()
  const { elderId } = useSession()
  const { todaysCheckin, submitCheckin } = useCheckins(elderId)

  if (todaysCheckin) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>All Done!</Text>
        <Text style={styles.subtitle}>You've already completed your check-in for today. Great job!</Text>
        <Button 
          label="GO HOME" 
          size="elder" 
          onPress={() => router.push('/(elder)')} 
          style={styles.homeBtn}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CheckInFlow 
        onSubmit={async (data) => {
          await submitCheckin(data)
          router.push('/(elder)')
        }}
        onCancel={() => router.back()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 48,
  },
  homeBtn: {
    width: '100%',
  }
})
