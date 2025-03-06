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

export const uploadCarImages = async (carId: string, images: File[]): Promise<CarData> => {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image);
  });

  const { data } = await api.post(`/cars/${carId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const updateCarWithImages = async (carId: string, carData: any, images?: File[]): Promise<CarData> => {
  const formData = new FormData();
  
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
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};