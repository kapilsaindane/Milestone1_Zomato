// Collaborative Filtering Engine for Phase 7
// Implements user-based and item-based collaborative filtering

export interface UserRating {
  userId: string
  restaurantId: string
  rating: number
  timestamp: string
}

export interface UserSimilarity {
  userId: string
  similarity: number
}

export interface RestaurantSimilarity {
  restaurantId: string
  similarity: number
}

export interface Recommendation {
  restaurantId: string
  predictedRating: number
  confidence: number
  reasoning: string
}

export class CollaborativeFilteringEngine {
  private userRatings: Map<string, UserRating[]> = new Map()
  private restaurantRatings: Map<string, UserRating[]> = new Map()
  
  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Mock user ratings data - in production, this would come from database
    const mockRatings: UserRating[] = [
      { userId: 'user_1', restaurantId: 'rest_1', rating: 5, timestamp: new Date().toISOString() },
      { userId: 'user_1', restaurantId: 'rest_2', rating: 4, timestamp: new Date().toISOString() },
      { userId: 'user_1', restaurantId: 'rest_3', rating: 3, timestamp: new Date().toISOString() },
      { userId: 'user_2', restaurantId: 'rest_1', rating: 4, timestamp: new Date().toISOString() },
      { userId: 'user_2', restaurantId: 'rest_2', rating: 5, timestamp: new Date().toISOString() },
      { userId: 'user_2', restaurantId: 'rest_4', rating: 4, timestamp: new Date().toISOString() },
      { userId: 'user_3', restaurantId: 'rest_3', rating: 5, timestamp: new Date().toISOString() },
      { userId: 'user_3', restaurantId: 'rest_4', rating: 3, timestamp: new Date().toISOString() },
      { userId: 'user_3', restaurantId: 'rest_5', rating: 4, timestamp: new Date().toISOString() },
    ]

    // Organize ratings by user and restaurant
    mockRatings.forEach(rating => {
      // By user
      if (!this.userRatings.has(rating.userId)) {
        this.userRatings.set(rating.userId, [])
      }
      this.userRatings.get(rating.userId)!.push(rating)

      // By restaurant
      if (!this.restaurantRatings.has(rating.restaurantId)) {
        this.restaurantRatings.set(rating.restaurantId, [])
      }
      this.restaurantRatings.get(rating.restaurantId)!.push(rating)
    })
  }

  // User-based collaborative filtering
  async getUserBasedRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    const userRatings = this.userRatings.get(userId) || []
    const similarUsers = this.findSimilarUsers(userId, 10)
    
    const recommendations: Map<string, { score: number; count: number }> = new Map()
    
    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserRatings = this.userRatings.get(similarUserId) || []
      
      similarUserRatings.forEach(rating => {
        // Skip if user already rated this restaurant
        if (userRatings.some(ur => ur.restaurantId === rating.restaurantId)) {
          return
        }
        
        const current = recommendations.get(rating.restaurantId) || { score: 0, count: 0 }
        recommendations.set(rating.restaurantId, {
          score: current.score + similarity * rating.rating,
          count: current.count + 1
        })
      })
    })
    
    // Convert to recommendations and sort
    const result: Recommendation[] = []
    recommendations.forEach((value, restaurantId) => {
      const predictedRating = value.score / value.count
      result.push({
        restaurantId,
        predictedRating,
        confidence: Math.min(value.count / 5, 1), // Confidence based on number of similar users
        reasoning: `Recommended by ${value.count} similar users with predicted rating ${predictedRating.toFixed(1)}`
      })
    })
    
    return result.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, limit)
  }

  // Item-based collaborative filtering
  async getItemBasedRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    const userRatings = this.userRatings.get(userId) || []
    const recommendations: Map<string, { score: number; count: number }> = new Map()
    
    userRatings.forEach(userRating => {
      const similarRestaurants = this.findSimilarRestaurants(userRating.restaurantId, 5)
      
      similarRestaurants.forEach(({ restaurantId: similarRestId, similarity }) => {
        // Skip if user already rated this restaurant
        if (userRatings.some(ur => ur.restaurantId === similarRestId)) {
          return
        }
        
        const current = recommendations.get(similarRestId) || { score: 0, count: 0 }
        recommendations.set(similarRestId, {
          score: current.score + similarity * userRating.rating,
          count: current.count + 1
        })
      })
    })
    
    // Convert to recommendations and sort
    const result: Recommendation[] = []
    recommendations.forEach((value, restaurantId) => {
      const predictedRating = value.score / value.count
      result.push({
        restaurantId,
        predictedRating,
        confidence: Math.min(value.count / 3, 1), // Confidence based on number of similar restaurants
        reasoning: `Similar to restaurants you rated ${userRatings.find(ur => ur.rating >= 4)?.rating || 'highly'}`
      })
    })
    
    return result.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, limit)
  }

  // Hybrid approach combining user-based and item-based
  async getHybridRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    const [userBased, itemBased] = await Promise.all([
      this.getUserBasedRecommendations(userId, limit * 2),
      this.getItemBasedRecommendations(userId, limit * 2)
    ])
    
    // Combine and weight recommendations
    const combined: Map<string, Recommendation> = new Map()
    
    userBased.forEach(rec => {
      combined.set(rec.restaurantId, {
        ...rec,
        predictedRating: rec.predictedRating * 0.6, // Weight user-based higher
        confidence: rec.confidence * 0.6,
        reasoning: rec.reasoning + ' (User-based)'
      })
    })
    
    itemBased.forEach(rec => {
      const existing = combined.get(rec.restaurantId)
      if (existing) {
        // Average the two approaches
        combined.set(rec.restaurantId, {
          ...existing,
          predictedRating: (existing.predictedRating + rec.predictedRating * 0.4) / 2,
          confidence: Math.max(existing.confidence, rec.confidence * 0.4),
          reasoning: existing.reasoning + ' + ' + rec.reasoning + ' (Item-based)'
        })
      } else {
        combined.set(rec.restaurantId, {
          ...rec,
          predictedRating: rec.predictedRating * 0.4,
          confidence: rec.confidence * 0.4,
          reasoning: rec.reasoning + ' (Item-based)'
        })
      }
    })
    
    return Array.from(combined.values())
      .sort((a, b) => b.predictedRating - a.predictedRating)
      .slice(0, limit)
  }

  // Find similar users using cosine similarity
  private findSimilarUsers(userId: string, limit: number): UserSimilarity[] {
    const userRatings = this.userRatings.get(userId) || []
    const similarities: UserSimilarity[] = []
    
    this.userRatings.forEach((ratings, otherUserId) => {
      if (otherUserId === userId) return
      
      const similarity = this.calculateUserSimilarity(userRatings, ratings)
      if (similarity > 0) {
        similarities.push({ userId: otherUserId, similarity })
      }
    })
    
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, limit)
  }

  // Find similar restaurants using cosine similarity
  private findSimilarRestaurants(restaurantId: string, limit: number): RestaurantSimilarity[] {
    const restaurantRatings = this.restaurantRatings.get(restaurantId) || []
    const similarities: RestaurantSimilarity[] = []
    
    this.restaurantRatings.forEach((ratings, otherRestaurantId) => {
      if (otherRestaurantId === restaurantId) return
      
      const similarity = this.calculateRestaurantSimilarity(restaurantRatings, ratings)
      if (similarity > 0) {
        similarities.push({ restaurantId: otherRestaurantId, similarity })
      }
    })
    
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, limit)
  }

  // Calculate cosine similarity between two users
  private calculateUserSimilarity(user1Ratings: UserRating[], user2Ratings: UserRating[]): number {
    const user1Map = new Map(user1Ratings.map(r => [r.restaurantId, r.rating]))
    const user2Map = new Map(user2Ratings.map(r => [r.restaurantId, r.rating]))
    
    // Find common restaurants
    const commonRestaurants = Array.from(user1Map.keys()).filter(rid => user2Map.has(rid))
    
    if (commonRestaurants.length === 0) return 0
    
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0
    
    commonRestaurants.forEach(restaurantId => {
      const rating1 = user1Map.get(restaurantId)!
      const rating2 = user2Map.get(restaurantId)!
      
      dotProduct += rating1 * rating2
      norm1 += rating1 * rating1
      norm2 += rating2 * rating2
    })
    
    if (norm1 === 0 || norm2 === 0) return 0
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  // Calculate cosine similarity between two restaurants
  private calculateRestaurantSimilarity(rest1Ratings: UserRating[], rest2Ratings: UserRating[]): number {
    const rest1Map = new Map(rest1Ratings.map(r => [r.userId, r.rating]))
    const rest2Map = new Map(rest2Ratings.map(r => [r.userId, r.rating]))
    
    // Find common users
    const commonUsers = Array.from(rest1Map.keys()).filter(uid => rest2Map.has(uid))
    
    if (commonUsers.length === 0) return 0
    
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0
    
    commonUsers.forEach(userId => {
      const rating1 = rest1Map.get(userId)!
      const rating2 = rest2Map.get(userId)!
      
      dotProduct += rating1 * rating2
      norm1 += rating1 * rating1
      norm2 += rating2 * rating2
    })
    
    if (norm1 === 0 || norm2 === 0) return 0
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  // Add a new rating
  addRating(rating: UserRating): void {
    // Add to user ratings
    if (!this.userRatings.has(rating.userId)) {
      this.userRatings.set(rating.userId, [])
    }
    this.userRatings.get(rating.userId)!.push(rating)

    // Add to restaurant ratings
    if (!this.restaurantRatings.has(rating.restaurantId)) {
      this.restaurantRatings.set(rating.restaurantId, [])
    }
    this.restaurantRatings.get(rating.restaurantId)!.push(rating)
  }

  // Get user's rating history
  getUserRatingHistory(userId: string): UserRating[] {
    return this.userRatings.get(userId) || []
  }

  // Get restaurant's rating history
  getRestaurantRatingHistory(restaurantId: string): UserRating[] {
    return this.restaurantRatings.get(restaurantId) || []
  }
}
