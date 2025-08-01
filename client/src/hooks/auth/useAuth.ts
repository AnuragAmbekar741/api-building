import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { apiClient } from '@/api/global.client'
import { authApi } from '@/api/auth'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
}

export const useAuth = () => {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Check if we have an access token
      const isAuthenticated = apiClient.isAuthenticated()

      if (isAuthenticated) {
        try {
          // Verify token by fetching user profile
          const user = await authApi.getProfile()
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
          })
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            await authApi.refreshToken()
            const user = await authApi.getProfile()
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user,
            })
          } catch (refreshError) {
            // Refresh failed, user needs to login again
            logout()
          }
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })
    }
  }

  const logout = () => {
    // Clear tokens
    apiClient.removeAccessToken()

    // Reset auth state
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })

    // Redirect to login
    router.navigate({ to: '/login' })
  }

  const refreshAuth = () => {
    checkAuthStatus()
  }

  return {
    ...authState,
    logout,
    refreshAuth,
    checkAuthStatus,
  }
}
