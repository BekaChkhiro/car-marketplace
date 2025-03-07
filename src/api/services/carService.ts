import api from '../config/axios';

interface CarImage {
  original_name: string;
  thumbnail: string;
  medium: string;
  large: string;
}

interface CarData {
  id: string;
  images: CarImage[];
  // ... other car properties
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
  };
  city: string;
  state: string;
  country: string;
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
      description: carData.description?.trim(),
      specifications
    };

    // Validate the data structure
    validateNewCarData(jsonData);

    // Create FormData for images
    const formData = new FormData();
    
    // Append each image
    images.forEach((image) => {
      formData.append('images', image);
    });

    // First create the car without images
    const { data: carResponse } = await api.post('/cars', jsonData);

    // Then upload images if car creation was successful
    if (carResponse.id) {
      await uploadCarImages(carResponse.id, images);
    }

    return carResponse;
  } catch (error: any) {
    console.error('Error creating car:', {
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      status: error.response?.status,
      originalError: error
    });
    throw error;
  }
};

export const uploadCarImages = async (carId: string, images: File[]): Promise<CarData> => {
  const formData = new FormData();
  
  // Validate image sizes and types before upload
  for (const image of images) {
    // Validate file size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      throw new Error(`Image ${image.name} is too large. Maximum size is 10MB`);
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(image.type)) {
      throw new Error(`File ${image.name} must be a JPEG, PNG, or WebP image`);
    }

    // Add the image to FormData with proper filename
    formData.append('images', image, image.name);
  }

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const { data } = await api.post(`/cars/${carId}/images`, formData, {
        headers: {
          'Accept': 'application/json',
          // Let browser set proper multipart boundary
          'Content-Type': 'multipart/form-data'
        },
        // Increase timeout for large uploads
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
      attempt++;
      
      console.error('Error uploading images (attempt ${attempt}/${maxRetries}):', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      // Don't retry if it's a validation error
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid image data');
      }

      // Don't retry if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }

      // If we've exhausted all retries, throw the error
      if (attempt === maxRetries) {
        // If it's an ACL error, throw a more specific error
        if (error.message?.includes('ACL') || error.response?.data?.error?.includes('ACL')) {
          throw new Error('The server is currently unable to process image uploads. Please try again later or contact support.');
        }
        
        throw new Error('Failed to upload images after multiple attempts. Please try again later.');
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Failed to upload images after exhausting all retries');
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

export default {
  createCar,
  uploadCarImages,
  updateCarWithImages
};