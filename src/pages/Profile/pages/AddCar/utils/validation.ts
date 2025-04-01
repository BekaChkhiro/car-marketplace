import { NewCarFormData } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateImage = (file: File): boolean => {
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

export const validateCarForm = (formData: NewCarFormData, images: File[]): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields validation with strict brand_id checking
  if (!formData.brand_id || formData.brand_id.trim() === '') {
    errors.brand_id = 'გთხოვთ აირჩიოთ მარკა';
  } else {
    const brandId = parseInt(formData.brand_id);
    if (isNaN(brandId) || brandId <= 0) {
      errors.brand_id = 'არასწორი მარკის ID';
    }
  }

  // Rest of the validation
  if (!formData.model) {
    errors.model = 'გთხოვთ აირჩიოთ მოდელი';
  }

  if (!formData.category_id) {
    errors.category_id = 'გთხოვთ აირჩიოთ კატეგორია';
  }

  if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
    errors.year = 'გთხოვთ მიუთითოთ სწორი წელი';
  }

  if (!formData.price || formData.price <= 0) {
    errors.price = 'გთხოვთ მიუთითოთ ფასი';
  }

  if (!formData.description_ka) {
    errors.description_ka = 'გთხოვთ შეიყვანოთ აღწერა';
  }

  if (!formData.location?.city) {
    errors.city = 'გთხოვთ მიუთითოთ ქალაქი';
  }

  if (formData.location?.location_type === 'international') {
    if (!formData.location.country) {
      errors.country = 'გთხოვთ მიუთითოთ ქვეყანა';
    }
    if (!formData.location.state) {
      errors.state = 'გთხოვთ მიუთითოთ შტატი/რეგიონი';
    }
  }

  // Technical specifications validation
  const specs = formData.specifications;
  
  if (!specs.transmission) {
    errors.transmission = 'გთხოვთ აირჩიოთ გადაცემათა კოლოფი';
  }

  if (!specs.fuel_type) {
    errors.fuel_type = 'გთხოვთ აირჩიოთ საწვავის ტიპი';
  }

  if (!specs.body_type) {
    errors.body_type = 'გთხოვთ აირჩიოთ ძარის ტიპი';
  }

  if (!specs.drive_type) {
    errors.drive_type = 'გთხოვთ აირჩიოთ წამყვანი თვლები';
  }

  if (specs.engine_size && (isNaN(Number(specs.engine_size)) || Number(specs.engine_size) <= 0)) {
    errors.engine_size = 'გთხოვთ მიუთითოთ სწორი ძრავის მოცულობა';
  }

  if (specs.horsepower && (isNaN(Number(specs.horsepower)) || Number(specs.horsepower) <= 0)) {
    errors.horsepower = 'გთხოვთ მიუთითოთ სწორი ცხენის ძალა';
  }

  if (specs.mileage && (isNaN(Number(specs.mileage)) || Number(specs.mileage) < 0)) {
    errors.mileage = 'გთხოვთ მიუთითოთ სწორი გარბენი';
  }

  if (specs.cylinders && (isNaN(Number(specs.cylinders)) || Number(specs.cylinders) <= 0)) {
    errors.cylinders = 'გთხოვთ მიუთითოთ სწორი ცილინდრების რაოდენობა';
  }

  return errors;
};