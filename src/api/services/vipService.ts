import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';
import { Car } from '../types/car.types';

export type VipStatus = 'none' | 'vip' | 'vip_plus' | 'super_vip';

export interface VipPrice {
  vip_status: VipStatus;
  price: number;
  duration_days: number;
}

export interface VipStatusUpdate {
  vipStatus: VipStatus;
  startDate?: string; // ISO date string - when VIP status starts
  expirationDate?: string; // ISO date string - when VIP status expires
}

export interface VipStatusResponse {
  id: number;
  vip_status: VipStatus;
  vip_expiration_date: string | null;
  vip_expiration?: string | null; // ალტერნატიული ველის სახელი
}

class VipService {
  /**
   * Get all VIP pricing information
   * @returns VIP pricing data
   */
  async getVipPrices(): Promise<VipPrice[]> {
    try {
      const response = await api.get('/api/pricing');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching VIP prices:', error);
      // Fallback to hardcoded prices if API fails
      return [
        { vip_status: 'vip', price: 10, duration_days: 7 },
        { vip_status: 'vip_plus', price: 30, duration_days: 30 },
        { vip_status: 'super_vip', price: 60, duration_days: 30 }
      ];
    }
  }

  /**
   * Get VIP status information for a car
   * @param carId Car ID
   * @returns VIP status information
   */
  async getVipStatusInfo(carId: number): Promise<VipStatusResponse> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log(`Fetching VIP status info for car ID: ${carId}`);
      
      const response = await api.get(`/api/vip/status/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // სერვერიდან მოსული მონაცემების დამუშავება
      console.log('VIP status response:', response.data);
      
      // სერვერი აბრუნებს მონაცემებს პირდაპირ ობიექტში
      const data = response.data;
      
      // ვიყენებთ მხოლოდ vip_expiration_date ველს
      return {
        id: carId,
        vip_status: data.vip_status || 'none',
        vip_expiration_date: data.vip_expiration_date || null,
        vip_expiration: data.vip_expiration_date || null // თავსებადობისთვის ვინახავთ ველს
      };
    } catch (error) {
      console.error('Error fetching VIP status info:', error);
      return {
        id: carId,
        vip_status: 'none',
        vip_expiration_date: null
      };
    }
  }
  
  /**
   * Purchase VIP status for a car using balance
   * @param carId Car ID
   * @param vipStatus VIP status to purchase
   * @returns Purchase result
   */
  async purchaseVipStatus(carId: number, vipStatus: VipStatus): Promise<any> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post(`/api/vip/purchase/${carId}`, { vipStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error purchasing VIP status:', error);
      throw error;
    }
  }

  /**
   * Get VIP auto-renewal status for a car
   * @param carId Car ID
   * @returns VIP auto-renewal status
   */
  async getVipAutoRenewalStatus(carId: number): Promise<any> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get(`/api/vip/auto-renewal/${carId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data?.data || {};
    } catch (error) {
      console.error('Error fetching VIP auto-renewal status:', error);
      return {
        autoRenewalEnabled: false,
        autoRenewalDays: 1
      };
    }
  }

  /**
   * Purchase comprehensive VIP package including additional services
   * @param carId Car ID
   * @param vipPackage VIP package details
   * @returns Purchase result
   */
  async purchaseVipPackage(carId: number, vipPackage: {
    vip_status: VipStatus;
    vip_days: number;
    color_highlighting: boolean;
    color_highlighting_days: number;
    auto_renewal: boolean;
    auto_renewal_days: number;
  }): Promise<any> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post(`/api/vip/purchase-package/${carId}`, vipPackage, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error purchasing VIP package:', error);
      throw error;
    }
  }

  /**
   * Get all available VIP status types
   * @returns Array of VIP status types
   */
  async getVipStatusTypes(): Promise<VipStatus[]> {
    try {
      const response = await api.get('/api/vip/types');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching VIP status types:', error);
      // Fallback to hardcoded types if API fails
      return ['none', 'vip', 'vip_plus', 'super_vip'];
    }
  }

  /**
   * Update a car's VIP status 
   * @param carId Car ID
   * @param vipStatus New VIP status
   * @param startDate Optional start date
   * @param expirationDate Optional expiration date
   * @returns Updated VIP status data
   */
  async updateVipStatus(
    carId: number,
    vipStatus: VipStatus,
    startDate?: string,
    expirationDate?: string
  ): Promise<VipStatusResponse> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.put(
        `/api/vip/update/${carId}`,
        { vipStatus, startDate, expirationDate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating VIP status:', error);
      throw error;
    }
  }

  /**
   * Get cars by VIP status with detailed logging
   * @param vipStatus VIP status to filter by
   * @param limit Maximum number of cars to return
   * @param offset Offset for pagination
   * @returns Cars with specified VIP status and total count
   */
  async getCarsByVipStatus(
    vipStatus: VipStatus,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ cars: Car[], total: number }> {
    try {
      console.log(`[VIP Service] Fetching ${vipStatus} cars, limit: ${limit}, offset: ${offset}`);
      
      // First try the dedicated VIP endpoint
      try {
        const response = await api.get(`/api/vip/cars/${vipStatus}`, {
          params: { limit, offset }
        });

        console.log(`[VIP Service] Received ${vipStatus} cars from VIP endpoint:`, {
          status: response.status,
          count: response.data?.data?.length || 0,
          sample: response.data?.data?.[0] ? {
            id: response.data.data[0].id,
            brand: response.data.data[0].brand,
            model: response.data.data[0].model,
            vip_status: response.data.data[0].vip_status,
            hasVipStatus: 'vip_status' in (response.data.data[0] || {})
          } : 'No cars in response',
          meta: response.data?.meta
        });

        if (response.data && response.data.data) {
          return {
            cars: response.data.data,
            total: response.data.total || response.data.data.length
          };
        }
      } catch (vipError) {
        console.warn(`[VIP Service] VIP endpoint failed, falling back to regular cars endpoint:`, vipError);
        // Fall through to regular endpoint
      }

      // Fallback to regular cars endpoint with VIP filter
      const response = await api.get('/api/cars', {
        params: {
          vip_status: vipStatus,
          limit,
          offset,
          include_vip: true // Ensure we get all VIP-related fields
        }
      });

      console.log(`[VIP Service] Received ${vipStatus} cars from regular endpoint:`, {
        status: response.status,
        count: response.data?.data?.length || 0,
        sample: response.data?.data?.[0] ? {
          id: response.data.data[0].id,
          brand: response.data.data[0].brand,
          model: response.data.data[0].model,
          vip_status: response.data.data[0].vip_status,
          hasVipStatus: 'vip_status' in (response.data.data[0] || {})
        } : 'No cars in response',
        meta: response.data?.meta
      });

      if (response.data && response.data.data && response.data.meta) {
        return {
          cars: response.data.data,
          total: response.data.meta.total
        };
      }

      // Fallback for different response format
      if (Array.isArray(response.data)) {
        return {
          cars: response.data,
          total: response.data.length
        };
      }

      console.warn('[VIP Service] Unexpected response format:', response.data);
      return { cars: [], total: 0 };
      
    } catch (error) {
      console.error(`[VIP Service] Error fetching ${vipStatus} cars:`, error);
      return { cars: [], total: 0 };
    }
  }

  /**
   * Disable VIP status for a car (sets it to 'none')
   * @param carId Car ID
   * @returns Updated VIP status data
   */
  async disableVipStatus(carId: number): Promise<VipStatusResponse> {
    try {
      console.log(`[VipService] Disabling VIP status for car ${carId}`);
      const token = getAccessToken();
      
      if (!token) {
        console.error('[VipService] No access token available');
        throw new Error('Authentication required');
      }
      
      console.log(`[VipService] Making PUT request to /api/vip/update/${carId}`);
      const response = await api.put(
        `/api/vip/update/${carId}`,
        { vipStatus: 'none' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log(`[VipService] VIP disable response:`, response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('[VipService] Error disabling VIP status:', error);
      if (error?.response) {
        console.error('[VipService] Response status:', error.response.status);
        console.error('[VipService] Response data:', error.response.data);
      }
      throw error;
    }
  }
}

export default new VipService();
