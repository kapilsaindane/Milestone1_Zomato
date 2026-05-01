'use client'

import React, { useState } from 'react'
import { 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  Heart,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Utensils,
  Coffee,
  Pizza,
  Salad,
  Fish
} from 'lucide-react'

interface UserPreferences {
  // Basic Preferences
  name: string
  email: string
  location: string
  maxDistance: number
  budgetLevel: string
  
  // Cuisine Preferences
  favoriteCuisines: string[]
  dislikedCuisines: string[]
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'very-spicy'
  
  // Dietary Restrictions
  dietaryRestrictions: string[]
  allergies: string[]
  
  // Restaurant Preferences
  preferredAmbiance: string[]
  mealTypes: string[]
  groupSize: number
  occasionTypes: string[]
  
  // Notification Preferences
  emailNotifications: boolean
  pushNotifications: boolean
  notificationFrequency: 'immediate' | 'daily' | 'weekly'
  
  // Search Preferences
  sortBy: 'best-match' | 'rating' | 'distance' | 'price' | 'delivery-time'
  showOnlyOpen: boolean
  showOnlyDelivery: boolean
}

interface PreferencesFormProps {
  initialPreferences?: Partial<UserPreferences>
  onSave: (preferences: UserPreferences) => void
  onCancel: () => void
}

const cuisineOptions = [
  { id: 'italian', name: 'Italian', icon: Pizza },
  { id: 'chinese', name: 'Chinese', icon: Utensils },
  { id: 'japanese', name: 'Japanese', icon: Fish },
  { id: 'indian', name: 'Indian', icon: Utensils },
  { id: 'mexican', name: 'Mexican', icon: Utensils },
  { id: 'thai', name: 'Thai', icon: Utensils },
  { id: 'american', name: 'American', icon: Coffee },
  { id: 'mediterranean', name: 'Mediterranean', icon: Utensils },
  { id: 'french', name: 'French', icon: Utensils }
]

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free', 'Nut-Free'
]

const allergyOptions = [
  'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 'Soy', 'Wheat', 'Sesame'
]

const ambianceOptions = [
  'Casual', 'Fine Dining', 'Romantic', 'Family-Friendly', 'Outdoor', 'Sports Bar', 'Quiet'
]

const mealTypes = [
  'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late Night', 'Happy Hour'
]

const occasionTypes = [
  'Date Night', 'Business Meeting', 'Family Gathering', 'Casual Meal', 'Celebration', 'Quick Bite'
]

export function PreferencesForm({ 
  initialPreferences = {}, 
  onSave, 
  onCancel 
}: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    email: '',
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
    showOnlyDelivery: false,
    ...initialPreferences
  })

  const [activeSection, setActiveSection] = useState<string>('basic')

  const handleSave = () => {
    onSave(preferences)
  }

  const toggleArrayItem = (field: keyof UserPreferences, item: string) => {
    const currentArray = preferences[field] as string[]
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    
    setPreferences({ ...preferences, [field]: newArray })
  }

  const updatePreference = (field: keyof UserPreferences, value: any) => {
    setPreferences({ ...preferences, [field]: value })
  }

  const sections = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'cuisine', name: 'Food Preferences', icon: Utensils },
    { id: 'dietary', name: 'Dietary & Allergies', icon: Heart },
    { id: 'restaurant', name: 'Restaurant Preferences', icon: MapPin },
    { id: 'notifications', name: 'Notifications', icon: Clock },
    { id: 'search', name: 'Search Settings', icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Additional Preferences
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5" />
                  <span>{section.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={preferences.name}
                      onChange={(e) => updatePreference('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={preferences.email}
                      onChange={(e) => updatePreference('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={preferences.location}
                      onChange={(e) => updatePreference('location', e.target.value)}
                      placeholder="City, State"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Distance: {preferences.maxDistance}km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={preferences.maxDistance}
                      onChange={(e) => updatePreference('maxDistance', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Budget Level</label>
                    <select
                      value={preferences.budgetLevel}
                      onChange={(e) => updatePreference('budgetLevel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="$">Budget Friendly ($)</option>
                      <option value="$$">Moderate ($$)</option>
                      <option value="$$$">Upscale ($$$)</option>
                      <option value="$$$$">Fine Dining ($$$$)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Cuisine Preferences Section */}
            {activeSection === 'cuisine' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Food Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Cuisines</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {cuisineOptions.map((cuisine) => (
                        <button
                          key={cuisine.id}
                          type="button"
                          onClick={() => toggleArrayItem('favoriteCuisines', cuisine.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            preferences.favoriteCuisines.includes(cuisine.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <cuisine.icon className="h-8 w-8 text-blue-600" />
                            <span className="text-sm font-medium">{cuisine.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Spice Level</h3>
                    <div className="flex space-x-4">
                      {['mild', 'medium', 'spicy', 'very-spicy'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updatePreference('spiceLevel', level)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            preferences.spiceLevel === level
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dietary & Allergies Section */}
            {activeSection === 'dietary' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Dietary & Allergies</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
                    <div className="flex flex-wrap gap-3">
                      {dietaryOptions.map((diet) => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => toggleArrayItem('dietaryRestrictions', diet)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            preferences.dietaryRestrictions.includes(diet)
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Allergies</h3>
                    <div className="flex flex-wrap gap-3">
                      {allergyOptions.map((allergy) => (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleArrayItem('allergies', allergy)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            preferences.allergies.includes(allergy)
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {allergy}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Restaurant Preferences Section */}
            {activeSection === 'restaurant' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Restaurant Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Ambiance</h3>
                    <div className="flex flex-wrap gap-3">
                      {ambianceOptions.map((ambiance) => (
                        <button
                          key={ambiance}
                          type="button"
                          onClick={() => toggleArrayItem('preferredAmbiance', ambiance)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            preferences.preferredAmbiance.includes(ambiance)
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {ambiance}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Types</h3>
                    <div className="flex flex-wrap gap-3">
                      {mealTypes.map((meal) => (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => toggleArrayItem('mealTypes', meal)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            preferences.mealTypes.includes(meal)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Size</h3>
                    <div className="flex space-x-4">
                      {[1, 2, 4, 6, 8].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updatePreference('groupSize', size)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            preferences.groupSize === size
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size} {size === 1 ? 'Person' : 'People'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Occasion Types</h3>
                    <div className="flex flex-wrap gap-3">
                      {occasionTypes.map((occasion) => (
                        <button
                          key={occasion}
                          type="button"
                          onClick={() => toggleArrayItem('occasionTypes', occasion)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            preferences.occasionTypes.includes(occasion)
                              ? 'border-pink-500 bg-pink-50 text-pink-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {occasion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive recommendations via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreference('emailNotifications', !preferences.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Get instant recommendations</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreference('pushNotifications', !preferences.pushNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
                    <div className="flex space-x-4">
                      {['immediate', 'daily', 'weekly'].map((frequency) => (
                        <button
                          key={frequency}
                          type="button"
                          onClick={() => updatePreference('notificationFrequency', frequency)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all ${
                            preferences.notificationFrequency === frequency
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Settings Section */}
            {activeSection === 'search' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Search Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Sort By</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['best-match', 'rating', 'distance', 'price', 'delivery-time'].map((sort) => (
                        <button
                          key={sort}
                          type="button"
                          onClick={() => updatePreference('sortBy', sort)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            preferences.sortBy === sort
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {sort.charAt(0).toUpperCase() + sort.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Show Only Open Restaurants</h3>
                      <p className="text-sm text-gray-600">Filter by availability</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreference('showOnlyOpen', !preferences.showOnlyOpen)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.showOnlyOpen ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          preferences.showOnlyOpen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Show Only Delivery Available</h3>
                      <p className="text-sm text-gray-600">Filter by delivery options</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreference('showOnlyDelivery', !preferences.showOnlyDelivery)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.showOnlyDelivery ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          preferences.showOnlyDelivery ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
