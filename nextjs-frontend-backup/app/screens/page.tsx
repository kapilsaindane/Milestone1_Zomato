'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
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
  Search,
  Filter
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
  const [selectedImage, setSelectedImage] = useState<ScreenImage | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Screen Management</h1>
          <p className="mt-2 text-gray-600">Manage your restaurant app screens and images</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search screens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScreens.map((screen) => (
            <div key={screen.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <ImageIcon className="h-12 w-12 text-gray-400 m-auto" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{screen.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{screen.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatFileSize(screen.size)}</span>
                  <span className="text-xs text-gray-500">{formatDate(screen.uploadedAt)}</span>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteImage(screen.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScreens.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 m-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No screens found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
