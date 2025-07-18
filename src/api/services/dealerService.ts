import api from '../config/api';
import { Dealer, DealerFilters, DealerResponse } from '../types/dealer.types';

const dealerService = {
  // Get all dealers with filters (using the public endpoint that doesn't require authentication)
  async getDealers(filters: DealerFilters = {}): Promise<DealerResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.established_year_min) params.append('established_year_min', filters.established_year_min.toString());
      if (filters.established_year_max) params.append('established_year_max', filters.established_year_max.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      // Use the public endpoint that doesn't require authentication
      const response = await api.get(`/api/dealers/public?${params.toString()}`);
      
      console.log('Public dealers response:', response.data);
      
      // Return the response in the expected format
      return {
        dealers: response.data.data || response.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        totalPages: response.data.meta?.totalPages || 1
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერების ჩამოტვირთვა ვერ მოხერხდა');
    }
  },

  // Get single dealer profile
  async getDealerProfile(dealerId: number): Promise<Dealer> {
    try {
      const response = await api.get(`/api/dealers/public/${dealerId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის მოძებნა ვერ მოხერხდა');
    }
  },

  // Get dealer's cars
  async getDealerCars(dealerId: number, filters: any = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/api/dealers/${dealerId}/cars?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის მანქანების ჩამოტვირთვა ვერ მოხერხდა');
    }
  },

  // Get dealer by ID (admin)
  async getDealerById(id: number): Promise<Dealer> {
    try {
      const response = await api.get(`/api/dealers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის მოძებნა ვერ მოხერხდა');
    }
  },

  // Update dealer profile
  async updateDealerProfile(dealerId: number, data: any): Promise<Dealer> {
    try {
      const response = await api.put(`/api/dealers/${dealerId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის განახლება ვერ მოხერხდა');
    }
  },

  // Get my dealer profile
  async getMyDealerProfile(): Promise<Dealer> {
    try {
      const response = await api.get('/api/dealers/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის პროფილის ჩამოტვირთვა ვერ მოხერხდა');
    }
  },

  // Admin methods
  async getAllDealers(params?: any): Promise<any> {
    try {
      const response = await api.get('/api/dealers', { params });
      
      // Handle the admin response format
      if (response.data.success && response.data.data) {
        return response.data;
      } else if (response.data.dealers) {
        // Backend returns: {dealers: [...], total: 15, page: 1, totalPages: 2}
        // Transform to: {success: true, data: [...], meta: {...}}
        return {
          success: true,
          data: response.data.dealers,
          meta: {
            total: response.data.total,
            page: response.data.page,
            totalPages: response.data.totalPages
          }
        };
      } else {
        // Fallback for older format
        return {
          success: true,
          data: response.data || [],
          meta: {
            total: response.data.length || 0,
            page: 1,
            totalPages: 1
          }
        };
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერების ჩამოტვირთვა ვერ მოხერხდა');
    }
  },

  async createDealer(data: any): Promise<any> {
    try {
      const response = await api.post('/api/dealers', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის შექმნა ვერ მოხერხდა');
    }
  },

  async updateDealer(id: number, data: any): Promise<any> {
    try {
      const response = await api.put(`/api/dealers/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის განახლება ვერ მოხერხდა');
    }
  },

  async deleteDealer(id: number): Promise<any> {
    try {
      const response = await api.delete(`/api/dealers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'დილერის წაშლა ვერ მოხერხდა');
    }
  },

  async uploadLogo(id: number, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.post(`/api/dealers/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ლოგოს ატვირთვა ვერ მოხერხდა');
    }
  }
};

export default dealerService;