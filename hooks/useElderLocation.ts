import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { LocationSharing } from '../types/app'

export function useElderLocation(elderId: string | null) {
  const [location, setLocation] = useState<LocationSharing | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLocation = useCallback(async () => {
    if (!elderId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('location_sharing')
      .select('*')
      .eq('elder_id', elderId)
      .maybeSingle()

    if (!error && data) {
      setLocation(data as LocationSharing)
    } else {
      setLocation(null)
    }

    setLoading(false)
  }, [elderId])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  return { location, loading, refresh: fetchLocation }
}
