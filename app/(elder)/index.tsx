import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

export default function ElderDashboardPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌿</Text>
      <Text style={styles.title}>Elder Dashboard</Text>
      <Text style={styles.subtitle}>Phase 2 — Coming soon!</Text>
      <Text style={styles.body}>
        You're successfully logged in as an Elder. The full dashboard is being built.
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.btnText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.primary, fontWeight: '600', marginBottom: 16 },
  body: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
