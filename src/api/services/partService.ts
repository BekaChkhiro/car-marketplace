import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';

// Types for car parts - these would typically be in a separate types file
export interface PartImage {
  id: number;
  part_id: number;
  url: string;
  thumbnail_url: string;
  medium_url: string;
  large_url: string;
  is_primary: boolean;
}

export interface Part {
  id: number;
  title: string;
  category_id: number;
  brand_id: number;
  model_id: number;
  condition: string;
  price: number;
  description?: string;
  description_en?: string;
  description_ka?: string;
  seller_id: number;
  created_at: string;
  images: PartImage[];
  brand?: string;
  category?: string;
  model?: string;
}

export interface PartFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  brand_id?: number;
  category_id?: number;
  model_id?: number;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export interface CreatePartFormData {
  title: string;
  category_id: number;
  brand_id: number;
  model_id: number;
  condition: string;
  price: number;
  description?: string;
  description_en?: string;
  description_ka?: string;
  images?: File[];
}

export interface UpdatePartFormData extends Partial<CreatePartFormData> {
  id: number;
}

class PartService {
  async getParts(filters?: PartFilters): Promise<{ parts: Part[], totalCount: number, totalPages: number, currentPage: number }> {
    try {
      console.log('[PartService.getParts] Sending filters to API:', JSON.stringify(filters));
      
      const response = await api.get('/api/parts/search', { params: filters });
      
      console.log('[PartService.getParts] Response from API:', response.data);
      
      return {
        parts: response.data.parts || [],
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || 1
      };
    } catch (error) {
      console.error('[PartService.getParts] Error fetching parts:', error);
      throw error;
    }
  }

  async getPartById(id: number | string): Promise<Part> {
    try {
      const response = await api.get(`/api/parts/${id}`);
      return response.data.part;
    } catch (error) {
      console.error('[PartService.getPartById] Error fetching part details:', error);
      throw error;
    }
  }

  async createPart(partData: CreatePartFormData): Promise<Part> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Ensure numeric fields are properly converted to numbers
      const processedPartData = {
        ...partData,
        category_id: Number(partData.category_id),
        brand_id: Number(partData.brand_id),
        model_id: Number(partData.model_id),
        price: Number(partData.price)
      };

      const formData = new FormData();
      formData.append('partData', JSON.stringify(processedPartData));

      if (partData.images && partData.images.length > 0) {
        partData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await api.post('/api/parts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.part;
    } catch (error) {
      console.error('[PartService.createPart] Error creating part:', error);
      throw error;
    }
  }

  async updatePart(partData: UpdatePartFormData, newImages?: File[]): Promise<Part> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const { id, ...updateData } = partData;
      const formData = new FormData();
      formData.append('partData', JSON.stringify(updateData));

      if (newImages && newImages.length > 0) {
        newImages.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await api.put(`/api/parts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.part;
    } catch (error) {
      console.error('[PartService.updatePart] Error updating part:', error);
      throw error;
    }
  }

  async deletePart(id: number): Promise<void> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await api.delete(`/api/parts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('[PartService.deletePart] Error deleting part:', error);
      throw error;
    }
  }

  async setImageAsPrimary(partId: number, imageId: number): Promise<void> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await api.put(`/api/parts/${partId}/images/${imageId}/primary`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('[PartService.setImageAsPrimary] Error setting image as primary:', error);
      throw error;
    }
  }

  async deleteImage(partId: number, imageId: number): Promise<void> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await api.delete(`/api/parts/${partId}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('[PartService.deleteImage] Error deleting image:', error);
      throw error;
    }
  }

  async getBrands(): Promise<any[]> {
    try {
      const response = await api.get('/api/parts/brands/all');
      return response.data.brands || [];
    } catch (error) {
      console.error('[PartService.getBrands] Error fetching brands:', error);
      throw error;
    }
  }

  async getModelsByBrand(brandId: number): Promise<any[]> {
    try {
      const response = await api.get(`/api/parts/models/by-brand/${brandId}`);
      return response.data.models || [];
    } catch (error) {
      console.error('[PartService.getModelsByBrand] Error fetching models by brand:', error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await api.get('/api/parts/categories/all');
      return response.data.categories || [];
    } catch (error) {
      console.error('[PartService.getCategories] Error fetching categories:', error);
      throw error;
    }
  }

  async getPartCategories(): Promise<any[]> {
    try {
      const response = await api.get('/api/parts/part-categories/all');
      return response.data.categories || [];
    } catch (error) {
      console.error('[PartService.getPartCategories] Error fetching part categories:', error);
      throw error;
    }
  }

  async getPartsByUser(userId: number, page = 1, limit = 10): Promise<{ parts: Part[], totalCount: number, totalPages: number, currentPage: number }> {
    try {
      const response = await api.get(`/api/parts/user/${userId}`, {
        params: { page, limit }
      });
      
      return {
        parts: response.data.parts || [],
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || 1
      };
    } catch (error) {
      console.error('[PartService.getPartsByUser] Error fetching user parts:', error);
      throw error;
    }
  }
}

// Create an instance of PartService and export it as default
const partService = new PartService();
export default partService;
