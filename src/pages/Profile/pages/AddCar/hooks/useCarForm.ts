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
      description_ka: '',
      description_en: '',
      description_ru: '',
      location: {
        city: '',
        state: '',
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
    const newErrors = validateCarForm(formData, images);
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