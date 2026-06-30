import { Stack } from 'expo-router'

/**
 * Auth layout — centred card-style screens, no tab bar, no header chrome.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
