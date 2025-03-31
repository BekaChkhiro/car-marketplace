import api from '../config/axios';
import { Car, CarFilters, CreateCarFormData, UpdateCarFormData } from '../types/car.types';
import { mockBrands } from '../../data/mockData';

interface Brand {
  id: number;
  name: string;
  models: string[];
}

class CarService {
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get('/api/cars/brands');
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for brands, using mock data');
        return mockBrands;
      }

      const brandsWithModels = response.data.map((apiBrand: any) => {
        // Find corresponding mock brand to get models if API doesn't provide them
        const mockBrand = mockBrands.find((mock: Brand) => 
          mock.name.toLowerCase() === apiBrand.name.toLowerCase()
        );

        return {
          id: apiBrand.id,
          name: apiBrand.name,
          models: apiBrand.models || mockBrand?.models || []
        };
      });

      return brandsWithModels;
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      return mockBrands;
    }
  }

  async getCars(filters?: Partial<CarFilters>): Promise<Car[]> {
    try {
      const response = await api.get<Car[]>('/api/cars', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cars');
    }
  }

  async getCar(id: number): Promise<Car> {
    try {
      const response = await api.get<Car>(`/api/cars/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch car details');
    }
  }

  async createCar(data: CreateCarFormData): Promise<Car> {
    try {
      // First create the car
      const response = await api.post<Car>('/api/cars', data);
      const carId = response.data.id;

      // Then upload images if available
      if (data.images && data.images.length > 0) {
        const formData = new FormData();
        data.images.forEach((image) => {
          formData.append('images', image);
        });
        await api.post(`/api/cars/${carId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create car listing');
    }
  }

  async updateCar(id: number, data: UpdateCarFormData): Promise<Car> {
    try {
      const response = await api.put<Car>(`/api/cars/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update car listing');
    }
  }

  async deleteCar(id: number): Promise<void> {
    try {
      await api.delete(`/api/cars/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete car listing');
    }
  }

  async getCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await api.get('/api/cars/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  async addToWishlist(carId: number): Promise<void> {
    try {
      await api.post('/api/wishlist', { car_id: carId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }

  async removeFromWishlist(carId: number): Promise<void> {
    try {
      await api.delete(`/api/wishlist/${carId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }

  async getWishlist(): Promise<Car[]> {
    try {
      const response = await api.get<Car[]>('/api/wishlist');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }

  async getFavoriteCars(): Promise<Car[]> {
    try {
      const response = await api.get<Car[]>('/api/cars/favorites');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorite cars');
    }
  }

  async getUserCars(): Promise<Car[]> {
    try {
      const response = await api.get<Car[]>('/api/cars/user');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user cars');
    }
  }
}

export default new CarService();