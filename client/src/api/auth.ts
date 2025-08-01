import { apiClient } from './global.client'
import type { LoginInput } from '@/components/forms/login/LoginSchema'

// API Response Types
export interface AuthResponse {
  message: string
  user: User
  accessToken: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isGoogleAuth: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface RefreshResponse {
  message: string
  accessToken: string
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
}

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials,
      )

      // Store the access token automatically
      if (response.data.accessToken) {
        apiClient.setAccessToken(response.data.accessToken)
      }

      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Login failed. Please try again.'

      throw new Error(errorMessage)
    }
  },

  /**
   * Register new user
   */
  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/register',
        userData,
      )

      // Store the access token automatically
      if (response.data.accessToken) {
        apiClient.setAccessToken(response.data.accessToken)
      }

      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Registration failed. Please try again.'

      throw new Error(errorMessage)
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<RefreshResponse> => {
    try {
      const response = await apiClient.post<RefreshResponse>('/auth/refresh')

      // Update the stored access token
      if (response.data.accessToken) {
        apiClient.setAccessToken(response.data.accessToken)
      }

      return response.data
    } catch (error: any) {
      // Clear tokens on refresh failure
      apiClient.removeAccessToken()

      const errorMessage =
        error?.response?.data?.error ||
        'Token refresh failed. Please login again.'

      throw new Error(errorMessage)
    }
  },

  /**
   * Logout user from current device
   */
  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/logout')
      return response.data
    } catch (error: any) {
      // Even if logout fails on server, we should clear local tokens
      console.warn('Logout request failed:', error)
      throw new Error('Logout failed')
    } finally {
      // Always clear local tokens
      apiClient.removeAccessToken()
    }
  },

  /**
   * Logout user from all devices
   */
  logoutAll: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/logout-all',
      )
      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Logout from all devices failed'
      throw new Error(errorMessage)
    } finally {
      // Always clear local tokens
      apiClient.removeAccessToken()
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{ user: User }>('/user/profile')
      return response.data.user
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Failed to fetch user profile'
      throw new Error(errorMessage)
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated: (): boolean => {
    return apiClient.isAuthenticated()
  },

  /**
   * Initiate Google OAuth login (redirects to backend)
   */
  initiateGoogleLogin: (): void => {
    const googleAuthUrl = `${apiClient.getAxiosInstance().defaults.baseURL}/auth/google`
    window.location.href = googleAuthUrl
  },

  /**
   * Handle forgot password request
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/forgot-password',
        { email },
      )
      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Failed to send reset email'
      throw new Error(errorMessage)
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/reset-password',
        {
          token,
          password: newPassword,
        },
      )
      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Password reset failed'
      throw new Error(errorMessage)
    }
  },
}

// Export individual functions for convenience
export const {
  login,
  register,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
  isAuthenticated,
  initiateGoogleLogin,
  forgotPassword,
  resetPassword,
} = authApi
