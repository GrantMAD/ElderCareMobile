import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import { Button } from '../../components/shared/Button'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { useLocationSharing } from '../../hooks/useLocationSharing'
import { supabase } from '../../lib/supabase'

export default function SettingsScreen() {
  const { elderId, user } = useSession()
  const { locationSharing, toggleSharing } = useLocationSharing(elderId)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Share Location with Family</Text>
          <Switch
            value={locationSharing?.is_enabled ?? false}
            onValueChange={toggleSharing}
            trackColor={{ false: '#d1d5db', true: Colors.success }}
            thumbColor={'#ffffff'}
          />
        </View>
        <Text style={styles.hint}>
          Allows your family to see where you are on the map. Useful during emergencies.
        </Text>
      </View>

      <Button 
        label="SIGN OUT" 
        variant="danger" 
        size="lg" 
        onPress={handleSignOut}
        style={styles.signOutBtn}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
  },
  rowLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  hint: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  signOutBtn: {
    marginTop: 'auto',
    marginBottom: 32,
  }
})
