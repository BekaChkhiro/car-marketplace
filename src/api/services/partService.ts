import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';
import currencyService from './currencyService';

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
  currency?: string; // Currency code (GEL, USD, etc.)
  description?: string;
  description_en?: string;
  description_ka?: string;
  seller_id: number;
  created_at: string;
  images: PartImage[];
  brand?: string;
  category?: string;
  model?: string;
  year?: number;
  quantity?: number;
  vip_status?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vip_expiration_date?: string;
  color_highlighting?: boolean;
  auto_renewal_enabled?: boolean;
  auto_renewal_expiration_date?: string;
  auto_renewal_days?: number;
  auto_renewal_remaining_days?: number;
  // Seller information
  first_name?: string;
  last_name?: string;
  phone?: string;
  username?: string;
  user_created_at?: string;
  // Author information for forms
  author_name?: string;
  author_phone?: string;
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
  currency?: string; // Currency code (GEL, USD, etc.)
  description?: string;
  description_en?: string;
  description_ka?: string;
  images?: File[];
  featuredImageIndex?: number;
  vip_status?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  color_highlighting?: boolean;
  auto_renewal?: boolean;
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
      
      // Ensure all parts have a currency property (default to GEL if not specified)
      const parts = (response.data.parts || []).map((part: Part) => ({
        ...part,
        currency: part.currency || 'GEL'
      }));
      
      return {
        parts,
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
      // Ensure part has a currency property (default to GEL if not specified)
      const part = {
        ...response.data.part,
        currency: response.data.part.currency || 'GEL'
      };
      return part;
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
        price: Number(partData.price),
        // Set default currency to GEL if not specified
        currency: partData.currency || 'GEL'
      };

      console.log('[PartService.createPart] Original data:', JSON.stringify(partData));
      console.log('[PartService.createPart] Processed data:', JSON.stringify(processedPartData));
      
      // Check data validity before sending
      if (!processedPartData.title || processedPartData.title.trim() === '') {
        throw new Error('Title is required');
      }
      
      if (!processedPartData.category_id || processedPartData.category_id <= 0) {
        throw new Error('Valid category is required');
      }
      
      if (!processedPartData.brand_id || processedPartData.brand_id <= 0) {
        throw new Error('Valid brand is required');
      }
      
      if (!processedPartData.model_id || processedPartData.model_id <= 0) {
        throw new Error('Valid model is required');
      }
      
      if (!processedPartData.price || processedPartData.price <= 0) {
        throw new Error('Valid price is required');
      }

      const formData = new FormData();
      
      // Add featured image index to the processed data if provided
      const dataToSend = {
        ...processedPartData,
        featuredImageIndex: partData.featuredImageIndex !== undefined ? partData.featuredImageIndex : 0
      };
      
      formData.append('partData', JSON.stringify(dataToSend));
      console.log('[PartService.createPart] Featured image index:', partData.featuredImageIndex);

      if (partData.images && partData.images.length > 0) {
        console.log(`[PartService.createPart] Processing ${partData.images.length} images:`);
        partData.images.forEach((image, index) => {
          console.log(`Image ${index}: ${image.name}, type: ${image.type}, size: ${image.size} bytes`);
          formData.append('images', image);
        });
        console.log(`[PartService.createPart] Added ${partData.images.length} images to form data`);
      } else {
        console.warn('[PartService.createPart] No images provided');
      }

      console.log('[PartService.createPart] Sending request to server...');
      const response = await api.post('/api/parts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('[PartService.createPart] Server response:', response.data);
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
      
      // Ensure all parts have a currency property (default to GEL if not specified)
      const parts = (response.data.parts || []).map((part: Part) => ({
        ...part,
        currency: part.currency || 'GEL'
      }));
      
      return {
        parts,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || 1
      };
    } catch (error) {
      console.error('[PartService.getPartsByUser] Error fetching user parts:', error);
      throw error;
    }
  }
  
  // Currency conversion utilities
  
  /**
   * Convert price from one currency to another using current exchange rates
   * @param price - The price to convert
   * @param fromCurrency - Source currency code (default: GEL)
   * @param toCurrency - Target currency code (default: GEL)
   * @returns The converted price
   */
  convertPrice(price: number, fromCurrency: string = 'GEL', toCurrency: string = 'GEL'): number {
    if (!price || fromCurrency === toCurrency) return price;
    return currencyService.convert(price, fromCurrency, toCurrency);
  }
  
  /**
   * Format price with currency symbol
   * @param price - The price to format
   * @param currency - Currency code (default: GEL)
   * @returns Formatted price string with currency symbol
   */
  formatPrice(price: number, currency: string = 'GEL'): string {
    return currencyService.formatPrice(price, currency);
  }
  
  /**
   * Get condition text in Georgian
   * @param condition - Condition code
   * @returns Georgian text for condition
   */
  
  /**
   * Purchase VIP status for a part
   * @param partId - The part ID
   * @param vipStatus - VIP status level
   * @param days - Number of days for VIP status
   * @param colorHighlighting - Whether to enable color highlighting
   * @param colorHighlightingDays - Number of days for color highlighting
   * @param autoRenewal - Whether to enable auto renewal
   * @param autoRenewalDays - Number of days for auto renewal
   * @returns Purchase result
   */
  async purchaseVipStatus(
    partId: number, 
    vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip',
    days: number = 7,
    colorHighlighting: boolean = false,
    colorHighlightingDays: number = 1,
    autoRenewal: boolean = false,
    autoRenewalDays: number = 1
  ): Promise<any> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const payload = {
        partId,
        vipStatus,
        days,
        colorHighlighting,
        colorHighlightingDays,
        autoRenewal,
        autoRenewalDays
      };
      
      console.log('[PartService.purchaseVipStatus] Purchasing VIP status:', payload);
      
      const response = await api.post('/api/parts/vip/purchase', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('[PartService.purchaseVipStatus] VIP purchase successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PartService.purchaseVipStatus] Error purchasing VIP status:', error);
      throw error;
    }
  }

  /**
   * Get VIP status information for a part
   * @param partId - The part ID
   * @returns VIP status information
   */
  async getVipStatusInfo(partId: number): Promise<any> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get(`/api/parts/${partId}/vip/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('[PartService.getVipStatusInfo] Error fetching VIP status info:', error);
      throw error;
    }
  }
  
  async incrementViews(partId: string): Promise<void> {
    try {
      await api.post(`/api/parts/${partId}/views`);
    } catch (error: any) {
      console.error('[PartService.incrementViews] Error:', error);
      // Don't throw error to prevent blocking page load
    }
  }
}

// Create an instance of PartService and export it as default
const partService = new PartService();
export default partService;
