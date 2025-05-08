import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';

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
      const response = await api.get('/api/vip/pricing');
      return response.data.data;
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
   * Get cars by VIP status
   * @param vipStatus VIP status to filter by
   * @param limit Optional limit
   * @param offset Optional offset
   * @returns Cars with specified VIP status
   */
  async getCarsByVipStatus(
    vipStatus: VipStatus,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ cars: any[], total: number }> {
    try {
      const response = await api.get(`/api/vip/cars/${vipStatus}`, {
        params: { limit, offset }
      });
      
      return {
        cars: response.data.data,
        total: response.data.total
      };
    } catch (error) {
      console.error('Error fetching cars by VIP status:', error);
      throw error;
    }
  }

  /**
   * Disable VIP status for a car (sets it to 'none')
   * @param carId Car ID
   * @returns Updated VIP status data
   */
  async disableVipStatus(carId: number): Promise<VipStatusResponse> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Calling updateVipStatus with 'none' status effectively disables VIP
      const response = await api.put(
        `/api/vip/update/${carId}`,
        { vipStatus: 'none' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error disabling VIP status:', error);
      throw error;
    }
  }
}

export default new VipService();
