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
  console.log('Validating form data:', formData);

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
  
  // Required technical specifications
  if (!specs.transmission) {
    errors.transmission = 'გთხოვთ აირჩიოთ გადაცემათა კოლოფი';
  }

  if (!specs.fuel_type) {
    errors.fuel_type = 'გთხოვთ აირჩიოთ საწვავის ტიპი';
  }

  if (!specs.drive_type) {
    errors.drive_type = 'გთხოვთ აირჩიოთ წამყვანი თვლები';
  }

  // body_type is no longer required
  // if (!specs.body_type) {
  //   errors.body_type = 'გთხოვთ აირჩიოთ ძარის ტიპი';
  // }

  // Validate numeric fields with proper ranges
  if (specs.engine_size !== undefined) {
    const engineSize = Number(specs.engine_size);
    if (isNaN(engineSize) || engineSize <= 0) {
      errors.engine_size = 'გთხოვთ მიუთითოთ სწორი ძრავის მოცულობა';
    } else {
      // Check if engine size is in cc or liters and validate accordingly
      if (engineSize > 100) { // Likely in cc
        // Convert to liters for validation
        const liters = engineSize / 1000;
        if (liters > 10) { // Most cars don't have more than 10L engines
          errors.engine_size = 'ძრავის მოცულობა ძალიან დიდია';
        }
        console.log(`Validating engine size: ${engineSize}cc (${liters}L)`);
      } else { // Already in liters
        if (engineSize > 10) { // Most cars don't have more than 10L engines
          errors.engine_size = 'ძრავის მოცულობა ძალიან დიდია';
        }
        console.log(`Validating engine size: ${engineSize}L`);
      }
    }
  }

  if (specs.mileage !== undefined) {
    const mileage = Number(specs.mileage);
    if (isNaN(mileage) || mileage < 0) {
      errors.mileage = 'გთხოვთ მიუთითოთ სწორი გარბენი';
    } else if (mileage > 1000000) { // Reasonable max mileage
      errors.mileage = 'გარბენი ძალიან დიდია';
    }
  }

  if (specs.cylinders !== undefined) {
    const cylinders = Number(specs.cylinders);
    if (isNaN(cylinders) || cylinders <= 0) {
      errors.cylinders = 'გთხოვთ მიუთითოთ სწორი ცილინდრების რაოდენობა';
    } else if (cylinders > 16) { // Most cars don't have more than 16 cylinders
      errors.cylinders = 'ცილინდრების რაოდენობა ძალიან დიდია';
    }
  }

  if (specs.horsepower !== undefined) {
    const horsepower = Number(specs.horsepower);
    if (isNaN(horsepower) || horsepower <= 0) {
      errors.horsepower = 'გთხოვთ მიუთითოთ სწორი ცხენის ძალა';
    } else if (horsepower > 2000) { // Most cars don't have more than 2000 hp
      errors.horsepower = 'ცხენის ძალა ძალიან დიდია';
    }
  }

  if (specs.airbags_count !== undefined) {
    const airbagsCount = Number(specs.airbags_count);
    if (isNaN(airbagsCount) || airbagsCount < 0) {
      errors.airbags_count = 'გთხოვთ მიუთითოთ სწორი ეარბეგების რაოდენობა';
    } else if (airbagsCount > 12) { // Most cars don't have more than 12 airbags
      errors.airbags_count = 'ეარბეგების რაოდენობა ძალიან დიდია';
    }
  }

  // Validate images
  if (images.length === 0) {
    errors.images = 'გთხოვთ ატვირთოთ მინიმუმ ერთი სურათი';
  } else if (images.length > 15) {
    errors.images = 'მაქსიმუმ 15 სურათის ატვირთვაა შესაძლებელი';
  }

  console.log('Validation errors:', errors);
  return errors;
};