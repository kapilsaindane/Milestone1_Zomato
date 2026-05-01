'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MapPin,
  Star,
  Clock,
  Heart,
  ArrowRight,
  Grid3X3,
  List,
  X
} from 'lucide-react'
import { SearchEnhanced } from '@/components/ui/search-enhanced'
import { RestaurantSimpleCard } from '@/components/ui/simple-card'
import { RatingFilter } from '@/components/ui/rating-filter'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  location: string
  description: string
  distance?: number
  deliveryTime?: number
  isFavorite?: boolean
  matchScore?: number
  tags: string[]
}

interface SearchFilters {
  query: string
  cuisine: string
  priceRange: string
  minRating: number
  maxRating: number
  dietary: string[]
  distance: number
  sortBy: string
}

export default function SearchEnhancedPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    cuisine: 'All',
    priceRange: '$$',
    minRating: 1,
    maxRating: 5,
    dietary: [],
    distance: 10,
    sortBy: 'Best Match'
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Load restaurants from API or mock data
    const loadRestaurants = async () => {
      // Mock restaurant data
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'Ruh',
          cuisine: 'North Indian, Mughlai',
          rating: 4.5,
          priceRange: '$$',
          location: 'Andheri, Mumbai',
          description: 'Authentic North Indian cuisine with rich flavors and traditional recipes. Known for their butter chicken and biryani.',
          distance: 2.3,
          deliveryTime: 35,
          isFavorite: true,
          matchScore: 0.95,
          tags: ['North Indian', 'Mughlai', 'Authentic', 'Family Friendly']
        },
        {
          id: '2',
          name: 'The Fatty Bao',
          cuisine: 'Asian, Pan-Asian',
          rating: 4.2,
          priceRange: '$$$',
          location: 'Bandra, Mumbai',
          description: 'Modern Asian fusion restaurant with innovative dishes and creative presentation. Popular for their bao buns and cocktails.',
          distance: 4.1,
          deliveryTime: 45,
          isFavorite: false,
          matchScore: 0.88,
          tags: ['Asian', 'Fusion', 'Cocktails', 'Trendy']
        },
        {
          id: '3',
          name: 'Punjab Grill',
          cuisine: 'North Indian, Punjabi',
          rating: 4.7,
          priceRange: '$$',
          location: 'Powai, Mumbai',
          description: 'Traditional Punjabi cuisine with generous portions and authentic flavors. Specializes in tandoori dishes.',
          distance: 6.8,
          deliveryTime: 40,
          isFavorite: true,
          matchScore: 0.92,
          tags: ['Punjabi', 'Tandoori', 'Generous Portions', 'Authentic']
        },
        {
          id: '4',
          name: 'Olive Bar & Kitchen',
          cuisine: 'Mediterranean, European',
          rating: 4.3,
          priceRange: '$$$',
          location: 'Colaba, Mumbai',
          description: 'Elegant Mediterranean restaurant with a sophisticated atmosphere and innovative European dishes.',
          distance: 8.2,
          deliveryTime: 50,
          isFavorite: false,
          matchScore: 0.85,
          tags: ['Mediterranean', 'Fine Dining', 'Romantic', 'Cocktails']
        },
        {
          id: '5',
          name: 'Swati Snacks',
          cuisine: 'Indian, Street Food',
          rating: 4.1,
          priceRange: '$',
          location: 'Multiple Locations',
          description: 'Popular Indian street food chain serving authentic snacks and quick meals at affordable prices.',
          distance: 3.5,
          deliveryTime: 25,
          isFavorite: true,
          matchScore: 0.78,
          tags: ['Street Food', 'Affordable', 'Quick Service', 'Indian']
        }
      ]

      setRestaurants(mockRestaurants)
      setIsLoading(false)
    }

    loadRestaurants()
  }, [user, router])

  const handleSearch = (query: string, searchFilters: SearchFilters) => {
    setIsLoading(true)
    
    // Filter restaurants based on search criteria
    let filtered = restaurants.filter(restaurant => {
      // Text search
      const matchesQuery = !query || 
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      // Cuisine filter
      const matchesCuisine = searchFilters.cuisine === 'All' || 
        restaurant.cuisine.toLowerCase().includes(searchFilters.cuisine.toLowerCase())

      // Rating filter
      const matchesRating = restaurant.rating >= searchFilters.minRating && 
        restaurant.rating <= searchFilters.maxRating

      // Price filter
      const matchesPrice = searchFilters.priceRange === '$' || 
        searchFilters.priceRange === '$$' || 
        searchFilters.priceRange === restaurant.priceRange

      // Distance filter
      const matchesDistance = restaurant.distance === undefined || 
        restaurant.distance <= searchFilters.distance

      // Dietary filter (simplified for demo)
      const matchesDietary = searchFilters.dietary.length === 0 || 
        restaurant.tags.some(tag => searchFilters.dietary.includes(tag))

      return matchesQuery && matchesCuisine && matchesRating && matchesPrice && matchesDistance && matchesDietary
    })

    // Sort results
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return (a.distance || 999) - (b.distance || 999)
        case 'price':
          return a.priceRange.length - b.priceRange.length
        case 'delivery-time':
          return (a.deliveryTime || 999) - (b.deliveryTime || 999)
        default: // Best Match
          return (b.matchScore || 0) - (a.matchScore || 0)
      }
    })

    setTimeout(() => {
      setRestaurants(filtered)
      setIsLoading(false)
    }, 500)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    // Trigger search with current query
    handleSearch(filters.query, newFilters)
  }

  const toggleFavorite = (restaurantId: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === restaurantId 
        ? { ...restaurant, isFavorite: !restaurant.isFavorite }
        : restaurant
    ))
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-blue-600">Loading search...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Search className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Enhanced Restaurant Search
              </h1>
              <p className="text-gray-600">
                Find your perfect dining experience
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className={`p-2 rounded-lg border ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  className={`p-2 rounded-lg border ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <SearchEnhanced
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {restaurants.length} Restaurants Found
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Sorted by: {filters.sortBy}
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  {filters.query && ` "${filters.query}"`}
                </span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Searching restaurants...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Results Grid/List */}
                {restaurants.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria or filters
                    </p>
                    <button
                      onClick={() => {
                        const resetFilters = {
                          query: '',
                          cuisine: 'All',
                          priceRange: '$$',
                          minRating: 1,
                          maxRating: 5,
                          dietary: [],
                          distance: 10,
                          sortBy: 'Best Match'
                        }
                        setFilters(resetFilters)
                        handleSearch('', resetFilters)
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className={viewMode === 'list' ? 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow' : ''}
                      >
                        {viewMode === 'grid' ? (
                          <RestaurantSimpleCard
                            restaurant={{
                              id: restaurant.id,
                              name: restaurant.name,
                              cuisine: restaurant.cuisine,
                              rating: restaurant.rating,
                              location: restaurant.location,
                              description: restaurant.description,
                              matchScore: restaurant.matchScore
                            }}
                            onFavoriteToggle={toggleFavorite}
                          />
                        ) : (
                          /* List View */
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {restaurant.name}
                                  </h3>
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="flex items-center">
                                      {getRatingStars(restaurant.rating)}
                                      <span className="ml-2 text-lg font-semibold text-gray-700">
                                        {restaurant.rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                      {restaurant.cuisine}
                                    </span>
                                    {restaurant.matchScore && (
                                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                        {Math.round(restaurant.matchScore * 100)}% match
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {restaurant.description}
                                  </p>
                                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {restaurant.location}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {restaurant.deliveryTime} min
                                    </div>
                                    <div className="flex items-center">
                                      <span className="mr-1">$</span>
                                      {restaurant.priceRange}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => toggleFavorite(restaurant.id)}
                                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                                      restaurant.isFavorite ? 'text-red-500' : 'text-gray-400'
                                    }`}
                                  >
                                    <Heart className={`h-5 w-5 ${restaurant.isFavorite ? 'fill-current' : ''}`} />
                                  </button>
                                  <button className="p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600">
                                    <ArrowRight className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
