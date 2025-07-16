import api from '../config/api';
import { Car, Brand, Category, CarFilters, CreateCarFormData, UpdateCarFormData } from '../types/car.types';
import { getAccessToken } from '../utils/tokenStorage';

class CarService {
  async getCars(filters?: CarFilters): Promise<{ cars: Car[], meta: any }> {
    try {
      // Log the filters we're sending to API
      console.log('[CarService.getCars] Sending filters to API:', JSON.stringify(filters));
      
      // Create a new object for server-side filters with mapped parameter names
      const serverFilters: Record<string, any> = {};
      
      if (filters) {
        // Map client-side filter names to server-side expected names
        if (filters.page) serverFilters.page = filters.page;
        if (filters.limit) serverFilters.limit = filters.limit;
        if (filters.sortBy) serverFilters.sort = filters.sortBy;
        if (filters.order) serverFilters.order = filters.order;
        
        // Exclude specific car ID
        if (filters.excludeId) serverFilters.exclude_id = filters.excludeId;
        
        // Brand and category IDs
        if (filters.brand_id) serverFilters.brand_id = filters.brand_id;
        if (filters.category) serverFilters.category_id = filters.category;
        
        // Model name
        if (filters.model) serverFilters.model = filters.model;
        
        // Price range - use server parameter names (priceFrom, priceTo)
        if (filters.priceFrom) serverFilters.priceFrom = filters.priceFrom;
        if (filters.priceTo) serverFilters.priceTo = filters.priceTo;
        
        // Year range - use server parameter names (yearFrom, yearTo)
        if (filters.yearFrom) serverFilters.yearFrom = filters.yearFrom;
        if (filters.yearTo) serverFilters.yearTo = filters.yearTo;
        
        // Mileage range - use server parameter names (mileageFrom, mileageTo)
        if (filters.mileageFrom) serverFilters.mileageFrom = filters.mileageFrom;
        if (filters.mileageTo) serverFilters.mileageTo = filters.mileageTo;
        
        // Location
        if (filters.location) serverFilters.location = filters.location;
        
        // Other specifications - match server parameter names
        if (filters.transmission) serverFilters.transmission = filters.transmission;
        if (filters.driveType) serverFilters.driveType = filters.driveType;
        if (filters.fuelType) serverFilters.fuelType = filters.fuelType;
        if (filters.steeringWheel) serverFilters.steeringWheel = filters.steeringWheel;
        if (filters.interiorColor) serverFilters.interiorColor = filters.interiorColor;
        if (filters.color) serverFilters.color = filters.color;
        if (filters.interiorMaterial) serverFilters.interiorMaterial = filters.interiorMaterial;
        if (filters.engineSizeFrom) serverFilters.engineSizeFrom = filters.engineSizeFrom;
        if (filters.engineSizeTo) serverFilters.engineSizeTo = filters.engineSizeTo;
        if (filters.airbags) serverFilters.airbags = filters.airbags;
      }
      
      console.log('[CarService.getCars] Mapped server filters:', serverFilters);
      
      // Make the API request with properly mapped filters
      const response = await api.get('/api/cars', { params: serverFilters });
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
            engine_size: 2.0,
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
      
      // Get the car data from the response
      const carData = response.data;
      
      // If we have a category_id but no category_name, try to fetch the category name
      if (carData.category_id && !carData.category_name) {
        console.log('[CarService.getCar] Car has category_id but no category_name, fetching category info');
        try {
          // Fetch categories
          const categories = await this.getCategories();
          
          // Find the matching category
          const categoryIdString = String(carData.category_id);
          const categoryIdNumber = parseInt(categoryIdString, 10);
          
          const matchingCategory = categories.find(cat => {
            const catIdString = String(cat.id);
            const catIdNumber = parseInt(catIdString, 10);
            return catIdString === categoryIdString || catIdNumber === categoryIdNumber;
          });
          
          if (matchingCategory) {
            console.log(`[CarService.getCar] Found matching category: ${matchingCategory.name}`);
            carData.category_name = matchingCategory.name;
          } else {
            console.log('[CarService.getCar] No matching category found for ID:', carData.category_id);
          }
        } catch (categoryError) {
          console.error('[CarService.getCar] Error fetching category info:', categoryError);
        }
      }
      
      console.log('[CarService.getCar] Final car data with category:', JSON.stringify({
        id: carData.id,
        category_id: carData.category_id,
        category_name: carData.category_name
      }));
      
      return carData;
    } catch (error: any) {
      console.error('[CarService.getCar] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCar] Server error response:', error.response.data);
      } else {
        console.log('[CarService.getCar] No response data available');
      }
      
      // If the car is not found (404 error), return a mock car as fallback
      if (error?.response?.status === 404) {
        console.log('[CarService.getCar] Car not found, returning mock data');
        
        // Create a mock car with the requested ID
        const mockCar: Car = {
          id: Number(id),
          user_id: 1,
          seller_id: 1,
          brand_id: 1,
          category_id: 1,
          title: 'Sample Car (Demo Mode)',
          brand: 'Demo Brand',
          model: 'Mock Model',
          year: new Date().getFullYear() - 2,
          price: 15000,
          currency: 'GEL',
          status: 'available',
          featured: false,
          author_name: 'დემო ავტორი',
          author_phone: '+995 555 123456',
          description_ka: 'ეს არის დემო მანქანა, რომელიც ნაჩვენებია მოთხოვნილი მანქანის ვერ პოვნის გამო. გთხოვთ, სცადოთ სხვა მანქანა.',
          description_en: 'This is a mock car shown because the requested car could not be found. Please try another car.',
          location: { 
            id: 1,
            city: 'Tbilisi', 
            country: 'Georgia',
            location_type: 'georgia',
            is_in_transit: false
          },
          specifications: { 
            id: 1,
            transmission: 'Automatic',
            fuel_type: 'Gasoline',
            mileage: 45000,
            mileage_unit: 'km',
            engine_size: 2.0,
            steering_wheel: 'Left',
            drive_type: 'Front',
            color: 'Silver',
            interior_color: 'Black',
            interior_material: 'Leather',
            doors: '4'
          },
          images: [
            {
              id: 1,
              car_id: Number(id),
              url: 'https://via.placeholder.com/600x400?text=Car+Not+Found',
              thumbnail_url: 'https://via.placeholder.com/100x75?text=Car+Not+Found',
              medium_url: 'https://via.placeholder.com/300x200?text=Car+Not+Found',
              large_url: 'https://via.placeholder.com/800x600?text=Car+Not+Found',
              is_primary: true
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          vip_status: 'none',
          vip_expiration_date: undefined
        };
        
        return mockCar;
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
      console.log('[CarService.getCategories] Fetching categories from API');
      const response = await api.get('/api/cars/categories');
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`[CarService.getCategories] Successfully loaded ${response.data.length} categories`);
        return response.data;
      } else {
        console.warn('[CarService.getCategories] API returned unexpected data format:', response.data);
        throw new Error('Unexpected data format from API');
      }
    } catch (error: any) {
      console.error('[CarService.getCategories] Error details:', error);
      
      // Show detailed error information for debugging
      if (error?.response?.data) {
        console.log('[CarService.getCategories] Server error response:', error.response.data);
      } else if (error?.message) {
        console.log('[CarService.getCategories] Error message:', error.message);
      }
      
      console.log('[CarService.getCategories] Using fallback mock categories');
      
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
      'უკანა': 'rear',
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
  
  // CRUD operations for cars
  async createCar(data: CreateCarFormData): Promise<Car> {
    try {
      console.log('[CarService.createCar] Starting car creation with data:', data);
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Process data to match server expectations
      // Use type assertion to allow adding server-required fields
      const carData: Record<string, any> = { ...data };
      
      // Extract images since they need to be sent separately
      const images = carData.images;
      delete carData.images;
      
      // Set default values for required fields
      carData.vip_status = carData.vip_status || 'none';
      carData.color_highlighting = carData.color_highlighting ?? false;
      carData.auto_renewal = carData.auto_renewal ?? false;
      carData.status = carData.status || 'available';
      
      // Append the main car data as a single JSON field named 'data'
      formData.append('data', JSON.stringify(carData));
      
      // Add images separately
      if (images && Array.isArray(images)) {
        images.forEach(file => {
          formData.append('images', file);
        });
      } else {
        console.warn('[CarService.createCar] Images is not an array:', images);
      }
      
      // Log what's being sent to the server
      console.log('[CarService.createCar] Sending car data to server:', JSON.stringify(carData));
      
      // Make the API request
      const response = await api.post('/api/cars', formData, { 
        headers: { 
          ...headers, 
          'Content-Type': 'multipart/form-data' 
        } 
      });
      
      console.log('[CarService.createCar] Car created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CarService.createCar] Error:', error);
      console.log('[CarService.createCar] Server response:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data
      });
      throw error;
    }
  }

  async updateCar(carId: number, data: UpdateCarFormData): Promise<Car> {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('[carService.updateCar] გაგზავნის მონაცემები:', data);
      console.log('[carService.updateCar] ავტორის ინფორმაცია:', { 
        author_name: data.author_name, 
        author_phone: data.author_phone 
      });
      
      // Create a FormData object to handle image uploads
      const formData = new FormData();
      
      // Add car ID to the form data
      formData.append('id', String(carId));
      
      // ექსპლიციტურად დავამატოთ ავტორის ინფორმაცია
      if (data.author_name !== undefined) {
        console.log('[carService.updateCar] ვამატებ author_name ფორმაში:', data.author_name);
        formData.append('author_name', String(data.author_name));
      }
      
      if (data.author_phone !== undefined) {
        console.log('[carService.updateCar] ვამატებ author_phone ფორმაში:', data.author_phone);
        formData.append('author_phone', String(data.author_phone));
      }
      
      // Add all car data to the form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          // Add each image file to the form data
          value.forEach(file => {
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
        } else if (key === 'specifications' || key === 'location' || key === 'features') {
          // Convert objects and arrays to JSON strings
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && key !== 'author_name' && key !== 'author_phone') {
          // Add other fields as is, except author fields which we handled separately
          formData.append(key, String(value));
        }
      });
      
      // დებაგ: შევამოწმოთ რა მონაცემები იგზავნება
      console.log('[carService.updateCar] FormData შიგნით:');
      // დავბეჭდოთ formData ობიექტი
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      const response = await api.put(`/api/cars/${carId}`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('[CarService.updateCar] Error:', error);
      throw error;
    }
  }
  
  async deleteCar(carId: number): Promise<void> {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      await api.delete(`/api/cars/${carId}`, { headers });
    } catch (error: any) {
      console.error('[CarService.deleteCar] Error:', error);
      throw error;
    }
  }
  
  async getUserCars(): Promise<Car[]> {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.get('/api/cars/user', { headers });
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('[CarService.getUserCars] Error:', error);
      throw error;
    }
  }
  
  async deleteCarImage(imageId: number): Promise<void> {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      await api.delete(`/api/cars/images/${imageId}`, { headers });
    } catch (error: any) {
      console.error('[CarService.deleteCarImage] Error:', error);
      throw error;
    }
  }
  
  async setPrimaryImage(carId: number, imageId: number): Promise<void> {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      await api.put(`/api/cars/${carId}/images/${imageId}/primary`, {}, { headers });
    } catch (error: any) {
      console.error('[CarService.setPrimaryImage] Error:', error);
      throw error;
    }
  }
}

// Create an instance of CarService and export it as default
const carService = new CarService();
export default carService;
