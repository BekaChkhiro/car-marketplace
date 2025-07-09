declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

// Google Analytics Measurement ID from environment variable
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer!.push(arguments);
    };
    
    window.gtag('js', new Date() as any);
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user interactions
export const trackUserInteraction = (action: string, element: string, additionalData?: any) => {
  trackEvent(action, 'user_interaction', element, additionalData?.value);
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', 'form_interaction', formName, success ? 1 : 0);
};

// Track search queries
export const trackSearch = (query: string, category?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      search_category: category || 'general',
    });
  }
};

// Track car/part view
export const trackItemView = (itemType: 'car' | 'part', itemId: string, itemName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      item_id: itemId,
      item_name: itemName,
      item_category: itemType,
    });
  }
};

// Track purchases or inquiries
export const trackPurchaseIntent = (itemType: 'car' | 'part', itemId: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase_intent', {
      item_id: itemId,
      item_category: itemType,
      value: value,
      currency: 'GEL',
    });
  }
};

// Track user registration
export const trackUserRegistration = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

// Track user login
export const trackUserLogin = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackFormSubmission,
  trackSearch,
  trackItemView,
  trackPurchaseIntent,
  trackUserRegistration,
  trackUserLogin,
};