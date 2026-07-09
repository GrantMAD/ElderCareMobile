import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { Colors } from '../constants/colors'
import { useSession } from '../hooks/useSession'
import { supabase } from '../lib/supabase'

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useSession()

  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Sync form state once the session user is available
  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '')
      setAvatarUrl(user.avatar_url ?? null)
    }
  }, [user])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to change your avatar.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri)
    }
  }

  const uploadAvatar = async (uri: string) => {
    if (!user?.id) return
    setUploading(true)
    try {
      const ext = uri.split('.').pop() ?? 'jpg'
      const filePath = `${user.id}/avatar.${ext}`

      // On web, fetch the blob; on native, pass the URI object directly.
      // The native Supabase client accepts { uri, name, type } but TypeScript
      // types it strictly as FileBody (web File), so we cast to avoid the error.
      let uploadData: any
      if (Platform.OS === 'web') {
        const response = await fetch(uri)
        uploadData = await response.blob()
      } else {
        uploadData = { uri, name: `avatar.${ext}`, type: `image/${ext}` }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, uploadData as any, { upsert: true, contentType: `image/${ext}` })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
      setAvatarUrl(newUrl)
    } catch (err: any) {
      Alert.alert('Upload failed', err.message ?? 'Could not upload your avatar.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user?.id) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), avatar_url: avatarUrl })
        .eq('id', user.id)

      if (error) throw error
      Alert.alert('Saved', 'Your profile has been updated.')
      router.back()
    } catch (err: any) {
      Alert.alert('Save failed', err.message ?? 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.text} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>My Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={uploading}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={Colors.primary} />
            </View>
          )}
          <View style={styles.editBadge}>
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to change photo</Text>
      </View>

      {/* Full Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="words"
        />
      </View>

      {/* Email — read-only */}
      <View style={styles.field}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputReadOnly}>
          <Text style={styles.inputReadOnlyText}>{user?.email ?? ''}</Text>
          <Ionicons name="lock-closed-outline" size={16} color={Colors.textLight} />
        </View>
        <Text style={styles.hint}>Email address cannot be changed here.</Text>
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={[styles.saveButton, (saving || uploading) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving || uploading}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: -8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundSecondary,
  },
  avatarHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  inputReadOnly: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputReadOnlyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: Colors.textLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
