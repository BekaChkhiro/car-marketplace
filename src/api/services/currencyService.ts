import axios from 'axios';

export interface CurrencyRate {
  code: string;
  quantity: number;
  rate: number;
  name: string;
  date: string;
  validFromDate: string;
}

interface NBGCurrencyResponse {
  date: string;
  currencies: CurrencyRate[];
}

class CurrencyService {
  private rates: Map<string, CurrencyRate> = new Map();
  private lastUpdated: Date | null = null;
  private updateInterval = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  private readonly API_URL = 'https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json/';

  constructor() {
    this.initializeRates();
  }

  private async initializeRates(): Promise<void> {
    try {
      await this.fetchLatestRates();
      // Set up periodic updates
      setInterval(() => this.fetchLatestRates(), this.updateInterval);
    } catch (error) {
      console.error('Failed to initialize currency rates:', error);
      // Set fallback rates
      this.setFallbackRates();
    }
  }

  private setFallbackRates(): void {
    // Default USD to GEL rate as fallback
    const usdRate: CurrencyRate = {
      code: 'USD',
      quantity: 1,
      rate: 2.7227, // Fallback rate
      name: 'აშშ დოლარი',
      date: new Date().toISOString(),
      validFromDate: new Date().toISOString()
    };
    
    this.rates.set('USD', usdRate);
    this.lastUpdated = new Date();
  }

  public async fetchLatestRates(): Promise<void> {
    try {
      console.log('Fetching latest currency rates from NBG...');
      const response = await axios.get<NBGCurrencyResponse[]>(this.API_URL);
      
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        
        // Clear existing rates
        this.rates.clear();
        
        // Add GEL as base currency (1:1 rate)
        const gelRate: CurrencyRate = {
          code: 'GEL',
          quantity: 1,
          rate: 1,
          name: 'ქართული ლარი',
          date: data.date,
          validFromDate: data.date
        };
        this.rates.set('GEL', gelRate);
        
        // Add other currencies
        data.currencies.forEach(currency => {
          this.rates.set(currency.code, currency);
        });
        
        this.lastUpdated = new Date();
        console.log(`Currency rates updated at ${this.lastUpdated.toLocaleString()}`);
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      // If we don't have any rates yet, set fallback rates
      if (this.rates.size === 0) {
        this.setFallbackRates();
      }
    }
  }

  public getRate(currencyCode: string): number {
    // GEL is our base currency with rate 1
    if (currencyCode === 'GEL') return 1;
    
    const currency = this.rates.get(currencyCode);
    if (!currency) {
      console.warn(`Rate for ${currencyCode} not found, using 1:1 rate`);
      return 1;
    }
    // NBG API returns how many GEL is 1 unit of foreign currency
    return currency.rate / currency.quantity;
  }

  public convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    // If converting from GEL to another currency
    if (fromCurrency === 'GEL') {
      const toRate = this.getRate(toCurrency);
      return amount * toRate;
    }
    
    // If converting from another currency to GEL
    if (toCurrency === 'GEL') {
      const fromRate = this.getRate(fromCurrency);
      return amount / fromRate;
    }
    
    // If converting between two non-GEL currencies
    const fromRate = this.getRate(fromCurrency);
    const toRate = this.getRate(toCurrency);
    
    // Convert to GEL first, then to target currency
    const amountInGEL = amount / fromRate;
    return amountInGEL * toRate;
  }

  public formatPrice(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    try {
      return formatter.format(amount);
    } catch (error) {
      // Fallback formatting
      const symbol = currency === 'GEL' ? '₾' : currency === 'USD' ? '$' : '';
      return `${symbol}${amount.toFixed(2)}`;
    }
  }

  public getLastUpdated(): Date | null {
    return this.lastUpdated;
  }

  public getAllRates(): Map<string, CurrencyRate> {
    return new Map(this.rates);
  }
}

const currencyService = new CurrencyService();
export default currencyService;
