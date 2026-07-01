import React, { useEffect } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import * as Speech from 'expo-speech'
import { Colors } from '../../constants/colors'
import { Button } from '../shared/Button'
import type { Alert as AppAlert } from '../../types/app'

interface AlertBannerProps {
  alert: AppAlert | null
  visible: boolean
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
  onClose: () => void
}

export function AlertBanner({ alert, visible, onAcknowledge, onResolve, onClose }: AlertBannerProps) {
  useEffect(() => {
    if (!visible || !alert) return

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    Speech.speak(alert.message ?? 'Emergency alert received', { rate: 1.0 })
  }, [alert, visible])

  if (!alert) return null

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Critical alert</Text>
          <Text style={styles.title}>{alert.severity.toUpperCase()} ALERT</Text>
          <Text style={styles.message}>{alert.message ?? 'Your elder needs immediate attention.'}</Text>

          <View style={styles.actions}>
            <Button
              label="Acknowledge"
              variant="danger"
              size="md"
              onPress={() => {
                onAcknowledge(alert.id)
                onClose()
              }}
            />
            <Button
              label="Resolve"
              variant="secondary"
              size="md"
              onPress={() => {
                onResolve(alert.id)
                onClose()
              }}
            />
          </View>

          <Pressable onPress={onClose} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  eyebrow: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: Colors.danger,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  dismissButton: {
    marginTop: 16,
  },
  dismissText: {
    color: Colors.primary,
    fontWeight: '700',
  },
})
