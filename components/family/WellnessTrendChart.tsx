import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import type { WellnessCheckin } from '../../types/app'

interface WellnessTrendChartProps {
  checkins: WellnessCheckin[]
}

export function WellnessTrendChart({ checkins }: WellnessTrendChartProps) {
  const recent = checkins.slice(0, 8).reverse()

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent wellness trend</Text>
      {recent.length === 0 ? (
        <Text style={styles.empty}>No check-in history yet.</Text>
      ) : (
        recent.map((item, index) => (
          <View key={item.id ?? index} style={styles.row}>
            <Text style={styles.label}>Day {index + 1}</Text>
            <Text style={styles.value}>Mood {item.mood_score ?? '—'} • Pain {item.pain_score ?? '—'} • Energy {item.energy_score ?? '—'}</Text>
          </View>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.text,
  },
  row: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  value: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  empty: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
})
