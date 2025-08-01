import { useEffect } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { apiClient } from '@/api/global.client'

export function OAuthCallback() {
  const router = useRouter()
  const searchParams = useSearch({ from: '/auth/callback' })

  useEffect(() => {
    const handleCallback = async () => {
      // Get token and error from URL params
      const token = (searchParams as any)?.token
      const error = (searchParams as any)?.error

      if (error) {
        console.error('OAuth error:', error)
        toast.error('Google authentication failed', {
          description: 'Please try again.',
        })
        router.navigate({ to: '/login' })
        return
      }

      if (token) {
        try {
          // Store the access token
          apiClient.setAccessToken(token)

          // Show success message
          toast.success('Successfully signed in with Google!', {
            description: 'Welcome to LABEL!',
          })

          // Navigate to dashboard or home
          router.navigate({ to: '/dashboard' })
        } catch (error) {
          console.error('Token storage failed:', error)
          toast.error('Authentication failed', {
            description: 'Please try signing in again.',
          })
          router.navigate({ to: '/login' })
        }
      } else {
        // No token received
        toast.error('Authentication failed', {
          description: 'No authentication token received.',
        })
        router.navigate({ to: '/login' })
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
        <h2 className="mb-2 text-xl font-semibold">
          Completing Google authentication...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we securely sign you in.
        </p>
      </div>
    </div>
  )
}
