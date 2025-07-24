import api from '../config/api';

export interface VipServicePricing {
  id: number;
  service_type: string;
  price: number;
  duration_days: number;
  is_daily_price: boolean;
  created_at: string;
  updated_at: string;
}

export interface VipPricingData {
  packages: VipServicePricing[];
  additionalServices: VipServicePricing[];
  all: VipServicePricing[];
}

class VipPricingService {
  private cache: VipPricingData | null = null;
  private cacheTimestamp: number = 0;
  private cacheExpiration: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.cacheTimestamp) < this.cacheExpiration;
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Get all VIP pricing data with caching
   */
  public async getAllPricing(): Promise<VipPricingData> {
    if (this.isCacheValid() && this.cache) {
      return this.cache;
    }

    try {
      const response = await api.get('/api/pricing');
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const allPricing: VipServicePricing[] = response.data.data;
        
        // Organize pricing data
        const packages = allPricing.filter(item => 
          ['free', 'vip', 'vip_plus', 'super_vip'].includes(item.service_type)
        );
        
        const additionalServices = allPricing.filter(item => 
          ['color_highlighting', 'auto_renewal'].includes(item.service_type)
        );

        this.cache = {
          packages,
          additionalServices,
          all: allPricing
        };
        this.cacheTimestamp = Date.now();
        
        return this.cache;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching VIP pricing:', error);
      
      // Return fallback data if API fails
      const fallbackData: VipPricingData = {
        packages: [
          { id: 1, service_type: 'free', price: 0, duration_days: 30, is_daily_price: false, created_at: '', updated_at: '' },
          { id: 2, service_type: 'vip', price: 2, duration_days: 1, is_daily_price: true, created_at: '', updated_at: '' },
          { id: 3, service_type: 'vip_plus', price: 5, duration_days: 1, is_daily_price: true, created_at: '', updated_at: '' },
          { id: 4, service_type: 'super_vip', price: 7, duration_days: 1, is_daily_price: true, created_at: '', updated_at: '' }
        ],
        additionalServices: [
          { id: 5, service_type: 'color_highlighting', price: 0.5, duration_days: 1, is_daily_price: true, created_at: '', updated_at: '' },
          { id: 6, service_type: 'auto_renewal', price: 0.5, duration_days: 1, is_daily_price: true, created_at: '', updated_at: '' }
        ],
        all: []
      };
      
      fallbackData.all = [...fallbackData.packages, ...fallbackData.additionalServices];
      
      return fallbackData;
    }
  }

  /**
   * Get VIP packages only
   */
  public async getVipPackages(): Promise<VipServicePricing[]> {
    const data = await this.getAllPricing();
    return data.packages;
  }

  /**
   * Get additional services only
   */
  public async getAdditionalServices(): Promise<VipServicePricing[]> {
    const data = await this.getAllPricing();
    return data.additionalServices;
  }

  /**
   * Get pricing for a specific service type
   */
  public async getPricingByServiceType(serviceType: string): Promise<VipServicePricing | null> {
    const data = await this.getAllPricing();
    return data.all.find(item => item.service_type === serviceType) || null;
  }

  /**
   * Get price for a specific VIP status (legacy compatibility)
   */
  public async getVipPrice(vipStatus: string): Promise<number> {
    const pricing = await this.getPricingByServiceType(vipStatus);
    return pricing ? pricing.price : 0;
  }

  /**
   * Get prices for additional services
   */
  public async getAdditionalServicesPricing(): Promise<{colorHighlighting: number, autoRenewal: number}> {
    const data = await this.getAllPricing();
    
    const colorHighlighting = data.additionalServices.find(s => s.service_type === 'color_highlighting')?.price || 0.5;
    const autoRenewal = data.additionalServices.find(s => s.service_type === 'auto_renewal')?.price || 0.5;
    
    return {
      colorHighlighting,
      autoRenewal
    };
  }

  /**
   * Calculate total price including additional services
   */
  public async calculateTotalPrice(
    vipStatus: string, 
    includeColorHighlighting: boolean = false, 
    includeAutoRenewal: boolean = false
  ): Promise<number> {
    const vipPrice = await this.getVipPrice(vipStatus);
    const additionalServices = await this.getAdditionalServicesPricing();
    
    let total = vipPrice;
    
    if (includeColorHighlighting) {
      total += additionalServices.colorHighlighting;
    }
    
    if (includeAutoRenewal) {
      total += additionalServices.autoRenewal;
    }
    
    return total;
  }

  /**
   * Get formatted price display for a service
   */
  public async getFormattedPrice(serviceType: string): Promise<string> {
    const pricing = await this.getPricingByServiceType(serviceType);
    
    if (!pricing) {
      return '0 ლარი';
    }
    
    if (serviceType === 'free') {
      return 'უფასო';
    }
    
    if (pricing.is_daily_price) {
      return `${pricing.price} ლარი / დღე`;
    } else {
      return `${pricing.price} ლარი (${pricing.duration_days} დღე)`;
    }
  }

  /**
   * Check if a service has daily pricing
   */
  public async isDailyPricing(serviceType: string): Promise<boolean> {
    const pricing = await this.getPricingByServiceType(serviceType);
    return pricing ? pricing.is_daily_price : true;
  }
}

export default new VipPricingService();