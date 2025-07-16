import api from '../config/api';
import { Car, Brand, Category, CarFilters, CreateCarFormData, UpdateCarFormData } from '../types/car.types';
import { getAccessToken } from '../utils/tokenStorage';

class CarService {
  async getCars(filters?: CarFilters): Promise<{ cars: Car[], meta: any }> {
    try {
      // Log the filters we're sending to API
      console.log('[CarService.getCars] Sending filters to API:', JSON.stringify(filters));
      
      // Make special note of brand_id and model if present 
      if (filters?.brand_id) {
        console.log('[CarService.getCars] Filter includes brand_id:', filters.brand_id);
      }
      
      if (filters?.model) {
        console.log('[CarService.getCars] Filter includes model:', filters.model);
      }
      
      // Make the API request
      const response = await api.get('/api/cars', { params: filters });
      console.log('[CarService.getCars] API response received');
      
      // Check if the response follows the new data structure with meta information
      if (response.data && response.data.data && response.data.meta) {
        console.log(`[CarService.getCars] Got ${response.data.data.length} cars with pagination. Total: ${response.data.meta.total}`);
        
        // Return both the cars and the meta information
        return {
          cars: response.data.data,
          meta: response.data.meta
        };
      }
      
      // Fallback for API compatibility if the response is in the old format (just an array)
      if (Array.isArray(response.data)) {
        console.log('[CarService.getCars] API returned old format (array), adding mock meta data');
        return {
          cars: response.data,
          meta: {
            total: response.data.length,
            page: filters?.page || 1,
            limit: filters?.limit || 12,
            totalPages: Math.ceil(response.data.length / (filters?.limit || 12))
          }
        };
      }
      
      // If we reach here, something is wrong with the response format
      console.warn('[CarService.getCars] Unexpected API response format:', response.data);
      return {
        cars: [],
        meta: {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 0
        }
      };
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
            engine_size: 3,
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
            is_in_transit: false
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
          price: 45000,
          description_ka: "ეს არის სარეზერვო მანქანის აღწერა. სერვერიდან ვერ მოხერხდა მანქანის მონაცემების ჩატვირთვა.",
          status: "available",
          featured: true,
          seller_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: {
            id: 2,
            transmission: "automatic",
            fuel_type: "Gasoline",
            mileage: 25000,
            mileage_unit: "km",
            engine_size: 2,
            color: "White",
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
            is_in_transit: false
          },
          images: [
            {
              id: 2,
              car_id: 2,
              url: "/images/fallback-car-2.jpg",
              thumbnail_url: "/images/fallback-car-2-thumb.jpg",
              medium_url: "/images/fallback-car-2-medium.jpg",
              large_url: "/images/fallback-car-2-large.jpg",
              is_primary: true
            }
          ]
        }
      ];
      
      return {
        cars: mockCars,
        meta: {
          total: mockCars.length,
          page: filters?.page || 1,
          limit: filters?.limit || 12,
          totalPages: Math.ceil(mockCars.length / (filters?.limit || 12))
        }
      };
    }
  }

  async getCar(id: string | number): Promise<Car> {
    try {
      console.log('[CarService.getCar] Fetching car with ID:', id);
      const response = await api.get(`/api/cars/${id}`);
      console.log('[CarService.getCar] Successfully retrieved car data from API');
      console.log('[CarService.getCar] API response data:', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCar] No response data available');
      }
      
      throw new Error(`Failed to fetch car with ID ${id}`);
    }
  }

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get('/api/cars/brands');
      return response.data;
    } catch (error: any) {
      console.error('[CarService.getBrands] Error details:', error);
      
      // Create fallback brands list
      const mockBrands: Brand[] = [
        { id: 1, name: "BMW", models: ["X5", "X3", "M3", "3 Series"] },
        { id: 2, name: "Mercedes-Benz", models: ["E-Class", "C-Class", "S-Class", "GLE"] },
        { id: 3, name: "Toyota", models: ["Camry", "Corolla", "RAV4", "Land Cruiser"] },
        { id: 4, name: "Honda", models: ["Civic", "Accord", "CR-V", "Pilot"] },
        { id: 5, name: "Ford", models: ["F-150", "Explorer", "Escape", "Mustang"] }
      ];
      
      return mockBrands;
    }
  }

  async getModelsByBrand(brandId: number): Promise<string[]> {
    try {
      console.log('[CarService.getModelsByBrand] Fetching models for brand ID:', brandId);
      
      // First get brand name
      const brand = await this.getBrandById(brandId);
      if (!brand) {
        throw new Error(`No brand found with ID ${brandId}`);
      }
      
      // Try ID-based endpoint first
      try {
        const response = await api.get(`/api/cars/brands/${brandId}/models`);
        console.log('[CarService.getModelsByBrand] Models retrieved successfully from ID-based endpoint');
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
      } catch (idError) {
        console.warn('[CarService.getModelsByBrand] Failed to get models by ID, falling back to name-based endpoint');
      }
      
      // Fallback to name-based endpoint if ID-based failed
      try {
        const brandNameEncoded = encodeURIComponent(brand.name.toLowerCase());
        const response = await api.get(`/api/cars/brands/${brandNameEncoded}/models`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
      } catch (nameError) {
        console.warn('[CarService.getModelsByBrand] Failed to get models by name');
      }
      
      // Fallback to local data if both endpoints failed
      const brandNameLower = brand.name.toLowerCase();
      const fallbackModels: Record<string, string[]> = {
        'bmw': ['X5', 'X3', 'M3', '3 Series', '5 Series', '7 Series'],
        'mercedes': ['E-Class', 'C-Class', 'S-Class', 'GLE', 'GLC', 'A-Class'],
        'toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Highlander'],
        'honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
        'ford': ['F-150', 'Explorer', 'Escape', 'Mustang', 'Edge']
      };
      
      // Try direct match
      if (fallbackModels[brandNameLower]) {
        return fallbackModels[brandNameLower];
      }
      
      // Try partial matches
      for (const [key, models] of Object.entries(fallbackModels)) {
        if (brandNameLower.includes(key) || key.includes(brandNameLower)) {
          return models;
        }
      }
      
      // Last resort fallback
      return ['Model 1', 'Model 2', 'Model 3', 'Other'];
    } catch (error: any) {
      console.error('[CarService.getModelsByBrand] Error:', error);
      return ['Model 1', 'Model 2', 'Model 3', 'Other'];
    }
  }

  async getBrandById(brandId: number): Promise<Brand | null> {
    try {
      const brands = await this.getBrands();
      return brands.find(brand => brand.id === brandId) || null;
    } catch (error) {
      console.error('[CarService.getBrandById] Error:', error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/api/cars/categories');
      return response.data;
    } catch (error) {
      console.error('[CarService.getCategories] Error:', error);
      
      // Fallback categories
      const mockCategories: Category[] = [
        { id: 1, name: 'სედანი' },
        { id: 2, name: 'ჯიპი' },
        { id: 3, name: 'კუპე' },
        { id: 4, name: 'კაბრიოლეტი' },
        { id: 5, name: 'უნივერსალი' },
        { id: 6, name: 'ჰეჩბეგი' },
        { id: 7, name: 'პიკაპი' },
        { id: 8, name: 'მინივენი' },
        { id: 9, name: 'მიკროავტობუსი' },
        { id: 10, name: 'სპორტული' }
      ];
      
      return mockCategories;
    }
  }
  
  // Helper methods for translations and normalizations
  translateDriveType(driveType: string): string {
    // Normalize input by trimming and converting to lowercase
    const normalizedInput = driveType ? String(driveType).trim().toLowerCase() : '';
    
    // Map of possible values to their standardized form
    const driveTypeMap: {[key: string]: string} = {
      // Georgian values
      'წინა': 'front',
      'უკანა': '4x4',
      '4x4': '4x4',
      
      // English abbreviations
      'fwd': 'front',
      'rwd': 'rear',
      'awd': '4x4',
      
      // Full English values
      'front': 'front',
      'rear': 'rear',
      'all wheel drive': '4x4',
      'front wheel drive': 'front',
      'rear wheel drive': 'rear'
    };
    
    // Get the mapped value or default to the original input
    return driveTypeMap[normalizedInput] || normalizedInput;
  }

  normalizeEngineSize(engineSize: number | string): number {
    // Convert to number first
    let size = typeof engineSize === 'string' ? parseFloat(engineSize) : engineSize;
    
    // If it's NaN, return 0
    if (isNaN(size)) {
      return 0;
    }
    
    // Check if it's likely in cc (over 100)
    if (size > 100) {
      // Convert from cc to liters
      return size / 1000;
    }
    
    // If it's already in a reasonable range for liters (0.1 to 10.0)
    if (size > 0 && size <= 10) {
      return size;
    }
    
    // For any other unusual values, return as is
    return size;
  }

  translateSteeringWheel(steeringWheel: string): string {
    // Normalize the input by trimming and converting to lowercase
    const normalizedInput = steeringWheel ? String(steeringWheel).trim().toLowerCase() : '';
    
    // Map of possible values to their correct form
    const steeringWheelMap: {[key: string]: string} = {
      'მარჯვენა': 'right',
      'მარცხენა': 'left',
      'right': 'right',
      'left': 'left'
    };
    
    // Get the mapped value or default to 'left'
    const result = steeringWheelMap[normalizedInput] || 'left';
    
    // Final validation to ensure it's exactly 'left' or 'right'
    return result === 'right' ? 'right' : 'left';
  }
}

// Create an instance of CarService and export it as default
const carService = new CarService();
export default carService;
