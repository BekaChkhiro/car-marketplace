import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../../context/ToastContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { Car, UpdateCarFormData } from '../../../../../api/types/car.types';
import carService from '../../../../../api/services/carService';
import { CarFeatures } from '../../AddCar/types';
import { validateCarForm, validateImage } from '../utils/validation';
import balanceService from '../../../../../api/services/balanceService';
import vipPricingService from '../../../../../api/services/vipPricingService';
import vipService from '../../../../../api/services/vipService';

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
  const [userBalance, setUserBalance] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<any[]>([]);
  const [additionalServicesPricing, setAdditionalServicesPricing] = useState<any[]>([]);
  const [pricingLoaded, setPricingLoaded] = useState<boolean>(false);
  const [vipDataLoaded, setVipDataLoaded] = useState<boolean>(false);
  
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
    vip_status: 'none', // Default VIP status is none
    vip_days: 1, // Default VIP days
    color_highlighting: false,
    color_highlighting_days: 1,
    auto_renewal: false,
    auto_renewal_days: 1,
    author_name: '',
    author_phone: '',
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
          console.log('VIP Status Details:', {
            vip_status: car.vip_status,
            vip_active: car.vip_active,
            vip_expiration_date: car.vip_expiration_date,
            color_highlighting_enabled: car.color_highlighting_enabled,
            auto_renewal_enabled: car.auto_renewal_enabled,
            auto_renewal_days: car.auto_renewal_days
          });
          
          // Fetch VIP auto-renewal status if car has VIP
          let vipAutoRenewalData = null;
          if (car.vip_status && car.vip_status !== 'none') {
            try {
              vipAutoRenewalData = await vipService.getVipAutoRenewalStatus(carId);
              console.log('VIP auto-renewal data from API:', vipAutoRenewalData);
            } catch (error) {
              console.error('Failed to fetch VIP auto-renewal status:', error);
            }
          }
          
          populateFormData(car, vipAutoRenewalData);
          setVipDataLoaded(true);
          
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
        setPricingLoaded(true);
        
        console.log('Loaded VIP pricing data:', {
          packages: pricingData.packages,
          additionalServices: pricingData.additionalServices,
          userBalance: processedBalance
        });
      } catch (error) {
        console.error('Error fetching balance and pricing:', error);
        setUserBalance(0);
        setPricingLoaded(true); // Still set to true to show that loading attempt is complete
      }
    };

    if (carId) {
      fetchCar();
      fetchBalanceAndPricing();
    }
  }, [carId]);

  // Convert car data to form data
  const populateFormData = (car: Car, vipAutoRenewalData?: any) => {
    console.log('============= მანქანის მონაცემები ჩატვირთვისთვის =============');
    console.log('მანქანის ID:', car.id);
    console.log('მანქანის მოდელი:', car.model);
    console.log('მანქანის მონაცემები სრულად:', car);
    console.log('VIP Status:', car.vip_status);
    console.log('Color Highlighting Enabled:', car.color_highlighting_enabled);
    console.log('Auto Renewal Enabled:', car.auto_renewal_enabled);
    console.log('VIP Auto-renewal data:', vipAutoRenewalData);
    
    // შევქმნათ features მასივი
    let featuresArray: string[] = [];
    
    // Process existing images
    if (car.images && car.images.length > 0) {
      setExistingImages(car.images);
      // Find primary image index
      const primaryIndex = car.images.findIndex(img => img.is_primary);
      setFeaturedImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }
    
    // შევამოწმოთ თუ გვაქვს specifications ობიექტი boolean თვისებებით
    if (car.specifications) {
      console.log('============= სპეციფიკაციების ანალიზი =============');
      
      // დავლოგოთ specifications-ის ყველა საკვანძო თვისება
      console.log('ყველა ხელმისაწვდომი specifications თვისება:', Object.keys(car.specifications));
      console.log('specifications ობიექტი სრულად:', car.specifications);
      
      // დეტალურად დავლოგოთ მნიშვნელოვანი ველები
      console.log('ძრავის მოცულობა:', car.specifications.engine_size.toString().substring(0, 3), 'ტიპი:', typeof car.specifications.engine_size);
      console.log('გადაცემათა კოლოფი:', car.specifications.transmission, 'ტიპი:', typeof car.specifications.transmission);
      console.log('საწვავის ტიპი:', car.specifications.fuel_type, 'ტიპი:', typeof car.specifications.fuel_type);
      console.log('ფერი:', car.specifications.color, 'ტიპი:', typeof car.specifications.color);
      console.log('სალონის მასალა:', car.specifications.interior_material, 'ტიპი:', typeof car.specifications.interior_material);
      
      // Boolean თვისებების სია specifications ობიექტიდან
      const booleanFeatures = [
        'has_abs', 'has_esp', 'has_asr', 'has_traction_control', 'has_central_locking',
        'has_alarm', 'has_fog_lights', 'has_board_computer', 'has_multimedia', 'has_bluetooth',
        'has_air_conditioning', 'has_climate_control', 'has_heated_seats', 'has_ventilated_seats',
        'has_cruise_control', 'has_start_stop', 'has_panoramic_roof', 'has_sunroof',
        'has_leather_interior', 'has_seat_memory', 'has_memory_steering_wheel',
        'has_electric_mirrors', 'has_electric_seats', 'has_heated_steering_wheel',
        'has_electric_windows', 'has_electric_trunk', 'has_keyless_entry',
        'has_parking_control', 'has_rear_view_camera', 'has_navigation',
        'has_technical_inspection',
        // ახალი ფუნქციები რომლებიც დავამატეთ
        'has_aux', 'has_multifunction_steering_wheel',
        'has_hydraulics', 'has_alloy_wheels', 'has_spare_tire', 'has_disability_adapted', 'is_disability_adapted',
        // დავამატოთ დანარჩენი ფუნქციები, რომლებიც შეიძლება არსებობდეს
        'traction_control', 'central_locking', 'fog_lights', 'multimedia', 'bluetooth',
        'air_conditioning', 'climate_control', 'heated_seats', 'ventilated_seats',
        'cruise_control', 'start_stop', 'panoramic_roof', 'sunroof',
        'leather_interior', 'memory_seats', 'memory_steering_wheel',
        'electric_mirrors', 'electric_seats', 'heated_steering_wheel',
        'electric_windows', 'electric_trunk', 'keyless_entry',
        'parking_control', 'rear_view_camera', 'navigation',
        'technical_inspection', 'abs', 'esp', 'asr',
        // Additional variations for the new features
        'aux', 'multifunction_steering_wheel',
        'hydraulics', 'alloy_wheels', 'spare_tire', 'disability_adapted',
      ];
      
      // შევამოწმოთ ყველა შესაძლო თვისება და დავამატოთ მასივში თუ ჩართულია
      booleanFeatures.forEach(feature => {
        const featureValue = (car.specifications as any)[feature];
        console.log(`თვისების შემოწმება: ${feature} = ${featureValue}`);
        if (featureValue === true || featureValue === 'true' || featureValue === 1) {
          // Handle special cases for renamed features
          
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
      vip_status: car.vip_status || 'none',
      vip_days: 1, // Always 1 for editing since we're not extending, just maintaining current status
      color_highlighting: car.color_highlighting_enabled || false,
      color_highlighting_days: 1, // Days for new purchase if enabling
      auto_renewal: vipAutoRenewalData?.autoRenewalEnabled || car.auto_renewal_enabled || false,
      auto_renewal_days: vipAutoRenewalData?.autoRenewalDays || car.auto_renewal_days || 1,
      author_name: car.author_name || '',
      author_phone: car.author_phone || '',
      location: {
        city: car.location?.city || '',
        country: car.location?.country || 'საქართველო',
        location_type: car.location?.location_type || 'georgia',
        is_in_transit: car.location?.is_in_transit || false
      },
      specifications: {
        // მნიშვნელოვანი ველები, რომლებიც არ იტვირთებოდა
        // გადავიყვანოთ სერვერიდან მოსული მნიშვნელოვანი ველები UI-სთვის საჭირო ფორმატში
        transmission: (() => {
          const trans = car.specifications?.transmission;
          if (!trans) return 'manual'; // დავაბრუნოთ ნაგულისხმები მნიშვნელობა თუ არის null
          
          // მივუსადაგოთ სერვერიდან მოსული სახელები UI-ს მოსალოდნელ მნიშვნელობებს
          console.log(`გადავიყვანოთ transmission: ${trans}`);
          if (trans?.toString().toLowerCase().includes('manual') || 
              trans?.toString().toLowerCase().includes('მექანიკურ')) {
            return 'manual';
          } else if (trans?.toString().toLowerCase().includes('automatic') || 
                   trans?.toString().toLowerCase().includes('ავტომატიკა')) {
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
        engine_size: car.specifications?.engine_size !== undefined ? 
          (typeof car.specifications.engine_size === 'number' ? 
            (Number.isInteger(car.specifications.engine_size) ? 
              car.specifications.engine_size : 
              parseFloat(car.specifications.engine_size.toString())
            ) : 
            parseFloat(String(car.specifications.engine_size))
          ) : null,
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
          is_in_transit: field === 'location_type' ? value === 'transit' : prev.location?.is_in_transit || false,
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

  // VIP pricing functions
  const getVipPrice = (status: string): number => {
    if (status === 'none') {
      const freePricing = vipPricing.find(p => p.service_type === 'free');
      return freePricing ? Number(freePricing.price) : 0;
    }

    // Only use database pricing, no fallbacks
    if (!pricingLoaded || !vipPricing || vipPricing.length === 0) {
      console.warn('VIP pricing not loaded yet, returning 0');
      return 0;
    }

    const pricing = vipPricing.find(p => p.service_type === status);
    const price = pricing ? Number(pricing.price) : 0;
    
    console.log(`VIP price for ${status}:`, { pricing, price });
    return price;
  };

  const getAdditionalServicesPrice = (): number => {
    if (!pricingLoaded || !additionalServicesPricing || additionalServicesPricing.length === 0) {
      console.warn('Additional services pricing not loaded yet, returning 0');
      return 0;
    }
    
    let price = 0;
    
    if (formData.color_highlighting) {
      const colorPricing = additionalServicesPricing.find(s => s.service_type === 'color_highlighting');
      const dailyPrice = colorPricing ? Number(colorPricing.price) : 0;
      price += dailyPrice * (formData.color_highlighting_days || 1);
      console.log('Color highlighting price calculation:', { dailyPrice, days: formData.color_highlighting_days, total: dailyPrice * (formData.color_highlighting_days || 1) });
    }
    
    if (formData.auto_renewal) {
      const renewalPricing = additionalServicesPricing.find(s => s.service_type === 'auto_renewal');
      const dailyPrice = renewalPricing ? Number(renewalPricing.price) : 0;
      price += dailyPrice * (formData.auto_renewal_days || 1);
      console.log('Auto renewal price calculation:', { dailyPrice, days: formData.auto_renewal_days, total: dailyPrice * (formData.auto_renewal_days || 1) });
    }
    
    return price;
  };

  // Get daily price for individual service (not multiplied by days)
  const getAdditionalServicePrice = (serviceType: string): number => {
    if (!pricingLoaded || !additionalServicesPricing || additionalServicesPricing.length === 0) {
      console.warn('Additional services pricing not loaded yet, returning 0');
      return 0;
    }
    
    const pricing = additionalServicesPricing.find(s => s.service_type === serviceType);
    const price = pricing ? Number(pricing.price) : 0;
    
    console.log(`Additional service price for ${serviceType}:`, { pricing, price });
    return price;
  };

  const getTotalVipPrice = (): number => {
    const vipStatus = formData.vip_status || 'none';
    const vipDays = formData.vip_days || 1;
    const dailyVipPrice = getVipPrice(vipStatus);
    const basePrice = dailyVipPrice * vipDays;
    const additionalPrice = getAdditionalServicesPrice();
    const totalPrice = basePrice + additionalPrice;
    
    console.log('VIP Price Calculation Debug:', {
      vipStatus,
      vipDays,
      dailyVipPrice,
      basePrice,
      additionalPrice,
      totalPrice,
      colorHighlighting: formData.color_highlighting,
      colorHighlightingDays: formData.color_highlighting_days,
      autoRenewal: formData.auto_renewal,
      autoRenewalDays: formData.auto_renewal_days,
      vipPricingLoaded: vipPricing.length > 0,
      additionalServicesPricingLoaded: additionalServicesPricing.length > 0
    });
    
    return totalPrice;
  };

  const hasSufficientBalance = (): boolean => {
    // If pricing not loaded yet, assume sufficient balance to avoid blocking UI
    if (!pricingLoaded) {
      return true;
    }
    
    if (formData.vip_status === 'none' && getVipPrice('none') === 0) {
      return true; // Free status
    }
    
    const totalCost = getTotalVipPrice();
    // Add small tolerance for floating point precision (0.01)
    const hasBalance = userBalance >= (totalCost - 0.01);
    
    console.log('Balance check:', {
      userBalance,
      totalCost,
      hasBalance,
      difference: userBalance - totalCost
    });
    
    return hasBalance;
  };

  // Check if current VIP selection has sufficient balance
  const hasInsufficientBalance = (): boolean => {
    // If pricing not loaded yet, don't show insufficient balance
    if (!pricingLoaded) {
      return false;
    }
    
    const totalCost = getTotalVipPrice();
    // Add small tolerance for floating point precision (0.01)
    const insufficient = totalCost > 0 && userBalance < (totalCost - 0.01);
    
    console.log('Insufficient balance check:', {
      userBalance,
      totalCost,
      insufficient,
      difference: userBalance - totalCost
    });
    
    return insufficient;
  };

  const handleFeaturesChange = (field: keyof CarFeatures, value: boolean) => {
    setFormData((prev: UpdateCarFormData) => {
      // Create a new features array with the updated value
      let featuresArray = [...(prev.features || [])] as string[];
      
      // Map feature keys for consistent naming
      let featureKey = field as string;
      let aliasKey: string | null = null;
      
      // Handle special cases for feature naming
      if (field === 'has_heated_seats') {
        aliasKey = 'has_heated_seats';
      } else if (field === 'has_seat_memory') {
        aliasKey = 'has_seat_memory';
      } else if (field === 'has_disability_adapted') {
        aliasKey = 'is_disability_adapted';
      } else if (featureKey === 'is_disability_adapted') {
        // Using featureKey instead of field to avoid TypeScript errors
        aliasKey = 'has_disability_adapted';
      }
      
      if (value) {
        // If the feature is enabled, add it to the array if not already present
        if (!featuresArray.includes(featureKey)) {
          featuresArray.push(featureKey);
        }
        
        // Also add the alias if it exists
        if (aliasKey && !featuresArray.includes(aliasKey)) {
          featuresArray.push(aliasKey);
        }
      } else {
        // If the feature is disabled, remove both the main key and its alias
        featuresArray = featuresArray.filter(f => f !== featureKey);
        if (aliasKey) {
          featuresArray = featuresArray.filter(f => f !== aliasKey);
        }
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
    
    // Prepare specifications data to match backend expectations
    const preparedSpecifications = {
      // Basic specifications
      engine_type: formData.specifications?.engine_type || null,
      transmission: formData.specifications?.transmission || 'manual',
      fuel_type: formData.specifications?.fuel_type || 'petrol',
      mileage: formData.specifications?.mileage || null,
      mileage_unit: formData.specifications?.mileage_unit || 'km',
      engine_size: formData.specifications?.engine_size || null,
      cylinders: formData.specifications?.cylinders || null,
      color: formData.specifications?.color || null,
      steering_wheel: formData.specifications?.steering_wheel || 'left',
      drive_type: formData.specifications?.drive_type || 'FWD',
      clearance_status: formData.specifications?.clearance_status || null,
      airbags_count: formData.specifications?.airbags_count || null,
      interior_material: formData.specifications?.interior_material || null,
      interior_color: formData.specifications?.interior_color || null,
      horsepower: formData.specifications?.horsepower || null,
      body_type: formData.specifications?.body_type || null,
      
      // Convert features array to individual boolean fields
      has_board_computer: Array.isArray(formData.features) && formData.features.includes('has_board_computer'),
      has_air_conditioning: Array.isArray(formData.features) && formData.features.includes('has_air_conditioning'),
      has_parking_control: Array.isArray(formData.features) && formData.features.includes('has_parking_control'),
      has_rear_view_camera: Array.isArray(formData.features) && formData.features.includes('has_rear_view_camera'),
      has_electric_windows: Array.isArray(formData.features) && formData.features.includes('has_electric_windows'),
      has_climate_control: Array.isArray(formData.features) && formData.features.includes('has_climate_control'),
      has_cruise_control: Array.isArray(formData.features) && formData.features.includes('has_cruise_control'),
      has_start_stop: Array.isArray(formData.features) && formData.features.includes('has_start_stop'),
      has_sunroof: Array.isArray(formData.features) && formData.features.includes('has_sunroof'),
      has_heated_seats: Array.isArray(formData.features) && formData.features.includes('has_heated_seats'),
      has_abs: Array.isArray(formData.features) && formData.features.includes('has_abs'),
      has_traction_control: Array.isArray(formData.features) && formData.features.includes('has_traction_control'),
      has_central_locking: Array.isArray(formData.features) && formData.features.includes('has_central_locking'),
      has_alarm: Array.isArray(formData.features) && formData.features.includes('has_alarm'),
      has_fog_lights: Array.isArray(formData.features) && formData.features.includes('has_fog_lights'),
      has_navigation: Array.isArray(formData.features) && formData.features.includes('has_navigation'),
      has_bluetooth: Array.isArray(formData.features) && formData.features.includes('has_bluetooth'),
      has_technical_inspection: Array.isArray(formData.features) && formData.features.includes('has_technical_inspection'),
      
      // Additional features from database schema
      has_catalyst: Array.isArray(formData.features) && formData.features.includes('has_catalyst'),
      has_hydraulics: Array.isArray(formData.features) && formData.features.includes('has_hydraulics'),
      has_seat_memory: Array.isArray(formData.features) && formData.features.includes('has_seat_memory'),
      has_aux: Array.isArray(formData.features) && formData.features.includes('has_aux'),
      has_multifunction_steering_wheel: Array.isArray(formData.features) && formData.features.includes('has_multifunction_steering_wheel'),
      has_alloy_wheels: Array.isArray(formData.features) && formData.features.includes('has_alloy_wheels'),
      has_spare_tire: Array.isArray(formData.features) && formData.features.includes('has_spare_tire'),
      is_disability_adapted: Array.isArray(formData.features) && (formData.features.includes('has_disability_adapted') || formData.features.includes('is_disability_adapted')),
      is_cleared: Array.isArray(formData.features) && formData.features.includes('is_cleared'),
      
      // Additional fields that might be in the database
      is_turbo: formData.specifications?.is_turbo || false,
      manufacture_month: formData.specifications?.manufacture_month || null,
      doors: formData.specifications?.doors || null
    };
    
    // Prepare the data for submission
    const submitData = {
      ...formData,
      specifications: preparedSpecifications
    };
    
    // დებაგის ლოგები მონაცემთა გაგზავნამდე
    console.log('გასაგზავნი ფორმის მონაცემები:', submitData);
    console.log('Currency in submitData:', submitData.currency);
    console.log('Price in submitData:', submitData.price);
    console.log('მომზადებული specifications:', preparedSpecifications);
    console.log('ავტორის ინფორმაცია:', { 
      author_name: formData.author_name, 
      author_phone: formData.author_phone 
    });
    
    try {
      showLoading();
      
      // First, process VIP purchases if any VIP services are selected
      const totalVipCost = getTotalVipPrice();
      const hasVipSelection = formData.vip_status !== 'none' || formData.color_highlighting || formData.auto_renewal;
      
      if (hasVipSelection && totalVipCost > 0) {
        console.log('Processing VIP purchase before car update:', {
          vip_status: formData.vip_status,
          vip_days: formData.vip_days,
          color_highlighting: formData.color_highlighting,
          color_highlighting_days: formData.color_highlighting_days,
          auto_renewal: formData.auto_renewal,
          auto_renewal_days: formData.auto_renewal_days,
          totalCost: totalVipCost
        });
        
        // Check balance before purchase
        if (userBalance < totalVipCost) {
          hideLoading();
          showToast('არასაკმარისი ბალანსი VIP სერვისისთვის', 'error');
          return;
        }
        
        try {
          // Use balanceService for all VIP purchases, including those with additional services
          if (formData.vip_status === 'none' && !formData.color_highlighting && !formData.auto_renewal) {
            hideLoading();
            showToast('არასაკმარისი სერვისები არჩეულია', 'error');
            return;
          }

          // Purchase VIP status or additional services
          const result = await balanceService.purchaseVipStatus(
            carId,
            formData.vip_status as 'none' | 'vip' | 'vip_plus' | 'super_vip',
            formData.vip_days || 1,
            {
              colorHighlighting: formData.color_highlighting,
              colorHighlightingDays: formData.color_highlighting_days,
              autoRenewal: formData.auto_renewal,
              autoRenewalDays: formData.auto_renewal_days
            }
          );
          
          if (!result.success) {
            throw new Error(result.message || 'VIP status purchase failed');
          }
          
          
          // Update user balance after successful VIP purchase
          setUserBalance(prev => prev - totalVipCost);
          
          showToast('VIP სერვისი წარმატებით შეძენილია', 'success');
        } catch (vipError: any) {
          console.error('VIP purchase failed:', vipError);
          hideLoading();
          showToast(vipError.message || 'VIP სერვისის შეძენა ვერ მოხერხდა', 'error');
          return;
        }
      }
      
      // Update the car data
      const updatedCar = await carService.updateCar(carId, submitData);
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
    userBalance,
    setFeaturedImageIndex,
    handleChange,
    handleFeaturesChange,
    handleSpecificationsChange,
    handleSubmit,
    handleImageUpload,
    removeImage,
    removeExistingImage,
    setPrimaryImage,
    getTotalVipPrice,
    hasSufficientBalance,
    hasInsufficientBalance,
    getAdditionalServicePrice,
    pricingLoaded,
    vipDataLoaded
  };
};
