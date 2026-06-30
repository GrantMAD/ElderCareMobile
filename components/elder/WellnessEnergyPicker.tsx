import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
import * as Haptics from 'expo-haptics'

interface WellnessEnergyPickerProps {
  value: number
  onSelect: (energy: number) => void
}

const LEVELS = [
  { value: 3, label: 'High Energy', desc: 'Feeling active and strong' },
  { value: 2, label: 'Normal', desc: 'Feeling okay' },
  { value: 1, label: 'Low Energy', desc: 'Feeling tired or weak' },
]

export function WellnessEnergyPicker({ value, onSelect }: WellnessEnergyPickerProps) {
  const handleSelect = (val: number) => {
    Haptics.selectionAsync()
    onSelect(val)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How is your energy level?</Text>
      
      <View style={styles.list}>
        {LEVELS.map(l => (
          <TouchableOpacity
            key={l.value}
            style={[styles.button, value === l.value && styles.buttonSelected]}
            onPress={() => handleSelect(l.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, value === l.value && styles.labelSelected]}>{l.label}</Text>
            <Text style={[styles.desc, value === l.value && styles.descSelected]}>{l.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: Colors.text,
  },
  list: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  buttonSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  labelSelected: {
    color: Colors.primary,
  },
  desc: {
    fontSize: 18,
    color: Colors.textLight,
  },
  descSelected: {
    color: Colors.primary,
  }
})
