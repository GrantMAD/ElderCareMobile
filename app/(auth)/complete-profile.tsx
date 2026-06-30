import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/shared/Button'
import { Colors } from '../../constants/colors'

export default function CompleteProfileScreen() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)

    if (updateError) {
      setError('Could not save your name. Please try again.')
      setLoading(false)
      return
    }

    // Fetch the role so we can navigate to the correct dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    setLoading(false)

    const role = (profile as any)?.role
    if (role === 'elder') {
      router.replace('/(elder)/')
    } else {
      router.replace('/(family)/')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>👋</Text>
          <Text style={styles.title}>Almost there!</Text>
          <Text style={styles.subtitle}>
            We found your existing account. Just tell us your name and you're all set.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jane Smith"
            placeholderTextColor={Colors.textLight}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            textContentType="name"
            autoFocus
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          label="Save & Continue"
          onPress={handleSave}
          loading={loading}
          size="lg"
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: { marginBottom: 8 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.backgroundSecondary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  btn: { marginTop: 24 },
})
