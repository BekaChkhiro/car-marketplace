import api from '../config/api';

export interface VipServicePricing {
  id: number;
  service_type: string;
  price: number;
  duration_days: number;
  is_daily_price: boolean;
  user_role?: string;
  created_at: string;
  updated_at: string;
}

export interface VipPricingData {
  packages: VipServicePricing[];
  additionalServices: VipServicePricing[];
  all: VipServicePricing[];
  role?: string;
}

class VipPricingService {
  private cache: VipPricingData | null = null;
  private userCache: VipPricingData | null = null;
  private cacheTimestamp: number = 0;
  private userCacheTimestamp: number = 0;
  private cacheExpiration: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.cacheTimestamp) < this.cacheExpiration;
  }

  /**
   * Check if user cache is valid
   */
  private isUserCacheValid(): boolean {
    return this.userCache !== null && (Date.now() - this.userCacheTimestamp) < this.cacheExpiration;
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.cache = null;
    this.userCache = null;
    this.cacheTimestamp = 0;
    this.userCacheTimestamp = 0;
  }

  /**
   * Get all VIP pricing data with caching
   */
  public async getAllPricing(category: string = 'cars'): Promise<VipPricingData> {
    if (this.isCacheValid() && this.cache) {
      return this.cache;
    }

    try {
      const response = await api.get(`/api/pricing?category=${category}`);
      
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
   * Get user-specific VIP pricing based on their role
   */
  public async getUserPricing(category: string = 'cars'): Promise<VipPricingData> {
    // Check user-specific cache first
    if (this.isUserCacheValid() && this.userCache) {
      console.log('Returning cached user-specific pricing');
      return this.userCache;
    }

    try {
      console.log('Fetching fresh user-specific pricing from API');
      const response = await api.get(`/api/pricing/user?category=${category}`);
      
      if (response.data && response.data.success && response.data.data) {
        const { role, packages, services, all } = response.data.data;
        
        this.userCache = {
          packages,
          additionalServices: services,
          all,
          role
        };
        this.userCacheTimestamp = Date.now();
        
        console.log(`Cached user-specific pricing for role: ${role}`, this.userCache);
        return this.userCache;
      } else {
        console.log('Invalid user-specific pricing response, falling back to general pricing');
        // Fall back to general pricing
        return this.getAllPricing(category);
      }
    } catch (error) {
      console.error('Error fetching user-specific VIP pricing:', error);
      // Fall back to general pricing
      return this.getAllPricing(category);
    }
  }

  /**
   * Force refresh user-specific pricing (bypasses cache)
   */
  public async refreshUserPricing(category: string = 'cars'): Promise<VipPricingData> {
    // Clear user cache to force refresh
    this.userCache = null;
    this.userCacheTimestamp = 0;
    return this.getUserPricing(category);
  }

  /**
   * Get VIP packages only
   */
  public async getVipPackages(category: string = 'cars'): Promise<VipServicePricing[]> {
    const data = await this.getAllPricing(category);
    return data.packages;
  }

  /**
   * Get additional services only
   */
  public async getAdditionalServices(category: string = 'cars'): Promise<VipServicePricing[]> {
    const data = await this.getAllPricing(category);
    return data.additionalServices;
  }

  /**
   * Get pricing for a specific service type
   */
  public async getPricingByServiceType(serviceType: string, category: string = 'cars'): Promise<VipServicePricing | null> {
    const data = await this.getAllPricing(category);
    return data.all.find(item => item.service_type === serviceType) || null;
  }

  /**
   * Get price for a specific VIP status (legacy compatibility)
   */
  public async getVipPrice(vipStatus: string, category: string = 'cars'): Promise<number> {
    const pricing = await this.getPricingByServiceType(vipStatus, category);
    return pricing ? pricing.price : 0;
  }

  /**
   * Get prices for additional services
   */
  public async getAdditionalServicesPricing(category: string = 'cars'): Promise<{colorHighlighting: number, autoRenewal: number}> {
    const data = await this.getAllPricing(category);
    
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
    includeAutoRenewal: boolean = false,
    category: string = 'cars'
  ): Promise<number> {
    const vipPrice = await this.getVipPrice(vipStatus, category);
    const additionalServices = await this.getAdditionalServicesPricing(category);
    
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
  public async getFormattedPrice(serviceType: string, category: string = 'cars'): Promise<string> {
    const pricing = await this.getPricingByServiceType(serviceType, category);
    
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
  public async isDailyPricing(serviceType: string, category: string = 'cars'): Promise<boolean> {
    const pricing = await this.getPricingByServiceType(serviceType, category);
    return pricing ? pricing.is_daily_price : true;
  }
}

export default new VipPricingService();