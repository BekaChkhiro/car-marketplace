import api from '../config/api';

interface AutoRenewalStats {
  stats: Array<{
    type: string;
    active_auto_renewals: number;
    expired_auto_renewals: number;
  }>;
}

interface EligibleCarsResponse {
  success: boolean;
  currentTime: string;
  eligibleCars: Array<{
    id: number;
    title: string;
    seller_id: number;
    created_at: string;
    auto_renewal_enabled: boolean;
    auto_renewal_days: number;
    auto_renewal_expiration_date: string;
    auto_renewal_last_processed: string;
    auto_renewal_remaining_days: number;
    renewal_status: string;
  }>;
  total: number;
}

interface TriggerResponse {
  success: boolean;
  message: string;
  timeInfo: {
    currentTime: string;
    currentHour: number;
    currentMinutes: number;
    timezoneOffset: number;
  };
  results: {
    expired: any;
    renewed: any;
  };
}

class AutoRenewalService {
  async getStats(): Promise<AutoRenewalStats> {
    try {
      const response = await api.get('/api/auto-renewal/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching auto-renewal stats:', error);
      throw error;
    }
  }

  async getEligible(): Promise<EligibleCarsResponse> {
    try {
      const response = await api.get('/api/auto-renewal/eligible');
      return response.data;
    } catch (error) {
      console.error('Error fetching eligible cars:', error);
      throw error;
    }
  }

  async triggerManually(): Promise<TriggerResponse> {
    try {
      const response = await api.post('/api/auto-renewal/manual-trigger');
      return response.data;
    } catch (error) {
      console.error('Error triggering auto-renewal:', error);
      throw error;
    }
  }

  async enableTestCar(): Promise<any> {
    try {
      const response = await api.post('/api/auto-renewal/enable-test-car');
      return response.data;
    } catch (error) {
      console.error('Error enabling test car for auto-renewal:', error);
      throw error;
    }
  }
}

export default new AutoRenewalService();