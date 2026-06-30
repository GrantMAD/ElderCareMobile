import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '../../constants/colors'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, style, padding = 'md' }: CardProps) {
  return (
    <View style={[styles.card, styles[`padding_${padding}`], style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  padding_none: { padding: 0 },
  padding_sm: { padding: 12 },
  padding_md: { padding: 16 },
  padding_lg: { padding: 24 },
})
