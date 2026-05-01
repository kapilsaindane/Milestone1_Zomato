'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  MapPin,
  Star,
  Clock,
  DollarSign,
  X
} from 'lucide-react'
import { RatingFilter } from './rating-filter'

interface SearchEnhancedProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onFiltersChange: (filters: SearchFilters) => void
  className?: string
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

const cuisineOptions = [
  'All', 'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 
  'Thai', 'American', 'Mediterranean', 'French', 'Korean'
]

const priceRanges = ['$', '$$', '$$$', '$$$$']
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher']
const sortOptions = ['Best Match', 'Rating', 'Distance', 'Delivery Time', 'Price']

export function SearchEnhanced({ 
  onSearch, 
  onFiltersChange, 
  className = '' 
}: SearchEnhancedProps) {
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

  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery, filters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      cuisine: 'All',
      priceRange: '$$',
      minRating: 1,
      maxRating: 5,
      dietary: [],
      distance: 10,
      sortBy: 'Best Match'
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const toggleDietary = (diet: string) => {
    const newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet]
    
    handleFilterChange('dietary', newDietary)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
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
            <button
              type="submit"
              className="absolute right-1 top-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Filters</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search Query</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
                <button
                  key={price}
                  type="button"
                  onClick={() => handleFilterChange('priceRange', price)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.priceRange === price
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              <RatingFilter
                onRatingChange={(rating) => {
                  handleFilterChange('minRating', rating)
                }}
                selectedRating={filters.minRating}
              />
            </label>
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

          {/* Dietary Preferences */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDietary(diet)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.dietary.includes(diet)
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {filters.dietary.length > 0 && (
              <span>
                {filters.dietary.length} dietary filter{filters.dietary.length > 1 ? 's' : ''} applied
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters, query: searchQuery }
                onFiltersChange(newFilters)
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
