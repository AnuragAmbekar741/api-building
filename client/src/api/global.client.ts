import axios from 'axios'
import Cookies from 'js-cookie'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Configuration constants
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'
const API_PREFIX = '/api'

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/google/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
]

/**
 * Global Axios Client Configuration
 * Handles all API requests with automatic token management
 */
class GlobalApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${API_PREFIX}`,
      timeout: 30000, // 30 seconds timeout
      withCredentials: true, // Send cookies with requests
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupRequestInterceptor()
  }

  /**
   * Setup request interceptor to add bearer token
   */
  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Check if this endpoint requires authentication
        const isPublicEndpoint = this.isPublicEndpoint(config.url || '')

        if (!isPublicEndpoint) {
          const accessToken = this.getAccessToken()
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
          }
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  /**
   * Check if endpoint is public (doesn't require authentication)
   */
  private isPublicEndpoint(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint))
  }

  /**
   * Get access token from cookies
   */
  private getAccessToken(): string | undefined {
    return Cookies.get('accessToken')
  }

  /**
   * Set access token in cookies
   */
  public setAccessToken(token: string): void {
    Cookies.set('accessToken', token, {
      expires: 7, // 7 days
      secure: import.meta.env.PROD, // Only secure in production
      sameSite: 'Lax',
      path: '/',
    })
  }

  /**
   * Remove access token from cookies
   */
  public removeAccessToken(): void {
    Cookies.remove('accessToken', { path: '/' })
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  // HTTP Methods

  /**
   * GET request
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  /**
   * POST request
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  /**
   * PUT request
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client
  }
}

// Create and export a singleton instance
export const apiClient = new GlobalApiClient()

// Export the class for testing or advanced usage
export { GlobalApiClient }

// Export common types
export type { AxiosResponse, AxiosRequestConfig }
