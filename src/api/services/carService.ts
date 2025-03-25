import api from '../config/axios';
import { mockBrands } from '../../data/mockData';
import { NewCarFormData } from '../../pages/Profile/pages/AddCar/types';

export interface CarImage {
  original_name: string;
  thumbnail: string;
  medium: string;
  large: string;
}

interface CarData {
  id: string;
  brand_id: number;
  category_id: number;
  model: string;
  year: number;
  price: number;
  description?: string;
  images: CarImage[];
  specifications: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: number;
    engine_size?: number;
    horsepower?: number;
    doors?: number;
    color?: string;
    body_type?: string;
    drive_type?: string;
  };
  city: string;
  state: string;
  country: string;
  isVip?: boolean;
  seller?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
}

interface GetCarsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  brand_id?: number;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
}

const validateNewCarData = (data: any): void => {
  const requiredFields = [
    { key: 'brand_id', type: 'number' },
    { key: 'category_id', type: 'number' },
    { key: 'model', type: 'string' },
    { key: 'year', type: 'number', min: 1900, max: new Date().getFullYear() + 1 },
    { key: 'price', type: 'number', min: 0 },
    { key: 'city', type: 'string' },
    { key: 'state', type: 'string' },
    { key: 'country', type: 'string' },
    { key: 'location_type', type: 'string' },
    { key: 'status', type: 'string' }
  ];

  for (const field of requiredFields) {
    if (data[field.key] === undefined || data[field.key] === null || data[field.key] === '') {
      throw new Error(`${field.key} is required`);
    }

    if (field.type === 'number') {
      const num = Number(data[field.key]);
      if (isNaN(num)) {
        throw new Error(`${field.key} must be a number`);
      }
      if (field.min !== undefined && num < field.min) {
        throw new Error(`${field.key} must be greater than ${field.min}`);
      }
      if (field.max !== undefined && num > field.max) {
        throw new Error(`${field.key} must be less than ${field.max}`);
      }
    }

    if (field.type === 'string' && typeof data[field.key] !== 'string') {
      throw new Error(`${field.key} must be a string`);
    }
  }

  // Validate specifications
  if (!data.specifications || typeof data.specifications !== 'object') {
    throw new Error('specifications is required and must be an object');
  }

  const requiredSpecifications = [
    { key: 'transmission', type: 'string' },
    { key: 'fuel_type', type: 'string' },
    { key: 'body_type', type: 'string' },
    { key: 'drive_type', type: 'string' }
  ];

  for (const spec of requiredSpecifications) {
    if (!data.specifications[spec.key]) {
      throw new Error(`specifications.${spec.key} is required`);
    }
  }
};

const carService = {
  // Get all brands
  getBrands: async () => {
    try {
      const response = await api.get('/cars/brands');
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid API response format, using mock data');
        return mockBrands;
      }

      // Map API response to include models
      const brandsWithModels = response.data.map((apiBrand: any) => {
        const mockBrand = mockBrands.find(mock => 
          mock.name.toLowerCase() === apiBrand.name.toLowerCase() ||
          mock.name.toLowerCase().includes(apiBrand.name.toLowerCase()) ||
          apiBrand.name.toLowerCase().includes(mock.name.toLowerCase())
        );

        return {
          id: apiBrand.id,
          name: apiBrand.name,
          models: mockBrand?.models || []
        };
      });

      return brandsWithModels;
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      throw new Error(error.response?.data?.message || 'მარკების ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  // Get models for a specific brand
  getModels: async (brandId: string) => {
    try {
      const response = await api.get(`/cars/brands/${brandId}/models`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid API response format for models, using mock data');
        const selectedBrand = mockBrands.find(brand => brand.id === Number(brandId));
        return selectedBrand?.models || [];
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching models:', error);
      // Fallback to mock data on API error
      const selectedBrand = mockBrands.find(brand => brand.id === Number(brandId));
      if (!selectedBrand) {
        throw new Error('მოდელების ჩატვირთვისას მოხდა შეცდომა');
      }
      return selectedBrand.models;
    }
  },

  // Create a new car
  createCar: async (formData: NewCarFormData, images: File[], featuredImageIndex: number) => {
    try {
      if (!images || images.length === 0) {
        throw new Error('At least one image is required');
      }

      validateNewCarData(formData);

      const data = new FormData();
      data.append('carData', JSON.stringify(formData));
      
      images.forEach((image) => {
        data.append('images', image);
      });

      data.append('featuredImageIndex', featuredImageIndex.toString());

      const response = await api.post('/cars', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'მანქანის დამატებისას მოხდა შეცდომა';
      throw new Error(errorMessage);
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/cars/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'კატეგორიების ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  updateCar: async (id: string, formData: Partial<NewCarFormData>, images?: File[], featuredImageIndex?: number) => {
    try {
      const data = new FormData();
      data.append('carData', JSON.stringify(formData));
      
      if (images) {
        images.forEach((image) => {
          data.append('images', image);
        });
      }
      
      if (typeof featuredImageIndex === 'number') {
        data.append('featuredImageIndex', featuredImageIndex.toString());
      }

      const response = await api.put(`/cars/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'მანქანის განახლებისას მოხდა შეცდომა');
    }
  },

  getAllCars: async (params: GetCarsParams = {}) => {
    try {
      const response = await api.get('/cars', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'მანქანების ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  getCarById: async (id: string) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'მანქანის ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  deleteCar: async (id: string) => {
    try {
      const response = await api.delete(`/cars/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'მანქანის წაშლისას მოხდა შეცდომა');
    }
  },

  getUserCars: async () => {
    try {
      const response = await api.get('/cars/user');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'თქვენი მანქანების ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  getFavoriteCars: async () => {
    try {
      const response = await api.get('/cars/favorites');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ფავორიტი მანქანების ჩატვირთვისას მოხდა შეცდომა');
    }
  },

  toggleFavorite: async (carId: string) => {
    try {
      const response = await api.post(`/cars/${carId}/favorite`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ფავორიტებში დამატებისას მოხდა შეცდომა');
    }
  },

  getSimilarCars: async (carId: string) => {
    try {
      const response = await api.get(`/cars/${carId}/similar`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'მსგავსი მანქანების ჩატვირთვისას მოხდა შეცდომა');
    }
  }
};

export default carService;