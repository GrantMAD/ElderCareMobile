import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
import * as Haptics from 'expo-haptics'

interface WellnessMoodPickerProps {
  value: number
  onSelect: (mood: number) => void
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Awful' },
  { value: 2, emoji: '🙁', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😁', label: 'Great' },
]

export function WellnessMoodPicker({ value, onSelect }: WellnessMoodPickerProps) {
  const handleSelect = (val: number) => {
    Haptics.selectionAsync()
    onSelect(val)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.grid}>
        {MOODS.map(m => (
          <TouchableOpacity
            key={m.value}
            style={[styles.button, value === m.value && styles.buttonSelected]}
            onPress={() => handleSelect(m.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={[styles.label, value === m.value && styles.labelSelected]}>{m.label}</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 8,
  },
  buttonSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginTop: 4,
  },
  labelSelected: {
    color: Colors.primary,
  }
})
