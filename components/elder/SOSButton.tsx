import React, { useState } from 'react'
import { Modal, Pressable, TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Colors } from '../../constants/colors'
import { supabase } from '../../lib/supabase'

interface SOSButtonProps {
  elderId: string | null
  familyId: string | null
  disabled?: boolean
}

export function SOSButton({ elderId, familyId, disabled = false }: SOSButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const resolveContext = async () => {
    let resolvedElderId = elderId
    let resolvedFamilyId = familyId

    if (!resolvedElderId || !resolvedFamilyId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user?.id) {
        throw new Error('Unable to identify the signed-in elder account.')
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError || !profileData) {
        throw new Error('Unable to load your profile information.')
      }

      resolvedElderId = profileData.role === 'elder' ? user.id : resolvedElderId

      if (!resolvedFamilyId) {
        const { data: memberData, error: memberError } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (memberError) {
          throw new Error('Unable to resolve your family connection.')
        }

        resolvedFamilyId = memberData?.family_id ?? null
      }
    }

    if (!resolvedElderId || !resolvedFamilyId) {
      throw new Error('This account is not linked to a family yet. Add a family connection before sending an SOS.')
    }

    return { elderId: resolvedElderId, familyId: resolvedFamilyId }
  }

  const triggerSOS = async () => {
    console.log('SOS button pressed')
    setLoading(true)

    try {
      console.log('Resolving SOS context')
      const context = await resolveContext()
      console.log('SOS context resolved', context)
      console.log('Attempting emergency alert insert')
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert({
          elder_id: context.elderId,
          family_id: context.familyId,
          trigger_type: 'sos_button',
          severity: 'critical',
          message: 'SOS Button pressed by elder',
        })
        .select()

      console.log('Insert response', { data, error })

      if (error) {
        console.error('SOS insert failed', error)
        const detail = error.message || 'The database rejected the SOS request.'
        Alert.alert('SOS failed', `The alert could not be sent. ${detail}`)
      } else {
        console.log('SOS insert succeeded', data)
        Alert.alert('SOS Sent', 'Your family has been notified and is on the way.')
      }
    } catch (error) {
      console.error('SOS resolution failed', error)
      const detail = error instanceof Error ? error.message : 'Unknown error'
      Alert.alert('SOS unavailable', detail)
    } finally {
      setLoading(false)
    }
  }

  const handlePress = () => {
    console.log('Showing SOS confirmation dialog')
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    setShowConfirm(true)
  }

  const confirmSOS = () => {
    setShowConfirm(false)
    console.log('Confirmed SOS action')
    void triggerSOS()
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.button}
        onPress={handlePress}
        disabled={loading || disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.text}>{loading ? 'SENDING...' : 'SOS'}</Text>
      </TouchableOpacity>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send SOS?</Text>
            <Text style={styles.modalText}>This will alert your family immediately.</Text>
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={confirmSOS}>
                <Text style={styles.confirmButtonText}>Send SOS</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  modalText: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: Colors.danger,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
})
