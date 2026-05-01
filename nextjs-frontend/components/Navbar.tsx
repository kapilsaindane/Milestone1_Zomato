'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Utensils,
  Star,
  BarChart3,
  Users
} from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Recommendations', href: '/recommendations', icon: Star },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Social', href: '/social', icon: Users },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Utensils className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RestaurantAI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/preferences')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/preferences')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    router.push('/login')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    router.push('/register')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
