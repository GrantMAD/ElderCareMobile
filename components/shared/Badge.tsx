import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '../../constants/colors'

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  status: BadgeStatus
  style?: ViewStyle
}

export function Badge({ label, status, style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[`bg_${status}`], style]}>
      <Text style={[styles.text, styles[`text_${status}`]]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Backgrounds
  bg_success: { backgroundColor: '#dcfce7' },
  bg_warning: { backgroundColor: '#fef3c7' },
  bg_danger:  { backgroundColor: '#fee2e2' },
  bg_info:    { backgroundColor: '#dbeafe' },
  bg_neutral: { backgroundColor: '#f3f4f6' },
  // Text colours
  text_success: { color: '#15803d' },
  text_warning: { color: '#92400e' },
  text_danger:  { color: '#991b1b' },
  text_info:    { color: '#1e40af' },
  text_neutral: { color: Colors.textSecondary },
})
