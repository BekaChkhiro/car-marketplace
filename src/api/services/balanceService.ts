import api from '../config/api';
import { getStoredToken as getAccessToken } from '../utils/tokenStorage';
import vipPricingService from './vipPricingService';

/**
 * Interface for Transaction object
 */
export interface Transaction {
  id: number;
  // ველი შეიძლება მოვიდეს როგორც სტრიქონი მონაცემთა ბაზიდან (numeric ტიპის გამო)
  amount: number | string;
  type: 'deposit' | 'vip_purchase';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  reference_id?: number | null;
  user_id?: number;
}

/**
 * Interface for Admin Transaction object with user information
 */
export interface AdminTransaction extends Transaction {
  user?: {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
  };
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
  message?: string;
  vipStatus?: string;
  vipExpiration?: string;
  newBalance?: number;
  totalPrice?: number; // Total price including additional services
  requiredAmount?: number;
  currentBalance?: number;
}

/**
 * Interface for online payment initialization response
 */
export interface OnlinePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  orderId?: string;
  message?: string;
}

/**
 * Interface for payment status check response
 */
export interface PaymentStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

/**
 * Interface for adding funds online with bank selection
 */
export interface OnlinePaymentRequest {
  amount: number;
  bank?: string;
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
   * Add funds to user balance (direct method - for testing)
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
   * Add funds using online payment with bank selection
   * @param amount Amount to add in GEL
   * @param bank Optional bank provider to use (flitt, bog, tbc)
   * @returns Payment session information including redirect URL
   */
  async addFundsOnline(amount: number, bank?: string): Promise<OnlinePaymentResponse> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const requestData: OnlinePaymentRequest = { amount };
      
      // Add bank selection if provided
      if (bank) {
        requestData.bank = bank;
      }
      
      const response = await api.post('/api/balance/add-online', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error initiating online payment:', error);
      throw error;
    }
  }
  
  /**
   * Check the status of a payment transaction
   * @param orderId The order ID or transaction reference to check
   * @returns Boolean indicating if payment is completed (true) or still pending (false)
   */
  async checkPaymentStatus(orderId: string): Promise<boolean> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.get(`/api/balance/payment-status/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Return true if payment is completed
      return response.data.status === 'completed';
    } catch (error) {
      console.error('Error checking payment status:', error);
      // On error, assume payment is not completed
      return false;
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
        id: 3,
        amount: -25,
        type: 'vip_purchase',
        description: 'VIP status purchase for 10 days',
        status: 'completed',
        created_at: now.toISOString(),
        reference_id: 123
      }
    ];
  }
  
  /**
   * Admin: Get all users' transaction history
   * @returns List of all transactions with user information
   */
  async getAdminTransactions(): Promise<AdminTransaction[]> {
    try {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('Requesting admin transaction history from API...');
      const response = await api.get('/api/balance/admin/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Admin transactions API response:', response.data);
      
      if (response.data && Array.isArray(response.data.transactions)) {
        // დეტალური ლოგი დებაგინგისთვის
        console.log('Transaction count from API:', response.data.transactions.length);
        if (response.data.transactions.length > 0) {
          console.log('First transaction sample:', JSON.stringify(response.data.transactions[0]));
        }
        
        return response.data.transactions;
      } else {
        console.warn('Invalid admin transaction data format received from API:', response.data);
        return this.getMockAdminTransactions();
      }
    } catch (error) {
      console.error('Error fetching admin transaction history:', error);
      // Return mock data as fallback
      return this.getMockAdminTransactions();
    }
  }
  
  /**
   * Get mock admin transaction data for fallback
   * @returns Mock admin transaction data
   */
  private getMockAdminTransactions(): AdminTransaction[] {
    const transactions = this.getMockTransactions();
    const users = [
      { id: 1, name: 'გიორგი მაისურაძე', email: 'giorgi@example.com' },
      { id: 2, name: 'ნინო ბერიძე', email: 'nino@example.com' },
      { id: 3, name: 'დავით კვარაცხელია', email: 'davit@example.com' },
      { id: 4, name: 'თამარ ლომიძე', email: 'tamar@example.com' },
      { id: 5, name: 'ლევან გვენეტაძე', email: 'levan@example.com' }
    ];
    
    // Create more mock transactions for multiple users
    const now = new Date();
    const mockTransactions: AdminTransaction[] = [];
    
    // Add original transactions with user 1
    transactions.forEach(t => {
      mockTransactions.push({
        ...t,
        user: users[0]
      });
    });
    
    // Add more mock transactions for other users
    for (let i = 1; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const transactionDate = new Date(now);
      transactionDate.setDate(transactionDate.getDate() - randomDaysAgo);
      
      // Randomize transaction type
      const types = ['deposit', 'vip_purchase'] as const;
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      // Randomize amount based on type
      let amount = 0;
      if (randomType === 'deposit') {
        amount = Math.floor(Math.random() * 500) + 10; // 10-510 GEL
      } else {
        amount = -(Math.floor(Math.random() * 50) + 5); // -5 to -55 GEL for VIP purchase
      }
      
      // Randomize status
      const statuses = ['completed', 'pending', 'failed'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create transaction description based on type
      let description = '';
      if (randomType === 'deposit') {
        description = 'ბალანსის შევსება';
      } else {
        const days = Math.floor(Math.random() * 30) + 1;
        description = `VIP სტატუსის შეძენა ${days} დღით`;
      }
      
      mockTransactions.push({
        id: 100 + i,
        amount,
        type: randomType,
        description,
        status: randomStatus,
        created_at: transactionDate.toISOString(),
        reference_id: randomType === 'vip_purchase' ? 1000 + i : undefined,
        user: randomUser
      });
    }
    
    // Sort by date, newest first
    return mockTransactions.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  
  /**
   * Purchase VIP status for a car
   * @param carId Car ID to purchase VIP status for
   * @param vipStatus Type of VIP status to purchase
   * @param days Number of days for VIP status
   * @returns Purchase result
   */
  async purchaseVipStatus(carId: number, vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip', days: number, additionalServices?: {
    colorHighlighting?: boolean;
    colorHighlightingDays?: number;
    autoRenewal?: boolean;
    autoRenewalDays?: number;
  }): Promise<PurchaseVipResponse> {
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
          days: validDays, // validDays უკვე არის რიცხვითი ტიპი
          ...(additionalServices || {})
        };
        
        // ვრწმუნდებით რომ მონაცემები სწორადაა გადაცემული
        console.log('🔍 CRITICAL - SENDING REQUEST TO SERVER:');
        console.log('🔍 Request data:', JSON.stringify(requestData, null, 2));
        console.log('🔍 vipStatus:', requestData.vipStatus, '(type:', typeof requestData.vipStatus + ')');
        console.log('🔍 days:', requestData.days, '(type:', typeof requestData.days + ')');
        console.log('🔍 additionalServices original:', additionalServices);
        console.log('🔍 colorHighlighting in requestData:', requestData.colorHighlighting, '(type:', typeof requestData.colorHighlighting + ')');
        console.log('🔍 colorHighlightingDays in requestData:', requestData.colorHighlightingDays, '(type:', typeof requestData.colorHighlightingDays + ')');
        
        // გამოვთვალოთ ჯამური ფასი კლიენტის მხარეს - განახლებული ფასები შესაბამისი ბაზიდან
        let pricePerDay = 0;
        if (vipStatus === 'none') pricePerDay = 0; // Standard package, no VIP upgrade
        else if (vipStatus === 'vip') pricePerDay = 2; // Updated to match database pricing
        else if (vipStatus === 'vip_plus') pricePerDay = 5;
        else if (vipStatus === 'super_vip') pricePerDay = 7; // Updated to match database pricing
        
        // ვიღებთ დამატებითი სერვისების ფასებს
        const additionalServicesPricing = await vipPricingService.getAdditionalServicesPricing();
        
        // ვთვლით დამატებითი სერვისების ფასებს
        let additionalServicesPrice = 0;
        if (additionalServices?.colorHighlighting) {
          additionalServicesPrice += additionalServicesPricing.colorHighlighting * (additionalServices.colorHighlightingDays || validDays);
        }
        if (additionalServices?.autoRenewal) {
          additionalServicesPrice += additionalServicesPricing.autoRenewal * (additionalServices.autoRenewalDays || validDays);
        }
        
        // ვთვლით ჯამური ფასს: VIP სტატუსის ფასი + დამატებითი სერვისების ფასები
        const vipPrice = pricePerDay * validDays;
        const totalPrice = vipPrice + additionalServicesPrice;
        
        console.log('VIP pricing details:', {
          vipStatus,
          vipDays: validDays,
          vipPricePerDay: pricePerDay,
          vipTotal: vipPrice,
          colorHighlighting: additionalServices?.colorHighlighting,
          colorHighlightingDays: additionalServices?.colorHighlightingDays,
          colorHighlightingPrice: additionalServices?.colorHighlighting ? additionalServicesPricing.colorHighlighting * (additionalServices.colorHighlightingDays || validDays) : 0,
          autoRenewal: additionalServices?.autoRenewal,
          autoRenewalDays: additionalServices?.autoRenewalDays,
          autoRenewalPrice: additionalServices?.autoRenewal ? additionalServicesPricing.autoRenewal * (additionalServices.autoRenewalDays || validDays) : 0,
          additionalServicesTotal: additionalServicesPrice,
          totalPrice
        });
        
        response = await api.post<PurchaseVipResponse>(
          `/api/balance/purchase-vip`,
          { carId, ...requestData },
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
          days: validDays,
          ...(additionalServices || {})
        };
        
        // ვრწმუნდებით რომ მონაცემები სწორადაა გადაცემული
        console.log('SENDING REQUEST TO FALLBACK API:');
        console.log('Request data:', JSON.stringify(requestData));
        console.log('vipStatus:', requestData.vipStatus, '(type:', typeof requestData.vipStatus + ')');
        console.log('days:', requestData.days, '(type:', typeof requestData.days + ')');
        
        // გამოვთვალოთ ჯამური ფასი კლიენტის მხარეს - განახლებული ფასები შესაბამისი ბაზიდან
        let pricePerDay = 0;
        if (vipStatus === 'none') pricePerDay = 0; // Standard package, no VIP upgrade
        else if (vipStatus === 'vip') pricePerDay = 2; // Updated to match database pricing
        else if (vipStatus === 'vip_plus') pricePerDay = 5;
        else if (vipStatus === 'super_vip') pricePerDay = 7; // Updated to match database pricing
        
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
