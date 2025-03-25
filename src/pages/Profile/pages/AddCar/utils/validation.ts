import { NewCarFormData } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateCarForm = (formData: NewCarFormData, images: File[]): ValidationErrors => {
  const errors: ValidationErrors = {};

  // ძირითადი ინფო
  if (!formData.brand_id) errors.brand_id = 'მარკა სავალდებულოა';
  if (!formData.model) errors.model = 'მოდელი სავალდებულოა';
  if (!formData.category_id) errors.category_id = 'კატეგორია სავალდებულოა';
  if (!formData.year) errors.year = 'წელი სავალდებულოა';
  
  // ფასი
  if (!formData.price) {
    errors.price = 'ფასი სავალდებულოა';
  } else if (Number(formData.price) <= 0) {
    errors.price = 'ფასი უნდა იყოს 0-ზე მეტი';
  }

  // აღწერა
  if (!formData.description_ka) {
    errors.description_ka = 'ქართული აღწერა სავალდებულოა';
  }

  // მდებარეობა
  if (!formData.city) errors.city = 'ქალაქი სავალდებულოა';
  if (!formData.country) errors.country = 'ქვეყანა სავალდებულოა';

  // ტექნიკური მახასიათებლები
  if (!formData.specifications.transmission) {
    errors['specifications.transmission'] = 'გადაცემათა კოლოფი სავალდებულოა';
  }
  if (!formData.specifications.fuel_type) {
    errors['specifications.fuel_type'] = 'საწვავის ტიპი სავალდებულოა';
  }
  if (!formData.specifications.body_type) {
    errors['specifications.body_type'] = 'ძარის ტიპი სავალდებულოა';
  }
  if (!formData.specifications.drive_type) {
    errors['specifications.drive_type'] = 'წამყვანი თვლები სავალდებულოა';
  }

  // სურათები
  if (!images || images.length === 0) {
    errors.images = 'მინიმუმ ერთი სურათი სავალდებულოა';
  } else if (images.length > 15) {
    errors.images = 'მაქსიმუმ 15 სურათის ატვირთვაა შესაძლებელი';
  }

  return errors;
};

export const validateImage = (file: File): boolean => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
  
  return (
    file.size <= MAX_SIZE &&
    ALLOWED_TYPES.includes(file.type)
  );
};