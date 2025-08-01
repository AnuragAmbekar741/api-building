import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { LoginInput } from '@/components/forms/login/LoginSchema'
import type { AuthResponse } from '@/api/auth'
import { authApi } from '@/api/auth'

export const useLogin = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),

    onSuccess: (data: AuthResponse) => {
      // Access token is already stored by authApi.login

      router.navigate({ to: '/dashboard' })

      // Show success toast
      toast.success('Welcome back!', {
        description: `Successfully signed in as ${data.user.firstName}`,
        duration: 4000,
      })
    },

    onError: (error: Error) => {
      // Show error toast
      toast.error('Sign in failed', {
        description:
          error.message || 'Please check your credentials and try again.',
        duration: 5000,
      })
    },

    onMutate: () => {
      // Optional: Show loading toast
      toast.loading('Signing you in...', {
        id: 'login-loading',
      })
    },

    onSettled: () => {
      // Dismiss loading toast
      toast.dismiss('login-loading')
    },
  })
}
