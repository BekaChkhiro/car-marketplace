import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageUploadWithFeatured from '../../../../components/ImageUploadWithFeatured';
import BasicInfo from './components/BasicInfo';
import TechnicalSpecs from './components/TechnicalSpecs';
import Features from './components/Features';
import Location from './components/Location';
import Description from './components/Description';
import VIPStatus from './components/VIPStatus';
import AuthorInfo from './components/AuthorInfo';
import { useCarForm } from './hooks/useCarForm';
import { CarFeatures } from './types';

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('profile');
  const {
    formData,
    errors,
    images,
    featuredImageIndex,
    isUploading,
    userBalance,
    handleChange,
    handleSpecificationsChange,
    handleFeaturesChange,
    handleImageUpload,
    removeImage,
    setFeaturedImageIndex,
    handleSubmit,
    getTotalVipPrice,
    hasSufficientBalance
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
              <h1 className="text-2xl font-bold text-gray-900">{t('addCar.title')}</h1>
              <p className="text-sm text-gray-500">{t('addCar.subtitle')}</p>
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

          <TechnicalSpecs 
            specifications={formData.specifications}
            onChange={handleSpecificationsChange}
            errors={errors}
          />

          <Features
            features={formData.features as Partial<CarFeatures>}
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
            authorName={formData.author_name}
            authorPhone={formData.author_phone}
            onAuthorNameChange={(value) => handleChange('author_name', value)}
            onAuthorPhoneChange={(value) => handleChange('author_phone', value)}
            errors={errors}
          />

          <div className="bg-white rounded-xl p-6 border">
            <ImageUploadWithFeatured
              files={images}
              onFilesChange={handleImageUpload}
              onFileRemove={removeImage}
              featuredIndex={featuredImageIndex}
              onFeaturedIndexChange={setFeaturedImageIndex}
              error={errors.images}
              isUploading={isUploading}
            />
          </div>

          <VIPStatus
            vipStatus={formData.vip_status}
            vipDays={formData.vip_days}
            colorHighlighting={formData.color_highlighting}
            colorHighlightingDays={formData.color_highlighting_days}
            autoRenewal={formData.auto_renewal}
            autoRenewalDays={formData.auto_renewal_days}
            userBalance={userBalance}
            onChange={handleChange}
          />

          <div className="sticky bottom-0 bg-white border py-4 px-6 rounded-b-xl shadow-lg transform translate-y-1">
            <div className="flex justify-end gap-4 max-w-5xl mx-auto">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => navigate('/profile/cars')}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={!hasSufficientBalance()}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 ${
                  hasSufficientBalance() 
                    ? 'bg-primary hover:bg-primary/90 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                title={!hasSufficientBalance() ? `Insufficient balance. Required: ${getTotalVipPrice()} GEL, Your balance: ${(userBalance || 0).toFixed(2)} GEL` : ''}
              >
                {t('addCar.submit')}
                {!hasSufficientBalance() && (
                  <span className="ml-2 text-xs">
                    ({t('cars.vip.modal.yourBalance')} {(userBalance || 0).toFixed(2)} {t('cars.vip.modal.currency')}, {t('cars.vip.modal.required')}: {getTotalVipPrice().toFixed(2)} {t('cars.vip.modal.currency')})
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCar;