import axios from 'axios';
import { API_URL } from '../config/api';
import { authHeader } from '../utils';

// Stats interface for VIP listings statistics
interface VipListingsStats {
  totalVipListings: number;
  activeVipListings: number;
  expiredVipListings: number;
  totalRevenue: number;
  currency: string;
}

// Interface for VIP listing data
interface VipListing {
  id: number;
  car_id: number;
  car_title: string;
  user_id: number;
  user_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  days: number;
  amount: number;
  currency: string;
}

// Interface for VIP transaction data
interface VipTransaction {
  id: number;
  transaction_id: string;
  user_id: number;
  user_name: string;
  car_id: number;
  car_title: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'vip_purchase';
  days: number;
}

/**
 * Get statistics for VIP listings
 */
export const getVipListingsStats = async (): Promise<VipListingsStats> => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/vip-listings/stats`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching VIP listings stats:', error);
    
    // Return mock data if server is unavailable (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock VIP listings stats data');
      return {
        totalVipListings: 156,
        activeVipListings: 42,
        expiredVipListings: 114,
        totalRevenue: 3120,
        currency: 'GEL'
      };
    }
    
    throw error;
  }
};

/**
 * Get list of all VIP listings
 */
export const getVipListings = async (): Promise<VipListing[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/vip-listings`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching VIP listings:', error);
    
    // Return mock data if server is unavailable (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock VIP listings data');
      
      // Generate mock data
      const mockListings: VipListing[] = [];
      
      for (let i = 1; i <= 20; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
        
        const endDate = new Date(startDate);
        const days = Math.floor(Math.random() * 30) + 1;
        endDate.setDate(endDate.getDate() + days);
        
        const isActive = endDate > new Date();
        
        mockListings.push({
          id: i,
          car_id: 100 + i,
          car_title: `BMW X${i % 9 + 1}`,
          user_id: 200 + i,
          user_name: `მომხმარებელი ${i}`,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: isActive ? 'active' : 'expired',
          days: days,
          amount: days * 5,
          currency: 'GEL'
        });
      }
      
      return mockListings;
    }
    
    throw error;
  }
};

/**
 * Get all VIP-related transactions
 */
export const getVipTransactions = async (): Promise<VipTransaction[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/vip-transactions`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching VIP transactions:', error);
    
    // Return mock data if server is unavailable (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock VIP transactions data');
      
      // Generate mock data
      const mockTransactions: VipTransaction[] = [];
      
      for (let i = 1; i <= 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const days = Math.floor(Math.random() * 30) + 1;
        
        mockTransactions.push({
          id: i,
          transaction_id: `vip-${10000 + i}`,
          user_id: 200 + i,
          user_name: `მომხმარებელი ${i}`,
          car_id: 100 + i,
          car_title: `BMW X${i % 9 + 1}`,
          amount: days * 5,
          currency: 'GEL',
          date: date.toISOString(),
          status: 'completed',
          type: 'vip_purchase',
          days: days
        });
      }
      
      return mockTransactions;
    }
    
    throw error;
  }
};

// Export the interfaces for use in other components
export type { VipListingsStats, VipListing, VipTransaction };
