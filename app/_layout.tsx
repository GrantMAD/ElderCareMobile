import { useEffect, useRef, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { registerPushToken } from '../lib/notifications'

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  // Track previous session to detect actual login/logout transitions
  const prevSessionRef = useRef<Session | null | undefined>(undefined)

  // ── 1. Track auth session ────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── 2. Route when session transitions (login / logout / initial load) ────
  useEffect(() => {
    if (session === undefined) return // Still loading

    const prevSession = prevSessionRef.current
    prevSessionRef.current = session

    if (!session) {
      // No session (initial load without auth, or just logged out) → login
      router.replace('/(auth)/login')
      return
    }

    // Has a session — only navigate when transitioning FROM no-session
    // (i.e. just logged in or initial app load with existing session)
    const wasUnauthenticated = prevSession === null || prevSession === undefined
    if (wasUnauthenticated) {
      routeToCorrectScreen(session)
    }
  }, [session])

  // ── 3. Protect main app routes when segments change ──────────────────────
  // Only redirects unauthenticated users away from the main app.
  // Does NOT interfere with navigation within the auth group.
  useEffect(() => {
    if (session === undefined) return // Still loading

    const inAuthGroup = (segments as string[]).includes('(auth)')
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login')
    }
  }, [segments])

  // ── Routing helper ───────────────────────────────────────────────────────
  async function routeToCorrectScreen(activeSession: Session) {
    await registerPushToken()

    const { data } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', activeSession.user.id)
      .maybeSingle()

    const profile = data as any
    const hasName = !!profile?.full_name
    const hasRole = !!profile?.role

    // Also check if the user is actually linked to a family — if not,
    // they are mid-onboarding regardless of what's in their profile row.
    const { data: memberRow } = await supabase
      .from('family_members')
      .select('id')
      .eq('user_id', activeSession.user.id)
      .maybeSingle()

    const inFamily = !!memberRow

    if (hasName && hasRole && inFamily) {
      // Fully set up — go to dashboard
      const target = profile.role === 'elder' ? '/(elder)/' : '/(family)/'
      const targetGroup = profile.role === 'elder' ? '(elder)' : '(family)'
      if (!(segments as string[]).includes(targetGroup)) {
        router.replace(target)
      }
      return
    }

    if (hasRole && !hasName) {
      // Existing web user — just needs a name
      if (!(segments as string[]).includes('complete-profile')) {
        router.replace('/(auth)/complete-profile')
      }
      return
    }

    // Brand new or incomplete onboarding — go to onboarding
    if (!(segments as string[]).includes('onboarding')) {
      router.replace('/(auth)/onboarding')
    }
  }

  // ── 4. Notification listeners ────────────────────────────────────────────
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data as Record<string, string>
        console.log('[Notification] received:', data?.type)
      }
    )

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string>
      switch (data?.type) {
        case 'emergency_alert':
        case 'sos_button':
          router.push('/(family)/alerts')
          break
        case 'medication_reminder':
          router.push('/(elder)/medications')
          break
        case 'checkin_reminder':
          router.push('/(elder)/checkin')
          break
        case 'appointment_reminder':
          router.push('/(elder)/appointments')
          break
      }
    })

    return () => {
      notificationListener.remove()
      responseListener.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Slot />
}
