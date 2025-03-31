import { NewCarFormData } from '../types';
import { CreateCarFormData } from '../../../../../api/types/car.types';

export const formatPrice = (price: number | string): string => {
  return new Intl.NumberFormat('ka-GE').format(Number(price));
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
};

export const cleanFormData = (formData: NewCarFormData): Omit<CreateCarFormData, 'images'> => {
  const cleanedData = { ...formData };

  // Convert features object to string array
  const features: string[] = [];
  if (cleanedData.features) {
    Object.entries(cleanedData.features).forEach(([key, value]) => {
      if (value === true) {
        // Convert from camelCase to readable format
        const feature = key
          .replace('has_', '')
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        features.push(feature);
      }
    });
  }

  // Remove fields that don't exist in CreateCarFormData
  const {
    brand_id,
    category_id,
    description_en,
    description_ru,
    city,
    state,
    country,
    location_type,
    ...apiFormData
  } = cleanedData;

  // Use the Georgian description as the main description
  const description = cleanedData.description_ka;

  // Convert specifications to match the API format
  const {
    transmission,
    fuel_type,
    drive_type,
    steering_wheel = 'left' as const,
    engine_size = 0,
    mileage = 0,
    color = ''
  } = cleanedData.specifications;

  return {
    brand: brand_id,
    category: category_id,
    condition: 'used',
    description,
    features,
    transmission,
    fuel_type,
    drive_type,
    steering_wheel,
    engine_size,
    mileage,
    color,
    year: cleanedData.year,
    price: cleanedData.price,
    model: cleanedData.model
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

export const clearSavedDraft = () => {
  localStorage.removeItem('car_form_draft');
};