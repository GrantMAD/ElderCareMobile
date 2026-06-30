import * as WebBrowser from 'expo-web-browser'
import { supabase } from './supabase'

/**
 * Opens Stripe Checkout in the system browser for a given price ID.
 * Payments are NOT embedded in the native app to comply with App Store policies.
 *
 * Usage:
 *   await openStripeCheckout(process.env.EXPO_PUBLIC_STRIPE_PRICE_BASIC!)
 */
export async function openStripeCheckout(priceId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_APP_URL}/api/subscription/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      }
    )

    const { url } = await response.json()
    if (url) {
      await WebBrowser.openBrowserAsync(url)
    }
  } catch (error) {
    console.error('[Stripe] Failed to open checkout:', error)
  }
}

/**
 * Opens the Stripe Customer Portal so the user can manage their billing.
 */
export async function openStripePortal() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_APP_URL}/api/subscription/portal`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    const { url } = await response.json()
    if (url) {
      await WebBrowser.openBrowserAsync(url)
    }
  } catch (error) {
    console.error('[Stripe] Failed to open portal:', error)
  }
}
