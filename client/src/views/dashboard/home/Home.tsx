import React from 'react'
import { MailPage } from '@/components/mail/mail'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const Home: React.FC = () => {
  return (
    <ProtectedRoute>
      <MailPage />
    </ProtectedRoute>
  )
}

export default Home
