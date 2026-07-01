import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { WellnessTrendChart } from '../../components/family/WellnessTrendChart'
import { Card } from '../../components/shared/Card'
import { useCheckins } from '../../hooks/useCheckins'
import { useSession } from '../../hooks/useSession'

export default function FamilyWellnessScreen() {
  const { elderId } = useSession()
  const { checkins, loading } = useCheckins(elderId)

  const trendWarning = useMemo(() => {
    const recent = [...checkins].sort((a, b) => new Date(b.completed_at ?? b.scheduled_time ?? 0).getTime() - new Date(a.completed_at ?? a.scheduled_time ?? 0).getTime()).slice(0, 5)
    let streak = 0

    for (let index = 0; index < recent.length - 1; index += 1) {
      const current = recent[index]
      const next = recent[index + 1]
      const currentMood = current.mood_score ?? 0
      const nextMood = next.mood_score ?? 0
      const dropped = nextMood < currentMood
      if (dropped) {
        streak += 1
      } else {
        streak = 0
      }
      if (streak >= 3) return true
    }

    return false
  }, [checkins])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {trendWarning ? (
        <Card style={styles.warningCard} padding="md">
          <Text style={styles.warningTitle}>Declining trend detected</Text>
          <Text style={styles.warningText}>Recent wellness scores are trending down across several consecutive days.</Text>
        </Card>
      ) : null}

      <Text style={styles.heading}>Wellness overview</Text>
      <WellnessTrendChart checkins={checkins} />

      <Text style={styles.subheading}>Recent history</Text>
      {loading ? (
        <Text style={styles.empty}>Loading wellness history…</Text>
      ) : checkins.length === 0 ? (
        <Text style={styles.empty}>No check-ins yet.</Text>
      ) : (
        checkins.slice(0, 6).map((item) => (
          <Card key={item.id} style={styles.itemCard} padding="md">
            <Text style={styles.itemDate}>{new Date(item.completed_at ?? item.scheduled_time ?? '').toLocaleDateString()}</Text>
            <Text style={styles.itemMeta}>Mood: {item.mood_score ?? '—'} • Pain: {item.pain_score ?? '—'} • Energy: {item.energy_score ?? '—'}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subheading: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 4 },
  warningCard: { backgroundColor: '#fef3c7', borderColor: Colors.warning },
  warningTitle: { color: Colors.warningDark, fontWeight: '800', fontSize: 16 },
  warningText: { color: Colors.text, marginTop: 4 },
  itemCard: { gap: 4 },
  itemDate: { fontWeight: '700', color: Colors.text },
  itemMeta: { color: Colors.textSecondary },
  empty: { color: Colors.textSecondary, paddingVertical: 8 },
})
