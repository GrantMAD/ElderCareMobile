import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { useAlerts } from '../../hooks/useAlerts'
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts'

export function AlertsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { familyId } = useSession()
  const { activeAlerts, refresh } = useAlerts(familyId)

  useRealtimeAlerts(familyId, () => refresh())

  const handleNavigate = () => {
    setIsOpen(false)
    router.push('/alerts')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.menuIcon}>
        <Ionicons name="notifications" size={24} color={Colors.text} />
        {activeAlerts.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeAlerts.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={[styles.dropdown, Platform.OS === 'web' && { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }]}>
            <Text style={styles.headerTitle}>Notifications</Text>
            
            {activeAlerts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No new notifications</Text>
              </View>
            ) : (
              <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
                {activeAlerts.slice(0, 5).map((alert) => (
                  <View key={alert.id} style={styles.alertItem}>
                    <View style={[styles.dot, alert.severity === 'critical' ? { backgroundColor: Colors.danger } : { backgroundColor: Colors.warning }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertTitle} numberOfLines={1}>{alert.trigger_type.replace('_', ' ').toUpperCase()}</Text>
                      <Text style={styles.alertTime}>{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.viewAllButton} onPress={handleNavigate}>
              <Text style={styles.viewAllText}>View All Alerts</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
  menuIcon: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 2,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    right: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    width: 250,
    maxHeight: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  alertsList: {
    maxHeight: 250,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  alertTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
})
