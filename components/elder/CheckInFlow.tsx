import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { WellnessMoodPicker } from './WellnessMoodPicker'
import { WellnessPainSlider } from './WellnessPainSlider'
import { WellnessEnergyPicker } from './WellnessEnergyPicker'
import { Button } from '../shared/Button'
import { Colors } from '../../constants/colors'
import type { CheckInData } from '../../types/app'

interface CheckInFlowProps {
  onSubmit: (data: CheckInData) => Promise<void>
  onCancel: () => void
}

export function CheckInFlow({ onSubmit, onCancel }: CheckInFlowProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CheckInData>({
    mood_score: 3,
    pain_score: 0,
    energy_score: 2,
    notes: ''
  })

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => {
    if (step === 1) onCancel()
    else setStep(s => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit(data)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Button label="BACK" variant="ghost" size="elder" onPress={handleBack} disabled={loading} style={styles.backBtn} />
        <Text style={styles.progress}>Step {step} of 4</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <WellnessMoodPicker 
            value={data.mood_score} 
            onSelect={(val) => {
              setData(d => ({ ...d, mood_score: val }))
              setTimeout(handleNext, 300)
            }} 
          />
        )}
        
        {step === 2 && (
          <WellnessPainSlider 
            value={data.pain_score}
            onChange={(val) => setData(d => ({ ...d, pain_score: val }))}
            onNext={handleNext}
          />
        )}
        
        {step === 3 && (
          <WellnessEnergyPicker 
            value={data.energy_score}
            onSelect={(val) => {
              setData(d => ({ ...d, energy_score: val }))
              setTimeout(handleNext, 300)
            }}
          />
        )}
        
        {step === 4 && (
          <View style={styles.finalStep}>
            <Text style={styles.title}>Anything else to share?</Text>
            <Text style={styles.subtitle}>Optional notes for your family</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="E.g., I have a slight headache..."
              value={data.notes}
              onChangeText={(text) => setData(d => ({ ...d, notes: text }))}
            />
            <Button 
              label="FINISH & SUBMIT" 
              size="elder" 
              onPress={handleSubmit} 
              loading={loading}
              style={styles.submitBtn}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: {
    width: 100,
  },
  progress: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  content: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  finalStep: {
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
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 32,
  },
  submitBtn: {
    width: '100%',
    marginTop: 'auto',
  }
})
