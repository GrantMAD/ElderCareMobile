import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

interface LoadingSpinnerProps {
  fullscreen?: boolean
  size?: 'small' | 'large'
  color?: string
}

export function LoadingSpinner({
  fullscreen = false,
  size = 'large',
  color = Colors.primary,
}: LoadingSpinnerProps) {
  return (
    <View style={fullscreen ? styles.fullscreen : styles.inline}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
})
