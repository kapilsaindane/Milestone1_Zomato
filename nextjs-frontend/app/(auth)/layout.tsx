import { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'AI Restaurant Recommender - Auth',
  description: 'Authentication for AI-powered restaurant recommendations',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="flex min-h-screen">
          <div className="flex-1 flex items-center justify-center p-8">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
