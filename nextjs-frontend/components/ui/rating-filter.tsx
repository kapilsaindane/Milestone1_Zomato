'use client'

import React, { useState } from 'react'
import { Star, ChevronDown } from 'lucide-react'

interface RatingFilterProps {
  onRatingChange: (rating: number | null) => void
  selectedRating: number | null
}

export function RatingFilter({ onRatingChange, selectedRating }: RatingFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRatingChange = (rating: number | null) => {
    onRatingChange(rating)
    setIsOpen(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingLabel = (rating: number) => {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    return labels[rating] || ''
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="flex items-center gap-1">
          {selectedRating ? renderStars(selectedRating) : <Star className="h-4 w-4 text-gray-400" />}
        </span>
        <span className="text-gray-700">
          {selectedRating ? `${selectedRating}+ Stars` : 'Any Rating'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-2">
            <button
              onClick={() => handleRatingChange(null)}
              className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 ${
                selectedRating === null ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Any Rating
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 flex items-center gap-2 ${
                  selectedRating === rating ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="flex items-center gap-1">
                  {renderStars(rating)}
                </span>
                <span>{rating}+ Stars</span>
                <span className="text-xs text-gray-500">({getRatingLabel(rating)})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
