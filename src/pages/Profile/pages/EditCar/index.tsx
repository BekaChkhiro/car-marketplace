import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, X, AlertCircle } from 'lucide-react';
import ImageUploadWithFeatured from '../../../../components/ImageUploadWithFeatured';
import { Loading } from '../../../../components/ui';
import { useEditCarForm } from './hooks/useEditCarForm';
import { CarFeatures } from './types';

// Import the local components
import BasicInfo from './components/BasicInfo';
import TechnicalSpecs from './components/TechnicalSpecs';
import Features from './components/Features';
import Location from './components/Location';
import Description from './components/Description';
import AuthorInfo from './components/AuthorInfo';
import VIPStatus from './components/VIPStatus';

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    formData,
    isLoading,
    error,
    errors,
    images,
    existingImages,
    featuredImageIndex,
    isUploading,
    userBalance,
    handleChange,
    handleSpecificationsChange,
    handleFeaturesChange,
    handleImageUpload,
    removeImage,
    removeExistingImage,
    setPrimaryImage,
    setFeaturedImageIndex,
    handleSubmit,
    getTotalVipPrice,
    hasSufficientBalance,
    hasInsufficientBalance,
    pricingLoaded
  } = useEditCarForm(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">{error}</h2>
            <button
              onClick={() => navigate('/profile/cars')}
              className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              ჩემს განცხადებებზე დაბრუნება
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">მანქანის რედაქტირება</h1>
              <p className="text-sm text-gray-500">შეცვალეთ საჭირო ინფორმაცია</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BasicInfo
            formData={{
              brand_id: formData.brand_id?.toString() || '',
              category_id: formData.category_id?.toString() || '',
              model: formData.model || '',
              title: formData.title || '',
              year: formData.year || new Date().getFullYear(),
              price: formData.price || 0,
              currency: formData.currency || 'GEL',
              description_ka: formData.description_ka || '',
              description_en: formData.description_en || '',
              description_ru: formData.description_ru || '',
              location: {
                city: formData.location?.city || '',
                state: '',  // Explicitly adding state property to satisfy type requirements
                country: formData.location?.country || 'საქართველო',
                location_type: formData.location?.location_type || 'georgia',
                is_in_transit: formData.location?.is_in_transit || false
              },
              specifications: formData.specifications || {},
              features: formData.features || [],
              images: [] // We handle images separately
            } as any}
            onChange={handleChange}
            onSpecificationsChange={handleSpecificationsChange}
            errors={errors}
          />

          <TechnicalSpecs
            specifications={{
              // უზრუნველვყოთ რომ მნიშვნელობების გადაფარვა არ მოხდეს
              // მხოლოდ იმ შემთხვევაში გამოვიყენოთ ნაგულისხმები მნიშვნელობები
              // როდესაც მონაცემი აბსოლუტურად არ არსებობს
              transmission: formData.specifications?.transmission !== undefined && formData.specifications?.transmission !== ''
                ? formData.specifications.transmission
                : 'manual',
              fuel_type: formData.specifications?.fuel_type !== undefined && formData.specifications?.fuel_type !== ''
                ? formData.specifications.fuel_type
                : 'petrol',
              drive_type: formData.specifications?.drive_type !== undefined && formData.specifications?.drive_type !== ''
                ? formData.specifications.drive_type
                : 'FWD',
              steering_wheel: formData.specifications?.steering_wheel !== undefined && formData.specifications?.steering_wheel !== ''
                ? formData.specifications.steering_wheel
                : 'left',
              // ციფრობრივი ველები პირდაპირ გადავცეთ
              engine_size: formData.specifications.engine_size !== undefined
                ? (typeof formData.specifications.engine_size === 'number'
                  ? (Number.isInteger(formData.specifications.engine_size) ? formData.specifications.engine_size + '.0' : formData.specifications.engine_size.toString())
                  : String(formData.specifications.engine_size))
                : '',
              mileage: formData.specifications?.mileage,
              mileage_unit: formData.specifications?.mileage_unit !== undefined
                ? formData.specifications.mileage_unit
                : 'km',
              // სტრიქონული ველები მხოლოდ მაშინ გადავფაროთ როცა აბსოლუტურად ცარიელია
              color: formData.specifications?.color !== undefined && formData.specifications?.color !== ''
                ? formData.specifications.color
                : '',
              cylinders: formData.specifications?.cylinders,
              interior_material: formData.specifications?.interior_material !== undefined && formData.specifications?.interior_material !== ''
                ? formData.specifications.interior_material
                : '',
              interior_color: formData.specifications?.interior_color !== undefined && formData.specifications?.interior_color !== ''
                ? formData.specifications.interior_color
                : '',
              airbags_count: formData.specifications?.airbags_count,
              engine_type: formData.specifications?.engine_type !== undefined && formData.specifications?.engine_type !== ''
                ? formData.specifications.engine_type
                : '',
              body_type: formData.specifications?.body_type !== undefined && formData.specifications?.body_type !== ''
                ? formData.specifications.body_type
                : '',
              has_heated_seats: formData.specifications?.has_heated_seats !== undefined && formData.specifications?.has_heated_seats !== false
                ? formData.specifications.has_heated_seats
                : '',
              has_seat_memory: formData.specifications?.has_seat_memory !== undefined && formData.specifications?.has_seat_memory !== false
                ? formData.specifications.has_seat_memory
                : '',
              horsepower: formData.specifications?.horsepower,
              has_board_computer: formData.specifications?.has_board_computer,
              has_alarm: formData.specifications?.has_alarm
            } as any}
            onChange={handleSpecificationsChange}
            errors={errors}
          />

          {/* დებაგისთვის ლოგი */}
          {(() => {
            console.log('მანქანის features მასივი:', formData.features);
            return null;
          })()}
          <Features
            features={{
              // უზრუნველვყოთ, რომ features მასივი არსებობს დასაკონვერტირებლად
              // String feature-ების დაკონვერტირება boolean ობიექტად
              has_abs: Array.isArray(formData.features) && formData.features.includes('has_abs'),
              has_esp: Array.isArray(formData.features) && formData.features.includes('has_esp'),
              has_asr: Array.isArray(formData.features) && formData.features.includes('has_asr'),
              has_traction_control: Array.isArray(formData.features) && formData.features.includes('has_traction_control'),
              has_central_locking: Array.isArray(formData.features) && formData.features.includes('has_central_locking'),
              has_alarm: Array.isArray(formData.features) && formData.features.includes('has_alarm'),
              has_fog_lights: Array.isArray(formData.features) && formData.features.includes('has_fog_lights'),
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
              has_seat_memory: Array.isArray(formData.features) && formData.features.includes('has_seat_memory'),
              has_bluetooth: Array.isArray(formData.features) && formData.features.includes('has_bluetooth'),
              has_navigation: Array.isArray(formData.features) && formData.features.includes('has_navigation'),
              has_multifunction_steering_wheel: Array.isArray(formData.features) && formData.features.includes('has_multifunction_steering_wheel'),
              has_alloy_wheels: Array.isArray(formData.features) && formData.features.includes('has_alloy_wheels'),
              has_spare_tire: Array.isArray(formData.features) && formData.features.includes('has_spare_tire'),
              is_disability_adapted: Array.isArray(formData.features) && (formData.features.includes('has_disability_adapted') || formData.features.includes('is_disability_adapted')),
              has_hydraulics: Array.isArray(formData.features) && formData.features.includes('has_hydraulics'),
              has_aux: Array.isArray(formData.features) && formData.features.includes('has_aux'),
              // New features to fix database mismatch
              has_catalyst: Array.isArray(formData.features) && formData.features.includes('has_catalyst'),
              has_technical_inspection: Array.isArray(formData.features) && formData.features.includes('has_technical_inspection'),
              is_cleared: Array.isArray(formData.features) && formData.features.includes('is_cleared'),
            } as Partial<CarFeatures>}
            onChange={(field, value) => {
              // Handle type conversion for disability adapted field
              if (field === 'is_disability_adapted') {
                handleFeaturesChange('has_disability_adapted' as any, value);
              } else {
                handleFeaturesChange(field as any, value);
              }
            }}
          />

          <Location
            city={formData.location?.city || ''}
            country={formData.location?.country || ''}
            location_type={(formData.location?.location_type || 'georgia') as 'georgia' | 'transit' | 'international'}
            onChange={handleChange}
            errors={errors}
          />

          <Description
            description_ka={formData.description_ka}
            description_en={formData.description_en}
            description_ru={formData.description_ru}
            onChange={handleChange}
            errors={errors}
          />

          <AuthorInfo
            authorName={formData.author_name || ''}
            authorPhone={formData.author_phone || ''}
            onAuthorNameChange={(value) => handleChange('author_name', value)}
            onAuthorPhoneChange={(value) => handleChange('author_phone', value)}
            errors={errors}
          />

          <VIPStatus
            carId={Number(id)}
            vipStatus={formData.vip_status || 'none'}
            vipDays={formData.vip_days || 1}
            colorHighlighting={formData.color_highlighting || false}
            colorHighlightingDays={formData.color_highlighting_days || 1}
            autoRenewal={formData.auto_renewal || false}
            autoRenewalDays={formData.auto_renewal_days || 1}
            userBalance={userBalance}
            onChange={handleChange}
          />

          <div className="bg-white rounded-xl p-6 border">
            <ImageUploadWithFeatured
              files={images}
              existingImages={existingImages}
              onFilesChange={handleImageUpload}
              onFileRemove={removeImage}
              onExistingImageRemove={removeExistingImage}
              onSetPrimaryImage={setPrimaryImage}
              featuredIndex={featuredImageIndex}
              onFeaturedIndexChange={setFeaturedImageIndex}
              error={errors.images}
              isUploading={isUploading}
            />
          </div>

          <div className="sticky bottom-0 bg-white border py-4 px-6 rounded-b-xl shadow-lg transform translate-y-1">
            {pricingLoaded && hasInsufficientBalance() && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  <span>
                    არასაკმარისი ბალანსი VIP სერვისისთვის. საჭიროა: {getTotalVipPrice().toFixed(2)} ლარი, 
                    ხელმისაწვდომია: {userBalance.toFixed(2)} ლარი
                  </span>
                </div>
              </div>
            )}
            {!pricingLoaded && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                <div className="flex items-center text-blue-600 text-sm">
                  <span>VIP ფასების ჩატვირთვა...</span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4 max-w-5xl mx-auto">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => navigate('/profile/cars')}
              >
                გაუქმება
              </button>
              <button
                type="submit"
                disabled={!pricingLoaded || hasInsufficientBalance()}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 ${
                  !pricingLoaded || hasInsufficientBalance() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {!pricingLoaded ? 'VIP ფასების ჩატვირთვა...' : hasInsufficientBalance() ? 'არასაკმარისი ბალანსი' : 'შენახვა'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
