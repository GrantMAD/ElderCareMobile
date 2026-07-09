import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/colors'
import { supabase } from '../../lib/supabase'
import { useSession } from '../../hooks/useSession'

export function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user } = useSession()

  const handleNavigate = (path: string) => {
    setIsOpen(false)
    router.push(path as any)
  }

  const handleSignOut = async () => {
    setIsOpen(false)
    await supabase.auth.signOut()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.menuIcon}>
        <Ionicons name="menu" size={28} color={Colors.text} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={[styles.dropdown, Platform.OS === 'web' && { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }]}>
            <TouchableOpacity
              style={styles.profileHeader}
              onPress={() => handleNavigate('/settings')}
            >
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={Colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.full_name || 'My Profile'}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
              <Text style={[styles.menuText, { color: Colors.danger }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
  },
  menuIcon: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70, 
    left: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff', // light blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
})
