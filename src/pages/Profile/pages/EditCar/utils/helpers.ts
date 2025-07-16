import { NewCarFormData } from '../types';
import { CreateCarFormData } from '../../../../../api/types/car.types';
import { CarSpecifications } from '../types';

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
  console.log('CleanFormData - Raw input:', JSON.stringify(formData, null, 2));
  console.log('CleanFormData - brand_id type:', typeof formData.brand_id);
  console.log('CleanFormData - brand_id value:', formData.brand_id);
  
  // Validate brand_id with detailed error message
  if (formData.brand_id === undefined || formData.brand_id === null || formData.brand_id === '') {
    console.error('CleanFormData - brand_id is missing or undefined');
    throw new Error('მარკის არჩევა სავალდებულოა');
  }

  // Convert brand_id and category_id to numbers and ensure they are valid
  const brand_id = parseInt(String(formData.brand_id));
  console.log('CleanFormData - Parsed brand_id:', brand_id, 'Original:', formData.brand_id);
  
  if (isNaN(brand_id)) {
    console.error('CleanFormData - brand_id parsing failed:', formData.brand_id);
    throw new Error('არასწორი მარკის ID ფორმატი');
  }
  if (brand_id <= 0) {
    console.error('CleanFormData - Invalid brand_id value:', brand_id);
    throw new Error('არასწორი მარკის ID მნიშვნელობა');
  }

  // Convert and validate category_id
  if (formData.category_id === undefined || formData.category_id === null || formData.category_id === '') {
    console.error('CleanFormData - category_id is missing or undefined');
    throw new Error('კატეგორიის არჩევა სავალდებულოა');
  }

  const category_id = parseInt(String(formData.category_id));
  console.log('CleanFormData - Parsed category_id:', category_id, 'Original:', formData.category_id);
  
  if (isNaN(category_id) || category_id <= 0) {
    console.error('CleanFormData - Invalid category_id:', formData.category_id);
    throw new Error('არასწორი კატეგორიის ID');
  }

  // Convert features object to string array
  const features: string[] = [];
  if (formData.features) {
    Object.entries(formData.features).forEach(([key, value]) => {
      if (value === true) {
        features.push(key);
      }
    });
  }

  // Handle location data with proper mapping
  const mapLocationTypeToDb = (frontendType: string): string => {
    switch (frontendType) {
      case 'georgia':
        return 'city'; // Georgian cities
      case 'international':
        return 'country'; // International countries
      case 'transit':
        return 'transit'; // Transit locations
      default:
        return 'city'; // Default to city
    }
  };

  const location = {
    city: typeof formData.location?.city === 'object' ? 
          (formData.location.city as { value: string; label: string })?.value || '' : 
          formData.location?.city || '',
    state: formData.location?.state || '',
    country: formData.location?.country || 'საქართველო',
    location_type: mapLocationTypeToDb(formData.location?.location_type || 'georgia'),
    is_in_transit: formData.location?.is_in_transit || false
  };

  // Convert drive_type from Georgian to English
  if (formData.specifications?.drive_type) {
    const driveTypeMap: { [key: string]: CarSpecifications['drive_type'] } = {
      'წინა': 'FWD',
      'უკანა': 'RWD',
      '4x4': 'AWD'
    };
    const mappedDriveType = driveTypeMap[formData.specifications.drive_type];
    if (mappedDriveType) {
      formData.specifications.drive_type = mappedDriveType;
    }
  }

  const cleanedData = {
    brand_id,
    category_id,
    model: formData.model,
    title: formData.title, // დავამატეთ title ველი
    year: formData.year,
    price: formData.price,
    description_ka: formData.description_ka || '',
    description_en: formData.description_en || '',
    description_ru: formData.description_ru || '',
    specifications: formData.specifications,
    features,
    location
  };

  console.log('CleanFormData - Final output:', JSON.stringify(cleanedData, null, 2));
  return cleanedData;
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