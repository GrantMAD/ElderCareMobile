import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { useSession } from '../../hooks/useSession'

export default function ElderLayout() {
  const { role, loading } = useSession()

  if (!loading && role !== 'elder') {
    return <Redirect href="/" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 80,
          paddingBottom: 16,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={36} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarIcon: ({ color }) => <Ionicons name="medkit" size={36} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={36} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={36} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={36} color={color} />,
        }}
      />
    </Tabs>
  )
}
