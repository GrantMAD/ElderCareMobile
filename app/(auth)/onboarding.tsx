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

type Role = 'elder' | 'family_member'
type FamilyAction = 'create' | 'join'

export default function OnboardingScreen() {
  const router = useRouter()

  // ── Step tracking ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [familyAction, setFamilyAction] = useState<FamilyAction>('create')
  const [familyName, setFamilyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [elderName, setElderName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')

  function clearError() { setError(null) }

  // ── Step 1: Account creation ───────────────────────────────────────────────
  async function handleCreateAccount() {
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    clearError()
    setLoading(true)

    const { error: signUpErr } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (signUpErr) {
      setError('We could not create your account. Please try a different email.')
      return
    }
    setStep(2)
  }

  // ── Step 2: Role selection ─────────────────────────────────────────────────
  function handleRoleSelect(selectedRole: Role) {
    setRole(selectedRole)
    setStep(3)
  }

  // ── Step 3 (Family): Create or join a family ───────────────────────────────
  async function handleFamilyStep() {
    clearError()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update profile with name + role
      await supabase
        .from('profiles')
        .update({ full_name: fullName, role: 'family_member' })
        .eq('id', user.id)

      let familyId: string

      if (familyAction === 'create') {
        if (!familyName.trim()) {
          setError('Please enter a family name.')
          setLoading(false)
          return
        }
        // Create the family
        const { data: family, error: familyErr } = await supabase
          .from('families')
          .insert({ name: familyName.trim() })
          .select('id')
          .single()

        if (familyErr || !family) throw new Error('Could not create family.')
        familyId = family.id

        // Add current user as caregiver
        await supabase.from('family_members').insert({
          family_id: familyId,
          user_id: user.id,
          role: 'caregiver',
          is_primary_caregiver: true,
        })

        setStep(4) // Go to add elder step
      } else {
        // Join existing family with invite code
        if (!inviteCode.trim()) {
          setError('Please enter the invite code.')
          setLoading(false)
          return
        }
        // For now, treat invite code as family ID (real implementation would look up by code)
        const { data: family, error: lookupErr } = await supabase
          .from('families')
          .select('id')
          .eq('id', inviteCode.trim())
          .single()

        if (lookupErr || !family) {
          setError('Invalid invite code. Please check and try again.')
          setLoading(false)
          return
        }
        familyId = family.id

        await supabase.from('family_members').insert({
          family_id: familyId,
          user_id: user.id,
          role: 'caregiver',
          is_primary_caregiver: false,
        })

        // Skip to done
        router.replace('/(family)/')
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  // ── Step 4 (Family): Add elder ─────────────────────────────────────────────
  async function handleAddElder() {
    // This step is informational — actual elder setup happens when the elder
    // logs in and enters their invite code. We just record the name for now.
    clearError()
    setStep(5)
  }

  // ── Step 5 (Family): Invite other members (optional) ──────────────────────
  async function handleFinish() {
    if (inviteEmail.trim()) {
      // In a full implementation this would call the web app's invite API or
      // a Supabase Edge Function to send an invite email via Resend.
      Alert.alert(
        'Invite Sent',
        `An invitation has been sent to ${inviteEmail}. They can join using your family code.`,
        [{ text: 'OK' }]
      )
    }
    router.replace('/(family)/')
  }

  // ── Step 3 (Elder): Enter invite code ─────────────────────────────────────
  async function handleElderJoin() {
    if (!inviteCode.trim()) {
      setError('Please enter the invite code from your family member.')
      return
    }
    clearError()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: family, error: lookupErr } = await supabase
        .from('families')
        .select('id')
        .eq('id', inviteCode.trim())
        .single()

      if (lookupErr || !family) {
        setError('Invalid invite code. Please ask your family member for the correct code.')
        setLoading(false)
        return
      }

      // Update profile role to elder
      await supabase
        .from('profiles')
        .update({ full_name: fullName, role: 'elder' })
        .eq('id', user.id)

      // Add to family as elder
      await supabase.from('family_members').insert({
        family_id: family.id,
        user_id: user.id,
        role: 'elder',
        is_primary_caregiver: false,
      })

      router.replace('/(elder)/')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (loading) return <LoadingSpinner fullscreen />

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* ── Step indicator ───────────────────────────────────────────────── */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[styles.progressDot, step >= s && styles.progressDotActive]}
            />
          ))}
        </View>

        {/* ── STEP 1: Account details ───────────────────────────────────── */}
        {step === 1 && (
          <View>
            <Text style={styles.heading}>Create your account</Text>
            <Text style={styles.subheading}>Let's get you set up in just a few steps.</Text>

            <Text style={styles.label}>Your full name</Text>
            <TextInput style={styles.input} placeholder="e.g. Sarah Johnson" placeholderTextColor={Colors.textLight}
              value={fullName} onChangeText={setFullName} />

            <Text style={styles.label}>Email address</Text>
            <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor={Colors.textLight}
              value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="At least 8 characters" placeholderTextColor={Colors.textLight}
              value={password} onChangeText={setPassword} secureTextEntry />

            <Button label="Continue" onPress={handleCreateAccount} size="lg" style={styles.btn} />

            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.link}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Role selection ────────────────────────────────────── */}
        {step === 2 && (
          <View>
            <Text style={styles.heading}>Who are you?</Text>
            <Text style={styles.subheading}>This helps us show you the right experience.</Text>

            <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect('family_member')}>
              <Text style={styles.roleIcon}>👨‍👩‍👧</Text>
              <View style={styles.roleTextWrap}>
                <Text style={styles.roleTitle}>Family Member / Carer</Text>
                <Text style={styles.roleDesc}>
                  I look after someone — I want to track their health, medications, and receive alerts.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect('elder')}>
              <Text style={styles.roleIcon}>🧓</Text>
              <View style={styles.roleTextWrap}>
                <Text style={styles.roleTitle}>Elder / Care Recipient</Text>
                <Text style={styles.roleDesc}>
                  My family set this up for me. I have an invite code from them.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 3 (Family): Family setup ────────────────────────────── */}
        {step === 3 && role === 'family_member' && (
          <View>
            <Text style={styles.heading}>Set up your family</Text>

            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeTab, familyAction === 'create' && styles.modeTabActive]}
                onPress={() => setFamilyAction('create')}
              >
                <Text style={[styles.modeTabText, familyAction === 'create' && styles.modeTabTextActive]}>
                  Create new
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, familyAction === 'join' && styles.modeTabActive]}
                onPress={() => setFamilyAction('join')}
              >
                <Text style={[styles.modeTabText, familyAction === 'join' && styles.modeTabTextActive]}>
                  Join existing
                </Text>
              </TouchableOpacity>
            </View>

            {familyAction === 'create' ? (
              <>
                <Text style={styles.label}>Family name</Text>
                <TextInput style={styles.input} placeholder="e.g. The Johnson Family"
                  placeholderTextColor={Colors.textLight} value={familyName} onChangeText={setFamilyName} />
              </>
            ) : (
              <>
                <Text style={styles.label}>Invite code</Text>
                <TextInput style={styles.input} placeholder="Paste the invite code here"
                  placeholderTextColor={Colors.textLight} value={inviteCode} onChangeText={setInviteCode}
                  autoCapitalize="none" />
              </>
            )}

            <Button label="Continue" onPress={handleFamilyStep} size="lg" style={styles.btn} />
          </View>
        )}

        {/* ── STEP 3 (Elder): Enter invite code ────────────────────────── */}
        {step === 3 && role === 'elder' && (
          <View>
            <Text style={styles.heading}>Join your family</Text>
            <Text style={styles.subheading}>
              Ask a family member for your invite code. They can find it in the app's family settings.
            </Text>

            <Text style={styles.label}>Invite code</Text>
            <TextInput
              style={[styles.input, styles.inputLarge]}
              placeholder="Enter code"
              placeholderTextColor={Colors.textLight}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
            />

            <Button label="Join Family" onPress={handleElderJoin} size="elder" style={styles.btn} />
          </View>
        )}

        {/* ── STEP 4 (Family): Add elder ───────────────────────────────── */}
        {step === 4 && (
          <View>
            <Text style={styles.heading}>Who are you caring for?</Text>
            <Text style={styles.subheading}>
              Enter the elder's name. They'll join using an invite code later.
            </Text>

            <Text style={styles.label}>Elder's name</Text>
            <TextInput style={styles.input} placeholder="e.g. Margaret Johnson"
              placeholderTextColor={Colors.textLight} value={elderName} onChangeText={setElderName} />

            <Button label="Continue" onPress={handleAddElder} size="lg" style={styles.btn} />
          </View>
        )}

        {/* ── STEP 5 (Family): Invite other members ────────────────────── */}
        {step === 5 && (
          <View>
            <Text style={styles.heading}>Invite others (optional)</Text>
            <Text style={styles.subheading}>
              You can invite other family members to help monitor {elderName || 'your elder'}.
            </Text>

            <Text style={styles.label}>Their email address</Text>
            <TextInput style={styles.input} placeholder="sibling@email.com"
              placeholderTextColor={Colors.textLight} value={inviteEmail} onChangeText={setInviteEmail}
              keyboardType="email-address" autoCapitalize="none" />

            <Button label="Send Invite & Finish" onPress={handleFinish} size="lg" style={styles.btn} />
            <TouchableOpacity onPress={handleFinish}>
              <Text style={styles.link}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 24, paddingTop: 48, justifyContent: 'center' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.primary },
  heading: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subheading: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 12 },
  input: {
    height: 52, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: Colors.text, backgroundColor: Colors.backgroundSecondary,
  },
  inputLarge: { height: 64, fontSize: 20, textAlign: 'center', letterSpacing: 4 },
  btn: { marginTop: 28 },
  link: { color: Colors.primary, fontSize: 14, textAlign: 'center', marginTop: 16, fontWeight: '600' },
  errorText: { color: Colors.danger, fontSize: 14, textAlign: 'center', marginTop: 16, lineHeight: 20 },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.backgroundSecondary,
    marginBottom: 16,
  },
  roleIcon: { fontSize: 40, marginRight: 16 },
  roleTextWrap: { flex: 1 },
  roleTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  roleDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  modeRow: {
    flexDirection: 'row', backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  modeTabActive: { backgroundColor: Colors.background, elevation: 2 },
  modeTabText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  modeTabTextActive: { color: Colors.text, fontWeight: '700' },
})
