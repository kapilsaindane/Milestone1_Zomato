import { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Dashboard - AI Restaurant Recommender',
  description: 'Your personalized restaurant recommendations dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
