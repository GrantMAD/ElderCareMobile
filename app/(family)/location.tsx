import React from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { ElderLocationMap } from '../../components/family/ElderLocationMap'
import { Card } from '../../components/shared/Card'
import { useElderLocation } from '../../hooks/useElderLocation'
import { useSession } from '../../hooks/useSession'

export default function FamilyLocationScreen() {
  const { elderId } = useSession()
  const { location, loading, refresh } = useElderLocation(elderId)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <Text style={styles.heading}>Location</Text>
      <Card style={styles.card} padding="md">
        <Text style={styles.title}>Elder location</Text>
        <Text style={styles.subtitle}>Last updated: {location?.last_updated ? new Date(location.last_updated).toLocaleString() : 'Not available'}</Text>
        <View style={styles.mapContainer}>
          <ElderLocationMap location={location} />
        </View>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  card: { gap: 12 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  subtitle: { color: Colors.textSecondary },
  mapContainer: { marginTop: 4 },
})
