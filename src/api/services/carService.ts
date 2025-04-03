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
      
      // Fallback to mock data when API fails
      console.log('[CarService.getCars] Using fallback mock data');
      
      // Create mock cars data
      const mockCars: Car[] = [
        {
          id: 1,
          brand_id: 1,
          category_id: 1,
          brand: "BMW",
          model: "X5",
          year: 2020,
          price: 35000,
          description_ka: "ეს არის სარეზერვო მანქანის აღწერა. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: true,
          seller_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 1,
            transmission: "automatic",
            fuel_type: "Diesel",
            mileage: 45000,
            mileage_unit: "km",
            engine_size: 3.0,
            color: "Black",
            steering_wheel: "left",
            drive_type: "AWD",
            interior_color: "Beige",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 1,
            city: "Tbilisi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 1,
              car_id: 1,
              url: "/images/fallback-car-1.jpg",
              thumbnail_url: "/images/fallback-car-1-thumb.jpg",
              medium_url: "/images/fallback-car-1-medium.jpg",
              large_url: "/images/fallback-car-1-large.jpg",
              is_primary: true
            }
          ]
        },
        {
          id: 2,
          brand_id: 2,
          category_id: 2,
          brand: "Mercedes-Benz",
          model: "E-Class",
          year: 2021,
          price: 42000,
          description_ka: "ეს არის სარეზერვო მანქანის აღწერა. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: false,
          seller_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 2,
            transmission: "automatic",
            fuel_type: "Gasoline",
            mileage: 30000,
            mileage_unit: "km",
            engine_size: 2.0,
            color: "Silver",
            steering_wheel: "left",
            drive_type: "RWD",
            interior_color: "Black",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 2,
            city: "Batumi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 3,
              car_id: 2,
              url: "/images/fallback-car-2.jpg",
              thumbnail_url: "/images/fallback-car-2-thumb.jpg",
              medium_url: "/images/fallback-car-2-medium.jpg",
              large_url: "/images/fallback-car-2-large.jpg",
              is_primary: true
            }
          ]
        },
        {
          id: 3,
          brand_id: 3,
          category_id: 3,
          brand: "Toyota",
          model: "Land Cruiser",
          year: 2019,
          price: 55000,
          description_ka: "ეს არის სარეზერვო მანქანის აღწერა. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: true,
          seller_id: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 3,
            transmission: "automatic",
            fuel_type: "Diesel",
            mileage: 60000,
            mileage_unit: "km",
            engine_size: 4.5,
            color: "White",
            steering_wheel: "left",
            drive_type: "4WD",
            interior_color: "Tan",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: false,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 3,
            city: "Kutaisi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 5,
              car_id: 3,
              url: "/images/fallback-car-3.jpg",
              thumbnail_url: "/images/fallback-car-3-thumb.jpg",
              medium_url: "/images/fallback-car-3-medium.jpg",
              large_url: "/images/fallback-car-3-large.jpg",
              is_primary: true
            }
          ]
        }
      ];
      
      // Apply filters if provided
      if (filters) {
        return mockCars.filter(car => {
          // Filter by brand if provided
          if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) {
            return false;
          }
          
          // Filter by category if provided
          if (filters.category) {
            // We would need to map category string to category_id in a real implementation
            // For now, just use a simple string comparison
            return false;
          }
          
          // Filter by featured if provided
          if (filters.featured !== undefined && car.featured !== filters.featured) {
            return false;
          }
          
          return true;
        });
      }
      
      return mockCars;
    }
  }

  async getCar(id: number): Promise<Car> {
    try {
      console.log('[CarService.getCar] Fetching car with ID:', id);
      const response = await api.get(`/api/cars/${id}`);
      console.log('[CarService.getCar] Successfully retrieved car data from API');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCar] No response data available');
      }
      
      // Try to fetch from the backend directly as a fallback
      try {
        console.log('[CarService.getCar] Attempting direct backend connection at http://localhost:5000');
        const backendResponse = await fetch(`http://localhost:5000/api/cars/${id}`);
        if (backendResponse.ok) {
          const data = await backendResponse.json();
          console.log('[CarService.getCar] Successfully retrieved car data from direct backend connection');
          return data;
        } else {
          console.log('[CarService.getCar] Direct backend connection failed with status:', backendResponse.status);
        }
      } catch (backendError) {
        console.error('[CarService.getCar] Direct backend connection error:', backendError);
      }
      
      // Fallback to mock data when all API attempts fail
      console.log('[CarService.getCar] All API attempts failed. Using fallback mock data for car ID:', id);
      
      // Create mock car data
      const mockCar: Car = {
        id: id,
        brand_id: 1,
        category_id: 1,
        brand: "BMW",
        model: "X5",
        year: 2020,
        price: 35000,
        description_ka: "ეს არის სარეზერვო მანქანის აღწერა. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
        status: "available",
        featured: false,
        seller_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        specifications: {
          id: 1,
          transmission: "automatic",
          fuel_type: "Diesel",
          mileage: 45000,
          mileage_unit: "km",
          engine_size: 3.0,
          color: "Black",
          steering_wheel: "left",
          drive_type: "AWD",
          interior_color: "Beige",
          has_navigation: true,
          has_leather_interior: true,
          has_sunroof: true,
          has_bluetooth: true,
          has_rear_view_camera: true
        },
        location: {
          id: 1,
          city: "Tbilisi",
          country: "Georgia",
          location_type: "georgia",
          is_transit: false
        },
        images: [
          {
            id: 1,
            car_id: id,
            url: "/images/fallback-car-1.jpg",
            thumbnail_url: "/images/fallback-car-1-thumb.jpg",
            medium_url: "/images/fallback-car-1-medium.jpg",
            large_url: "/images/fallback-car-1-large.jpg",
            is_primary: true
          },
          {
            id: 2,
            car_id: id,
            url: "/images/fallback-car-2.jpg",
            thumbnail_url: "/images/fallback-car-2-thumb.jpg",
            medium_url: "/images/fallback-car-2-medium.jpg",
            large_url: "/images/fallback-car-2-large.jpg",
            is_primary: false
          }
        ]
      };
      
      return mockCar;
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
        currency: data.currency || 'GEL', // Use the selected currency (GEL or USD)
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
        currency: data.currency || 'GEL', // Include currency field
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
      console.log('[CarService.deleteCar] Attempting to delete car with ID:', id);
      await api.delete(`/api/cars/${id}`, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      console.log('[CarService.deleteCar] Successfully deleted car');
    } catch (error: any) {
      console.error('[CarService.deleteCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.deleteCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.deleteCar] No response data available');
      }
      
      // Try to delete from the backend directly as a fallback
      try {
        console.log('[CarService.deleteCar] Attempting direct backend connection at http://localhost:5000');
        const backendResponse = await fetch(`http://localhost:5000/api/cars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        });
        if (backendResponse.ok) {
          console.log('[CarService.deleteCar] Successfully deleted car via direct backend connection');
          return;
        } else {
          console.log('[CarService.deleteCar] Direct backend connection failed with status:', backendResponse.status);
        }
      } catch (backendError) {
        console.error('[CarService.deleteCar] Direct backend connection error:', backendError);
      }
      
      // Provide a more user-friendly error message
      let errorMessage = 'Failed to delete car.';
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.details) {
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
      console.log('[CarService.getSimilarCars] Fetching similar cars for ID:', id, 'and category:', category);
      const response = await api.get(`/api/cars/${id}/similar`, {
        params: { category }
      });
      console.log('[CarService.getSimilarCars] Successfully retrieved similar cars data from API');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getSimilarCars] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getSimilarCars] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getSimilarCars] No response data available');
      }
      
      // Try to fetch from the backend directly as a fallback
      try {
        console.log('[CarService.getSimilarCars] Attempting direct backend connection at http://localhost:5000');
        const backendResponse = await fetch(`http://localhost:5000/api/cars/${id}/similar?category=${encodeURIComponent(category)}`);
        if (backendResponse.ok) {
          const data = await backendResponse.json();
          console.log('[CarService.getSimilarCars] Successfully retrieved similar cars data from direct backend connection');
          return data;
        } else {
          console.log('[CarService.getSimilarCars] Direct backend connection failed with status:', backendResponse.status);
        }
      } catch (backendError) {
        console.error('[CarService.getSimilarCars] Direct backend connection error:', backendError);
      }
      
      // Fallback to mock data when all API attempts fail
      console.log('[CarService.getSimilarCars] All API attempts failed. Using fallback mock data');
      
      // Create mock similar cars data
      const mockSimilarCars: Car[] = [
        {
          id: id + 100,
          brand_id: 1,
          category_id: Number(category) || 1,
          brand: "BMW",
          model: "X3",
          year: 2021,
          price: 32000,
          description_ka: "სარეზერვო მსგავსი მანქანის აღწერა.",
          status: "available",
          featured: true,
          seller_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 1,
            transmission: "automatic",
            fuel_type: "Diesel",
            mileage: 35000,
            mileage_unit: "km",
            engine_size: 2.0,
            color: "Blue",
            steering_wheel: "left",
            drive_type: "AWD",
            interior_color: "Black",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 1,
            city: "Tbilisi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 10,
              car_id: id + 100,
              url: "/images/fallback-car-1.jpg",
              thumbnail_url: "/images/fallback-car-1-thumb.jpg",
              medium_url: "/images/fallback-car-1-medium.jpg",
              large_url: "/images/fallback-car-1-large.jpg",
              is_primary: true
            }
          ]
        },
        {
          id: id + 101,
          brand_id: 1,
          category_id: Number(category) || 1,
          brand: "BMW",
          model: "X7",
          year: 2022,
          price: 65000,
          description_ka: "სარეზერვო მსგავსი მანქანის აღწერა.",
          status: "available",
          featured: false,
          seller_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 2,
            transmission: "automatic",
            fuel_type: "Gasoline",
            mileage: 15000,
            mileage_unit: "km",
            engine_size: 4.4,
            color: "Black",
            steering_wheel: "left",
            drive_type: "AWD",
            interior_color: "Beige",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 2,
            city: "Batumi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 11,
              car_id: id + 101,
              url: "/images/fallback-car-2.jpg",
              thumbnail_url: "/images/fallback-car-2-thumb.jpg",
              medium_url: "/images/fallback-car-2-medium.jpg",
              large_url: "/images/fallback-car-2-large.jpg",
              is_primary: true
            }
          ]
        }
      ];
      
      return mockSimilarCars;
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
      console.log('[CarService.getUserCars] Attempting to fetch user cars from API...');
      // Add explicit headers with authentication token
      const response = await api.get('/api/cars/user', {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      console.log('[CarService.getUserCars] Successfully retrieved user cars from API');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getUserCars] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getUserCars] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getUserCars] No response data available');
      }
      
      // Try to get all cars and filter by current user
      try {
        console.log('[CarService.getUserCars] Attempting to fetch all cars and filter by current user...');
        // Get all cars and filter by the current user's ID
        const allCarsResponse = await api.get('/api/cars');
        if (allCarsResponse.data && Array.isArray(allCarsResponse.data)) {
          // Get current user ID from token
          const token = getAccessToken();
          let userId: number | null = null;
          
          if (token) {
            try {
              // Extract user ID from token if possible
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              
              const payload = JSON.parse(jsonPayload);
              // Extract user ID and convert to number if it's a string
              const extractedId = payload.id || payload.userId || payload.sub;
              userId = typeof extractedId === 'string' ? parseInt(extractedId, 10) : extractedId;
              console.log('[CarService.getUserCars] Extracted user ID from token:', userId);
            } catch (tokenError) {
              console.error('[CarService.getUserCars] Error extracting user ID from token:', tokenError);
            }
          }
          
          if (userId) {
            // Filter cars by seller_id matching the current user's ID
            const userCars = allCarsResponse.data.filter((car: Car) => car.seller_id === userId);
            console.log(`[CarService.getUserCars] Filtered ${userCars.length} cars for user ID ${userId}`);
            return userCars;
          }
        }
      } catch (filterError) {
        console.error('[CarService.getUserCars] Error filtering cars by user:', filterError);
      }
      
      // Try an alternative endpoint as a workaround
      try {
        console.log('[CarService.getUserCars] Attempting to use alternative endpoint...');
        // Try with a different URL structure to avoid the parameter confusion
        const altResponse = await api.get('/api/cars?user=true', {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        });
        if (altResponse.data) {
          console.log('[CarService.getUserCars] Successfully retrieved user cars from alternative endpoint');
          return altResponse.data;
        }
      } catch (altError) {
        console.error('[CarService.getUserCars] Alternative endpoint error:', altError);
      }
      
      // Try to fetch from the backend directly as a fallback
      try {
        console.log('[CarService.getUserCars] Attempting direct backend connection at http://localhost:5000');
        const backendResponse = await fetch('http://localhost:5000/api/cars?user=true', {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        });
        if (backendResponse.ok) {
          const data = await backendResponse.json();
          console.log('[CarService.getUserCars] Successfully retrieved user cars from direct backend connection');
          return data;
        } else {
          console.log('[CarService.getUserCars] Direct backend connection failed with status:', backendResponse.status);
        }
      } catch (backendError) {
        console.error('[CarService.getUserCars] Direct backend connection error:', backendError);
      }
      
      // Fallback to mock data when all API attempts fail
      console.log('[CarService.getUserCars] All API attempts failed. Using fallback mock data');
      
      // Create mock user cars data - these should represent the current user's cars only
      const mockUserCars: Car[] = [
        {
          id: 1001,
          brand_id: 1,
          category_id: 1,
          brand: "BMW",
          model: "X5",
          year: 2020,
          price: 35000,
          description_ka: "თქვენი მანქანა - BMW X5. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: true,
          seller_id: 1, // This would be the current user's ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 1,
            transmission: "automatic",
            fuel_type: "Diesel",
            mileage: 45000,
            mileage_unit: "km",
            engine_size: 3.0,
            color: "Black",
            steering_wheel: "left",
            drive_type: "AWD",
            interior_color: "Beige",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 1,
            city: "Tbilisi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 1,
              car_id: 1001,
              url: "/images/fallback-car-1.jpg",
              thumbnail_url: "/images/fallback-car-1-thumb.jpg",
              medium_url: "/images/fallback-car-1-medium.jpg",
              large_url: "/images/fallback-car-1-large.jpg",
              is_primary: true
            }
          ]
        },
        {
          id: 1002,
          brand_id: 2,
          category_id: 2,
          brand: "Mercedes-Benz",
          model: "E-Class",
          year: 2021,
          price: 42000,
          description_ka: "თქვენი მანქანა - Mercedes-Benz E-Class. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: false,
          seller_id: 1, // This would be the current user's ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 2,
            transmission: "automatic",
            fuel_type: "Gasoline",
            mileage: 30000,
            mileage_unit: "km",
            engine_size: 2.0,
            color: "Silver",
            steering_wheel: "left",
            drive_type: "RWD",
            interior_color: "Black",
            has_navigation: true,
            has_leather_interior: true,
            has_sunroof: true,
            has_bluetooth: true,
            has_rear_view_camera: true
          },
          location: {
            id: 2,
            city: "Batumi",
            country: "Georgia",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            {
              id: 3,
              car_id: 1002,
              url: "/images/fallback-car-2.jpg",
              thumbnail_url: "/images/fallback-car-2-thumb.jpg",
              medium_url: "/images/fallback-car-2-medium.jpg",
              large_url: "/images/fallback-car-2-large.jpg",
              is_primary: true
            }
          ]
        }
      ];
      
      return mockUserCars;
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