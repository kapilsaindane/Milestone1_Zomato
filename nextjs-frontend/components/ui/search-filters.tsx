'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react'

interface SearchFiltersProps {
  onFiltersChange: (filters: FiltersState) => void
  onSearch: (query: string) => void
  initialFilters?: Partial<FiltersState>
}

interface FiltersState {
  cuisine: string
  priceRange: string
  rating: number
  distance: number
  deliveryTime: number
  dietary: string[]
  sortBy: string
}

const cuisineOptions = [
  'All', 'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 
  'Thai', 'American', 'Mediterranean', 'French', 'Korean'
]

const priceRanges = ['$', '$$', '$$$', '$$$$']
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher']
const sortOptions = ['Best Match', 'Rating', 'Distance', 'Delivery Time', 'Price']

export function SearchFilters({ 
  onFiltersChange, 
  onSearch,
  initialFilters = {}
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    cuisine: initialFilters.cuisine || 'All',
    priceRange: initialFilters.priceRange || '$$',
    rating: initialFilters.rating || 3,
    distance: initialFilters.distance || 10,
    deliveryTime: initialFilters.deliveryTime || 60,
    dietary: initialFilters.dietary || [],
    sortBy: initialFilters.sortBy || 'Best Match'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const toggleDietary = (diet: string) => {
    const newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet]
    
    handleFilterChange('dietary', newDietary)
  }

  const clearFilters = () => {
    const defaultFilters = {
      cuisine: 'All',
      priceRange: '$$',
      rating: 3,
      distance: 10,
      deliveryTime: 60,
      dietary: [],
      sortBy: 'Best Match'
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1"
              >
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Quick Filters
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Simple' : 'Advanced'}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cuisine */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {cuisineOptions.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex space-x-2">
                {priceRanges.map(price => (
                  <Button
                    key={price}
                    variant={filters.priceRange === price ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('priceRange', price)}
                  >
                    {price}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Minimum Rating: {filters.rating}+ Stars
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                <MapPin className="inline h-4 w-4 mr-1" />
                Distance: {filters.distance}km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Delivery Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                <Clock className="inline h-4 w-4 mr-1" />
                Max Delivery: {filters.deliveryTime}min
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={filters.deliveryTime}
                onChange={(e) => handleFilterChange('deliveryTime', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <h3 className="font-medium text-gray-900 mb-4">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(diet => (
                  <Button
                    key={diet}
                    variant={filters.dietary.includes(diet) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDietary(diet)}
                  >
                    {diet}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">
              {filters.dietary.length > 0 && (
                <span>
                  {filters.dietary.length} dietary filter{filters.dietary.length > 1 ? 's' : ''} applied
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
