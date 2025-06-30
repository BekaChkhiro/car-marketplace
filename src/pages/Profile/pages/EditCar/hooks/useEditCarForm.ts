import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { Car, UpdateCarFormData } from '../../../../../api/types/car.types';
import carService from '../../../../../api/services/carService';
import { CarFeatures } from '../../AddCar/types';
import { validateCarForm, validateImage } from '../utils/validation';

export const useEditCarForm = (carId: number) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Initialize form data with empty values, will be populated once car data is fetched
  const initialFormData = (): UpdateCarFormData => ({
    id: carId,
    brand_id: 0,
    model: '',
    title: '',
    category_id: 0,
    year: new Date().getFullYear(),
    price: 0,
    currency: 'GEL', // Default currency is GEL (Georgian Lari)
    description_ka: '',
    description_en: '',
    description_ru: '',
    author_name: '',
    author_phone: '',
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
    features: [] // API expects string[] but we'll convert it later
  });
  
  const [formData, setFormData] = useState<UpdateCarFormData>(initialFormData());

  // Fetch car data on component mount
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const car = await carService.getCar(carId);
        if (car) {
          // დავლოგოთ მანქანის მონაცემები დებაგისთვის
          console.log('ჩატვირთული მანქანის მონაცემები:', car);
          console.log('ავტორის მონაცემები:', { სახელი: car.author_name, ტელეფონი: car.author_phone });
          
          populateFormData(car);
          
          // დავლოგოთ განახლებული ფორმის მონაცემები
          setTimeout(() => {
            console.log('ფორმის მონაცემები პოპულაციის შემდეგ:', formData);
          }, 100);
        } else {
          setError('მანქანა ვერ მოიძებნა');
        }
      } catch (error: any) {
        setError(error.message || 'მანქანის მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  // Convert car data to form data
  const populateFormData = (car: Car) => {
    // Process existing images
    if (car.images && car.images.length > 0) {
      setExistingImages(car.images);
      // Find primary image index
      const primaryIndex = car.images.findIndex(img => img.is_primary);
      setFeaturedImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }

    // Create form data from car object
    setFormData({
      id: carId, // Always include the car ID
      brand_id: car.brand_id || 0,
      model: car.model || '',
      title: car.title || '',
      category_id: car.category_id || 0,
      year: car.year || new Date().getFullYear(),
      price: car.price || 0,
      currency: car.currency || 'GEL',
      description_ka: car.description_ka || '',
      description_en: car.description_en || '',
      description_ru: car.description_ru || '',
      author_name: car.author_name || '',
      author_phone: car.author_phone || '',
      location: {
        city: car.location?.city || '',
        country: car.location?.country || 'საქართველო',
        location_type: car.location?.location_type || 'georgia',
        is_transit: car.location?.is_transit || false
      },
      specifications: {
        transmission: car.specifications?.transmission || '',
        fuel_type: car.specifications?.fuel_type || '',
        body_type: car.specifications?.body_type || '',
        drive_type: car.specifications?.drive_type || '',
        steering_wheel: car.specifications?.steering_wheel || 'left',
        engine_size: car.specifications?.engine_size,
        horsepower: car.specifications?.horsepower,
        mileage: car.specifications?.mileage,
        mileage_unit: car.specifications?.mileage_unit || 'km',
        color: car.specifications?.color || '',
        cylinders: car.specifications?.cylinders,
        interior_material: car.specifications?.interior_material || '',
        interior_color: car.specifications?.interior_color || '',
        airbags_count: car.specifications?.airbags_count,
        engine_type: car.specifications?.engine_type || ''
      },
      // Convert the features to string[] format for API compatibility
      features: [
        car.specifications?.has_abs ? 'has_abs' : '',
        car.specifications?.has_esp ? 'has_esp' : '',
        car.specifications?.has_asr ? 'has_asr' : '',
        car.specifications?.has_traction_control ? 'has_traction_control' : '',
        car.specifications?.has_central_locking ? 'has_central_locking' : '',
        car.specifications?.has_alarm ? 'has_alarm' : '',
        car.specifications?.has_fog_lights ? 'has_fog_lights' : '',
        car.specifications?.has_board_computer ? 'has_board_computer' : '',
        car.specifications?.has_multimedia ? 'has_multimedia' : '',
        car.specifications?.has_bluetooth ? 'has_bluetooth' : '',
        car.specifications?.has_air_conditioning ? 'has_air_conditioning' : '',
        car.specifications?.has_climate_control ? 'has_climate_control' : '',
        car.specifications?.has_heated_seats ? 'has_heated_seats' : '',
        car.specifications?.has_ventilated_seats ? 'has_ventilated_seats' : '',
        car.specifications?.has_cruise_control ? 'has_cruise_control' : '',
        car.specifications?.has_start_stop ? 'has_start_stop' : '',
        car.specifications?.has_panoramic_roof ? 'has_panoramic_roof' : '',
        car.specifications?.has_sunroof ? 'has_sunroof' : '',
        car.specifications?.has_leather_interior ? 'has_leather_interior' : '',
        car.specifications?.has_memory_seats ? 'has_memory_seats' : '',
        car.specifications?.has_memory_steering_wheel ? 'has_memory_steering_wheel' : '',
        car.specifications?.has_electric_mirrors ? 'has_electric_mirrors' : '',
        car.specifications?.has_electric_seats ? 'has_electric_seats' : '',
        car.specifications?.has_heated_steering_wheel ? 'has_heated_steering_wheel' : '',
        car.specifications?.has_electric_windows ? 'has_electric_windows' : '',
        car.specifications?.has_electric_trunk ? 'has_electric_trunk' : '',
        car.specifications?.has_keyless_entry ? 'has_keyless_entry' : '',
        car.specifications?.has_parking_control ? 'has_parking_control' : '',
        car.specifications?.has_rear_view_camera ? 'has_rear_view_camera' : '',
        car.specifications?.has_navigation ? 'has_navigation' : '',
        car.specifications?.has_technical_inspection ? 'has_technical_inspection' : ''
      ].filter(Boolean)
    });
  };

  const handleChange = (field: string, value: any) => {
    // Handle location fields
    if (['city', 'state', 'country', 'location_type'].includes(field)) {
      setFormData((prev: UpdateCarFormData) => ({
        ...prev,
        location: {
          ...prev.location || {},
          [field]: typeof value === 'object' ? value.value : value,
          is_transit: field === 'location_type' ? value === 'transit' : prev.location?.is_transit || false,
          city: prev.location?.city || '',
          country: prev.location?.country || 'საქართველო',
          location_type: field === 'location_type' ? (typeof value === 'object' ? value.value : value) : (prev.location?.location_type || 'georgia')
        }
      }));
      return;
    }

    setFormData((prev: UpdateCarFormData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationsChange = (field: string, value: any) => {
    // Process numeric values properly
    let processedValue = value;
    
    if (field === 'engine_size') {
      // Handle engine size - could be in cc or liters
      processedValue = value ? parseFloat(value) : undefined;
    } 
    else if (field === 'mileage' || field === 'cylinders' || field === 'airbags_count' || field === 'horsepower') {
      // Handle other numeric fields
      processedValue = value ? parseInt(value, 10) : undefined;
    }
    else if (field === 'has_board_computer' || field === 'has_alarm') {
      // Handle boolean fields
      processedValue = Boolean(value);
    }
    
    setFormData((prev: UpdateCarFormData) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: processedValue
      }
    }));
  };

  const handleFeaturesChange = (field: keyof CarFeatures, value: boolean) => {
    setFormData((prev: UpdateCarFormData) => {
      // Create a new features array with the updated value
      let featuresArray = [...(prev.features || [])] as string[];
      
      if (value) {
        // If the feature is enabled, add it to the array if not already present
        if (!featuresArray.includes(field as string)) {
          featuresArray.push(field as string);
        }
      } else {
        // If the feature is disabled, remove it from the array
        featuresArray = featuresArray.filter(f => f !== field);
      }
      
      return {
        ...prev,
        features: featuresArray
      };
    });
  };

  // Validate form data
  const validate = () => {
    // For edit form, we don't need to validate images if there are existing images
    const hasExistingImages = existingImages.length > 0;
    
    // Run validation, with an exception for images if we have existing ones
    const newErrors = validateCarForm(formData, images, hasExistingImages);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('გთხოვთ შეავსოთ ყველა აუცილებელი ველი', 'error');
      return;
    }
    
    try {
      showLoading();
      await carService.updateCar(carId, formData);
      hideLoading();
      
      // Show success message
      showToast('მანქანის მონაცემები წარმატებით განახლდა!', 'success');
      
      // Navigate to the car details page
      navigate(`/profile/cars`);
    } catch (error: any) {
      hideLoading();
      showToast(error.message || 'მანქანის განახლება ვერ მოხერხდა', 'error');
    }
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      
      // Validate all files
      const validFiles = files.filter(file => {
        if (!validateImage(file)) {
          showToast('სურათის ფორმატი ან ზომა არასწორია. დაშვებულია მხოლოდ JPEG/PNG ფორმატი, მაქსიმუმ 5MB', 'error');
          return false;
        }
        return true;
      });

      if (validFiles.length > 15) {
        showToast('მაქსიმუმ 15 სურათის ატვირთვაა შესაძლებელი', 'error');
        setIsUploading(false);
        return;
      }

      // Simulate a small delay to show the upload progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the images state to the valid files
      setImages(validFiles);
      
      // Set a timeout to turn off the uploading state
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    } catch (error: any) {
      setIsUploading(false);
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

  // ფუნქცია არსებული ფოტოს წასაშლელად
  const removeExistingImage = async (imageId: number) => {
    try {
      showLoading();
      // API-ზე მოთხოვნა ფოტოს წასაშლელად
      await carService.deleteCarImage(imageId);
      
      // წაშლის შემდეგ state-დან მოვაშოროთ ფოტო
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      hideLoading();
      showToast('ფოტო წარმატებით წაიშალა', 'success');
    } catch (error: any) {
      hideLoading();
      showToast(error.message || 'ფოტოს წაშლა ვერ მოხერხდა', 'error');
    }
  };

  // ფუნქცია მთავარი ფოტოს შესაცვლელად
  const setPrimaryImage = async (imageId: number) => {
    try {
      showLoading();
      // API-ზე მოთხოვნა მთავარი ფოტოს შესაცვლელად
      await carService.setPrimaryImage(carId, imageId);
      
      // განახლება State-ში
      setExistingImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
      
      hideLoading();
      showToast('მთავარი ფოტო შეიცვალა', 'success');
    } catch (error: any) {
      hideLoading();
      showToast(error.message || 'მთავარი ფოტოს შეცვლა ვერ მოხერხდა', 'error');
    }
  };

  return {
    formData,
    isLoading,
    error,
    errors,
    images,
    existingImages,
    featuredImageIndex,
    isUploading,
    setFeaturedImageIndex,
    handleChange,
    handleFeaturesChange,
    handleSpecificationsChange,
    handleSubmit,
    handleImageUpload,
    removeImage,
    removeExistingImage,
    setPrimaryImage
  };
};
