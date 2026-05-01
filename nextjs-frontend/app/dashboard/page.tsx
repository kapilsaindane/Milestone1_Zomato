'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { SimpleCard, RestaurantSimpleCard } from '@/components/ui/simple-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Settings
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

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [recentRecommendations, setRecentRecommendations] = useState<Recommendation[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Simulate loading user data
    const loadDashboardData = async () => {
      // Mock recent recommendations
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
        }
      ]

      // Mock user stats
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your personalized restaurant recommendation dashboard
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link href="/recommendations">
            <Button>
              Get New Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-900" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.thisWeekRecommendations} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on your feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats?.satisfactionScore || 0) * 100)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(stats?.satisfactionScore || 0) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Cuisine</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.favoriteCuisine}</div>
            <p className="text-xs text-muted-foreground">
              Most recommended type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Recommendations</CardTitle>
          <CardDescription>
            Your latest personalized restaurant suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRecommendations.map((rec) => (
              <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {rec.restaurantName}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {Math.round(rec.confidenceScore * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.cuisine}</p>
                  <p className="text-sm text-gray-700 mt-2">{rec.explanation}</p>
                  <div className="flex items-center mt-3 space-x-4">
                    {rec.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{rec.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(rec.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {recentRecommendations.length === 0 && (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-600 mb-4">Get started by setting your preferences</p>
              <Link href="/preferences">
                <Button>Set Preferences</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/preferences">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                Update Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Refine your taste profile for better recommendations
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/analytics">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track your recommendation history and patterns
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/social">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Social Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Connect with friends and share recommendations
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
