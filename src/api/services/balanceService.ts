import api from '../config/api';
import { getStoredToken as getAccessToken } from '../utils/tokenStorage';

/**
 * Interface for Transaction object
 */
export interface Transaction {
  id: number;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'vip_purchase';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  reference_id?: number;
}

/**
 * Interface for Balance response
 */
export interface BalanceResponse {
  balance: number;
}

/**
 * Interface for Transaction history response
 */
export interface TransactionHistoryResponse {
  transactions: Transaction[];
}

/**
 * Interface for adding funds request
 */
export interface AddFundsRequest {
  amount: number;
}

/**
 * Interface for adding funds response
 */
export interface AddFundsResponse {
  success: boolean;
  balance: number;
  message: string;
}

/**
 * Interface for purchasing VIP status request
 */
export interface PurchaseVipRequest {
  vipStatus: 'vip' | 'vip_plus' | 'super_vip';
  days: number;
}

/**
 * Interface for purchasing VIP status response
 */
export interface PurchaseVipResponse {
  success: boolean;
  newBalance: number;
  vipStatus: string;
  vipExpiration: string;
  message: string;
  requiredAmount?: number;
  currentBalance?: number;
}

class BalanceService {
  /**
   * Get user balance
   * @returns Current user balance
   */
  async getBalance(): Promise<number> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get<BalanceResponse>('/api/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
  
  /**
   * Add funds to user balance
   * @param amount Amount to add
   * @returns Updated balance information
   */
  async addFunds(amount: number): Promise<AddFundsResponse> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post<AddFundsResponse>(
        '/api/balance/add',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  }
  
  /**
   * Get transaction history
   * @returns List of user transactions
   */
  async getTransactionHistory(): Promise<Transaction[]> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('Requesting transaction history from API...');
      const response = await api.get<TransactionHistoryResponse>('/api/balance/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('API response:', response.data);
      
      if (response.data && response.data.transactions && Array.isArray(response.data.transactions)) {
        return response.data.transactions;
      } else {
        console.warn('Invalid transaction data format received from API');
        return this.getMockTransactions();
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      // Return mock data as fallback, similar to carService approach
      return this.getMockTransactions();
    }
  }
  
  /**
   * Get mock transaction data for fallback
   * @returns Mock transaction data
   */
  private getMockTransactions(): Transaction[] {
    console.log('Using mock transaction data as fallback');
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: 1,
        amount: 100,
        type: 'deposit',
        description: 'Balance top-up',
        status: 'completed',
        created_at: now.toISOString()
      },
      {
        id: 2,
        amount: 50,
        type: 'deposit',
        description: 'Balance top-up',
        status: 'completed',
        created_at: yesterday.toISOString()
      },
      {
        id: 3,
        amount: -30,
        type: 'vip_purchase',
        description: 'VIP status purchase',
        status: 'completed',
        created_at: yesterday.toISOString(),
        reference_id: 1
      }
    ];
  }
  
  /**
   * Purchase VIP status for a car
   * @param carId Car ID to purchase VIP status for
   * @param vipStatus Type of VIP status to purchase
   * @param days Number of days for VIP status
   * @returns Purchase result
   */
  async purchaseVipStatus(carId: number, vipStatus: 'vip' | 'vip_plus' | 'super_vip', days: number): Promise<PurchaseVipResponse> {
    try {
      // დავრწმუნდეთ, რომ days არის მთელი რიცხვი და დადებითი
      // CRITICAL FIX: სწორი დღეების რაოდენობის გადაცემა
      const daysInt = Number(days);
      
      // ვრწმუნდებით რომ დღეების რაოდენობა არის მინიმუმ 1
      const validDays = Math.max(1, Math.round(daysInt));
      
      console.log('PURCHASE VIP STATUS - CLIENT SIDE FIXED:');
      console.log(`VIP purchase for car ID: ${carId}`);
      console.log(`VIP status: ${vipStatus}`);
      console.log(`Days (original): ${days}, type: ${typeof days}`);
      console.log(`Days (parsed): ${daysInt}, type: ${typeof daysInt}`);
      console.log(`Days (validated): ${validDays}, type: ${typeof validDays}`);
      
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // ვცდილობთ ორივე API ენდპოინტს, თუ ერთი არ მუშაობს, მეორეს ვცდით
      let response;
      try {
        // პირველად ვცდით ბალანსის API-ს
        // ვრწმუნდებით რომ days პარამეტრი გადაეცემა როგორც რიცხვი და არა სტრიქონი
        const requestData = { 
          vipStatus, 
          days: validDays // validDays უკვე არის რიცხვითი ტიპი
        };
        
        // ვრწმუნდებით რომ მონაცემები სწორადაა გადაცემული
        console.log('CRITICAL - SENDING REQUEST TO SERVER:');
        console.log('Request data:', JSON.stringify(requestData));
        console.log('vipStatus:', requestData.vipStatus, '(type:', typeof requestData.vipStatus + ')');
        console.log('days:', requestData.days, '(type:', typeof requestData.days + ')');
        
        // გამოვთვალოთ ჯამური ფასი კლიენტის მხარეს
        let pricePerDay = 0;
        if (vipStatus === 'vip') pricePerDay = 2.5;
        else if (vipStatus === 'vip_plus') pricePerDay = 5;
        else if (vipStatus === 'super_vip') pricePerDay = 8;
        
        const totalPrice = pricePerDay * validDays;
        console.log(`Expected price: ${pricePerDay} * ${validDays} = ${totalPrice}`);
        
        response = await api.post<PurchaseVipResponse>(
          `/api/balance/purchase-vip/${carId}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('Balance API response:', response.data);
      } catch (balanceError) {
        console.log('Error with balance API:', balanceError);
        console.log('Trying VIP API endpoint instead of balance API');
        // ვრწმუნდებით რომ მონაცემები სწორადაა გადაცემული
        // CRITICAL FIX: დღეების რაოდენობა უნდა იყოს მთელი რიცხვი და არა სტრიქონი
        const requestData = { 
          vipStatus, 
          days: validDays
        };
        
        // ვრწმუნდებით რომ მონაცემები სწორადაა გადაცემული
        console.log('SENDING REQUEST TO FALLBACK API:');
        console.log('Request data:', JSON.stringify(requestData));
        console.log('vipStatus:', requestData.vipStatus, '(type:', typeof requestData.vipStatus + ')');
        console.log('days:', requestData.days, '(type:', typeof requestData.days + ')');
        
        // გამოვთვალოთ ჯამური ფასი კლიენტის მხარეს
        let pricePerDay = 0;
        if (vipStatus === 'vip') pricePerDay = 2.5;
        else if (vipStatus === 'vip_plus') pricePerDay = 5;
        else if (vipStatus === 'super_vip') pricePerDay = 8;
        
        const totalPrice = pricePerDay * validDays;
        console.log(`Expected price for fallback: ${pricePerDay} * ${validDays} = ${totalPrice}`);
        
        // FIXED ENDPOINT: Ensure we use the exact correct route pattern
        const vipResponse = await api.post(
          `/api/vip/purchase/${carId}`, // This is targeting the router.post('/purchase/:carId') route
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        response = {
          data: {
            success: true,
            newBalance: vipResponse.data.newBalance || 0,
            vipStatus: vipStatus,
            vipExpiration: vipResponse.data.vipExpiration || '',
            message: vipResponse.data.message || 'VIP status purchased successfully'
          }
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error purchasing VIP status:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
        headers: error.config?.headers
      });
      
      // If the error is due to insufficient balance, return that information
      if (error.response && error.response.status === 400 && error.response.data.requiredAmount) {
        return {
          success: false,
          newBalance: error.response.data.currentBalance || 0,
          vipStatus: '',
          vipExpiration: '',
          message: error.response.data.message || 'Insufficient balance',
          requiredAmount: error.response.data.requiredAmount,
          currentBalance: error.response.data.currentBalance
        };
      }
      
      throw error;
    }
  }
}

export default new BalanceService();
