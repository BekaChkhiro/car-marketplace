import api from '../config/axios';

export interface Advertisement {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  placement: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  impressions?: number;
  clicks?: number;
}

export interface AdvertisementAnalytics {
  id: number;
  title: string;
  placement: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate (percentage)
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Mock data for when the API call fails
const mockAdvertisements: Advertisement[] = [
  {
    id: 1,
    title: 'პირველი რეკლამა',
    image_url: 'https://via.placeholder.com/800x200',
    link_url: 'https://example.com',
    placement: 'home_banner',
    start_date: '2025-04-01',
    end_date: '2025-06-01',
    is_active: true,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'მეორე რეკლამა',
    image_url: 'https://via.placeholder.com/300x400',
    link_url: 'https://example.com/promo',
    placement: 'sidebar',
    start_date: '2025-04-01',
    end_date: '2025-05-15',
    is_active: true,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z'
  }
];

// Mock analytics data for development
const mockAnalytics: AdvertisementAnalytics[] = [
  {
    id: 1,
    title: 'პირველი რეკლამა',
    placement: 'home_banner',
    impressions: 2450,
    clicks: 127,
    ctr: 5.18,
    start_date: '2025-04-01',
    end_date: '2025-06-01',
    is_active: true
  },
  {
    id: 2,
    title: 'მეორე რეკლამა',
    placement: 'sidebar',
    impressions: 1852,
    clicks: 93,
    ctr: 5.02,
    start_date: '2025-04-01',
    end_date: '2025-05-15',
    is_active: true
  }
];

const advertisementService = {
  // Get all advertisements (admin)
  async getAll(): Promise<Advertisement[]> {
    try {
      console.log('Fetching advertisements from API');
      const response = await api.get('/api/advertisements');
      return response.data;
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      console.log('Using mock advertisements data instead of API');
      return mockAdvertisements; // Return mock data if API call fails
    }
  },

  // Get active advertisements by placement
  async getByPlacement(placement: string): Promise<Advertisement[]> {
    try {
      console.log(`Fetching advertisements by placement: ${placement}`);
      const response = await api.get(`/api/advertisements/placement/${placement}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching advertisements for placement ${placement}:`, error);
      return mockAdvertisements.filter(ad => ad.placement === placement);
    }
  },

  // Get advertisement by ID
  async getById(id: number): Promise<Advertisement | null> {
    try {
      console.log(`Fetching advertisement by ID: ${id}`);
      const response = await api.get(`/api/advertisements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching advertisement with id ${id}:`, error);
      return mockAdvertisements.find(ad => ad.id === id) || null;
    }
  },

  // Create new advertisement
  async create(advertisementData: FormData): Promise<Advertisement> {
    try {
      console.log('Creating advertisement');
      const response = await api.post('/api/advertisements', advertisementData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating advertisement:', error);
      throw error;
    }
  },

  // Update advertisement
  async update(id: number, advertisementData: FormData): Promise<Advertisement> {
    try {
      console.log(`Updating advertisement with id ${id}`);
      
      // Ensure the existing image_url is preserved if no new image is provided
      if (!advertisementData.get('image') || (advertisementData.get('image') as File).size === 0) {
        // If we're not uploading a new image, make sure we have the current image URL
        if (!advertisementData.get('image_url')) {
          try {
            const currentAd = await this.getById(id);
            if (currentAd && currentAd.image_url) {
              advertisementData.set('image_url', currentAd.image_url);
            }
          } catch (err) {
            console.warn('Could not fetch current advertisement for image URL preservation');
          }
        }
      }
      
      const response = await api.put(`/api/advertisements/${id}`, advertisementData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating advertisement with id ${id}:`, error);
      throw error;
    }
  },

  // Delete advertisement
  async delete(id: number): Promise<void> {
    try {
      console.log(`Deleting advertisement with id ${id}`);
      await api.delete(`/api/advertisements/${id}`);
    } catch (error) {
      console.error(`Error deleting advertisement with id ${id}:`, error);
      throw error;
    }
  },

  // Record advertisement impression
  async recordImpression(id: number): Promise<void> {
    try {
      console.log(`Recording impression for advertisement id ${id}`);
      await api.post(`/api/advertisements/impression/${id}`);
    } catch (error) {
      console.error(`Error recording impression for advertisement id ${id}:`, error);
      // Silently fail - don't disrupt user experience for analytics
    }
  },

  // Record advertisement click
  async recordClick(id: number): Promise<void> {
    try {
      console.log(`Recording click for advertisement id ${id}`);
      await api.post(`/api/advertisements/click/${id}`);
    } catch (error) {
      console.error(`Error recording click for advertisement id ${id}:`, error);
      // Silently fail - don't disrupt user experience for analytics
    }
  },

  // Get analytics for a specific advertisement
  async getAnalytics(id: number): Promise<AdvertisementAnalytics | null> {
    try {
      console.log(`Fetching analytics for advertisement id ${id}`);
      const response = await api.get(`/api/advertisements/analytics/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for advertisement id ${id}:`, error);
      return mockAnalytics.find(item => item.id === id) || null;
    }
  },

  // Get analytics for all advertisements
  async getAllAnalytics(): Promise<AdvertisementAnalytics[]> {
    try {
      console.log('Fetching analytics for all advertisements');
      const response = await api.get('/api/advertisements/analytics/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics for all advertisements:', error);
      return mockAnalytics;
    }
  }
};

export default advertisementService;
