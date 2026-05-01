'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Clock, 
  Heart, 
  Share2,
  ExternalLink,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  location: string
  description: string
  image?: string
  tags: string[]
  distance?: number
  deliveryTime?: number
  isFavorite?: boolean
  matchScore?: number
}

interface RestaurantCardProps {
  restaurant: Restaurant
  onFavoriteToggle?: (id: string) => void
  onShare?: (restaurant: Restaurant) => void
  showMatchScore?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function RestaurantCard({ 
  restaurant, 
  onFavoriteToggle, 
  onShare,
  showMatchScore = false,
  variant = 'default'
}: RestaurantCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onFavoriteToggle?.(restaurant.id)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onShare?.(restaurant)
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < fullStars 
            ? 'text-yellow-400 fill-current' 
            : i === fullStars && hasHalfStar 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
        }`}
      />
    ))
  }

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
        <Link href={`/restaurants/${restaurant.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {getRatingStars(restaurant.rating)}
                    <span className="ml-1 text-sm text-gray-600">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.cuisine}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {restaurant.priceRange}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="ml-2"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    restaurant.isFavorite 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400'
                  }`}
                />
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <div className="relative">
        {/* Restaurant Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400">
                <MapPin className="h-12 w-12" />
              </div>
            </div>
          )}
          
          {/* Match Score Badge */}
          {showMatchScore && restaurant.matchScore && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-green-500 text-white">
                {Math.round(restaurant.matchScore * 100)}% match
              </Badge>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 left-2 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFavoriteClick}
              className="bg-white/90 hover:bg-white"
            >
              <Heart 
                className={`h-4 w-4 ${
                  restaurant.isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShareClick}
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <Link href={`/restaurants/${restaurant.id}`}>
          <CardContent className="p-6">
            {/* Restaurant Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {getRatingStars(restaurant.rating)}
                      <span className="ml-2 text-lg font-semibold text-gray-700">
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {restaurant.cuisine}
                    </Badge>
                  </div>
                  {restaurant.distance && (
                    <div className="text-sm text-gray-600">
                      {restaurant.distance < 1 
                        ? `${Math.round(restaurant.distance * 1000)}m`
                        : `${restaurant.distance}km`
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {restaurant.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {restaurant.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2">
                {restaurant.description}
              </p>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {restaurant.priceRange}
                  </div>
                  {restaurant.deliveryTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {restaurant.deliveryTime} min
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Link>
      </div>
    </Card>
  )
}
