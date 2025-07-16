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

// VIN validation function - VIN is completely optional
export const validateVIN = (vin: string): boolean => {
  if (!vin) return true; // Empty VIN is valid - field is optional
  
  // Remove spaces and convert to uppercase
  const cleanVIN = vin.replace(/\s/g, '').toUpperCase();
  
  // Check if VIN is exactly 17 characters
  if (cleanVIN.length !== 17) {
    return false;
  }
  
  // Check if VIN contains only valid characters (no I, O, Q)
  const vinPattern = /^[ABCDEFGHJKLMNPRSTUVWXYZ0-9]{17}$/;
  if (!vinPattern.test(cleanVIN)) {
    return false;
  }
  
  // Simple check digit validation for position 9
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const values: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i !== 8) { // Skip check digit position
      sum += (values[cleanVIN[i]] || 0) * weights[i];
    }
  }
  
  const checkDigit = sum % 11;
  const expectedChar = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  return cleanVIN[8] === expectedChar;
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

  // Validate VIN code if provided
  if (formData.vin_code && formData.vin_code.trim()) {
    if (!validateVIN(formData.vin_code)) {
      errors.vin_code = 'VIN კოდი არასწორია. უნდა იყოს 17 სიმბოლოსგან შემდგარი';
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