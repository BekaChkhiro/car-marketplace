import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { Camera, Info, Settings, Car, CheckCircle2, AlertTriangle } from 'lucide-react';
import carService from '../../../../api/services/carService';
import { useToast } from '../../../../context/ToastContext';
import { NewCarFormData } from './types';
import ImageUploadWithFeatured from '../../../../components/ImageUploadWithFeatured';
import BasicInfo from './components/BasicInfo';
import Features from './components/Features';

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(-1);
  const [currentSection, setCurrentSection] = useState<'basic' | 'features'>('basic');
  
  const [formData, setFormData] = useState<NewCarFormData>({
    brand_id: '',
    category_id: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    city: '',
    state: '',
    country: 'საქართველო',
    location_type: 'georgia',
    specifications: {
      engine_type: '',
      transmission: 'manual',
      fuel_type: 'ბენზინი',
      mileage: '',
      engine_size: '',
      horsepower: '',
      doors: 4,
      color: '',
      body_type: 'სედანი',
      drive_type: 'front'
    },
    features: {
      has_abs: false,
      has_air_conditioning: false,
      has_alarm: false,
      has_aux: false,
      has_bluetooth: false,
      has_board_computer: false,
      has_central_locking: false,
      has_climate_control: false,
      has_cruise_control: false,
      has_electric_windows: false,
      has_fog_lights: false,
      has_multifunction_steering_wheel: false,
      has_navigation: false,
      has_parking_control: false,
      has_rear_view_camera: false,
      has_seat_heating: false,
      has_sunroof: false,
      has_alloy_wheels: false
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({
    basic: 0,
    features: 0
  });

  const handleBasicInfoChange = (field: string, value: any) => {
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

  const handleImagesChange = useCallback((newImages: File[]) => {
    setImages(newImages);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (images.length === 0) {
        showToast('გთხოვთ აირჩიოთ მინიმუმ ერთი სურათი', 'error');
        return;
      }

      if (featuredImageIndex === -1) {
        showToast('გთხოვთ აირჩიოთ მთავარი სურათი', 'error');
        return;
      }

      const carDataToSend = {
        ...formData,
        brand_id: Number(formData.brand_id),
        category_id: Number(formData.category_id),
        year: Number(formData.year),
        price: Number(formData.price),
        specifications: {
          ...formData.specifications,
          mileage: formData.specifications.mileage ? Number(formData.specifications.mileage) : undefined,
          engine_size: formData.specifications.engine_size ? Number(formData.specifications.engine_size) : undefined,
          horsepower: formData.specifications.horsepower ? Number(formData.specifications.horsepower) : undefined
        },
        featuredImageIndex
      };

      await carService.createCar(carDataToSend, images);
      showToast('მანქანა წარმატებით დაემატა', 'success');
      navigate('/profile/cars');
    } catch (error: any) {
      showToast(error.message || 'დამატების დროს მოხდა შეცდომა', 'error');
    }
  };

  const handleFeaturedImageChange = (index: number) => {
    setFeaturedImageIndex(index);
  };

  const getFormProgress = () => {
    let progress = 0;
    let total = 0;

    // Images progress
    if (images.length > 0) progress++;
    if (featuredImageIndex !== -1) progress++;
    total += 2;

    // Basic info progress
    const requiredFields = ['brand_id', 'model', 'category_id', 'year', 'price', 'city', 'state'];
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData]) progress++;
      total++;
    });

    // Calculate percentage
    return Math.round((progress / total) * 100);
  };

  const formProgress = getFormProgress();

  // Save scroll position when switching sections
  const handleSectionChange = (section: 'basic' | 'features') => {
    // Save current section's scroll position
    setScrollPositions(prev => ({
      ...prev,
      [currentSection]: window.scrollY
    }));

    // Change section
    setCurrentSection(section);

    // Restore that section's scroll position after a brief delay
    setTimeout(() => {
      window.scrollTo({
        top: scrollPositions[section],
        behavior: 'smooth'
      });
    }, 100);
  };

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = images.length > 0 || 
      Object.values(formData).some(value => 
        value && (typeof value === 'string' ? value.length > 0 : true)
      );
    
    setHasUnsavedChanges(hasChanges);
  }, [formData, images]);

  // Show warning when trying to leave with unsaved changes
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return (event.returnValue = 'თქვენ გაქვთ შეუნახავი ცვლილებები. ნამდვილად გსურთ გვერდის დატოვება?');
        }
      },
      [hasUnsavedChanges]
    )
  );

  // Handle navigation attempt with unsaved changes
  const handleNavigation = useCallback(
    (to: string) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          'თქვენ გაქვთ შეუნახავი ცვლილებები. ნამდვილად გსურთ გვერდის დატოვება?'
        );
        if (!confirmLeave) {
          return;
        }
      }
      navigate(to);
    },
    [hasUnsavedChanges, navigate]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        მანქანის დამატება
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Car size={20} className="text-primary" />
              <span className="text-sm font-medium text-gray-700">
                ფორმის შევსების პროგრესი
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formProgress === 100 ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <AlertTriangle size={20} className="text-amber-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {formProgress}%
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            />
          </div>
        </div>

        <div className="border-b border-gray-100 mt-6">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleSectionChange('basic')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  currentSection === 'basic'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Info size={18} />
                ძირითადი ინფორმაცია
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('features')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  currentSection === 'features'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} />
                აღჭურვილობა
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e).then(() => {
                setHasUnsavedChanges(false);
              });
            }} 
            className="space-y-8"
          >
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Camera size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">სურათები</h2>
                  <p className="text-sm text-gray-500">
                    {images.length > 0 
                      ? `${images.length} სურათი ატვირთულია${featuredImageIndex !== -1 ? ', მთავარი სურათი არჩეულია' : ''}`
                      : 'მინიმუმ 1 სურათი სავალდებულოა'
                    }
                  </p>
                </div>
              </div>
              
              <ImageUploadWithFeatured
                files={images}
                onUpload={setImages}
                onRemove={(index) => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                  if (featuredImageIndex === index) {
                    setFeaturedImageIndex(-1);
                  } else if (featuredImageIndex > index) {
                    setFeaturedImageIndex(featuredImageIndex - 1);
                  }
                }}
                maxFiles={10}
                featuredImageIndex={featuredImageIndex}
                onFeaturedChange={handleFeaturedImageChange}
              />
            </div>

            {currentSection === 'basic' ? (
              <BasicInfo
                formData={formData}
                onChange={handleBasicInfoChange}
                onSpecificationsChange={handleSpecificationsChange}
              />
            ) : (
              <Features
                features={formData.features}
                onChange={handleFeaturesChange}
              />
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {formProgress === 100 ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">მზადაა გამოსაქვეყნებლად</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                    <AlertTriangle size={18} />
                    <span className="text-sm font-medium">შეავსეთ ყველა სავალდებულო ველი</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {hasUnsavedChanges && (
                  <span className="text-sm text-amber-600">
                    * თქვენ გაქვთ შეუნახავი ცვლილებები
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleNavigation('/profile/cars')}
                  className="px-6 py-2.5 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                    formProgress === 100
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={formProgress !== 100}
                >
                  დამატება
                  {formProgress === 100 && <CheckCircle2 size={18} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;