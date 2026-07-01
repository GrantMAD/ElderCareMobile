import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { useAlerts } from '../../hooks/useAlerts'
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts'
import { useSession } from '../../hooks/useSession'
import { Button } from '../../components/shared/Button'
import { Card } from '../../components/shared/Card'
import type { Alert } from '../../types/app'

export default function FamilyAlertsScreen() {
  const { familyId } = useSession()
  const { alerts, activeAlerts, acknowledgeAlert, resolveAlert, refresh } = useAlerts(familyId)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

  useRealtimeAlerts(familyId, () => refresh())

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (filter === 'active' && alert.resolved_at) return false
      if (filter === 'resolved' && !alert.resolved_at) return false
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
      return true
    })
  }, [alerts, filter, severityFilter])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Alert center</Text>
      <Text style={styles.subtitle}>{activeAlerts.length} active alerts</Text>

      <View style={styles.filterRow}>
        {(['all', 'active', 'resolved'] as const).map((value) => (
          <Button key={value} label={value} variant={filter === value ? 'primary' : 'secondary'} size="sm" onPress={() => setFilter(value)} />
        ))}
      </View>

      <View style={styles.filterRow}>
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((value) => (
          <Button key={value} label={value} variant={severityFilter === value ? 'primary' : 'ghost'} size="sm" onPress={() => setSeverityFilter(value)} />
        ))}
      </View>

      {filteredAlerts.length === 0 ? <Text style={styles.empty}>No alerts to show.</Text> : filteredAlerts.map((alert) => (
        <Card
          key={alert.id}
          style={alert.trigger_type === 'sos_button' ? [styles.card, styles.sosCard] : styles.card}
          padding="md"
        >
          <View style={styles.row}>
            <Text style={styles.title}>{alert.severity.toUpperCase()}</Text>
            <Text style={styles.time}>{new Date(alert.created_at).toLocaleString()}</Text>
          </View>
          <Text style={styles.message}>{alert.message ?? 'Emergency alert'}</Text>
          <View style={styles.actions}>
            <Button label="Acknowledge" variant="danger" size="sm" onPress={() => acknowledgeAlert(alert.id)} />
            <Button label="Resolve" variant="secondary" size="sm" onPress={() => resolveAlert(alert.id)} />
          </View>
        </Card>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subtitle: { color: Colors.textSecondary },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { gap: 8 },
  sosCard: { borderColor: Colors.danger, borderWidth: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text },
  time: { color: Colors.textSecondary, fontSize: 12 },
  message: { color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: 8 },
  empty: { color: Colors.textSecondary, paddingVertical: 8 },
})
