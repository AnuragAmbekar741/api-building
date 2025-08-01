import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { queryClient } from './lib/react-query.ts'
import {
  authCallbackRoute,
  dashboardAnalyticsRoute,
  dashboardIndexRoute,
  dashboardMailRoute,
  dashboardRoute,
  dashboardSettingsRoute,
  dashboardUsersRoute,
  indexRoute,
  loginRoute,
  registerRoute,
  rootRoute,
} from '@/routes'

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  authCallbackRoute,
  registerRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    dashboardMailRoute,
    dashboardAnalyticsRoute,
    dashboardUsersRoute,
    dashboardSettingsRoute,
  ]),
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

reportWebVitals()
