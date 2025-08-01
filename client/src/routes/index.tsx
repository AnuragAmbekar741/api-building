import { Outlet, createRootRoute, createRoute } from '@tanstack/react-router'
import App from '@/App'
import { OAuthCallback } from '@/components/auth/OAuthCallback'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import Login from '@/views/auth/Login'
import Register from '@/views/auth/Register'
import { MailPage } from '@/components/mail/mail'

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

export const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: OAuthCallback,
})

// Dashboard parent route with layout
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
})

// Dashboard home
export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: () => (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Select an option from the sidebar
        </p>
      </div>
    </div>
  ),
})

// Mail route
export const dashboardMailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/mail',
  component: MailPage,
})

// Additional dashboard routes
export const dashboardAnalyticsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/analytics',
  component: () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">
        Analytics dashboard coming soon...
      </p>
    </div>
  ),
})

export const dashboardUsersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/users',
  component: () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="text-muted-foreground">User management coming soon...</p>
    </div>
  ),
})

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/settings',
  component: () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Settings panel coming soon...</p>
    </div>
  ),
})
