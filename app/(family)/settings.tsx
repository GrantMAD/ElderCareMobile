import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { Button } from '../../components/shared/Button'
import { Card } from '../../components/shared/Card'
import { useSession } from '../../hooks/useSession'
import { openStripeCheckout, openStripePortal } from '../../lib/stripe'
import { supabase } from '../../lib/supabase'

export default function FamilySettingsScreen() {
  const { user, familyId, loading } = useSession()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Family settings</Text>

      <Card style={styles.card} padding="md">
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.value}>{user?.full_name ?? 'Family member'}</Text>
        <Text style={styles.value}>{user?.email ?? ''}</Text>
      </Card>

      <Card style={styles.card} padding="md">
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.value}>Family account: {loading ? 'Loading…' : familyId ? 'Connected' : 'Pending'}</Text>
        <View style={styles.actions}>
          <Button label="Upgrade" variant="primary" size="md" onPress={() => openStripeCheckout(process.env.EXPO_PUBLIC_STRIPE_PRICE_BASIC ?? '')} />
          <Button label="Manage billing" variant="secondary" size="md" onPress={() => openStripePortal()} />
        </View>
      </Card>

      <Card style={styles.card} padding="md">
        <Button label="Sign out" variant="danger" size="md" onPress={() => supabase.auth.signOut()} />
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: '800', color: Colors.text },
  card: { gap: 8 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  value: { color: Colors.textSecondary },
  actions: { gap: 8, marginTop: 8 },
})
