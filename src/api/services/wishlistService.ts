import api from '../config/axios';
import { Car } from '../types/car.types';

class WishlistService {
  async getWishlist(): Promise<Car[]> {
    try {
      const response = await api.get('/api/wishlist');
      return response.data;
    } catch (error: any) {
      console.error('[WishlistService.getWishlist] Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }

  async addToWishlist(carId: number): Promise<void> {
    try {
      await api.post(`/api/wishlist/${carId}`);
    } catch (error: any) {
      console.error('[WishlistService.addToWishlist] Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }

  async removeFromWishlist(carId: number): Promise<void> {
    try {
      await api.delete(`/api/wishlist/${carId}`);
    } catch (error: any) {
      console.error('[WishlistService.removeFromWishlist] Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }

  async isInWishlist(carId: number): Promise<boolean> {
    try {
      const response = await api.get(`/api/wishlist/check/${carId}`);
      return response.data.exists;
    } catch (error: any) {
      console.error('[WishlistService.isInWishlist] Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to check wishlist status');
    }
  }

  async clearWishlist(): Promise<void> {
    try {
      await api.delete('/api/wishlist');
    } catch (error: any) {
      console.error('[WishlistService.clearWishlist] Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
}

export default new WishlistService();