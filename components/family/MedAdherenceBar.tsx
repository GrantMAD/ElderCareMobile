import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'

interface MedAdherenceBarProps {
  taken: number
  total: number
}

export function MedAdherenceBar({ taken, total }: MedAdherenceBarProps) {
  const ratio = total > 0 ? taken / total : 0
  const pct = Math.round(ratio * 100)
  const color = pct >= 80 ? Colors.success : pct >= 50 ? Colors.warning : Colors.danger

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Medication adherence</Text>
        <Text style={[styles.value, { color }]}>{taken}/{total}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.caption}>{pct}% completed today</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  caption: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
})
