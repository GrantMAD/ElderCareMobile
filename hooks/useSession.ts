import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile, UserRole, SessionContext, SubscriptionTier } from '../types/app'

/**
 * useSession — provides the current authenticated user, their role, and
 * resolved family/elder IDs. Listens for auth state changes.
 *
 * Returns:
 *   user       — full Profile row (or null while loading / logged out)
 *   role       — 'elder' | 'family_member' | ... (or null)
 *   familyId   — UUID of the family the user belongs to (or null)
 *   elderId    — UUID of the elder in the same family (or null if user IS elder)
 *   subscriptionTier — The family's subscription tier (or null)
 *   loading    — true while the initial session check is running
 */
export function useSession(): SessionContext {
  const [user, setUser] = useState<Profile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [elderId, setElderId] = useState<string | null>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadSession(userId: string) {
    // 1. Fetch the user's profile (role, name, etc.)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profileData) {
      setLoading(false)
      return
    }

    const profile = profileData as any
    setUser(profile as Profile)
    setRole(profile.role as UserRole)

    // 2. Find the family the user belongs to
    const { data: memberData } = await supabase
      .from('family_members')
      .select('family_id, families(subscription_tier)')
      .eq('user_id', userId)
      .maybeSingle()

    const memberRow = memberData as any
    const resolvedFamilyId = memberRow?.family_id ?? null
    setFamilyId(resolvedFamilyId)
    setSubscriptionTier(memberRow?.families?.subscription_tier ?? null)

    // 3. If the user is not an elder, find the elder in the same family
    if (profile.role !== 'elder' && resolvedFamilyId) {
      const { data: elderData } = await supabase
        .from('family_members')
        .select('user_id')
        .eq('family_id', resolvedFamilyId)
        .eq('role', 'elder')
        .maybeSingle()

      const elderMember = elderData as any
      setElderId(elderMember?.user_id ?? null)
    } else if (profile.role === 'elder') {
      // The elder IS themselves
      setElderId(userId)
    }

    setLoading(false)
  }

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadSession(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for login / logout / token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadSession(session.user.id)
      } else {
        setUser(null)
        setRole(null)
        setFamilyId(null)
        setElderId(null)
        setSubscriptionTier(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, role, familyId, elderId, subscriptionTier, loading }
}
