import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, X } from 'lucide-react';
import ImageUploadWithFeatured from '../../../../components/ImageUploadWithFeatured';
import { Loading } from '../../../../components/ui';
import { useEditCarForm } from './hooks/useEditCarForm';
import { CarFeatures } from '../AddCar/types';

// Import the same components as AddCar
import BasicInfo from '../AddCar/components/BasicInfo';
import TechnicalSpecs from '../AddCar/components/TechnicalSpecs';
import Features from '../AddCar/components/Features';
import Location from '../AddCar/components/Location';
import Description from '../AddCar/components/Description';
import AuthorInfo from '../AddCar/components/AuthorInfo';

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
    handleChange,
    handleSpecificationsChange,
    handleFeaturesChange,
    handleImageUpload,
    removeImage,
    removeExistingImage,
    setPrimaryImage,
    setFeaturedImageIndex,
    handleSubmit
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
                is_transit: formData.location?.is_transit || false
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
              transmission: formData.specifications?.transmission || 'manual',
              fuel_type: formData.specifications?.fuel_type || 'petrol',
              drive_type: formData.specifications?.drive_type || 'FWD',
              steering_wheel: formData.specifications?.steering_wheel || 'left',
              engine_size: formData.specifications?.engine_size,
              mileage: formData.specifications?.mileage,
              mileage_unit: formData.specifications?.mileage_unit || 'km',
              color: formData.specifications?.color || '',
              cylinders: formData.specifications?.cylinders,
              interior_material: formData.specifications?.interior_material || '',
              interior_color: formData.specifications?.interior_color || '',
              airbags_count: formData.specifications?.airbags_count,
              engine_type: formData.specifications?.engine_type || '',
              body_type: formData.specifications?.body_type || '',
              horsepower: formData.specifications?.horsepower,
              has_board_computer: formData.specifications?.has_board_computer,
              has_alarm: formData.specifications?.has_alarm
            } as any}
            onChange={handleSpecificationsChange}
            errors={errors}
          />

          <Features
            features={{
              // Convert string[] to object with boolean values
              has_abs: formData.features?.includes('has_abs') || false,
              has_esp: formData.features?.includes('has_esp') || false,
              has_asr: formData.features?.includes('has_asr') || false,
              has_traction_control: formData.features?.includes('has_traction_control') || false,
              has_central_locking: formData.features?.includes('has_central_locking') || false,
              has_alarm: formData.features?.includes('has_alarm') || false,
              has_fog_lights: formData.features?.includes('has_fog_lights') || false,
              has_board_computer: formData.features?.includes('has_board_computer') || false,
              has_air_conditioning: formData.features?.includes('has_air_conditioning') || false,
              has_parking_control: formData.features?.includes('has_parking_control') || false,
              has_rear_view_camera: formData.features?.includes('has_rear_view_camera') || false,
              has_electric_windows: formData.features?.includes('has_electric_windows') || false,
              has_climate_control: formData.features?.includes('has_climate_control') || false,
              has_cruise_control: formData.features?.includes('has_cruise_control') || false,
              has_start_stop: formData.features?.includes('has_start_stop') || false,
              has_sunroof: formData.features?.includes('has_sunroof') || false,
              has_heated_seats: formData.features?.includes('has_heated_seats') || false,
              has_memory_seats: formData.features?.includes('has_memory_seats') || false,
              has_bluetooth: formData.features?.includes('has_bluetooth') || false,
              has_navigation: formData.features?.includes('has_navigation') || false,
              has_multifunction_steering_wheel: formData.features?.includes('has_multifunction_steering_wheel') || false,
              has_alloy_wheels: formData.features?.includes('has_alloy_wheels') || false,
              has_spare_tire: formData.features?.includes('has_spare_tire') || false,
              has_disability_adapted: formData.features?.includes('has_disability_adapted') || false
            } as Partial<CarFeatures>}
            onChange={handleFeaturesChange}
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
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                შენახვა
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
