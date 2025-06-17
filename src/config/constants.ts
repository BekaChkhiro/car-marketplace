import { API_URL } from './api';

// Export API URL
export { API_URL };

// Define types for advertising spaces
export interface AdvertisingSpaceDescription {
  ka: string;
  en: string;
  ru: string;
}

export interface AdvertisingSpaceDetails {
  price: number;
  duration: number;
  description: AdvertisingSpaceDescription;
}

export interface AdvertisingPrices {
  [key: string]: AdvertisingSpaceDetails;
}

// Advertising spaces pricing and information
export const ADVERTISING_PRICES: AdvertisingPrices = {
  // მთავარი გვერდი (Home Page)
  'home_slider': {
    price: 750,
    duration: 30, // days
    description: {
      ka: 'სლაიდერი (1200×600px)',
      en: 'Slider (1200×600px)',
      ru: 'Слайдер (1200×600px)'
    }
  },
  'home_banner': {
    price: 400,
    duration: 30,
    description: {
      ka: 'ზედა ბანერი (1200×300px)',
      en: 'Top Banner (1200×300px)',
      ru: 'Верхний баннер (1200×300px)'
    }
  },
  'home_after_vip': {
    price: 400,
    duration: 30,
    description: {
      ka: 'VIP განცხადებების შემდეგ (720×140px)',
      en: 'After VIP Listings (720×140px)',
      ru: 'После VIP объявлений (720×140px)'
    }
  },
  
  // მანქანების ყიდვის გვერდი (Car Listing Page)
  'car_listing_top': {
    price: 400,
    duration: 30,
    description: {
      ka: 'მანქანების ყიდვის გვერდი - ზედა ბანერი (728×140px)',
      en: 'Car Listing Page - Top Banner (728×140px)',
      ru: 'Страница покупки авто - верхний баннер (728×140px)'
    }
  },
  'car_listing_bottom': {
    price: 400,
    duration: 30,
    description: {
      ka: 'მანქანების ყიდვის გვერდი - ქვედა ბანერი (720×140px)',
      en: 'Car Listing Page - Bottom Banner (720×140px)',
      ru: 'Страница покупки авто - нижний баннер (720×140px)'
    }
  },
  
  // მანქანის დეტალების გვერდი (Car Details Page)
  'car_details_top': {
    price: 400,
    duration: 30,
    description: {
      ka: 'მანქანის დეტალების გვერდი - ზედა ბანერი (728×140px)',
      en: 'Car Details Page - Top Banner (728×140px)',
      ru: 'Страница деталей авто - верхний баннер (728×140px)'
    }
  },
  'car_details_bottom': {
    price: 400,
    duration: 30,
    description: {
      ka: 'მანქანის დეტალების გვერდი - შუა ბანერი (728×140px)',
      en: 'Car Details Page - Middle Banner (728×140px)',
      ru: 'Страница деталей авто - средний баннер (728×140px)'
    }
  },
  'car_details_after_similar': {
    price: 400,
    duration: 30,
    description: {
      ka: 'მანქანის დეტალების გვერდი - მსგავსი მანქანების შემდეგ (720×140px)',
      en: 'Car Details Page - After Similar Cars (720×140px)',
      ru: 'Страница деталей авто - после похожих авто (720×140px)'
    }
  }
};
