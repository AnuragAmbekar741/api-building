import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen">
      <div className="flex-1"></div>
      <div className="flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
