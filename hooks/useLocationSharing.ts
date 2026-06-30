import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { LocationSharing } from '../types/app'

export function useLocationSharing(elderId: string | null) {
  const [locationSharing, setLocationSharing] = useState<LocationSharing | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLocationSharing = useCallback(async () => {
    if (!elderId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('location_sharing')
      .select('*')
      .eq('elder_id', elderId)
      .maybeSingle()

    if (!error && data) {
      setLocationSharing(data as LocationSharing)
    }
    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchLocationSharing()
  }, [fetchLocationSharing])

  const toggleSharing = async (isEnabled: boolean) => {
    if (!elderId) return
    
    if (locationSharing) {
      const { error } = await supabase
        .from('location_sharing')
        .update({ is_enabled: isEnabled })
        .eq('id', locationSharing.id)
        
      if (!error) {
        setLocationSharing(prev => prev ? { ...prev, is_enabled: isEnabled } : null)
      }
    } else {
      const { data, error } = await supabase
        .from('location_sharing')
        .insert({
          elder_id: elderId,
          is_enabled: isEnabled,
          visible_to: []
        })
        .select()
        .single()
        
      if (!error && data) {
        setLocationSharing(data as LocationSharing)
      }
    }
  }

  const updatePosition = async (lat: number, lng: number) => {
    if (!elderId || !locationSharing || !locationSharing.is_enabled) return
    
    const { error } = await supabase
      .from('location_sharing')
      .update({
        last_lat: lat,
        last_lng: lng,
        last_updated: new Date().toISOString()
      })
      .eq('id', locationSharing.id)
      
    if (!error) {
      setLocationSharing(prev => prev ? { ...prev, last_lat: lat, last_lng: lng, last_updated: new Date().toISOString() } : null)
    }
  }

  return { locationSharing, loading, toggleSharing, updatePosition, refresh: fetchLocationSharing }
}
