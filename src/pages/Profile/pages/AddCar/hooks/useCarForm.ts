import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { NewCarFormData, CarFeatures } from '../types';
import { validateCarForm, validateImage } from '../utils/validation';
import carService from '../../../../../api/services/carService';
import { cleanFormData } from '../utils/helpers';

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 3000;

export const useCarForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  
  // Get saved draft or use initial state
  const [formData, setFormData] = useState<NewCarFormData>(() => {
    const savedDraft = localStorage.getItem('car_form_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error('Error parsing saved form draft:', e);
      }
    }
    return {
      brand_id: '',
      model: '',
      category_id: '',
      year: new Date().getFullYear(),
      price: 0,
      currency: 'GEL', // Default currency is GEL (Georgian Lari)
      description_ka: '',
      description_en: '',
      description_ru: '',
      location: {
        city: '',
        country: 'საქართველო',
        location_type: 'georgia',
        is_transit: false
      },
      specifications: {
        transmission: '',
        fuel_type: '',
        body_type: '',
        drive_type: '',
        steering_wheel: 'left',
        engine_size: undefined,
        horsepower: undefined,
        mileage: undefined,
        mileage_unit: 'km',
        color: '',
        cylinders: undefined,
        interior_material: '',
        interior_color: '',
        airbags_count: undefined,
        engine_type: ''
      },
      features: {
        has_abs: false,
        has_esp: false,
        has_asr: false,
        has_traction_control: false,
        has_central_locking: false,
        has_alarm: false,
        has_fog_lights: false,
        has_board_computer: false,
        has_multimedia: false,
        has_bluetooth: false,
        has_air_conditioning: false,
        has_climate_control: false,
        has_heated_seats: false,
        has_ventilated_seats: false,
        has_cruise_control: false,
        has_start_stop: false,
        has_panoramic_roof: false,
        has_sunroof: false,
        has_leather_interior: false,
        has_memory_seats: false,
        has_memory_steering_wheel: false,
        has_electric_mirrors: false,
        has_electric_seats: false,
        has_heated_steering_wheel: false,
        has_electric_windows: false,
        has_electric_trunk: false,
        has_keyless_entry: false,
        has_parking_control: false,
        has_rear_view_camera: false,
        has_navigation: false,
        has_technical_inspection: false
      }
    };
  });

  // Auto-save form data to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('car_form_draft', JSON.stringify(formData));
    }, AUTO_SAVE_DELAY);
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    console.log(`handleChange - field: ${field}, value:`, value);
    
    // Handle location fields
    if (['city', 'state', 'country', 'location_type'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: typeof value === 'object' ? value.value : value,
          is_transit: field === 'location_type' ? value === 'transit' : prev.location?.is_transit || false
        }
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleFeaturesChange = (field: keyof CarFeatures, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
  };

  const validate = () => {
    // Log all form data for debugging
    console.log('Form data being validated:', JSON.stringify(formData, null, 2));
    
    // Check for empty fields and log them
    const emptyFields: string[] = [];
    
    // Check basic fields
    if (!formData.brand_id) emptyFields.push('brand_id');
    if (!formData.model) emptyFields.push('model');
    if (!formData.category_id) emptyFields.push('category_id');
    if (!formData.year) emptyFields.push('year');
    if (!formData.price) emptyFields.push('price');
    if (!formData.description_ka) emptyFields.push('description_ka');
    
    // Check location fields
    if (!formData.location?.city) emptyFields.push('location.city');
    if (formData.location?.location_type === 'international') {
      if (!formData.location.country) emptyFields.push('location.country');
      if (!formData.location.state) emptyFields.push('location.state');
    }
    
    // Check specifications
    const specs = formData.specifications;
    if (!specs.transmission) emptyFields.push('specifications.transmission');
    if (!specs.fuel_type) emptyFields.push('specifications.fuel_type');
    if (!specs.body_type) emptyFields.push('specifications.body_type');
    if (!specs.drive_type) emptyFields.push('specifications.drive_type');
    if (!specs.steering_wheel) emptyFields.push('specifications.steering_wheel');
    
    // Check if images are provided
    if (images.length === 0) emptyFields.push('images');
    
    // Log empty fields
    if (emptyFields.length > 0) {
      console.log('Empty fields detected:', emptyFields);
      console.log('Empty fields count:', emptyFields.length);
    } else {
      console.log('All required fields are filled');
    }
    
    // Run the regular validation
    const newErrors = validateCarForm(formData, images);
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      const validFiles = files.filter(file => {
        if (!validateImage(file)) {
          showToast('სურათის ფორმატი ან ზომა არასწორია. დაშვებულია მხოლოდ JPEG/PNG ფორმატი, მაქსიმუმ 5MB', 'error');
          return false;
        }
        return true;
      });

      if (images.length + validFiles.length > 15) {
        showToast('მაქსიმუმ 15 სურათის ატვირთვაა შესაძლებელი', 'error');
        return;
      }

      setImages(prev => [...prev, ...validFiles]);
    } catch (error: any) {
      showToast(error.message || 'სურათის ატვირთვისას მოხდა შეცდომა', 'error');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('HandleSubmit - Form data before validation:', formData);
    
    // Log specific details about the steering_wheel field
    console.log('Steering wheel value type:', typeof formData.specifications.steering_wheel);
    console.log('Steering wheel value:', formData.specifications.steering_wheel);
    
    // Check if steering_wheel is an object and handle it
    if (formData.specifications.steering_wheel && 
        typeof formData.specifications.steering_wheel === 'object') {
      const steeringWheelObj = formData.specifications.steering_wheel as any;
      console.log('Steering wheel is an object:', steeringWheelObj);
      if (steeringWheelObj.value) {
        console.log('Extracting value from steering wheel object:', steeringWheelObj.value);
        formData.specifications.steering_wheel = steeringWheelObj.value as 'left' | 'right';
      }
    }
    
    // Also check for any other select fields that might be objects
    const selectFields = ['transmission', 'fuel_type', 'body_type', 'drive_type'] as const;
    selectFields.forEach(field => {
      const value = formData.specifications[field as keyof typeof formData.specifications];
      if (value && typeof value === 'object') {
        console.log(`Field ${field} is an object:`, value);
        const objValue = (value as any).value;
        if (objValue) {
          console.log(`Extracting value from ${field} object:`, objValue);
          // Use type assertion to safely assign the value
          (formData.specifications as any)[field] = objValue;
        }
      }
    });

    if (!formData.brand_id) {
      showToast('გთხოვთ აირჩიოთ მარკა', 'error');
      return;
    }

    if (!validate()) {
      showToast('გთხოვთ შეავსოთ ყველა სავალდებულო ველი', 'error');
      return;
    }

    try {
      showLoading();
      console.log('HandleSubmit - Form data after validation:', formData);
      const cleanedData = cleanFormData(formData);
      console.log('HandleSubmit - Cleaned data:', cleanedData);
      
      await carService.createCar({
        ...cleanedData,
        images
      });
      
      localStorage.removeItem('car_form_draft'); // Clear the draft after successful submission
      showToast('მანქანა წარმატებით დაემატა', 'success');
      navigate('/profile/cars');
    } catch (error: any) {
      console.error('HandleSubmit - Error:', error);
      showToast(error.message || 'მანქანის დამატებისას მოხდა შეცდომა', 'error');
    } finally {
      hideLoading();
    }
  };

  return {
    formData,
    errors,
    images,
    featuredImageIndex,
    handleChange,
    handleSpecificationsChange,
    handleFeaturesChange,
    handleImageUpload,
    removeImage,
    setFeaturedImageIndex,
    handleSubmit
  };
};