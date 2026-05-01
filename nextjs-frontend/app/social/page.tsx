'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Star,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react'

interface SocialReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  restaurantId: string
  restaurantName: string
  rating: number
  review: string
  images?: string[]
  likes: number
  comments: Comment[]
  timestamp: string
  isLiked: boolean
  isBookmarked: boolean
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  timestamp: string
}

interface Friend {
  id: string
  name: string
  avatar?: string
  mutualFriends: number
  isFollowing: boolean
}

export default function SocialPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'reviews'>('feed')
  const [reviews, setReviews] = useState<SocialReview[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [newReview, setNewReview] = useState('')
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedRestaurant, setSelectedRestaurant] = useState('')

  useEffect(() => {
    // Load mock social data
    const mockReviews: SocialReview[] = [
      {
        id: '1',
        userId: 'user_2',
        userName: 'Sarah Chen',
        userAvatar: '/avatars/sarah.jpg',
        restaurantId: 'rest_1',
        restaurantName: 'Ruh',
        rating: 5,
        review: 'Amazing North Indian cuisine! The butter chicken was to die for and the ambiance was perfect for a family dinner. Highly recommend the dal makhani.',
        likes: 23,
        comments: [
          {
            id: 'c1',
            userId: 'user_3',
            userName: 'Mike Johnson',
            text: 'Totally agree! Their lunch buffet is amazing too.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isBookmarked: false
      },
      {
        id: '2',
        userId: 'user_3',
        userName: 'Mike Johnson',
        userAvatar: '/avatars/mike.jpg',
        restaurantId: 'rest_2',
        restaurantName: 'The Fatty Bao',
        rating: 4,
        review: 'Great Asian fusion restaurant. The bao buns are incredible and the cocktails are creative. A bit pricey but worth it for special occasions.',
        likes: 15,
        comments: [],
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isLiked: true,
        isBookmarked: false
      }
    ]

    const mockFriends: Friend[] = [
      {
        id: 'friend_1',
        name: 'Alex Thompson',
        avatar: '/avatars/alex.jpg',
        mutualFriends: 12,
        isFollowing: true
      },
      {
        id: 'friend_2',
        name: 'Emma Wilson',
        avatar: '/avatars/emma.jpg',
        mutualFriends: 8,
        isFollowing: false
      },
      {
        id: 'friend_3',
        name: 'David Lee',
        avatar: '/avatars/david.jpg',
        mutualFriends: 15,
        isFollowing: true
      }
    ]

    setReviews(mockReviews)
    setFriends(mockFriends)
  }, [])

  const handleLike = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            isLiked: !review.isLiked 
          }
        : review
    ))
  }

  const handleBookmark = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isBookmarked: !review.isBookmarked }
        : review
    ))
  }

  const handleFollow = (friendId: string) => {
    setFriends(prev => prev.map(friend => 
      friend.id === friendId 
        ? { ...friend, isFollowing: !friend.isFollowing }
        : friend
    ))
  }

  const handleSubmitReview = () => {
    if (!newReview.trim() || selectedRating === 0 || !selectedRestaurant) return

    const review: SocialReview = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || 'Anonymous',
      restaurantId: 'new_rest',
      restaurantName: selectedRestaurant,
      rating: selectedRating,
      review: newReview,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      isLiked: false,
      isBookmarked: false
    }

    setReviews(prev => [review, ...prev])
    setNewReview('')
    setSelectedRating(0)
    setSelectedRestaurant('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Dining</h1>
          <p className="text-gray-600 mt-1">Connect with food lovers and share experiences</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant={activeTab === 'feed' ? 'default' : 'outline'}
            onClick={() => setActiveTab('feed')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Feed
          </Button>
          <Button
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
          >
            <Users className="h-4 w-4 mr-2" />
            Friends
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reviews')}
          >
            <Star className="h-4 w-4 mr-2" />
            My Reviews
          </Button>
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Review */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>Write a review about a restaurant you visited</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant Name</Label>
                <Input
                  id="restaurant"
                  placeholder="Enter restaurant name"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  placeholder="Share your dining experience..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button onClick={handleSubmitReview} disabled={!newReview.trim() || selectedRating === 0}>
                Post Review
              </Button>
            </CardContent>
          </Card>

          {/* Social Feed */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback>{review.userName[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.restaurantName}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-gray-700">{review.review}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(review.id)}
                          className={review.isLiked ? 'text-red-600' : ''}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${review.isLiked ? 'fill-current' : ''}`} />
                          {review.likes}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {review.comments.length}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(review.id)}
                          className={review.isBookmarked ? 'text-blue-600' : ''}
                        >
                          <Bookmark className={`h-4 w-4 ${review.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      {review.comments.length > 0 && (
                        <div className="mt-4 space-y-2 border-t pt-4">
                          {review.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-semibold">{comment.userName}</span>{' '}
                                  <span className="text-gray-700">{comment.text}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Food Friends</h2>
            <Badge variant="secondary">{friends.length} friends</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-sm text-gray-600">{friend.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    
                    <Button
                      variant={friend.isFollowing ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleFollow(friend.id)}
                    >
                      {friend.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Reviews</h2>
            <Badge variant="secondary">
              {reviews.filter(r => r.userId === user?.id).length} reviews
            </Badge>
          </div>
          
          {reviews.filter(r => r.userId === user?.id).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Start sharing your dining experiences!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.filter(r => r.userId === user?.id).map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{review.restaurantName}</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
