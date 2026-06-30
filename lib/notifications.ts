import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { supabase } from './supabase'

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

/**
 * Request permissions, create Android notification channels, obtain the Expo
 * push token and persist it to the user's profile row.
 *
 * Call this every time the user opens the app (in _layout.tsx) because the
 * token can change after reinstall or device reset.
 */
export async function registerPushToken() {
  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  // User denied — do not block the app, just return silently
  if (finalStatus !== 'granted') return

  // Android requires explicit notification channels
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10b981',
    })

    await Notifications.setNotificationChannelAsync('sos', {
      name: 'SOS Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#ef4444',
      sound: 'default',
    })

    await Notifications.setNotificationChannelAsync('medication', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10b981',
      sound: 'default',
    })
  }

  // Obtain Expo push token
  // Replace 'your-eas-project-id' with the real EAS project ID after running `eas init`
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? 'your-eas-project-id',
  })
  const token = tokenData.data

  // Persist token to Supabase so Edge Functions can target this device
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('profiles')
      .update({ expo_push_token: token })
      .eq('id', user.id)
  }
}

/**
 * Schedule a local notification to fire after `seconds` seconds.
 * Used for medication reminders when the app is in the foreground.
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
      seconds 
    },
  })
}

/**
 * Cancel all pending local notifications.
 */
export async function cancelAllLocalNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
