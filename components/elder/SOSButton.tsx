import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Colors } from '../../constants/colors'
import { supabase } from '../../lib/supabase'

interface SOSButtonProps {
  elderId: string | null
  familyId: string | null
}

export function SOSButton({ elderId, familyId }: SOSButtonProps) {
  const [loading, setLoading] = useState(false)

  const triggerSOS = async () => {
    if (!elderId || !familyId) return

    setLoading(true)
    const { error } = await supabase.from('emergency_alerts').insert({
      elder_id: elderId,
      family_id: familyId,
      trigger_type: 'sos_button',
      severity: 'critical',
      message: 'SOS Button pressed by elder',
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', 'Failed to send SOS. Please try again or call emergency services.')
    } else {
      Alert.alert('SOS Sent', 'Your family has been notified and is on the way.')
    }
  }

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    Alert.alert(
      'Send SOS?',
      'Are you sure you need help? This will alert your family immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'SEND SOS', 
          style: 'destructive',
          onPress: triggerSOS 
        }
      ]
    )
  }

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{loading ? 'SENDING...' : 'SOS'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.danger,
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
    marginVertical: 24,
  },
  text: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  }
})
