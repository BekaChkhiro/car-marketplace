import api from '../config/api';
import { Car, Brand, Category, CarFilters, CreateCarFormData, UpdateCarFormData } from '../types/car.types';
import { getAccessToken } from '../utils/tokenStorage';

class CarService {
  async getCars(filters?: CarFilters): Promise<Car[]> {
    try {
      const response = await api.get('/api/cars', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getCars] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCars] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCars] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve cars.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getCar(id: number): Promise<Car> {
    try {
      const response = await api.get(`/api/cars/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCar] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve car.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get('/api/cars/brands');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getBrands] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getBrands] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getBrands] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve brands.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getModelsByBrand(brandId: number): Promise<string[]> {
    try {
      console.log('[CarService.getModelsByBrand] Fetching models for brand ID:', brandId);
      
      // First get brand name
      const brand = await this.getBrandById(brandId);
      if (!brand) {
        console.error('[CarService.getModelsByBrand] Brand not found for ID:', brandId);
        throw new Error('ბრენდი ვერ მოიძებნა');
      }
      
      console.log('[CarService.getModelsByBrand] Found brand:', brand.name);
      
      // First, try to get models directly by brand ID (new endpoint)
      try {
        console.log('[CarService.getModelsByBrand] Trying to fetch models directly by brand ID:', brandId);
        const response = await api.get(`/api/cars/brands/id/${brandId}/models`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('[CarService.getModelsByBrand] Successfully retrieved models by ID:', response.data);
          return response.data;
        } else {
          console.warn('[CarService.getModelsByBrand] No models returned for brand ID, trying by name next');
        }
      } catch (idError) {
        console.warn('[CarService.getModelsByBrand] Failed to get models by ID, falling back to name-based endpoint');
      }
      
      // If ID-based endpoint failed or returned no data, try the name-based endpoint
      try {
        const brandNameEncoded = encodeURIComponent(brand.name.toLowerCase());
        console.log('[CarService.getModelsByBrand] Requesting models with URL:', `/api/cars/brands/${brandNameEncoded}/models`);
        
        const response = await api.get(`/api/cars/brands/${brandNameEncoded}/models`);
        console.log('[CarService.getModelsByBrand] Server response:', response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('[CarService.getModelsByBrand] Successfully retrieved models from server:', response.data);
          return response.data;
        } else {
          console.warn('[CarService.getModelsByBrand] Empty models array from server, will use fallbacks');
        }
      } catch (apiError) {
        console.error('[CarService.getModelsByBrand] API error when fetching by name:', apiError);
        // Continue to fallbacks
      }
      
      // Only use fallbacks if both server endpoints failed
      console.warn('[CarService.getModelsByBrand] All server endpoints failed, using local fallbacks');
      const fallbackModels: Record<string, string[]> = {
        'audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'e-tron', 'RS6', 'TT'],
        'bmw': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M3', 'M5', 'i4', 'iX'],
        'mercedes': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'AMG GT'],
        'toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Prius', 'Highlander', 'Avalon', '4Runner', 'Tacoma', 'Tundra'],
        'honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Passport', 'Insight'],
        'ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Ranger', 'Bronco', 'Expedition', 'Focus'],
        'chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Traverse', 'Malibu', 'Camaro', 'Suburban', 'Colorado', 'Blazer'],
        'volkswagen': ['Golf', 'Passat', 'Tiguan', 'Atlas', 'Jetta', 'Arteon', 'ID.4', 'Taos', 'GTI'],
        'hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq'],
        'kia': ['Forte', 'K5', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Seltos', 'Carnival', 'Stinger']
      };
      
      // Try direct match first
      const brandNameLower = brand.name.toLowerCase();
      if (fallbackModels[brandNameLower]) {
        console.log(`[CarService.getModelsByBrand] Direct fallback match found for: ${brandNameLower}`);
        return fallbackModels[brandNameLower];
      }
      
      // Try partial matches if no direct match
      for (const [key, models] of Object.entries(fallbackModels)) {
        if (brandNameLower.includes(key) || key.includes(brandNameLower)) {
          console.log(`[CarService.getModelsByBrand] Partial match found! Using fallback models for ${key}`);
          return models;
        }
      }
      
      // Last resort fallback
      console.log('[CarService.getModelsByBrand] No matching fallbacks found, using default models');
      return ['Model 1', 'Model 2', 'Model 3', 'Other'];
      
    } catch (error: any) {
      console.error('[CarService.getModelsByBrand] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getModelsByBrand] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getModelsByBrand] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve models.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.warn('[CarService.getModelsByBrand] Returning empty models array due to error:', errorMessage);
      return [];
    }
  }

  async getBrandById(brandId: number): Promise<Brand | null> {
    try {
      const brands = await this.getBrands();
      return brands.find(brand => brand.id === brandId) || null;
    } catch (error: any) {
      console.error('[CarService.getBrandById] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getBrandById] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getBrandById] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve brand.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/api/cars/categories');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getCategories] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCategories] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCategories] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve categories.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async createCar(data: CreateCarFormData): Promise<Car> {
    try {
      console.log('[CarService.createCar] Starting car creation');
      
      // Validate required fields
      if (!data.brand_id && data.brand_id !== 0) {
        throw new Error('Brand ID is required');
      }
      
      if (!data.category_id && data.category_id !== 0) {
        throw new Error('Category ID is required');
      }
      
      if (!data.model) {
        throw new Error('Model is required');
      }

      // Translate drive type from Georgian to English
      const driveType = data.specifications?.drive_type || '';
      const translatedDriveType = this.translateDriveType(driveType);
      console.log('[CarService.createCar] Translating drive type:', driveType, '->', translatedDriveType);
      
      // SINGLE FOCUSED APPROACH: Create a car data object with model at the top level
      const carData = {
        model: data.model, // Critical field - ensure it's at the top level
        brand_id: Number(data.brand_id),
        category_id: Number(data.category_id),
        year: Number(data.year || new Date().getFullYear()),
        price: Number(data.price || 0),
        description_ka: data.description_ka || '',
        description_en: data.description_en || '',
        description_ru: data.description_ru || '',
        
        // Include specifications as a nested object
        specifications: {
          drive_type: translatedDriveType,
          engine_type: data.specifications?.engine_type || 'gasoline',
          transmission: data.specifications?.transmission || 'manual',
          fuel_type: data.specifications?.fuel_type || 'petrol',
          mileage: Number(data.specifications?.mileage || 0),
          // Convert engine size from cc to liters (divide by 1000) to fit in database DECIMAL(3,1)
          engine_size: data.specifications?.engine_size ? Number(data.specifications.engine_size) / 1000 : 0,
          cylinders: Number(data.specifications?.cylinders || 0),
          color: data.specifications?.color || 'black',
          body_type: data.specifications?.body_type || 'sedan',
          steering_wheel: this.translateSteeringWheel(data.specifications?.steering_wheel || 'LEFT'),
          airbags_count: Number(data.specifications?.airbags_count || 0),
          interior_material: data.specifications?.interior_material || 'leather',
          interior_color: data.specifications?.interior_color || 'black',
          has_board_computer: Boolean(data.specifications?.has_board_computer),
          has_alarm: Boolean(data.specifications?.has_alarm),
        },
        
        // Include location at the top level (flat structure)
        location: {
          city: data.location?.city || 'თბილისი',
          state: data.location?.state || '',
          country: data.location?.country || 'საქართველო',
          location_type: data.location?.location_type || 'georgia',
          is_transit: Boolean(data.location?.is_transit)
        }
      };
      
      console.log('[CarService.createCar] Car data:', carData);
      console.log('[CarService.createCar] Model field:', carData.model); // Verify model is present
      
      // Create FormData ONLY for the images and data string
      const formData = new FormData();
      
      // This is the critical part - stringify the data and double-check it's valid JSON
      const dataStr = JSON.stringify(carData);
      
      // Verify JSON is parseable
      try {
        const parsed = JSON.parse(dataStr);
        console.log('[CarService.createCar] JSON validated, model=', parsed.model);
      } catch (e) {
        console.error('[CarService.createCar] Invalid JSON:', e);
      }
      
      // Send as a plain string
      formData.append('data', dataStr);
      
      // Add images
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i]);
        }
        console.log(`[CarService.createCar] Added ${data.images.length} images to form`);
      }
      
      // CRITICAL: Use a direct HTTP fetch with minimum headers to avoid any issues
      const baseURL = api.defaults.baseURL || 'http://localhost:5000';
      const token = getAccessToken();
      
      console.log('[CarService.createCar] Sending request with token present:', !!token);
      
      const response = await fetch(`${baseURL}/api/cars`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      
      // Parse response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[CarService.createCar] Server error response:', errorData);
        throw new Error(`Server error: ${errorData.details || errorData.error || 'Unknown error'}`);
      }
      
      const responseData = await response.json();
      console.log('[CarService.createCar] Success! Response:', responseData);
      return responseData.data || responseData;
    } catch (error: any) {
      console.error('[CarService.createCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.createCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.createCar] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to create car.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateCar(id: number, data: UpdateCarFormData): Promise<Car> {
    try {
      const formData = new FormData();
      
      // Process specifications to ensure engine_size is properly converted
      let specifications = { ...data.specifications };
      
      // Convert engine size from cc to liters
      if (specifications?.engine_size) {
        specifications.engine_size = Number(specifications.engine_size) / 1000;
      }
      
      // Add all non-file data
      formData.append('data', JSON.stringify({
        brand_id: data.brand_id,
        category_id: data.category_id,
        model: data.model,
        year: data.year,
        price: data.price,
        description_ka: data.description_ka,
        description_en: data.description_en,
        description_ru: data.description_ru,
        specifications: specifications,
        location: data.location ? {
          ...data.location,
          location_type: data.location.location_type || 'georgia',
          country: data.location.location_type === 'international' ? data.location.country : 'საქართველო'
        } : undefined
      }));

      // Add new images if provided
      if (data.images?.length) {
        data.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await api.put(`/api/cars/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[CarService.updateCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.updateCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.updateCar] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to update car.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async deleteCar(id: number): Promise<void> {
    try {
      await api.delete(`/api/cars/${id}`);
    } catch (error: any) {
      console.error('[CarService.deleteCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.deleteCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.deleteCar] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to delete car.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getSimilarCars(id: number, category: string): Promise<Car[]> {
    try {
      const response = await api.get(`/api/cars/${id}/similar`, {
        params: { category }
      });
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getSimilarCars] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getSimilarCars] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getSimilarCars] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve similar cars.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async toggleFavorite(carId: number): Promise<void> {
    try {
      await api.post(`/api/cars/${carId}/favorite`);
    } catch (error: any) {
      console.error('[CarService.toggleFavorite] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.toggleFavorite] Server error response:', error.response.data);
      } else {
        console.log('[CarService.toggleFavorite] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to toggle favorite.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getFavorites(): Promise<Car[]> {
    try {
      const response = await api.get('/api/cars/favorites');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getFavorites] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getFavorites] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getFavorites] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve favorites.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async getUserCars(): Promise<Car[]> {
    try {
      const response = await api.get('/api/cars/user');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getUserCars] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getUserCars] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getUserCars] No response data available');
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to retrieve user cars.';
      
      if (error?.response?.data?.details) {
        if (error.response.data.details.includes('numeric field overflow')) {
          errorMessage = 'One of the numeric values exceeds the database field limit. Please check large number entries.';
        } else {
          errorMessage = `Server error: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  private translateDriveType(georgianDriveType: string): string {
    const driveTypeMap: {[key: string]: string} = {
      'წინა': 'front',
      'უკანა': 'rear',
      '4x4': '4x4',
      'RWD': 'rear',
      'FWD': 'front',
      'AWD': '4x4'
    };
    
    return driveTypeMap[georgianDriveType] || georgianDriveType;
  }

  private translateSteeringWheel(steeringWheel: string): string {
    // First normalize the input by trimming and converting to lowercase
    const normalizedInput = steeringWheel ? String(steeringWheel).trim() : '';
    
    // Log the input value for debugging
    console.log('[CarService.translateSteeringWheel] Input:', steeringWheel);
    console.log('[CarService.translateSteeringWheel] Normalized:', normalizedInput);
    
    // Map of possible values to their correct form
    const steeringWheelMap: {[key: string]: string} = {
      'მარჯვენა': 'right',
      'მარცხენა': 'left',
      'right': 'right',
      'left': 'left',
      'RIGHT': 'right',
      'LEFT': 'left'
    };
    
    // Get the mapped value or default to 'left'
    const result = steeringWheelMap[normalizedInput] || 'left';
    
    // Final validation to ensure it's exactly 'left' or 'right'
    const finalResult = result === 'right' ? 'right' : 'left';
    
    console.log('[CarService.translateSteeringWheel] Final result:', finalResult);
    return finalResult;
  }
}

export default new CarService();