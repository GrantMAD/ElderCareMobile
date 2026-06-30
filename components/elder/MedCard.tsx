import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card } from '../shared/Card'
import { Button } from '../shared/Button'
import { Colors } from '../../constants/colors'
import type { Medication, MedicationSchedule, MedicationLog, MedAction } from '../../types/app'

interface MedCardProps {
  medication: Medication
  schedule: MedicationSchedule
  scheduledTime: string
  log?: MedicationLog | null
  onAction: (action: MedAction) => void
}

export function MedCard({ medication, schedule, scheduledTime, log, onAction }: MedCardProps) {
  const isTaken = log?.action === 'taken'
  const isSkipped = log?.action === 'skipped'

  return (
    <Card style={[styles.card, isTaken && styles.cardTaken, isSkipped && styles.cardSkipped] as any}>
      <View style={styles.header}>
        <Text style={styles.time}>{scheduledTime}</Text>
        {medication.is_critical && (
          <View style={styles.criticalBadge}>
            <Text style={styles.criticalText}>CRITICAL</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.name}>{medication.name}</Text>
      <Text style={styles.dosage}>{medication.dosage}</Text>
      {medication.instructions ? (
        <Text style={styles.instructions}>{medication.instructions}</Text>
      ) : null}

      {!log ? (
        <View style={styles.actions}>
          <Button 
            label="SKIP" 
            variant="ghost" 
            size="elder"
            style={styles.skipButton}
            onPress={() => onAction('skipped')} 
          />
          <Button 
            label="TAKE" 
            variant="primary" 
            size="elder"
            style={styles.takeButton}
            onPress={() => onAction('taken')} 
          />
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, isTaken ? styles.textTaken : styles.textSkipped]}>
            {isTaken ? '✓ TAKEN' : '✕ SKIPPED'}
          </Text>
        </View>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  cardTaken: {
    borderColor: Colors.success,
    backgroundColor: '#f0fdf4',
  },
  cardSkipped: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  criticalBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  criticalText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  dosage: {
    fontSize: 20,
    color: Colors.textLight,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 18,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  skipButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  takeButton: {
    flex: 2,
    backgroundColor: Colors.success,
  },
  statusContainer: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textTaken: {
    color: Colors.success,
  },
  textSkipped: {
    color: Colors.textLight,
  }
})
