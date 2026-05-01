'use client'

import React from 'react'
import { 
  MapPin, 
  Star, 
  Clock, 
  Heart, 
  TrendingUp,
  Users,
  Target
} from 'lucide-react'

interface SimpleCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  className?: string
}

export function SimpleCard({ title, value, icon, trend, className }: SimpleCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          {icon}
          {trend && (
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface RestaurantSimpleCardProps {
  restaurant: {
    id: string
    name: string
    cuisine: string
    rating: number
    location: string
    description: string
    matchScore?: number
  }
  onClick?: (restaurant: any) => void
}

export function RestaurantSimpleCard({ restaurant, onClick }: RestaurantSimpleCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => onClick?.(restaurant)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-4 mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {restaurant.cuisine}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 space-x-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {restaurant.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          {restaurant.matchScore && (
            <div className="text-right">
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                {Math.round(restaurant.matchScore * 100)}% match
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
          <div className="flex items-center space-x-4">
            <MapPin className="h-4 w-4 mr-1" />
            {restaurant.location}
          </div>
          <button
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation()
              // Handle favorite toggle
            }}
          >
            <Heart className="h-4 w-4 mr-1" />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
