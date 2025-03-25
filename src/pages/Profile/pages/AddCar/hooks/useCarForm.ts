import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { NewCarFormData } from '../types';
import { validateCarForm, validateImage, ValidationErrors } from '../utils/validation';
import carService from '../../../../../api/services/carService';
import { cleanFormData, validateImageFile } from '../utils/helpers';

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 3000;

export const useCarForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [errors, setErrors] = useState<ValidationErrors>({});
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
      // ძირითადი ინფო
      brand_id: '',
      model: '',
      category_id: '',
      year: new Date().getFullYear(),
      price: 0,
      
      // აღწერა
      description_ka: '',
      description_en: '',
      description_ru: '',
      
      // მდებარეობა
      city: '',
      state: '',
      country: 'საქართველო',
      location_type: 'georgia',
      
      // ტექნიკური მახასიათებლები
      specifications: {
        transmission: '',
        fuel_type: '',
        body_type: '',
        drive_type: '',
        engine_size: undefined,
        mileage: undefined,
        color: undefined
      },
      
      // დამატებითი ფუნქციები
      features: {
        has_air_conditioning: false,
        has_navigation: false,
        has_parking_control: false,
        has_board_computer: false,
        has_rear_view_camera: false,
        has_heated_seats: false,
        has_ventilated_seats: false,
        has_cruise_control: false,
        has_multimedia: false,
        has_bluetooth: false,
        has_start_stop: false,
        has_panoramic_roof: false,
        has_sunroof: false,
        has_leather_interior: false,
        has_memory_seats: false,
        has_memory_steering_wheel: false,
        has_electric_mirrors: false,
        has_electric_seats: false,
        has_heated_steering_wheel: false,
        has_electric_trunk: false,
        has_keyless_entry: false,
        has_alarm: false,
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

  // Clear saved draft on successful submission
  const clearSavedDraft = () => {
    localStorage.removeItem('car_form_draft');
  };

  const handleChange = (field: string, value: any) => {
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

  const handleFeaturesChange = (field: string, value: boolean) => {
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

    if (!validate()) {
      showToast('გთხოვთ შეავსოთ ყველა სავალდებულო ველი', 'error');
      return;
    }

    try {
      showLoading();
      const cleanedData = cleanFormData(formData);
      await carService.createCar(cleanedData, images, featuredImageIndex);
      clearSavedDraft(); // Clear the draft after successful submission
      showToast('მანქანა წარმატებით დაემატა', 'success');
      navigate('/profile/cars');
    } catch (error: any) {
      console.error('Error creating car:', error);
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
    handleSubmit,
    clearSavedDraft
  };
};