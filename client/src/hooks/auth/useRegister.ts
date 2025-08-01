import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { RegisterInput } from '@/components/forms/register/register.schema'
import type { AuthResponse } from '@/api/auth'
import { authApi } from '@/api/auth'

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterInput) => authApi.register(userData),

    onSuccess: (data: AuthResponse) => {
      // Access token is already stored by authApi.register

      // Show success toast
      toast.success('Welcome to LABEL!', {
        description: `Account created successfully for ${data.user.firstName}`,
        duration: 4000,
      })

      // You can add navigation logic here
      // router.navigate({ to: '/dashboard' })
    },

    onError: (error: Error) => {
      // Show error toast
      toast.error('Registration failed', {
        description:
          error.message || 'Please check your information and try again.',
        duration: 5000,
      })
    },

    onMutate: () => {
      // Optional: Show loading toast
      toast.loading('Creating your account...', {
        id: 'register-loading',
      })
    },

    onSettled: () => {
      // Dismiss loading toast
      toast.dismiss('register-loading')
    },
  })
}
