'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthLayoutEnhanced({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Panel - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Right Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-b from-purple-600 to-blue-800 p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-8">
              <div className="text-3xl font-bold text-blue-600">
                🍽
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI Restaurant Recommender
            </h2>
            <p className="text-blue-100 mb-8">
              Discover your perfect dining experience with personalized recommendations
            </p>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm">Smart Recommendations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm">Social Features</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm">Real-time Updates</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm">Advanced Personalization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
