import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LandingPage } from '@/components/landing/LandingPage'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/react-query'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <LandingPage />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
