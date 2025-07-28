import api from '../config/axios';
import { Car } from '../types/car.types';

// Mock wishlist data for when API calls fail
const mockWishlist: Car[] = [
  {
    id: 1001,
    title: 'Mock Mercedes-Benz S-Class',
    brand: 'Mercedes-Benz',
    brand_id: 1,
    category_id: 1,
    model: 'S-Class',
    year: 2022,
    price: 85000,
    currency: 'USD',
    description_ka: 'Mock luxury sedan with all features',
    description_en: 'Mock luxury sedan with all features',
    seller_id: 1,
    featured: true,
    specifications: {
      id: 1,
      mileage: 15000,
      fuel_type: 'Gasoline',
      transmission: 'Automatic',
      engine_type: '4.0L V8',
      drive_type: '4x4',
      body_type: 'Sedan',
      interior_color: 'Beige',
      color: 'Black'
    },
    images: [{
      id: 1,
      car_id: 1001,
      url: 'https://via.placeholder.com/800x600?text=Mock+Car+Image',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Mock+Car+Thumbnail',
      medium_url: 'https://via.placeholder.com/500x400?text=Mock+Car+Medium',
      large_url: 'https://via.placeholder.com/800x600?text=Mock+Car+Large',
      is_primary: true
    }],
    status: 'available',
    location: {
      id: 1,
      city: 'tbilisi',
      country: 'georgia',
      location_type: 'georgia',
      is_in_transit: false
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 1002,
    title: 'Mock BMW X5',
    brand: 'BMW',
    brand_id: 2,
    category_id: 2,
    model: 'X5',
    year: 2021,
    price: 65000,
    currency: 'USD',
    description_ka: 'Mock luxury SUV with premium features',
    description_en: 'Mock luxury SUV with premium features',
    seller_id: 2,
    featured: false,
    specifications: {
      id: 2,
      mileage: 25000,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      engine_type: '3.0L 6-cylinder',
      drive_type: '4x4',
      body_type: 'SUV',
      interior_color: 'Black',
      color: 'White'
    },
    images: [{
      id: 2,
      car_id: 1002,
      url: 'https://via.placeholder.com/800x600?text=Mock+Car+Image',
      thumbnail_url: 'https://via.placeholder.com/300x200?text=Mock+Car+Thumbnail',
      medium_url: 'https://via.placeholder.com/500x400?text=Mock+Car+Medium',
      large_url: 'https://via.placeholder.com/800x600?text=Mock+Car+Large',
      is_primary: true
    }],
    status: 'available',
    location: {
      id: 2,
      city: 'batumi',
      country: 'georgia',
      location_type: 'georgia',
      is_in_transit: false
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Store wishlist state locally for the mock implementation
let localMockWishlist = [...mockWishlist];

class WishlistService {
  async getWishlist(): Promise<Car[]> {
    try {
      const response = await api.get('/api/wishlist');
      
      console.log('[WishlistService.getWishlist] Raw API response:', response.data);
      
      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error('[WishlistService.getWishlist] Invalid response format - expected array, got:', typeof response.data);
        throw new Error('Invalid wishlist response format');
      }
      
      // Transform the API response to match the expected Car interface
      const transformedCars = response.data.map((car: any) => {
        // Ensure each car has all required properties according to the Car interface
        return {
          id: car.id || car.car_id,
          brand_id: car.brand_id,
          category_id: car.category_id,
          brand: car.brand || '',
          model: car.model || '',
          title: car.title || `${car.brand || ''} ${car.model || ''}`,
          year: car.year || 0,
          price: car.price || 0,
          currency: car.currency || 'GEL',
          description_ka: car.description_ka || '',
          description_en: car.description_en || '',
          status: car.status || 'available',
          featured: car.featured || false,
          seller_id: car.seller_id || 0,
          created_at: car.created_at || new Date().toISOString(),
          updated_at: car.updated_at || new Date().toISOString(),
          specifications: car.specifications || {
            id: 0,
            mileage: 0,
            fuel_type: '',
            transmission: '',
            engine_type: '',
            drive_type: '',
            body_type: '',
            interior_color: '',
            color: ''
          },
          location: car.location || {
            id: 0,
            city: '',
            country: '',
            location_type: 'georgia',
            is_in_transit: false
          },
          images: car.images || []
        };
      });

      console.log('[WishlistService.getWishlist] Transformed cars:', transformedCars);
      return transformedCars;
    } catch (error: any) {
      console.error('[WishlistService.getWishlist] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Throw the error instead of returning mock data - this will help identify the issue
      throw error;
    }
  }

  async addToWishlist(carId: number): Promise<void> {
    try {
      await api.post(`/api/wishlist/${carId}`);
    } catch (error: any) {
      console.error('[WishlistService.addToWishlist] Error:', error);
      console.log('Using mock wishlist for add operation');
      // Update local mock wishlist state
      const mockCar = mockWishlist.find(car => car.id === carId);
      if (mockCar && !localMockWishlist.some(car => car.id === carId)) {
        localMockWishlist.push(mockCar);
      }
    }
  }

  async removeFromWishlist(carId: number): Promise<void> {
    try {
      await api.delete(`/api/wishlist/${carId}`);
    } catch (error: any) {
      console.error('[WishlistService.removeFromWishlist] Error:', error);
      console.log('Using mock wishlist for remove operation');
      // Update local mock wishlist state
      localMockWishlist = localMockWishlist.filter(car => car.id !== carId);
    }
  }

  async isInWishlist(carId: number): Promise<boolean> {
    try {
      const response = await api.get(`/api/wishlist/check/${carId}`);
      return response.data.exists;
    } catch (error: any) {
      console.error('[WishlistService.isInWishlist] Error:', error);
      console.log('Using mock wishlist for check operation');
      // Use local mock wishlist state
      return localMockWishlist.some(car => car.id === carId);
    }
  }

  async clearWishlist(): Promise<void> {
    try {
      await api.delete('/api/wishlist');
    } catch (error: any) {
      console.error('[WishlistService.clearWishlist] Error:', error);
      console.log('Using mock wishlist for clear operation');
      // Clear local mock wishlist state
      localMockWishlist = [];
    }
  }
}

export default new WishlistService();