import api from '../config/axios';
import { mockBrands } from '../../data/mockData';

interface CarImage {
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

interface NewCarData {
  brand_id: number | string;
  category_id: number | string;
  model: string;
  year: number;
  price: number | string;
  description?: string;
  status?: 'available' | 'sold' | 'pending';
  featured?: boolean;
  specifications?: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: number | string;
    engine_size?: number | string;
    horsepower?: number | string;
    doors?: number | string;
    color?: string;
    body_type?: string;
    drive_type?: string;
  };
  city: string;
  state: string;
  country: string;
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
    { key: 'country', type: 'string' }
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
};

export const createCar = async (carData: NewCarData, images: File[]): Promise<CarData> => {
  try {
    // Validate images first
    if (!images || images.length === 0) {
      throw new Error('At least one image is required');
    }

    // Convert specifications to server format
    const specifications = carData.specifications ? {
      engine_type: carData.specifications.engine_type?.trim(),
      transmission: carData.specifications.transmission?.trim(),
      fuel_type: carData.specifications.fuel_type?.trim(),
      color: carData.specifications.color?.trim(),
      body_type: carData.specifications.body_type?.trim(),
      mileage: carData.specifications.mileage ? Number(carData.specifications.mileage) : undefined,
      engine_size: carData.specifications.engine_size ? Number(carData.specifications.engine_size) : undefined,
      horsepower: carData.specifications.horsepower ? Number(carData.specifications.horsepower) : undefined,
      doors: carData.specifications.doors ? Number(carData.specifications.doors) : undefined
    } : undefined;

    // Build the car data
    const jsonData = {
      brand_id: parseInt(String(carData.brand_id)),
      category_id: parseInt(String(carData.category_id)),
      model: carData.model.trim(),
      year: Number(carData.year),
      price: Number(carData.price),
      city: carData.city.trim(),
      state: carData.state.trim(),
      country: carData.country.trim(),
      status: carData.status || 'available',
      featured: carData.featured || false,
      description: carData.description?.trim()
    };

    // Log data before validation
    console.log('Data before validation:', jsonData);

    // Validate the data structure
    validateNewCarData(jsonData);

    // Create FormData
    const formData = new FormData();
    
    // Append each field individually
    Object.entries(jsonData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Append specifications fields individually
    if (specifications) {
      Object.entries(specifications).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(`specifications[${key}]`, String(value));
        }
      });
    }
    
    // Add each image with standard field name format
    images.forEach(image => {
      formData.append('images', image);
    });

    // Log formData contents (for debugging)
    console.log('FormData entries:');
    for (const pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    // Send everything in one request
    const { data } = await api.post('/cars', formData, {
      headers: {
        'Accept': 'application/json',
        // Let browser set the content type for FormData
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });

    return data;
  } catch (error: any) {
    // Enhanced error logging
    const errorDetails = {
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      status: error.response?.status,
      originalError: error,
      validationErrors: error.response?.data?.errors,
      requestData: error.config?.data
    };
    console.error('Error creating car:', errorDetails);

    // If we have specific validation errors, include them in the error message
    if (error.response?.data?.errors) {
      const validationMessages = Object.entries(error.response.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
      throw new Error(`Validation failed: ${validationMessages}`);
    }

    throw error;
  }
};

export const updateCarWithImages = async (carId: string, carData: any, images?: File[]): Promise<CarData> => {
  // For updates, we'll keep the nested structure consistent
  const formData = new FormData();

  // If specifications exist, ensure they're properly nested
  if (carData.specifications) {
    carData.specifications = {
      ...carData.specifications,
      mileage: carData.specifications.mileage ? Number(carData.specifications.mileage) : undefined,
      engine_size: carData.specifications.engine_size ? Number(carData.specifications.engine_size) : undefined,
      horsepower: carData.specifications.horsepower ? Number(carData.specifications.horsepower) : undefined,
      doors: carData.specifications.doors ? Number(carData.specifications.doors) : undefined
    };
  }
  
  // Append car data
  Object.keys(carData).forEach(key => {
    if (carData[key] !== undefined) {
      formData.append(key, 
        typeof carData[key] === 'object' 
          ? JSON.stringify(carData[key]) 
          : carData[key]
      );
    }
  });

  // Append images if provided
  if (images) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }

  const { data } = await api.put(`/cars/${carId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};

// Get all cars with filtering
export const getCars = async (params: GetCarsParams = {}) => {
  try {
    // Transform frontend parameters to match backend expectations
    const transformedParams = {
      page: params.page || 1,
      limit: params.limit || 12,
      sort: params.sort || 'created_at',
      order: params.order || 'DESC',
      brand_id: params.brand_id,
      category_id: params.category_id,
      price_min: params.price_min,
      price_max: params.price_max,
      year_min: params.year_min,
      year_max: params.year_max
    };

    const { data } = await api.get('/cars', { params: transformedParams });
    return data;
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    throw new Error(error.response?.data?.message || 'Error fetching cars');
  }
};

// Get single car by ID
export const getCarById = async (id: string): Promise<CarData> => {
  try {
    const { data } = await api.get(`/cars/${id}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching car:', error);
    throw new Error(error.response?.data?.message || 'Error fetching car details');
  }
};

// Get similar cars
export const getSimilarCars = async (carId: string, limit: number = 3): Promise<CarData[]> => {
  try {
    const { data } = await api.get(`/cars/${carId}/similar`, {
      params: { limit }
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching similar cars:', error);
    throw error;
  }
};

// Get VIP cars
export const getVipCars = async (limit: number = 4): Promise<CarData[]> => {
  try {
    const { data } = await api.get('/cars', {
      params: {
        isVip: true,
        limit
      }
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching VIP cars:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/cars/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const brandModelsMap: { [key: string]: string[] } = {
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'TT', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q8'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'i8', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class', 'SL', 'AMG GT'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Prius', 'Yaris', 'Highlander', 'Avalon', 'Supra', '4Runner', 'Tundra', 'Tacoma', 'Sienna'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Odyssey', 'Fit', 'Jazz', 'City', 'Insight'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Atlas', 'Jetta', 'Arteon', 'ID.4', 'Taos', 'Polo', 'T-Roc', 'Touareg'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Venue', 'Palisade', 'Accent', 'i20', 'i30'],
  'Kia': ['Forte', 'K5', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Seltos', 'Carnival', 'Rio', 'Stinger'],
  'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco', 'Ranger', 'Focus', 'Fiesta', 'EcoSport'],
  'Chevrolet': ['Silverado', 'Camaro', 'Equinox', 'Tahoe', 'Traverse', 'Malibu', 'Suburban', 'Colorado', 'Spark', 'Blazer'],
  'Nissan': ['Altima', 'Maxima', 'Rogue', 'Pathfinder', 'Murano', 'Sentra', 'Frontier', 'Titan', 'Kicks', 'Leaf'],
  'Lexus': ['ES', 'IS', 'LS', 'NX', 'RX', 'UX', 'GX', 'LX', 'RC', 'LC'],
  'Mazda': ['CX-5', 'CX-30', 'Mazda3', 'Mazda6', 'MX-5', 'CX-9', 'CX-3', 'RX-7', 'RX-8'],
  'Subaru': ['Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent', 'WRX', 'BRZ'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Discovery', 'Discovery Sport', 'Defender'],
  'Jaguar': ['F-PACE', 'E-PACE', 'I-PACE', 'XE', 'XF', 'F-TYPE'],
  'Volvo': ['XC90', 'XC60', 'XC40', 'S60', 'S90', 'V60', 'V90'],
  'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
  'Acura': ['TLX', 'RDX', 'MDX', 'ILX', 'NSX', 'RLX']
};

export const getBrands = async () => {
  try {
    console.log('Fetching brands...');
    const response = await api.get('/cars/brands');
    console.log('Raw brands response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log('API returned invalid data, using mock data');
      return mockBrands;
    }

    // Map through the brands and add models from our map or keep existing models
    const brandsWithModels = response.data.map((brand: any) => {
      const brandName = brand.name;
      const fallbackModels = brandModelsMap[brandName] || [];
      
      return {
        id: brand.id || brand._id,
        name: brandName,
        models: Array.isArray(brand.models) && brand.models.length > 0 
          ? brand.models 
          : fallbackModels
      };
    });

    console.log('Processed brands with models:', JSON.stringify(brandsWithModels[0], null, 2));
    return brandsWithModels;

  } catch (error) {
    console.error('Error fetching brands:', error);
    return mockBrands;
  }
};

export default {
  createCar,
  updateCarWithImages,
  getCars,
  getCarById,
  getSimilarCars,
  getVipCars,
  getCategories,
  getBrands
};