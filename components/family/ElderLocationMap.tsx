import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import type { LocationSharing } from '../../types/app'

interface ElderLocationMapProps {
  location: LocationSharing | null
}

export function ElderLocationMap({ location }: ElderLocationMapProps) {
  if (!location?.is_enabled || !location.last_lat || !location.last_lng) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Location sharing is off</Text>
        <Text style={styles.emptyText}>Enable sharing on the elder device to see a live map here.</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Shared location</Text>
      <Text style={styles.description}>
        {Platform.OS === 'web'
          ? 'Web preview shows the latest shared coordinates and status instead of a native map view.'
          : 'Live location is available on the mobile app.'}
      </Text>
      <Text style={styles.coords}>Lat: {location.last_lat.toFixed(4)}</Text>
      <Text style={styles.coords}>Lng: {location.last_lng.toFixed(4)}</Text>
      <View style={styles.pin}>
        <Text style={styles.pinText}>E</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  coords: {
    color: Colors.text,
    fontWeight: '600',
  },
  pin: {
    marginTop: 4,
    backgroundColor: Colors.danger,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  pinText: {
    color: Colors.background,
    fontWeight: '800',
  },
  emptyState: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
})
