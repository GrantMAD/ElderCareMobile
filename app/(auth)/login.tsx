import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/shared/Button'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Colors } from '../../constants/colors'

type LoginMode = 'password' | 'magic_link' | 'otp'

export default function LoginScreen() {
  const router = useRouter()

  const [mode, setMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  // ── Email + password login ─────────────────────────────────────────────────
  async function handlePasswordLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    clearMessages()
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError('Incorrect email or password. Please try again.')
    }
    // On success the root layout's onAuthStateChange will handle the redirect
  }

  // ── Magic link ─────────────────────────────────────────────────────────────
  async function handleMagicLink() {
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    clearMessages()
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (err) {
      setError('We could not send the link. Please check your email and try again.')
    } else {
      setSuccess('Magic link sent! Check your email inbox.')
    }
  }

  // ── Phone OTP — step 1: send code ─────────────────────────────────────────
  async function handleSendOtp() {
    if (!phone) {
      setError('Please enter your phone number (include country code, e.g. +27...).')
      return
    }
    clearMessages()
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({ phone })
    setLoading(false)
    if (err) {
      setError('We could not send the code. Please check your number and try again.')
    } else {
      setOtpSent(true)
      setSuccess('Code sent! Enter it below.')
    }
  }

  // ── Phone OTP — step 2: verify code ───────────────────────────────────────
  async function handleVerifyOtp() {
    if (!otpCode) {
      setError('Please enter the code you received.')
      return
    }
    clearMessages()
    setLoading(true)
    const { error: err } = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
      type: 'sms',
    })
    setLoading(false)
    if (err) {
      setError('Invalid or expired code. Please try again.')
    }
  }

  if (loading) return <LoadingSpinner fullscreen />

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo / branding */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.appName}>Elder Care Companion</Text>
          <Text style={styles.tagline}>Peace of mind for families, dignity for elders.</Text>
        </View>

        {/* Mode selector */}
        <View style={styles.modeRow}>
          {(['password', 'magic_link', 'otp'] as LoginMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeTab, mode === m && styles.modeTabActive]}
              onPress={() => { setMode(m); clearMessages(); setOtpSent(false) }}
            >
              <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
                {m === 'password' ? 'Password' : m === 'magic_link' ? 'Magic Link' : 'Phone'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Password mode ──────────────────────────────────────────────── */}
        {mode === 'password' && (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
            />
            <Button label="Sign In" onPress={handlePasswordLogin} size="lg" style={styles.submitBtn} />
          </View>
        )}

        {/* ── Magic link mode ───────────────────────────────────────────── */}
        {mode === 'magic_link' && (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <Button label="Send Magic Link" onPress={handleMagicLink} size="lg" style={styles.submitBtn} />
          </View>
        )}

        {/* ── Phone OTP mode ────────────────────────────────────────────── */}
        {mode === 'otp' && (
          <View style={styles.form}>
            {!otpSent ? (
              <>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+27 82 000 0000"
                  placeholderTextColor={Colors.textLight}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
                <Button label="Send Code" onPress={handleSendOtp} size="lg" style={styles.submitBtn} />
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter the code we sent you</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  placeholderTextColor={Colors.textLight}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Button label="Verify Code" onPress={handleVerifyOtp} size="lg" style={styles.submitBtn} />
                <TouchableOpacity onPress={() => setOtpSent(false)}>
                  <Text style={styles.link}>← Change number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Error / success messages */}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        {/* Create account */}
        <TouchableOpacity
          style={styles.createAccountRow}
          onPress={() => router.push('/(auth)/onboarding')}
        >
          <Text style={styles.createAccountText}>
            Don't have an account?{' '}
            <Text style={styles.createAccountLink}>Create one</Text>
          </Text>
        </TouchableOpacity>
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
  logo: { fontSize: 64, marginBottom: 12 },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: { backgroundColor: Colors.background, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  modeTabText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  modeTabTextActive: { color: Colors.text, fontWeight: '700' },
  form: { marginBottom: 16 },
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
  submitBtn: { marginTop: 24 },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  successText: {
    color: Colors.success,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  createAccountRow: { marginTop: 32, alignItems: 'center' },
  createAccountText: { fontSize: 14, color: Colors.textSecondary },
  createAccountLink: { color: Colors.primary, fontWeight: '700' },
})
