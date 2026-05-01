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
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">
          {minRating === 0 && maxRating === 5 
            ? 'All Ratings' 
            : `${getRatingLabel(minRating)} - ${getRatingLabel(maxRating)}`
          }
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Rating Filter</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Minimum Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(minRating)}
                <span className="text-sm text-gray-600">{getRatingLabel(minRating)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={(e) => handleRatingChange('min', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            {/* Maximum Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Rating
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(maxRating)}
                <span className="text-sm text-gray-600">{getRatingLabel(maxRating)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={maxRating}
                onChange={(e) => handleRatingChange('max', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            {/* Quick Filters */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Quick Filters</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onRatingChange(0, 5)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  All Ratings
                </button>
                <button
                  onClick={() => onRatingChange(4, 5)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  4+ Stars
                </button>
                <button
                  onClick={() => onRatingChange(3, 5)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  3+ Stars
                </button>
                <button
                  onClick={() => onRatingChange(2, 5)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  2+ Stars
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
