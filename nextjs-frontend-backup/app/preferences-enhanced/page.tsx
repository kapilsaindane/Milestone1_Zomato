'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { PreferencesForm } from '@/components/ui/preferences-form'
import { 
  User, 
  Settings, 
  Check,
  ArrowLeft,
  Save,
  RefreshCw
} from 'lucide-react'

interface UserPreferenceData {
  name: string
  email: string
  location: string
  maxDistance: number
  budgetLevel: string
  favoriteCuisines: string[]
  dislikedCuisines: string[]
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'very-spicy'
  dietaryRestrictions: string[]
  allergies: string[]
  preferredAmbiance: string[]
  mealTypes: string[]
  groupSize: number
  occasionTypes: string[]
  emailNotifications: boolean
  pushNotifications: boolean
  notificationFrequency: 'immediate' | 'daily' | 'weekly'
  sortBy: 'best-match' | 'rating' | 'distance' | 'price' | 'delivery-time'
  showOnlyOpen: boolean
  showOnlyDelivery: boolean
}

export default function PreferencesEnhancedPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferenceData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Load user preferences from user profile or API
    const loadPreferences = async () => {
      // Mock data - in real app, this would come from API
      const mockPreferences: UserPreferenceData = {
        name: user.name || '',
        email: user.email || '',
        location: user.location || 'San Francisco, CA',
        maxDistance: user.maxDistance || 10,
        budgetLevel: user.budgetLevel || '$$',
        favoriteCuisines: user.favoriteCuisines || ['italian', 'chinese'],
        dislikedCuisines: user.dislikedCuisines || [],
        spiceLevel: user.spiceLevel || 'medium',
        dietaryRestrictions: user.dietaryRestrictions || [],
        allergies: user.allergies || [],
        preferredAmbiance: user.preferredAmbiance || ['casual', 'family-friendly'],
        mealTypes: user.mealTypes || ['lunch', 'dinner'],
        groupSize: user.groupSize || 2,
        occasionTypes: user.occasionTypes || ['casual-meal', 'date-night'],
        emailNotifications: user.emailNotifications !== false,
        pushNotifications: user.pushNotifications !== false,
        notificationFrequency: user.notificationFrequency || 'daily',
        sortBy: user.sortBy || 'best-match',
        showOnlyOpen: user.showOnlyOpen !== false,
        showOnlyDelivery: user.showOnlyDelivery !== false
      }

      setPreferences(mockPreferences)
    }

    loadPreferences()
  }, [user, router])

  const handleSave = async (newPreferences: UserPreferenceData) => {
    setIsLoading(true)
    try {
      // Update user profile with new preferences
      if (updateProfile) {
        await updateProfile({
          ...user,
          ...newPreferences
        })
      }

      // In real app, save to backend API
      console.log('Saving preferences:', newPreferences)
      
      setHasChanges(false)
      setIsLoading(false)
      
      // Show success message
      setTimeout(() => {
        alert('Preferences saved successfully!')
      }, 500)
    } catch (error) {
      console.error('Error saving preferences:', error)
      setIsLoading(false)
      alert('Error saving preferences. Please try again.')
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  const handleReset = async () => {
    setIsLoading(true)
    try {
      // Reset to default preferences
      const defaultPreferences: UserPreferenceData = {
        name: user.name || '',
        email: user.email || '',
        location: '',
        maxDistance: 10,
        budgetLevel: '$$',
        favoriteCuisines: [],
        dislikedCuisines: [],
        spiceLevel: 'medium',
        dietaryRestrictions: [],
        allergies: [],
        preferredAmbiance: [],
        mealTypes: [],
        groupSize: 2,
        occasionTypes: [],
        emailNotifications: true,
        pushNotifications: true,
        notificationFrequency: 'daily',
        sortBy: 'best-match',
        showOnlyOpen: true,
        showOnlyDelivery: false
      }

      setPreferences(defaultPreferences)
      setIsLoading(false)
      setHasChanges(true)
    } catch (error) {
      console.error('Error resetting preferences:', error)
      setIsLoading(false)
      alert('Error resetting preferences. Please try again.')
    }
  }

  const handleQuickSave = async (field: keyof UserPreferenceData, value: any) => {
    if (preferences) {
      const updatedPreferences = { ...preferences, [field]: value }
      setPreferences(updatedPreferences)
      setHasChanges(true)
      
      // Auto-save after 2 seconds of inactivity
      setTimeout(() => {
        handleSave(updatedPreferences)
      }, 2000)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-blue-600">Loading preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </button>
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Enhanced Preferences
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-5 w-5" />
                Reset to Default
              </button>
              <button
                onClick={() => preferences && handleSave(preferences)}
                disabled={isLoading || !hasChanges}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Bar */}
          {hasChanges && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    You have unsaved changes
                  </span>
                </div>
                <button
                  onClick={() => preferences && handleSave(preferences)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Save Now
                </button>
              </div>
            </div>
          )}

          {/* Preferences Form */}
          <div className="p-6">
            {preferences ? (
              <PreferencesForm
                initialPreferences={preferences}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading preferences...</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => preferences && handleQuickSave('favoriteCuisines', ['italian', 'chinese'])}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Set Favorite Cuisines to Italian & Chinese
              </button>
              <button
                onClick={() => preferences && handleQuickSave('spiceLevel', 'medium')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Set Spice Level to Medium
              </button>
              <button
                onClick={() => preferences && handleQuickSave('budgetLevel', '$$')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Set Budget Level to Moderate
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{preferences?.location || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Max Distance:</span>
                <span className="font-medium">{preferences?.maxDistance || 10}km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Budget Level:</span>
                <span className="font-medium">{preferences?.budgetLevel || '$$'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favorite Cuisines:</span>
                <span className="font-medium">
                  {preferences?.favoriteCuisines.length || 0} selected
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Basic Info:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{width: `${preferences?.name && preferences?.email ? '100%' : '50%'}`}}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {preferences?.name && preferences?.email ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Food Preferences:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{width: `${(preferences?.favoriteCuisines.length || 0) > 0 ? '100%' : '30%'}`}}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {(preferences?.favoriteCuisines.length || 0) > 0 ? 'Complete' : 'Not Set'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notifications:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{width: `${preferences?.emailNotifications && preferences?.pushNotifications ? '100%' : '50%'}`}}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {preferences?.emailNotifications && preferences?.pushNotifications ? 'Enabled' : 'Partial'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
