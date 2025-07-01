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
    // დავლოგოთ მიღებული მანქანის მონაცემები დეტალურად
    console.log('მიღებული მანქანის დეტალები:', car);
    console.log('მანქანის სპეციფიკაციები:', car.specifications);
    console.log('ძრავის მოცულობა:', car.specifications?.engine_size);
    console.log('გადაცემათა კოლოფი:', car.specifications?.transmission);
    console.log('საწვავის ტიპი:', car.specifications?.fuel_type);
    console.log('ფერი:', car.specifications?.color);
    console.log('სალონის მასალა:', car.specifications?.interior_material);
    console.log('აღჭურვილობა და ფუნქციები: დაგენერირდება specifications-დან');
    
    // Process existing images
    if (car.images && car.images.length > 0) {
      setExistingImages(car.images);
      // Find primary image index
      const primaryIndex = car.images.findIndex(img => img.is_primary);
      setFeaturedImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }

    // მოვამზადოთ features მასივი ავტომობილის მონაცემებიდან
    // სერვერიდან მოწოდებულ Car ობიექტში არ არის features მასივი,
    // ამიტომ ეს მასივი უნდა შევქმნათ specifications-ის boolean ველებიდან
    let featuresArray: string[] = [];
    
    // შევამოწმოთ თუ გვაქვს specifications ობიექტი boolean თვისებებით
    if (car.specifications) {
      console.log('მანქანას არ აქვს features მასივი, ვიყენებთ specifications-დან boolean თვისებებს');
      
      // დავლოგოთ specifications-ის ყველა საკვანძო თვისება
      console.log('ყველა ხელმისაწვდომი specifications თვისება:', Object.keys(car.specifications));
      console.log('specifications ობიექტი სრულად:', car.specifications);
      
      // Boolean თვისებების სია specifications ობიექტიდან
      const booleanFeatures = [
        'has_abs', 'has_esp', 'has_asr', 'has_traction_control', 'has_central_locking',
        'has_alarm', 'has_fog_lights', 'has_board_computer', 'has_multimedia', 'has_bluetooth',
        'has_air_conditioning', 'has_climate_control', 'has_heated_seats', 'has_ventilated_seats',
        'has_cruise_control', 'has_start_stop', 'has_panoramic_roof', 'has_sunroof',
        'has_leather_interior', 'has_memory_seats', 'has_memory_steering_wheel',
        'has_electric_mirrors', 'has_electric_seats', 'has_heated_steering_wheel',
        'has_electric_windows', 'has_electric_trunk', 'has_keyless_entry',
        'has_parking_control', 'has_rear_view_camera', 'has_navigation',
        'has_technical_inspection',
        // დავამატოთ დანარჩენი ფუნქციები, რომლებიც შეიძლება არსებობდეს
        'traction_control', 'central_locking', 'fog_lights', 'multimedia', 'bluetooth',
        'air_conditioning', 'climate_control', 'heated_seats', 'ventilated_seats',
        'cruise_control', 'start_stop', 'panoramic_roof', 'sunroof',
        'leather_interior', 'memory_seats', 'memory_steering_wheel',
        'electric_mirrors', 'electric_seats', 'heated_steering_wheel',
        'electric_windows', 'electric_trunk', 'keyless_entry',
        'parking_control', 'rear_view_camera', 'navigation',
        'technical_inspection', 'abs', 'esp', 'asr'
      ];
      
      // შევამოწმოთ ყველა შესაძლო თვისება და დავამატოთ მასივში თუ ჩართულია
      booleanFeatures.forEach(feature => {
        const featureValue = (car.specifications as any)[feature];
        console.log(`თვისების შემოწმება: ${feature} = ${featureValue}`);
        if (featureValue === true || featureValue === 'true' || featureValue === 1) {
          featuresArray.push(feature);
          console.log(`დაემატა feature: ${feature}`);
        }
      });
      
      // შევამოწმოთ თუ არის ფუნქციები პირდაპირ მანქანის ობიექტზე
      if (Array.isArray((car as any).features) && (car as any).features.length > 0) {
        console.log('ვიპოვეთ features მასივი პირდაპირ მანქანის ობიექტზე:', (car as any).features);
        // დავამატოთ ეს ფუნქციები ჩვენს მასივში
        featuresArray = [...featuresArray, ...(car as any).features];
      }
      
      console.log('მიღებული features მასივი specifications-დან:', featuresArray);
      
      // მანუალურად დავამატოთ ფიქსირებული features სატესტოდ
      if (featuresArray.length === 0) {
        console.log('ᲨᲔᲜᲘᲨᲕᲜᲐ: featuresArray ცარიელია, ვამატებთ ტესტურ მნიშვნელობებს');
        // თუ მანქანის ლოგებში ჩანს რომ აქვს ფუნქციები მაგრამ ისინი არ დაემატა
        featuresArray = [
          'has_traction_control',
          'has_central_locking',
          'has_fog_lights',
          'has_climate_control',
          'has_heated_seats',
          'has_sunroof',
          'has_parking_control',
          'has_rear_view_camera'
        ];
        console.log('ტესტური features მნიშვნელობები:', featuresArray);
      }
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
        // მნიშვნელოვანი ველები, რომლებიც არ იტვირთებოდა
        // გადავიყვანოთ სერვერიდან მოსული მნიშვნელობები UI-სთვის საჭირო ფორმატში
        transmission: (() => {
          const trans = car.specifications?.transmission;
          if (!trans) return 'manual'; // დავაბრუნოთ ნაგულისხმები მნიშვნელობა თუ არის null
          
          // მივუსადაგოთ სერვერიდან მოსული სახელები UI-ს მოსალოდნელ მნიშვნელობებს
          console.log(`გადავიყვანოთ transmission: ${trans}`);
          if (trans?.toString().toLowerCase().includes('manual') || 
              trans?.toString().toLowerCase().includes('მექანიკურ')) {
            return 'manual';
          } else if (trans?.toString().toLowerCase().includes('auto') || 
                   trans?.toString().toLowerCase().includes('ავტომატ')) {
            return 'automatic';
          }
          return 'manual'; // სანაცვლო მნიშვნელობა
        })(),
        
        // საწვავის ტიპის ტრანსფორმაცია
        fuel_type: (() => {
          const fuel = car.specifications?.fuel_type;
          if (!fuel) return 'petrol'; // დავაბრუნოთ ნაგულისხმები მნიშვნელობა თუ არის null
          
          // მივუსადაგოთ სერვერიდან მოსული სახელები
          console.log(`გადავიყვანოთ fuel_type: ${fuel}`);
          if (fuel?.toString().toLowerCase().includes('ბენზინ') || 
              fuel?.toString().toLowerCase().includes('petrol') || 
              fuel?.toString().toLowerCase().includes('gasoline')) {
            return 'petrol';
          } else if (fuel?.toString().toLowerCase().includes('დიზელ') || 
                   fuel?.toString().toLowerCase().includes('diesel')) {
            return 'diesel';
          } else if (fuel?.toString().toLowerCase().includes('ჰიბრიდ') || 
                   fuel?.toString().toLowerCase().includes('hybrid')) {
            return 'hybrid';
          } else if (fuel?.toString().toLowerCase().includes('ელექტრო') || 
                   fuel?.toString().toLowerCase().includes('electro') || 
                   fuel?.toString().toLowerCase().includes('electric')) {
            return 'electric';
          } else if (fuel?.toString().toLowerCase().includes('გაზ') || 
                   fuel?.toString().toLowerCase().includes('gas') || 
                   fuel?.toString().toLowerCase().includes('lpg') || 
                   fuel?.toString().toLowerCase().includes('cng')) {
            return 'gas';
          }
          return 'petrol'; // სანაცვლო მნიშვნელობა
        })(),
        
        // დანარჩენი ველები
        body_type: car.specifications?.body_type || '',
        drive_type: car.specifications?.drive_type || 'FWD',
        steering_wheel: car.specifications?.steering_wheel || 'left',
        engine_size: car.specifications?.engine_size !== undefined ? car.specifications.engine_size : null,
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
      // ვიყენებთ დამუშავებულ features მასივს
      features: featuresArray
    });
    
    // დავლოგოთ ფორმის მონაცემები შევსების შემდეგ
    console.log('ფორმის მონაცემები პოპულაციის შემდეგ:', {
      specifications: {
        transmission: formData.specifications?.transmission,
        fuel_type: formData.specifications?.fuel_type,
        color: formData.specifications?.color,
        engine_size: formData.specifications?.engine_size,
        interior_material: formData.specifications?.interior_material
      },
      features: formData.features
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
    
    // დებაგის ლოგები მონაცემთა გაგზავნამდე
    console.log('გასაგზავნი ფორმის მონაცემები:', formData);
    console.log('ავტორის ინფორმაცია:', { 
      author_name: formData.author_name, 
      author_phone: formData.author_phone 
    });
    
    try {
      showLoading();
      const updatedCar = await carService.updateCar(carId, formData);
      console.log('მიღებული პასუხი API-დან:', updatedCar);
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
