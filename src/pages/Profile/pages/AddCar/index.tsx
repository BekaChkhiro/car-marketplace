import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ImageUploadWithFeatured from '../../../../components/ImageUploadWithFeatured';
import BasicInfo from './components/BasicInfo';
import Features from './components/Features';
import Location from './components/Location';
import { useCarForm } from './hooks/useCarForm';
import { CarFeatures } from './types';

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useCarForm();

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
              <h1 className="text-2xl font-bold text-gray-900">მანქანის დამატება</h1>
              <p className="text-sm text-gray-500">შეავსეთ ყველა საჭირო ინფორმაცია</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BasicInfo
            formData={formData}
            onChange={handleChange}
            onSpecificationsChange={handleSpecificationsChange}
            errors={errors}
          />

          <Location
            city={formData.location?.city || ''}
            state={formData.location?.state || ''}
            country={formData.location?.country || ''}
            location_type={(formData.location?.location_type || 'georgia') as 'georgia' | 'transit' | 'international'}
            onChange={handleChange}
            errors={errors}
          />

          <Features
            features={formData.features as Partial<CarFeatures>}
            onChange={handleFeaturesChange}
          />

          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
            <ImageUploadWithFeatured
              files={images}
              onFilesChange={handleImageUpload}
              onFileRemove={removeImage}
              featuredIndex={featuredImageIndex}
              onFeaturedIndexChange={setFeaturedImageIndex}
              error={errors.images}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4 px-6 rounded-b-xl shadow-lg transform translate-y-1">
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
                დამატება
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCar;