import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { NewCarFormData, CarFeatures } from '../types';
import { validateCarForm, validateImage } from '../utils/validation';
import carService from '../../../../../api/services/carService';
import { CreateCarFormData } from '../../../../../api/types/car.types';
import balanceService from '../../../../../api/services/balanceService';
import vipPricingService from '../../../../../api/services/vipPricingService';
import vipService from '../../../../../api/services/vipService';

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 2000;

export const useCarForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<any[]>([]);
  const [additionalServicesPricing, setAdditionalServicesPricing] = useState<any[]>([]);
  
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
      title: '',
      category_id: '',
      year: new Date().getFullYear(),
      price: 0,
      currency: 'GEL', // Default currency is GEL (Georgian Lari)
      description_ka: '',
      description_en: '',
      description_ru: '',
      vin_code: '', // VIN code field
      vip_status: 'none', // Default VIP status is none
      vip_days: 1, // Default VIP days
      color_highlighting: false,
      color_highlighting_days: 1,
      auto_renewal: false,
      auto_renewal_days: 1,
      author_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '', // Default to current user name
      author_phone: user?.phone || '', // Default to current user phone
      location: {
        city: '',
        country: 'საქართველო',
        location_type: 'georgia',
        is_in_transit: false
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
        has_technical_inspection: false,
        has_hydraulics: false,
        has_alloy_wheels: false,
        has_spare_tire: false,
        is_disability_adapted: false,
        has_aux: false,
        has_multifunction_steering_wheel: false
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

  // Fetch user balance and VIP pricing on component mount
  useEffect(() => {
    const fetchBalanceAndPricing = async () => {
      try {
        const [balance, pricingData] = await Promise.all([
          balanceService.getBalance(),
          vipPricingService.getAllPricing()
        ]);
        const processedBalance = typeof balance === 'number' ? balance : parseFloat(balance) || 0;
        setUserBalance(processedBalance);
        setVipPricing(pricingData.packages);
        setAdditionalServicesPricing(pricingData.additionalServices);
      } catch (error) {
        console.error('Error fetching balance and pricing:', error);
        setUserBalance(0);
      }
    };
    
    fetchBalanceAndPricing();
  }, []);

  const handleChange = (field: string, value: any) => {
    console.log(`handleChange - field: ${field}, value:`, value);
    
    // Handle location fields
    if (['city', 'state', 'country', 'location_type'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: typeof value === 'object' ? value.value : value,
          is_in_transit: field === 'location_type' ? value === 'transit' : prev.location?.is_in_transit || false
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
    console.log(`handleSpecificationsChange - field: ${field}, value:`, value);
    
    // Process numeric values properly
    let processedValue = value;
    
    if (field === 'engine_size') {
      // For engine size, we keep the original string value from the dropdown
      // This ensures decimal values like '1.0', '2.0', '3.0' work properly
      processedValue = value ? parseFloat(value) : undefined;
      console.log(`Processing engine_size: ${value} -> ${processedValue}`);
    } 
    else if (field === 'mileage' || field === 'cylinders' || field === 'airbags_count' || field === 'horsepower') {
      // Handle other numeric fields
      processedValue = value ? parseInt(value, 10) : undefined;
      console.log(`Processing numeric field ${field}: ${value} -> ${processedValue}`);
    }
    else if (field === 'has_board_computer' || field === 'has_alarm') {
      // Handle boolean fields
      processedValue = Boolean(value);
      console.log(`Processing boolean field ${field}: ${value} -> ${processedValue}`);
    }
    
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: processedValue
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

  // Validate form data using the validation utility
  // VIP pricing functions
  const getVipPrice = (status: string): number => {
    if (status === 'none') {
      const freePricing = vipPricing.find(p => p.service_type === 'free');
      return freePricing ? Number(freePricing.price) : 0;
    }

    const pricing = vipPricing.find(p => p.service_type === status);
    return pricing ? Number(pricing.price) : 0;
  };

  const getAdditionalServicesPrice = (): number => {
    let price = 0;
    
    if (formData.color_highlighting) {
      const colorPricing = additionalServicesPricing.find(s => s.service_type === 'color_highlighting');
      const dailyPrice = colorPricing ? colorPricing.price : 0.5;
      price += dailyPrice * formData.color_highlighting_days;
    }
    
    if (formData.auto_renewal) {
      const renewalPricing = additionalServicesPricing.find(s => s.service_type === 'auto_renewal');
      const dailyPrice = renewalPricing ? renewalPricing.price : 0.5;
      price += dailyPrice * formData.auto_renewal_days;
    }
    
    return price;
  };

  const getTotalVipPrice = (): number => {
    const basePrice = getVipPrice(formData.vip_status) * formData.vip_days;
    const additionalPrice = getAdditionalServicesPrice();
    return basePrice + additionalPrice;
  };

  const hasSufficientBalance = (): boolean => {
    if (formData.vip_status === 'none' && getVipPrice('none') === 0) {
      return true; // Free status
    }
    // Check total VIP cost including additional services
    return userBalance >= getTotalVipPrice();
  };

  const validate = () => {
    // Log all form data for debugging
    console.log('Form data being validated:', JSON.stringify(formData, null, 2));
    
    // Check for empty fields and log them
    const emptyFields: string[] = [];
    
    // Check basic fields
    if (!formData.brand_id) emptyFields.push('brand_id');
    if (!formData.model) emptyFields.push('model');
    if (!formData.title) emptyFields.push('title');
    if (!formData.category_id) emptyFields.push('category_id');
    if (!formData.year) emptyFields.push('year');
    if (!formData.price) emptyFields.push('price');
    if (!formData.description_ka) emptyFields.push('description_ka');
    if (!formData.author_name) emptyFields.push('author_name');
    if (!formData.author_phone) emptyFields.push('author_phone');
    
    // Check location fields
    if (!formData.location?.city) emptyFields.push('location.city');
    
    // Check specifications fields
    const specs = formData.specifications;
    if (!specs.transmission) emptyFields.push('specifications.transmission');
    if (!specs.fuel_type) emptyFields.push('specifications.fuel_type');
    if (!specs.drive_type) emptyFields.push('specifications.drive_type');
    if (!specs.steering_wheel) emptyFields.push('specifications.steering_wheel');
    if (!specs.mileage) emptyFields.push('specifications.mileage');
    
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
  
  // Clean form data before submission to ensure proper format for API
  const cleanFormData = (): CreateCarFormData => {
    // Create a deep copy of the form data
    const cleanedData = JSON.parse(JSON.stringify(formData)) as CreateCarFormData;

    // Make sure location object is complete
    if (!cleanedData.location) {
      cleanedData.location = {
        city: '',
        country: 'საქართველო',
        location_type: 'georgia',
        is_in_transit: false
      };
    }
    
    // Make sure specifications object is complete
    if (!cleanedData.specifications) {
      cleanedData.specifications = {
        transmission: '',
        fuel_type: '',
        body_type: '',
        drive_type: '',
        steering_wheel: 'left',
        mileage: 0,
        mileage_unit: 'km',
        color: '',
        engine_size: undefined
      };
    }
    
    // Convert the features object to a string array as required by the API
    // The API expects features as a string[] where each string is a feature name
    const featuresArray: string[] = [];
    
    if (cleanedData.features) {
      // Loop through all feature properties and add enabled ones to the array
      Object.entries(cleanedData.features).forEach(([key, value]) => {
        // Convert value to boolean and check if it's true
        if (Boolean(value) === true) {
          // Remove the 'has_' prefix if present and add to the array
          const featureName = key.startsWith('has_') ? key.substring(4) : key;
          featuresArray.push(featureName);
        }
      });
    }
    
    // Replace the features object with the array
    cleanedData.features = featuresArray;
    
    // Ensure numeric fields are properly formatted
    if (cleanedData.specifications) {
      // Handle engine size - keep the original value from dropdown
      if (cleanedData.specifications.engine_size !== undefined) {
        // Convert to string first to check if it's empty
        const engineSizeStr = String(cleanedData.specifications.engine_size);
        if (engineSizeStr !== '' && engineSizeStr !== '0') {
          // The engine size from dropdown is already in the correct format (e.g., "0.5", "1.0", "2.5")
          const engineSize = parseFloat(engineSizeStr);
          if (!isNaN(engineSize) && engineSize > 0) {
            cleanedData.specifications.engine_size = engineSize;
            console.log(`Engine size: ${cleanedData.specifications.engine_size}L`);
          } else {
            console.warn('Invalid engine size value:', cleanedData.specifications.engine_size);
            delete cleanedData.specifications.engine_size; // Remove instead of setting to 0
          }
        } else {
          delete cleanedData.specifications.engine_size; // Remove instead of setting to 0
        }
      }
      
      // Ensure other numeric fields are numbers
      if (cleanedData.specifications.mileage !== undefined) {
        const mileageStr = String(cleanedData.specifications.mileage);
        if (mileageStr !== '' && mileageStr !== '0') {
          const mileage = Number(mileageStr);
          if (!isNaN(mileage) && mileage >= 0) {
            cleanedData.specifications.mileage = mileage;
          } else {
            delete cleanedData.specifications.mileage;
          }
        } else {
          delete cleanedData.specifications.mileage;
        }
      }
      
      if (cleanedData.specifications.cylinders !== undefined) {
        const cylindersStr = String(cleanedData.specifications.cylinders);
        if (cylindersStr !== '' && cylindersStr !== '0') {
          const cylinders = Number(cylindersStr);
          if (!isNaN(cylinders) && cylinders > 0) {
            cleanedData.specifications.cylinders = Math.round(cylinders);
          } else {
            delete cleanedData.specifications.cylinders;
          }
        } else {
          delete cleanedData.specifications.cylinders;
        }
      }
      
      if (cleanedData.specifications.airbags_count !== undefined) {
        const airbagsStr = String(cleanedData.specifications.airbags_count);
        if (airbagsStr !== '') {
          const airbagsCount = Number(airbagsStr);
          if (!isNaN(airbagsCount) && airbagsCount >= 0) {
            cleanedData.specifications.airbags_count = Math.round(airbagsCount);
          } else {
            delete cleanedData.specifications.airbags_count;
          }
        } else {
          delete cleanedData.specifications.airbags_count;
        }
      }
      
      if (cleanedData.specifications.horsepower !== undefined) {
        const horsepowerStr = String(cleanedData.specifications.horsepower);
        if (horsepowerStr !== '' && horsepowerStr !== '0') {
          const horsepower = Number(horsepowerStr);
          if (!isNaN(horsepower) && horsepower > 0) {
            cleanedData.specifications.horsepower = Math.round(horsepower);
          } else {
            delete cleanedData.specifications.horsepower;
          }
        } else {
          delete cleanedData.specifications.horsepower;
        }
      }
      
      // Remove empty string fields instead of sending them
      if (!cleanedData.specifications.body_type) {
        delete cleanedData.specifications.body_type;
      }
      if (!cleanedData.specifications.engine_type) {
        delete cleanedData.specifications.engine_type;
      }
      if (!cleanedData.specifications.interior_color) {
        delete cleanedData.specifications.interior_color;
      }
      if (!cleanedData.specifications.interior_material) {
        delete cleanedData.specifications.interior_material;
      }
      if (!cleanedData.specifications.color) {
        delete cleanedData.specifications.color;
      }
      if (!cleanedData.specifications.steering_wheel) {
        delete cleanedData.specifications.steering_wheel;
      }
      if (!cleanedData.specifications.drive_type) {
        delete cleanedData.specifications.drive_type;
      }
    }
    
    // Add images to the cleaned data
    cleanedData.images = images;
    
    return cleanedData;
  };
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('გთხოვთ შეავსოთ ყველა აუცილებელი ველი', 'error');
      return;
    }
    
    try {
      showLoading();
      
      // Clean the form data before submission
      const cleanedData = cleanFormData();
      console.log('Submitting cleaned data:', cleanedData);
      
      const result = await carService.createCar(cleanedData);
      console.log('Car creation result:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', Object.keys(result || {}));
      
      // Extract car ID from the result - try multiple possible formats
      let carId = null;
      if (result && typeof result === 'object') {
        // Cast to any to access potential response wrapper properties
        const response = result as any;
        
        // Try common response formats
        carId = result.id || (response.data && response.data.id) || (response.car && response.car.id) || response.carId;
        
        // If still no ID, check if the whole result is the car object
        if (!carId && result.brand_id) {
          carId = result.id;
        }
      } else if (typeof result === 'number') {
        carId = result;
      }
      
      console.log('Extracted car ID:', carId, typeof carId);
      
      // Process VIP purchase if user selected any paid VIP services
      const totalVipCost = getTotalVipPrice();
      if (totalVipCost > 0 && formData.vip_status !== 'none') {
        try {
          console.log('Processing comprehensive VIP purchase for car:', carId);
          console.log('VIP status from formData:', formData.vip_status);
          console.log('VIP days from formData:', formData.vip_days, typeof formData.vip_days);
          console.log('Total VIP cost (including services):', totalVipCost);
          console.log('User balance:', userBalance);
          console.log('Full VIP package data:', {
            vip_status: formData.vip_status,
            vip_days: formData.vip_days,
            color_highlighting: formData.color_highlighting,
            color_highlighting_days: formData.color_highlighting_days,
            auto_renewal: formData.auto_renewal,
            auto_renewal_days: formData.auto_renewal_days
          });
          
          // Ensure vip_days is a valid integer
          const validDays = Math.max(1, Math.round(formData.vip_days));
          console.log('Valid days for purchase:', validDays);
          
          // Validate car ID before making VIP purchase
          if (!carId || carId === 'undefined') {
            throw new Error(`Invalid car ID: ${carId}. Car creation may have failed.`);
          }
          
          // Since the car was created with VIP data, just purchase the VIP status and deduct total cost
          // The additional services should already be in the car data
          console.log('Car created with VIP data. Now purchasing VIP status and deducting costs...');
          
          // Purchase VIP status with additional services (this applies the VIP status and its expiration)
          const vipResult = await balanceService.purchaseVipStatus(
            carId,
            formData.vip_status as 'vip' | 'vip_plus' | 'super_vip',
            validDays,
            {
              colorHighlighting: formData.color_highlighting,
              colorHighlightingDays: formData.color_highlighting_days,
              autoRenewal: formData.auto_renewal,
              autoRenewalDays: formData.auto_renewal_days
            }
          );
          
          console.log('VIP status purchase result:', vipResult);
          
          if (vipResult.success) {
            // The VIP status purchase only deducts VIP cost, we need to manually deduct additional services
            const vipStatusCost = getVipPrice(formData.vip_status) * validDays;
            const additionalServicesCost = getAdditionalServicesPrice();
            
            console.log('VIP status cost:', vipStatusCost);
            console.log('Additional services cost:', additionalServicesCost);
            console.log('Total cost should be:', totalVipCost);
            
            // Set balance to the VIP result balance minus additional services cost
            const finalBalance = vipResult.newBalance - additionalServicesCost;
            setUserBalance(finalBalance);
            
            console.log(`VIP status purchased successfully. Final balance: ${finalBalance} GEL`);
            console.log(`Total cost deducted: ${totalVipCost} GEL (VIP: ${vipStatusCost}, Additional: ${additionalServicesCost})`);
          } else {
            throw new Error(vipResult.message || 'VIP status purchase failed');
          }
        } catch (vipError: any) {
          console.error('VIP purchase failed with error:', vipError);
          console.error('Error details:', {
            message: vipError.message,
            response: vipError.response?.data,
            status: vipError.response?.status
          });
          hideLoading();
          showToast(`Car created successfully, but VIP purchase failed: ${vipError.message || 'Unknown error'}`, 'warning');
          
          // Still navigate to the car even if VIP purchase failed
          navigate(`/cars/${carId}`);
          return;
        }
      }
      
      hideLoading();
      
      // Clear the form draft from localStorage
      localStorage.removeItem('car_form_draft');
      
      // Show success message with VIP info
      const successMessage = totalVipCost > 0 && formData.vip_status !== 'none'
        ? `Car added successfully! VIP ${formData.vip_status.toUpperCase()} package purchased for ${formData.vip_days} days (${totalVipCost.toFixed(2)} GEL).`
        : 'მანქანა წარმატებით დაემატა!';
      showToast(successMessage, 'success');
      
      // Navigate to the car details page
      navigate(`/cars/${carId}`);
    } catch (error: any) {
      hideLoading();
      showToast(error.message || 'მანქანის დამატება ვერ მოხერხდა', 'error');
    }
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      
      // Important: The files parameter contains ALL files, not just new ones
      // So we should directly set the images state to these files, not append them
      
      // First validate all files
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
      
      // Directly set the images state to the valid files
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



  return {
    formData,
    errors,
    images,
    featuredImageIndex,
    isUploading,
    userBalance,
    setFeaturedImageIndex,
    handleChange,
    handleFeaturesChange,
    handleSpecificationsChange,
    handleSubmit,
    handleImageUpload,
    removeImage,
    getTotalVipPrice,
    hasSufficientBalance
  };
};