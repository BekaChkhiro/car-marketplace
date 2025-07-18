import api from '../config/api';
import { Dealer, DealerFilters, DealerResponse, DealerCar } from '../types/dealer.types';

export const dealerService = {
  // Get all dealers with filters
  async getDealers(filters: DealerFilters = {}): Promise<DealerResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.established_year_min) params.append('established_year_min', filters.established_year_min.toString());
    if (filters.established_year_max) params.append('established_year_max', filters.established_year_max.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/dealers?${params.toString()}`);
    return response.data;
  },

  // Get single dealer profile
  async getDealerProfile(dealerId: number): Promise<Dealer> {
    const response = await api.get(`/api/dealers/${dealerId}`);
    return response.data;
  },

  // Get dealer by ID (alias for getDealerProfile)
  async getDealerById(dealerId: number): Promise<Dealer> {
    return this.getDealerProfile(dealerId);
  },

  // Get dealer's cars
  async getDealerCars(dealerId: number, filters: any = {}): Promise<{ cars: DealerCar[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/dealers/${dealerId}/cars?${params.toString()}`);
    return response.data;
  },

  // Update dealer profile (for dealer users)
  async updateDealerProfile(dealerId: number, data: FormData): Promise<Dealer> {
    const response = await api.put(`/api/dealers/${dealerId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user's dealer profile
  async getMyDealerProfile(): Promise<Dealer> {
    const response = await api.get('/api/dealer/profile');
    return response.data;
  },
};