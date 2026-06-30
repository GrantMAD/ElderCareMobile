import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../shared/Button'
import { Colors } from '../../constants/colors'
import * as Haptics from 'expo-haptics'

interface WellnessPainSliderProps {
  value: number
  onChange: (val: number) => void
  onNext: () => void
}

export function WellnessPainSlider({ value, onChange, onNext }: WellnessPainSliderProps) {
  const increase = () => {
    if (value < 10) {
      Haptics.selectionAsync()
      onChange(value + 1)
    }
  }
  
  const decrease = () => {
    if (value > 0) {
      Haptics.selectionAsync()
      onChange(value - 1)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you experiencing any pain?</Text>
      <Text style={styles.subtitle}>0 is no pain, 10 is the worst pain</Text>
      
      <View style={styles.stepper}>
        <Button 
          label="-" 
          onPress={decrease} 
          variant="secondary" 
          size="elder" 
          style={styles.stepBtn}
          disabled={value === 0}
        />
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
        <Button 
          label="+" 
          onPress={increase} 
          variant="secondary" 
          size="elder" 
          style={styles.stepBtn}
          disabled={value === 10}
        />
      </View>

      <Button label="NEXT" onPress={onNext} size="elder" style={styles.nextBtn} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 48,
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 64,
  },
  stepBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 80,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  nextBtn: {
    width: '100%',
    marginTop: 'auto',
  }
})
