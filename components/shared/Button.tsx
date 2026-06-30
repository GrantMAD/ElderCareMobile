import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { Colors } from '../../constants/colors'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'elder'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  const containerStyle: any = [
    styles.base,
    (styles as any)[`size_${size}`],
    (styles as any)[`variant_${variant}`],
    (disabled || loading) && styles.disabled,
    style,
  ]

  const textStyle: any = [
    styles.text,
    (styles as any)[`textSize_${size}`],
    (styles as any)[`textVariant_${variant}`],
    (disabled || loading) && styles.textDisabled,
  ]

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // ── Sizes ──────────────────────────────────────────────────────────────────
  size_sm: { height: 36, paddingHorizontal: 16 },
  size_md: { height: 48, paddingHorizontal: 24 },
  size_lg: { height: 56, paddingHorizontal: 32 },
  // Elder: 64dp min height, accessible touch target, larger text
  size_elder: { minHeight: 64, paddingHorizontal: 32, paddingVertical: 12 },

  // ── Variants ───────────────────────────────────────────────────────────────
  variant_primary: { backgroundColor: Colors.primary },
  variant_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  variant_danger: { backgroundColor: Colors.danger },
  variant_ghost: { backgroundColor: 'transparent' },

  // ── Disabled state ─────────────────────────────────────────────────────────
  disabled: { opacity: 0.5 },

  // ── Text base ──────────────────────────────────────────────────────────────
  text: { fontWeight: '600' },

  textSize_sm: { fontSize: 14 },
  textSize_md: { fontSize: 16 },
  textSize_lg: { fontSize: 18 },
  textSize_elder: { fontSize: 20 },

  textVariant_primary: { color: '#ffffff' },
  textVariant_secondary: { color: Colors.primary },
  textVariant_danger: { color: '#ffffff' },
  textVariant_ghost: { color: Colors.primary },
  textDisabled: { opacity: 0.7 },
})
