import { NewCarFormData } from '../types';

export const formatPrice = (price: number | string): string => {
  return new Intl.NumberFormat('ka-GE').format(Number(price));
};

export const cleanFormData = (data: NewCarFormData): NewCarFormData => {
  return {
    // ძირითადი ინფო
    brand_id: data.brand_id,
    model: data.model.trim(),
    category_id: data.category_id,
    year: Number(data.year),
    price: Number(data.price),
    
    // აღწერა
    description_ka: data.description_ka.trim(),
    description_en: data.description_en?.trim(),
    description_ru: data.description_ru?.trim(),
    
    // მდებარეობა
    city: data.city.trim(),
    state: data.state?.trim(),
    country: data.country.trim(),
    location_type: data.location_type,
    
    // ტექნიკური მახასიათებლები
    specifications: {
      transmission: data.specifications.transmission,
      fuel_type: data.specifications.fuel_type,
      body_type: data.specifications.body_type,
      drive_type: data.specifications.drive_type,
      engine_size: data.specifications.engine_size ? Number(data.specifications.engine_size) : undefined,
      mileage: data.specifications.mileage ? Number(data.specifications.mileage) : undefined,
      color: data.specifications.color
    },
    
    // დამატებითი ფუნქციები
    features: {
      ...data.features
    }
  };
};

export const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): boolean => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    throw new Error('მხოლოდ JPG, JPEG და PNG ფორმატის სურათებია დაშვებული');
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('სურათის ზომა არ უნდა აღემატებოდეს 5MB-ს');
  }

  return true;
};