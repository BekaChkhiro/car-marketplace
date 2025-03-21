import { NewCarFormData } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateCarForm = (formData: NewCarFormData, images: File[]): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields validation
  if (!formData.brand_id) errors.brand_id = 'მარკა სავალდებულოა';
  if (!formData.model) errors.model = 'მოდელი სავალდებულოა';
  if (!formData.category_id) errors.category_id = 'კატეგორია სავალდებულოა';
  if (!formData.year) errors.year = 'წელი სავალდებულოა';
  if (!formData.price) errors.price = 'ფასი სავალდებულოა';
  if (!formData.city) errors.city = 'ქალაქი სავალდებულოა';
  if (!formData.country) errors.country = 'ქვეყანა სავალდებულოა';
  if (!formData.description_ka) errors.description_ka = 'აღწერა სავალდებულოა';

  // Specifications validation
  if (!formData.specifications.transmission) errors['specifications.transmission'] = 'ტრანსმისია სავალდებულოა';
  if (!formData.specifications.fuel_type) errors['specifications.fuel_type'] = 'საწვავის ტიპი სავალდებულოა';
  if (!formData.specifications.body_type) errors['specifications.body_type'] = 'ძარის ტიპი სავალდებულოა';
  if (!formData.specifications.drive_type) errors['specifications.drive_type'] = 'წამყვანი თვლები სავალდებულოა';
  if (!formData.specifications.steering_wheel) errors['specifications.steering_wheel'] = 'საჭე სავალდებულოა';

  // Images validation
  if (images.length === 0) {
    errors.images = 'მინიმუმ ერთი სურათი სავალდებულოა';
  }

  return errors;
};