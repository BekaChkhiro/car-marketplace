import api from '../config/api';
import { 
  Autosalon, 
  CreateAutosalonRequest, 
  UpdateAutosalonRequest, 
  AutosalonResponse, 
  AutosalonsListResponse 
} from '../types/autosalon.types';

class AutosalonService {
  // Create new autosalon (Admin only)
  async createAutosalon(data: CreateAutosalonRequest): Promise<AutosalonResponse> {
    try {
      const response = await api.post<AutosalonResponse>('/api/autosalons', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის შექმნა ვერ მოხერხდა');
    }
  }

  // Get all autosalons (Admin only)
  async getAllAutosalons(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<AutosalonsListResponse> {
    try {
      const response = await api.get<AutosalonsListResponse>('/api/autosalons', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონების ჩამოტვირთვა ვერ მოხერხდა');
    }
  }

  // Get autosalon by ID
  async getAutosalonById(id: number): Promise<AutosalonResponse> {
    try {
      const response = await api.get<AutosalonResponse>(`/api/autosalons/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის მოძებნა ვერ მოხერხდა');
    }
  }

  // Get autosalon profile (alias for getAutosalonById)
  async getAutosalonProfile(autosalonId: number): Promise<Autosalon> {
    try {
      const response = await api.get(`/api/autosalons/public/${autosalonId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('ავტოსალონი ვერ მოიძებნა');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის მოძებნა ვერ მოხერხდა');
    }
  }

  // Get all autosalons for public listing (no auth required)
  async getAutosalons(filters: {
    page?: number;
    limit?: number;
    search?: string;
    established_year_min?: number;
    established_year_max?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<{
    autosalons: Autosalon[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.established_year_min) params.append('established_year_min', filters.established_year_min.toString());
      if (filters.established_year_max) params.append('established_year_max', filters.established_year_max.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/api/autosalons/public?${params.toString()}`);
      return {
        autosalons: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        totalPages: response.data.meta?.totalPages || 1
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონების ჩამოტვირთვა ვერ მოხერხდა');
    }
  }

  // Update autosalon (Admin only)
  async updateAutosalon(id: number, data: UpdateAutosalonRequest): Promise<AutosalonResponse> {
    try {
      const response = await api.put<AutosalonResponse>(`/api/autosalons/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის განახლება ვერ მოხერხდა');
    }
  }

  // Delete autosalon (Admin only)
  async deleteAutosalon(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/api/autosalons/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის წაშლა ვერ მოხერხდა');
    }
  }

  // Upload autosalon logo (Admin only)
  async uploadLogo(id: number, file: File): Promise<AutosalonResponse> {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post<AutosalonResponse>(`/api/autosalons/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ლოგოს ატვირთვა ვერ მოხერხდა');
    }
  }

  // Get autosalon's cars
  async getAutosalonCars(autosalonId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    cars: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // First get the autosalon to get the user_id
      const autosalonResponse = await this.getAutosalonProfile(autosalonId);
      
      if (!autosalonResponse || !autosalonResponse.user_id) {
        throw new Error('ავტოსალონი ვერ მოიძებნა');
      }
      
      // Use the main cars API with seller_id filter
      const response = await api.get(`/api/cars`, { 
        params: {
          seller_id: autosalonResponse.user_id,
          page: params?.page || 1,
          limit: params?.limit || 12
        }
      });
      
      return {
        cars: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        totalPages: response.data.meta?.totalPages || 1
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ავტოსალონის მანქანების ჩამოტვირთვა ვერ მოხერხდა');
    }
  }
}

export default new AutosalonService();