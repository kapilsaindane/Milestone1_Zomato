// Hugging Face API service for restaurant data

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  price: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  features?: string[];
}

export interface HuggingFaceResponse {
  data: Restaurant[];
  total: number;
  page: number;
  pageSize: number;
}

class HuggingFaceService {
  private baseUrl = 'https://huggingface.co/api';
  
  // Using a public restaurant dataset or creating mock data that simulates Hugging Face API
  async getRestaurants(page = 1, pageSize = 20, filters?: {
    cuisine?: string;
    minRating?: number;
    maxDistance?: number;
    priceRange?: string;
    searchQuery?: string;
  }): Promise<HuggingFaceResponse> {
    try {
      // For now, we'll use a mock dataset that simulates Hugging Face data
      // In production, you would replace this with actual Hugging Face API calls
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'The Garden Bistro',
          cuisine: 'Italian',
          rating: 4.5,
          reviews: 234,
          distance: '0.8 km',
          deliveryTime: '25-35 min',
          price: '$$',
          address: '123 Main St, New York, NY',
          phone: '(555) 123-4567',
          website: 'www.gardenbistro.com',
          description: 'Authentic Italian cuisine with a modern twist',
          features: ['Outdoor Seating', 'Delivery', 'Takeout', 'Vegetarian Options']
        },
        {
          id: '2',
          name: 'Sushi Master',
          cuisine: 'Japanese',
          rating: 4.8,
          reviews: 189,
          distance: '1.2 km',
          deliveryTime: '30-40 min',
          price: '$$$',
          address: '456 Oak Ave, New York, NY',
          phone: '(555) 234-5678',
          website: 'www.sushimaster.com',
          description: 'Traditional and fusion sushi experience',
          features: ['Sushi Bar', 'Delivery', 'Private Dining', 'Sake Selection']
        },
        {
          id: '3',
          name: 'Burger Palace',
          cuisine: 'American',
          rating: 4.2,
          reviews: 412,
          distance: '0.5 km',
          deliveryTime: '20-30 min',
          price: '$',
          address: '789 Elm St, New York, NY',
          phone: '(555) 345-6789',
          website: 'www.burgerpalace.com',
          description: 'Gourmet burgers and classic American fare',
          features: ['Fast Food', 'Delivery', 'Kids Menu', 'Late Night']
        },
        {
          id: '4',
          name: 'Spice Garden',
          cuisine: 'Indian',
          rating: 4.6,
          reviews: 156,
          distance: '1.5 km',
          deliveryTime: '35-45 min',
          price: '$$',
          address: '321 Pine Rd, New York, NY',
          phone: '(555) 456-7890',
          website: 'www.spicegarden.com',
          description: 'Authentic Indian flavors from various regions',
          features: ['Vegetarian', 'Vegan Options', 'Delivery', 'Catering']
        },
        {
          id: '5',
          name: 'Le Petit Café',
          cuisine: 'French',
          rating: 4.7,
          reviews: 98,
          distance: '2.0 km',
          deliveryTime: '40-50 min',
          price: '$$$',
          address: '654 Maple Dr, New York, NY',
          phone: '(555) 567-8901',
          website: 'www.lepetitcafe.com',
          description: 'Cozy French bistro with authentic cuisine',
          features: ['Outdoor Seating', 'Wine Bar', 'Brunch', 'Romantic']
        },
        {
          id: '6',
          name: 'Taco Fiesta',
          cuisine: 'Mexican',
          rating: 4.3,
          reviews: 267,
          distance: '0.9 km',
          deliveryTime: '25-35 min',
          price: '$',
          address: '987 Cedar Ln, New York, NY',
          phone: '(555) 678-9012',
          website: 'www.tacofiesta.com',
          description: 'Authentic Mexican street food and cocktails',
          features: ['Delivery', 'Takeout', 'Late Night', 'Happy Hour']
        },
        {
          id: '7',
          name: 'Dragon Palace',
          cuisine: 'Chinese',
          rating: 4.4,
          reviews: 321,
          distance: '1.8 km',
          deliveryTime: '30-40 min',
          price: '$$',
          address: '147 Birch St, New York, NY',
          phone: '(555) 789-0123',
          website: 'www.dragonpalace.com',
          description: 'Traditional Chinese cuisine in modern setting',
          features: ['Family Style', 'Delivery', 'Banquet Room', 'Lunch Specials']
        },
        {
          id: '8',
          name: 'Greek Corner',
          cuisine: 'Greek',
          rating: 4.5,
          reviews: 143,
          distance: '2.2 km',
          deliveryTime: '35-45 min',
          price: '$$',
          address: '258 Willow Way, New York, NY',
          phone: '(555) 890-1234',
          website: 'www.greekcorner.com',
          description: 'Mediterranean flavors and Greek specialties',
          features: ['Outdoor Seating', 'Delivery', 'Catering', 'Live Music']
        }
      ];

      // Apply filters
      let filteredRestaurants = mockRestaurants;

      if (filters) {
        if (filters.cuisine && filters.cuisine !== 'All Cuisines') {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.cuisine.toLowerCase() === filters.cuisine!.toLowerCase()
          );
        }

        if (filters.minRating) {
          filteredRestaurants = filteredRestaurants.filter(r => r.rating >= filters.minRating!);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.name.toLowerCase().includes(query) ||
            r.cuisine.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query)
          );
        }

        if (filters.priceRange && filters.priceRange !== 'All Prices') {
          const priceMap: { [key: string]: string[] } = {
            '$': ['$'],
            '$$': ['$$'],
            '$$$': ['$$$'],
            '$$$$': ['$$$$']
          };
          filteredRestaurants = filteredRestaurants.filter(r => 
            priceMap[filters.priceRange!]?.includes(r.price)
          );
        }
      }

      // Pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

      return {
        data: paginatedRestaurants,
        total: filteredRestaurants.length,
        page,
        pageSize
      };

    } catch (error) {
      console.error('Error fetching restaurants from Hugging Face:', error);
      throw new Error('Failed to fetch restaurant data');
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const response = await this.getRestaurants();
      return response.data.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      return null;
    }
  }

  async searchRestaurants(query: string, filters?: any): Promise<HuggingFaceResponse> {
    return this.getRestaurants(1, 20, { ...filters, searchQuery: query });
  }
}

export const huggingFaceService = new HuggingFaceService();
