import React, { useCallback, useMemo } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { ActivityFeed } from '../../components/family/ActivityFeed'
import { AlertBanner } from '../../components/family/AlertBanner'
import { Card } from '../../components/shared/Card'
import { useActivityFeed } from '../../hooks/useActivityFeed'
import { useAlerts } from '../../hooks/useAlerts'
import { useFamilyDashboard } from '../../hooks/useFamilyDashboard'
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts'
import { useSession } from '../../hooks/useSession'

export default function FamilyDashboardScreen() {
  const { elderId, familyId } = useSession()
  const { elderName, lastCheckin, todayMeds, nextAppointment, activeAlertCount, loading: dashboardLoading } = useFamilyDashboard(elderId, familyId)
  const { alerts, acknowledgeAlert, resolveAlert, refresh: refreshAlerts } = useAlerts(familyId)
  const { items, loading: feedLoading, hasMore, loadMore } = useActivityFeed(elderId)
  const [activeBannerAlert, setActiveBannerAlert] = React.useState<any>(null)

  const handleRealtimeAlert = useCallback((alert: any) => {
    setActiveBannerAlert(alert)
    void refreshAlerts()
  }, [refreshAlerts])

  useRealtimeAlerts(familyId, handleRealtimeAlert)

  const latestAlert = useMemo(() => alerts.find((alert) => !alert.resolved_at) ?? null, [alerts])

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={dashboardLoading} onRefresh={refreshAlerts} />}
      >
        <Text style={styles.greeting}>Family dashboard</Text>
        <Text style={styles.subtitle}>{elderName ? `Monitoring ${elderName}` : 'Monitoring your elder'}</Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard} padding="md">
            <Text style={styles.statLabel}>Active alerts</Text>
            <Text style={styles.statValue}>{activeAlertCount}</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <Text style={styles.statLabel}>Meds today</Text>
            <Text style={styles.statValue}>{todayMeds.taken}/{todayMeds.total}</Text>
          </Card>
        </View>

        <Card style={styles.card} padding="md">
          <Text style={styles.cardTitle}>Latest wellness</Text>
          <Text style={styles.cardText}>{lastCheckin ? `Last check-in: ${new Date(lastCheckin.completed_at ?? lastCheckin.scheduled_time ?? '').toLocaleString()}` : 'No check-in yet'}</Text>
        </Card>

        <Card style={styles.card} padding="md">
          <Text style={styles.cardTitle}>Next appointment</Text>
          <Text style={styles.cardText}>{nextAppointment ? `${nextAppointment.doctor_name ?? 'Care visit'} — ${new Date(nextAppointment.appointment_date ?? '').toLocaleString()}` : 'No upcoming visits'}</Text>
        </Card>

        <Card style={styles.card} padding="md">
          <Text style={styles.cardTitle}>Recent activity</Text>
          <ActivityFeed items={items} loading={feedLoading} hasMore={hasMore} onLoadMore={loadMore} />
        </Card>
      </ScrollView>

      <AlertBanner
        alert={activeBannerAlert ?? latestAlert}
        visible={Boolean(activeBannerAlert || latestAlert)}
        onAcknowledge={(id) => {
          acknowledgeAlert(id)
          setActiveBannerAlert(null)
        }}
        onResolve={(id) => {
          resolveAlert(id)
          setActiveBannerAlert(null)
        }}
        onClose={() => setActiveBannerAlert(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  greeting: { fontSize: 24, fontWeight: '800', color: Colors.text },
  subtitle: { color: Colors.textSecondary, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, gap: 4 },
  statLabel: { color: Colors.textSecondary, fontSize: 13 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  card: { gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardText: { color: Colors.textSecondary },
})
