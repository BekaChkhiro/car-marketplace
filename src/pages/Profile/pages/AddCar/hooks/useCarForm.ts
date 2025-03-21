import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { NewCarFormData } from '../types';
import { validateCarForm, ValidationErrors } from '../utils/validation';
import carService from '../../../../../api/services/carService';
import { cleanFormData, validateImageFile } from '../utils/helpers';

export const useCarForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [formData, setFormData] = useState<NewCarFormData>({
    brand_id: '',
    category_id: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    description_ka: '',
    description_en: '',
    description_ru: '',
    status: 'available',
    city: '',
    state: '',
    country: 'საქართველო',
    location_type: 'georgia',
    specifications: {
      transmission: '',
      fuel_type: '',
      body_type: '',
      drive_type: '',
    },
    features: {}
  });

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
        try {
          return validateImageFile(file);
        } catch (error: any) {
          showToast(error.message, 'error');
          return false;
        }
      });

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
    handleSubmit
  };
};