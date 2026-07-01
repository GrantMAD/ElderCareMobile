import React, { useMemo, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { Button } from '../../components/shared/Button'
import { Card } from '../../components/shared/Card'
import { MedAdherenceBar } from '../../components/family/MedAdherenceBar'
import { useMedicationLogs } from '../../hooks/useMedicationLogs'
import { useMedications } from '../../hooks/useMedications'
import { useSession } from '../../hooks/useSession'

export default function FamilyMedicationsScreen() {
  const { elderId } = useSession()
  const { medications, loading, addMedication } = useMedications(elderId)
  const { logs, logDose, todayAdherence, refresh } = useMedicationLogs(elderId)
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [instructions, setInstructions] = useState('')
  const [showForm, setShowForm] = useState(false)

  const sortedMeds = useMemo(() => [...medications].sort((a, b) => a.name.localeCompare(b.name)), [medications])

  async function handleAddMedication() {
    if (!name.trim()) {
      Alert.alert('Medication name required')
      return
    }

    await addMedication({
      name,
      dosage,
      instructions,
      prescribed_by: '',
      is_critical: false,
      frequency: 'daily',
      times_of_day: ['09:00'],
    })

    setName('')
    setDosage('')
    setInstructions('')
    setShowForm(false)
    refresh()
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MedAdherenceBar taken={todayAdherence.taken} total={todayAdherence.total} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medication list</Text>
        <Button label="Add" variant="secondary" size="sm" onPress={() => setShowForm((value) => !value)} />
      </View>

      {showForm && (
        <Card style={styles.formCard} padding="md">
          <TextInput style={styles.input} placeholder="Medication name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Dosage" value={dosage} onChangeText={setDosage} />
          <TextInput style={styles.input} placeholder="Instructions" value={instructions} onChangeText={setInstructions} />
          <Button label="Save medication" variant="primary" size="md" onPress={handleAddMedication} />
        </Card>
      )}

      {loading ? (
        <Text style={styles.empty}>Loading medications…</Text>
      ) : sortedMeds.length === 0 ? (
        <Text style={styles.empty}>No medications found.</Text>
      ) : (
        sortedMeds.map((medication) => (
          <Card key={medication.id} style={styles.medCard} padding="md">
            <View style={styles.medRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{medication.name}</Text>
                <Text style={styles.medMeta}>{medication.dosage ?? 'No dosage'}</Text>
              </View>
              {medication.is_critical ? <Text style={styles.critical}>Critical</Text> : null}
            </View>

            <View style={styles.actions}>
              <Button label="Taken" variant="primary" size="sm" onPress={() => logDose(null, 'taken')} />
              <Button label="Skipped" variant="secondary" size="sm" onPress={() => logDose(null, 'skipped')} />
            </View>

            {logs.length > 0 ? (
              <Text style={styles.logText}>{logs[0]?.action === 'taken' ? 'Latest log: taken today' : 'Latest log: skipped today'}</Text>
            ) : null}
          </Card>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  formCard: { gap: 8 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: Colors.text },
  medCard: { gap: 8 },
  medRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  medMeta: { color: Colors.textSecondary, marginTop: 2 },
  critical: { color: Colors.danger, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10 },
  logText: { color: Colors.textSecondary, fontSize: 12 },
  empty: { color: Colors.textSecondary, paddingVertical: 12 },
})
