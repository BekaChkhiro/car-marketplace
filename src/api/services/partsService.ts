import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';
import { Part } from '../types/part.types';

class PartsService {
  async getParts(): Promise<{ parts: Part[], meta: any }> {
    try {
      const response = await api.get('/api/parts');
      
      // Check if the response follows the data structure with meta information
      if (response.data && response.data.data && response.data.meta) {
        return {
          parts: response.data.data,
          meta: response.data.meta
        };
      }
      
      // Fallback for API compatibility if the response is in the old format (just an array)
      if (Array.isArray(response.data)) {
        return {
          parts: response.data,
          meta: {
            total: response.data.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(response.data.length / 10)
          }
        };
      }
      
      // If we reach here, something is wrong with the response format
      console.warn('[PartsService.getParts] Unexpected API response format:', response.data);
      return {
        parts: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('[PartsService.getParts] Error fetching parts:', error);
      throw error;
    }
  }

  async getAllPartsForAdmin(): Promise<{ parts: Part[], meta: any }> {
    try {
      const response = await api.get('/api/parts?includeUser=true', {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      
      // Check if the response follows the data structure with meta information
      if (response.data && response.data.data && response.data.meta) {
        return {
          parts: response.data.data,
          meta: response.data.meta
        };
      }
      
      // Fallback for API compatibility if the response is in the old format (just an array)
      if (Array.isArray(response.data)) {
        return {
          parts: response.data,
          meta: {
            total: response.data.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(response.data.length / 10)
          }
        };
      }
      
      // If we reach here, something is wrong with the response format
      console.warn('[PartsService.getAllPartsForAdmin] Unexpected API response format:', response.data);
      return {
        parts: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('[PartsService.getAllPartsForAdmin] Error fetching parts for admin:', error);
      throw error;
    }
  }

  async getPartById(id: string | number): Promise<Part> {
    try {
      const response = await api.get(`/api/parts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`[PartsService.getPartById] Error fetching part with id ${id}:`, error);
      throw error;
    }
  }

  async createPart(partData: Partial<Part>): Promise<Part> {
    try {
      const response = await api.post('/api/parts', partData, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('[PartsService.createPart] Error creating part:', error);
      throw error;
    }
  }

  async updatePart(id: string | number, partData: Partial<Part>): Promise<Part> {
    try {
      const response = await api.put(`/api/parts/${id}`, partData, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`[PartsService.updatePart] Error updating part with id ${id}:`, error);
      throw error;
    }
  }

  async deletePart(id: string | number): Promise<void> {
    try {
      await api.delete(`/api/parts/${id}`, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
    } catch (error) {
      console.error(`[PartsService.deletePart] Error deleting part with id ${id}:`, error);
      throw error;
    }
  }
}

const partsService = new PartsService();
export default partsService;
