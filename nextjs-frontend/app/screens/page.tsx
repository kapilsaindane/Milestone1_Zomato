'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Image as ImageIcon,
  Upload,
  Grid3X3,
  Plus,
  X,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2
} from 'lucide-react'

interface ScreenImage {
  id: string
  name: string
  url: string
  description: string
  category: string
  uploadedAt: string
  size: number
  tags: string[]
}

export default function ScreensPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<ScreenImage | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock screen data
  const [screens, setScreens] = useState<ScreenImage[]>([
    {
      id: '1',
      name: 'Restaurant Hero Banner',
      url: '/api/placeholder/restaurant-hero.jpg',
      description: 'Modern restaurant banner with gradient overlay',
      category: 'banners',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      size: 2457600,
      tags: ['hero', 'banner', 'restaurant']
    },
    {
      id: '2',
      name: 'Food Photography',
      url: '/api/placeholder/food-photography.jpg',
      description: 'High-quality food photography for restaurant marketing',
      category: 'photography',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      size: 1843200,
      tags: ['food', 'photography', 'marketing']
    },
    {
      id: '3',
      name: 'UI Components',
      url: '/api/placeholder/ui-components.jpg',
      description: 'Modern UI components and design elements',
      category: 'ui',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      size: 1048576,
      tags: ['ui', 'components', 'design']
    },
    {
      id: '4',
      name: 'Logo Variations',
      url: '/api/placeholder/logo-variations.jpg',
      description: 'Different logo variations for branding',
      category: 'branding',
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      size: 2097152,
      tags: ['logo', 'branding', 'variations']
    }
  ])

  const categories = ['all', 'banners', 'photography', 'ui', 'branding']

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          const newImage: ScreenImage = {
            id: Date.now().toString(),
            name: file.name,
            url: result,
            description: `Uploaded image: ${file.name}`,
            category: 'uploads',
            uploadedAt: new Date().toISOString(),
            size: file.size,
            tags: ['upload', 'new']
          }
          setScreens([newImage, ...screens])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = (id: string) => {
    setScreens(screens.filter(screen => screen.id !== id))
    if (selectedImage?.id === id) {
      setSelectedImage(null)
    }
  }

  const filteredScreens = screens.filter(screen => {
    const matchesSearch = screen.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || screen.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = bytes / 1024
    const mb = k / 1024
    const gb = mb / 1024
    
    if (gb > 1) return `${gb.toFixed(2)} GB`
    if (mb > 1) return `${mb.toFixed(2)} MB`
    return `${k.toFixed(2)} KB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading screens...</p>
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
              <div className="flex items-center">
                <IconImage className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Screens & Media
                </h1>
              </div>
              <p className="text-gray-600">
                Manage your restaurant images and UI components
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Upload Button */}
              <label className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <button
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  Upload Image
                </button>
              </label>

              {/* Search */}
              <div className="relative">
                <IconImage className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search screens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 px-4 py-2"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

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
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Screen Library ({filteredScreens.length} images)
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              <Download className="h-4 w-4 mr-1" />
              Export All
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              <Copy className="h-4 w-4 mr-1" />
              Copy URL
            </button>
          </div>
        </div>

        {/* Screens Grid/List */}
        {filteredScreens.length === 0 ? (
          <div className="text-center py-16">
            <IconImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No screens found</h3>
            <p className="text-gray-600 mb-6">Upload your first image to get started</p>
            <button
              onClick={() => document.getElementById('image-upload')?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredScreens.map((screen) => (
              <div
                key={screen.id}
                className={`relative group cursor-pointer ${
                  viewMode === 'grid' ? '' : 'flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50'
                }`}
                onClick={() => setSelectedImage(screen)}
              >
                {/* Image Preview */}
                <div className={viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'}>
                  <img
                    src={screen.url}
                    alt={screen.name}
                    className={`w-full h-full object-cover rounded-lg ${
                      viewMode === 'grid' ? 'group-hover:scale-105' : ''
                    } transition-transform duration-300`}
                  />
                </div>

                {/* Image Info */}
                <div className={viewMode === 'grid' ? 'mt-4' : 'flex-1'}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {screen.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {screen.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(screen.size)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {screen.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {screen.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(screen.uploadedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(screen.url)
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle edit functionality
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteImage(screen.id)
                        }}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedImage?.id === screen.id && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-90 rounded-lg flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedImage.name}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {selectedImage.category}
                </span>
                <span className="text-sm text-gray-500">
                  {formatFileSize(selectedImage.size)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {selectedImage.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedImage.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Uploaded: {formatDate(selectedImage.uploadedAt)}
              </p>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.url)
                    setSelectedImage(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
