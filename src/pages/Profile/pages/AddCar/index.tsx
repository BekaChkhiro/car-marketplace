import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import carService from '../../../../api/services/carService';
import { useToast } from '../../../../context/ToastContext';
import { useLoading } from '../../../../context/LoadingContext';
import { useAuth } from '../../../../context/AuthContext';
import ImageUpload from '../../../../components/ImageUpload';
import BasicInfo from './components/BasicInfo';
import TechnicalSpecs from './components/TechnicalSpecs';
import Location from './components/Location';
import Description from './components/Description';
import type { NewCarFormData, FormSection } from './types';

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<NewCarFormData>({
    brand_id: '',
    category_id: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    description: '', // This is now required in state even if optional in API
    city: '',
    state: '',
    country: 'Georgia',
    status: 'available',
    // Make specifications required in state even if optional in API
    specifications: {
      engine_type: '',
      transmission: '',
      fuel_type: '',
      mileage: '',
      engine_size: '',
      horsepower: '',
      doors: '',
      color: '',
      body_type: ''
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    // Basic Info validation with numeric checks
    if (!formData.brand_id) newErrors['brand_id'] = 'მარკის არჩევა სავალდებულოა';
    if (!formData.category_id) newErrors['category_id'] = 'კატეგორიის არჩევა სავალდებულოა';
    if (!formData.model) newErrors['model'] = 'მოდელის მითითება სავალდებულოა';
    
    // Year validation
    if (!formData.year) {
      newErrors['year'] = 'წლის არჩევა სავალდებულოა';
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors['year'] = `წელი უნდა იყოს 1900-სა და ${currentYear + 1}-ს შორის`;
    }

    // Price validation
    if (!formData.price) {
      newErrors['price'] = 'ფასის მითითება სავალდებულოა';
    } else {
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors['price'] = 'ფასი უნდა იყოს დადებითი რიცხვი';
      }
    }

    // Location validation
    if (!formData.city?.trim()) {
      newErrors['city'] = 'ქალაქის მითითება სავალდებულოა';
    }
    if (!formData.state?.trim()) {
      newErrors['state'] = 'რეგიონის მითითება სავალდებულოა';
    }

    // Optional specifications validation if provided
    const specs = formData.specifications;
    if (specs) {
      if (specs.mileage && isNaN(Number(specs.mileage))) {
        newErrors['specifications.mileage'] = 'გარბენი უნდა იყოს რიცხვითი მნიშვნელობა';
      }
      if (specs.engine_size && isNaN(Number(specs.engine_size))) {
        newErrors['specifications.engine_size'] = 'ძრავის მოცულობა უნდა იყოს რიცხვითი მნიშვნელობა';
      }
      if (specs.horsepower && isNaN(Number(specs.horsepower))) {
        newErrors['specifications.horsepower'] = 'ცხენის ძალა უნდა იყოს რიცხვითი მნიშვნელობა';
      }
      if (specs.doors) {
        const doors = Number(specs.doors);
        if (isNaN(doors) || doors < 2 || doors > 5) {
          newErrors['specifications.doors'] = 'კარების რაოდენობა უნდა იყოს 2-დან 5-მდე';
        }
      }
    }

    // Images validation
    if (images.length === 0) {
      setError('გთხოვთ ატვირთოთ მინიმუმ 1 სურათი');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('გთხოვთ გაიაროთ ავტორიზაცია');
      showToast('გთხოვთ გაიაროთ ავტორიზაცია მანქანის დასამატებლად', 'error');
      navigate('/');
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    showLoading();

    try {
      // Convert form data to proper types before sending
      const carDataToSend = {
        ...formData,
        brand_id: Number(formData.brand_id),
        category_id: Number(formData.category_id),
        year: Number(formData.year),
        price: Number(formData.price),
        specifications: formData.specifications ? {
          ...formData.specifications,
          mileage: formData.specifications.mileage ? Number(formData.specifications.mileage) : undefined,
          engine_size: formData.specifications.engine_size ? Number(formData.specifications.engine_size) : undefined,
          horsepower: formData.specifications.horsepower ? Number(formData.specifications.horsepower) : undefined,
          doors: formData.specifications.doors ? Number(formData.specifications.doors) : undefined
        } : undefined,
        // Ensure strings are trimmed
        model: formData.model.trim(),
        description: formData.description?.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim()
      };

      const response = await carService.createCar(carDataToSend, images);
      showToast('მანქანა წარმატებით დაემატა', 'success');
      navigate(`/transports/${response.id}`);
    } catch (err: any) {
      console.error('Error creating car:', err);
      const errorMessage = err.message === 'No authentication token found' || err.message === 'Authentication token expired'
        ? 'გთხოვთ გაიაროთ ავტორიზაცია მანქანის დასამატებლად'
        : err.response?.data?.message || 'დაფიქსირდა შეცდომა მანქანის დამატებისას';
      
      setError(errorMessage);
      showToast(errorMessage, 'error');

      if (err.message === 'No authentication token found' || err.message === 'Authentication token expired') {
        navigate('/');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [section, key] = field.split('.') as [FormSection, string];
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleImageUpload = useCallback((files: File[]) => {
    setImages(prev => [...prev, ...files].slice(0, 10));
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-dark mb-6">მანქანის დამატება</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-dark">სურათები</h2>
          <ImageUpload
            files={images}
            onUpload={handleImageUpload}
            onRemove={removeImage}
            maxFiles={10}
            maxSize={5 * 1024 * 1024} // 5MB
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
            isUploading={isLoading}
          />
          <p className="text-sm text-gray-500">
            * მაქსიმუმ 10 სურათი, თითოეული მაქსიმუმ 5MB ზომის. დაშვებული ფორმატები: JPEG, PNG, WebP
          </p>
        </div>

        <BasicInfo 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
        
        <TechnicalSpecs 
          specifications={formData.specifications} 
          onChange={handleChange}
          errors={errors}
        />
        
        <Location 
          city={formData.city}
          state={formData.state}
          country={formData.country}
          onChange={handleChange}
          errors={errors}
        />
        
        <Description 
          description={formData.description} 
          onChange={handleChange}
          errors={errors}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              მიმდინარეობს...
            </>
          ) : (
            'დამატება'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCar;