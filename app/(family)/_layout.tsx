import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Tabs, Redirect, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'
import { HeaderMenu } from '../../components/shared/HeaderMenu'
import { AlertsMenu } from '../../components/shared/AlertsMenu'

export default function FamilyLayout() {
  const { role, loading } = useSession()
  const router = useRouter()

  if (!loading && role !== 'family_member') {
    return <Redirect href="/" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 85,
          paddingBottom: 8,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
        },
        headerShown: true,
        headerLeft: () => <HeaderMenu />,
        headerRight: () => <AlertsMenu />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarIcon: ({ color }) => <Ionicons name="medkit" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Wellness',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          href: null,
          title: 'Alerts',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'Location',
          tabBarIcon: ({ color }) => <Ionicons name="location" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
        }}
      />
    </Tabs>
  )
}
