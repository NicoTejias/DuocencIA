/**
 * Hook central para el perfil del usuario autenticado con Clerk + Supabase.
 * Reemplaza useConvexAuth + useQuery(api.users.getProfile)
 */
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export type UserProfile = {
  id: string
  clerk_id: string
  name: string | null
  email: string | null
  image: string | null
  avatar_url: string | null
  role: string
  student_id: string | null
  is_verified: boolean
  is_demo: boolean
  terms_accepted_at: number | null
  daily_streak: number
  ice_cubes: number
  belbin_profile: any | null
  bartle_profile: string | null
  created_at: string
}

type UseProfileResult = {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  refetch: () => Promise<void>
}

export function useProfile(): UseProfileResult {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!clerkUser) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      // Set JWT for Supabase (if using Supabase auth integration)
      // Since we use service role key on client via anon for reads,
      // we identify the user by their Clerk ID
      const clerkId = clerkUser.id

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        setUser(null)
        return
      }

      if (!data) {
        // Profile doesn't exist yet - UserSync will create it
        setUser(null)
        return
      }

      setUser(data as UserProfile)
    } catch (err) {
      console.error('useProfile error:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [clerkUser])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUser(null)
      setIsLoading(false)
      return
    }
    fetchProfile()
  }, [isLoaded, isSignedIn, fetchProfile])

  return {
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: isLoaded && !!isSignedIn,
    refetch: fetchProfile,
  }
}
