'use client'

import React, { useState } from 'react'
import { 
  Star, 
  Filter,
  ChevronDown,
  X
} from 'lucide-react'

interface RatingFilterProps {
  minRating: number
  maxRating: number
  onRatingChange: (minRating: number, maxRating: number) => void
  className?: string
}

export function RatingFilter({ 
  minRating, 
  maxRating, 
  onRatingChange, 
  className = '' 
}: RatingFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRatingChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      if (value <= maxRating) {
        onRatingChange(value, maxRating)
      }
    } else {
      if (value >= minRating) {
        onRatingChange(minRating, value)
      }
    }
  }

  const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    handleRatingChange('min', value)
  }

  const handleMaxRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    handleRatingChange('max', value)
  }

  const clearFilters = () => {
    onRatingChange(1, 5)
  }

  const renderStars = (rating: number) => {
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

  const getRatingLabel = (rating: number) => {
    if (rating === 1) return 'Poor'
    if (rating === 2) return 'Fair'
    if (rating === 3) return 'Good'
    if (rating === 4) return 'Very Good'
    if (rating === 5) return 'Excellent'
    return `${rating} Stars`
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium">
          Rating: {minRating}-{maxRating} {getRatingLabel(minRating)}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating Filter</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Rating Display */}
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {minRating}-{maxRating}
                </div>
                <div className="flex justify-center space-x-1">
                  {renderStars(minRating)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {getRatingLabel(minRating)}
                </div>
              </div>
            </div>

            {/* Min Rating Slider */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={handleMinRatingChange}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-600 w-12">
                    {minRating} {getRatingLabel(minRating)}
                  </span>
                </div>
              </div>

              {/* Max Rating Slider */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maximum Rating</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={maxRating}
                      onChange={handleMaxRatingChange}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {maxRating} {getRatingLabel(maxRating)}
                    </span>
                  </div>
                </div>
              </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
