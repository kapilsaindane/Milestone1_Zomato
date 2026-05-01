'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: {
    location: string
    budget: string
    cuisine: string
    minimumRating: number
  }
  stats: {
    totalRecommendations: number
    averageRating: number
    favoriteCuisine: string
    joinDate: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  updatePreferences: (preferences: User['preferences']) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call - in production, this would call your backend
      const mockUser: User = {
        id: 'user_123',
        email,
        name: email.split('@')[0],
        preferences: {
          location: 'Bellandur',
          budget: 'medium',
          cuisine: 'North Indian',
          minimumRating: 4.0
        },
        stats: {
          totalRecommendations: 0,
          averageRating: 0,
          favoriteCuisine: 'North Indian',
          joinDate: new Date().toISOString()
        }
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        preferences: {
          location: '',
          budget: 'medium',
          cuisine: 'any',
          minimumRating: 3.5
        },
        stats: {
          totalRecommendations: 0,
          averageRating: 0,
          favoriteCuisine: '',
          joinDate: new Date().toISOString()
        }
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      return false
    }
  }

  const updatePreferences = async (preferences: User['preferences']): Promise<boolean> => {
    if (!user) return false
    
    try {
      const updatedUser = { ...user, preferences }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      updatePreferences,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
