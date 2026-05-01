'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  ChefHat,
  ArrowRight,
  Target,
  Award,
  Search,
  Filter,
  Heart,
  BarChart3,
  Settings,
  Bell,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface Recommendation {
  id: string
  restaurantName: string
  cuisine: string
  explanation: string
  confidenceScore: number
  rating?: number
  timestamp: string
}

interface UserStats {
  totalRecommendations: number
  averageRating: number
  favoriteCuisine: string
  joinDate: string
  thisWeekRecommendations: number
  satisfactionScore: number
}

export default function DashboardEnhanced() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [recentRecommendations, setRecentRecommendations] = useState<Recommendation[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Simulate loading user data
    const loadDashboardData = async () => {
      // Enhanced mock recommendations with more details
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          restaurantName: 'Ruh',
          cuisine: 'North Indian, Mughlai',
          explanation: 'Highly rated restaurant in your area with excellent Mughlai cuisine that matches your preferences.',
          confidenceScore: 0.95,
          rating: 4.5,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          restaurantName: 'The Fatty Bao',
          cuisine: 'Asian, Pan-Asian',
          explanation: 'Popular Asian restaurant with unique fusion dishes that align with your taste profile.',
          confidenceScore: 0.88,
          rating: 4.2,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          restaurantName: 'Punjab Grill',
          cuisine: 'North Indian, Punjabi',
          explanation: 'Traditional Punjabi cuisine with authentic flavors and generous portions.',
          confidenceScore: 0.92,
          rating: 4.7,
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ]

      // Enhanced user stats
      const mockStats: UserStats = {
        totalRecommendations: 47,
        averageRating: 4.3,
        favoriteCuisine: 'North Indian',
        joinDate: user.stats.joinDate,
        thisWeekRecommendations: 12,
        satisfactionScore: 0.87
      }

      setRecentRecommendations(mockRecommendations)
      setStats(mockStats)
      setIsLoading(false)
    }

    loadDashboardData()
  }, [user, router])

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-blue-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-sm text-gray-600">
                    Here's your personalized restaurant recommendation dashboard
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search restaurants, cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Recommendations
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/recommendations">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                  New Recommendations
                </button>
              </Link>
              <button 
                onClick={logout}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Recommendations</h3>
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats?.totalRecommendations}</div>
              <p className="text-sm text-gray-600">
                <span className="text-green-600 font-semibold">+{stats?.thisWeekRecommendations}</span> this week
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{width: `${(stats?.thisWeekRecommendations || 0) / 50 * 100}%`}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats?.averageRating}</div>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (stats?.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on your feedback</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Satisfaction Score</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{Math.round((stats?.satisfactionScore || 0) * 100)}%</div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{width: `${(stats?.satisfactionScore || 0) * 100}%`}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Cuisine</h3>
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">{stats?.favoriteCuisine}</div>
              <p className="text-sm text-gray-600">Most recommended type</p>
              <div className="mt-4 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <div className="text-4xl font-bold text-orange-600">🍽</div>
              </div>
            </div>
          </section>

          {/* Enhanced Recent Recommendations */}
          <section className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Recommendations</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Last 30 days
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {recentRecommendations.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
                  <p className="text-gray-600 mb-6">Get started by setting your preferences</p>
                  <Link href="/preferences">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Set Preferences
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentRecommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="bg-gray-50 rounded-lg p-6 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 cursor-pointer border border border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {rec.restaurantName}
                          </h3>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                              {rec.cuisine}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <span className="ml-2 text-lg font-semibold text-gray-700">
                                {rec.rating}
                              </span>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                              {Math.round(rec.confidenceScore * 100)}% match
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{rec.explanation}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <Clock className="h-4 w-4" />
                            {new Date(rec.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 rounded-full hover:bg-red-100 transition-colors">
                            <Heart className="h-5 w-5 text-red-600" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-blue-100 transition-colors">
                            <ArrowRight className="h-5 w-5 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Enhanced Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <Link href="/preferences">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Update Preferences</h3>
                    <p className="text-sm text-gray-600">Refine your taste profile</p>
                  </div>
                </div>
                <div className="text-right">
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <Link href="/analytics">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600">Track your patterns</p>
                  </div>
                </div>
                <div className="text-right">
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <Link href="/social">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Social Features</h3>
                    <p className="text-sm text-gray-600">Connect with friends</p>
                  </div>
                </div>
                <div className="text-right">
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
