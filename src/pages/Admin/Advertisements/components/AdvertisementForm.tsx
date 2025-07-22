import React, { useState, useEffect } from 'react';
import { X, Info, Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import advertisementService, { Advertisement } from '../../../../api/services/advertisementService';

interface AdvertisementFormProps {
  advertisement: Advertisement | null;
  onClose: () => void;
  onSave: () => void;
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({ advertisement, onClose, onSave }) => {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    placement: advertisement?.placement || '',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPlacementPreview, setShowPlacementPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (advertisement) {
      setFormData({
        title: advertisement.title,
        link_url: advertisement.link_url || '',
        placement: advertisement.placement,
        start_date: new Date(advertisement.start_date).toISOString().split('T')[0],
        end_date: new Date(advertisement.end_date).toISOString().split('T')[0],
        is_active: advertisement.is_active
      });
      setPreviewImage(advertisement.image_url);
    } else {
      // Set default dates for new advertisements
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 30); // Default 30 days duration
      
      setFormData({
        ...formData,
        start_date: today.toISOString().split('T')[0],
        end_date: tomorrow.toISOString().split('T')[0]
      });
    }
  }, [advertisement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when it's changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      
      // Clear error for image when it's changed
      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
    }
  };

  // Helper function to get placement name
  const getPlacementName = (placement: string): string => {
    switch (placement) {
      case 'home_slider':
        return t('advertisements.placements.home_slider');
      case 'home_banner':
        return t('advertisements.placements.home_banner');
      case 'home_after_vip_plus':
        return t('advertisements.placements.home_after_vip_plus');
      case 'car_listing_top':
        return t('advertisements.placements.car_listing_top');
      case 'car_listing_bottom':
        return t('advertisements.placements.car_listing_bottom');
      case 'car_details_top':
        return t('advertisements.placements.car_details_top');
      case 'car_details_bottom':
        return t('advertisements.placements.car_details_bottom');
      case 'car_details_after_similar':
        return t('advertisements.placements.car_details_after_similar');
      default:
        return placement;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.placement) {
      newErrors.placement = t('advertisements.form.placementRequired');
    }
    
    if (!formData.title.trim()) {
      newErrors.title = t('advertisements.form.titleRequired');
    }
    
    if (!formData.start_date) {
      newErrors.start_date = t('advertisements.form.startDateRequired');
    }
    
    if (!formData.end_date) {
      newErrors.end_date = t('advertisements.form.endDateRequired');
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = t('advertisements.form.endDateAfterStart');
    }
    
    if (!advertisement && !imageFile) {
      newErrors.image = t('advertisements.form.imageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('link_url', formData.link_url);
      formDataToSend.append('placement', formData.placement);
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('is_active', String(formData.is_active));
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Check if advertisement exists and has a valid ID (greater than 0)
      if (advertisement && advertisement.id > 0) {
        await advertisementService.update(advertisement.id, formDataToSend);
      } else {
        await advertisementService.create(formDataToSend);
      }
      
      onSave();
    } catch (error) {
      console.error('Failed to save advertisement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    return (
      <div className=" fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50 flex items-center justify-center ">
        <div className="relative p-4 mx-4 sm:mx-0  bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-medium mb-6 text-gray-700">
            {advertisement ? t('advertisements.form.editAdvertisement') : t('advertisements.form.addNewAdvertisement')}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 ">
              {/* Placement Dropdown with Preview */}
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="placement" className="block text-sm text-gray-600">
                    {t('advertisements.form.placement')} <span className="text-red-500">*</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowPlacementPreview(!showPlacementPreview)}
                    className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
                  >
{showPlacementPreview ? t('common.close') : t('advertisements.form.previewTitle')}
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <select
                  id="placement"
                  name="placement"
                  value={formData.placement}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value && !showPlacementPreview) {
                      setShowPlacementPreview(true);
                    }
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.placement ? 'border-red-300' : 'border-gray-200'} rounded focus:outline-none focus:border-blue-500 text-sm`}
                >
                  <option value="" disabled>{t('advertisements.form.selectPlacement')}</option>
                  
                  {/* მთავარი გვერდი */}
                  <optgroup label="მთავარი გვერდი">
                    <option value="home_slider">სლაიდერი (1200×600px)</option>
                    <option value="home_banner">ზედა ბანერი (1200×300px)</option>
                    <option value="home_after_vip_plus">VIP+ განცხადებების შემდეგ (720×140px)</option>
                  </optgroup>
                  
                  {/* მანქანების ყიდვის გვერდი */}
                  <optgroup label="მანქანების ყიდვის გვერდი">
                    <option value="car_listing_top">ზედა ბანერი (728×140px)</option>
                    <option value="car_listing_bottom">ქვედა ბანერი (720×140px)</option>
                  </optgroup>
                  
                  {/* მანქანის დეტალების გვერდი */}
                  <optgroup label="მანქანის დეტალების გვერდი">
                    <option value="car_details_top">ზედა ბანერი (728×140px)</option>
                    <option value="car_details_bottom">შუა ბანერი (728×140px)</option>
                    <option value="car_details_after_similar">მსგავსი მანქანების შემდეგ (720×140px)</option>
                  </optgroup>
                </select>
                {errors.placement && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.placement}
                  </p>
                )}
                
                {/* Placement Preview */}
                {showPlacementPreview && formData.placement && (
                  <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">რეკლამის ადგილის პრევიუ</h4>
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`flex items-center gap-1 text-xs px-1.5 py-0.5 ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'} rounded transition-colors`}
                        >
                          <Monitor className="h-3 w-3" />
                          <span>დესკტოპი</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`flex items-center gap-1 text-xs px-1.5 py-0.5 ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'} rounded transition-colors`}
                        >
                          <Smartphone className="h-3 w-3" />
                          <span>მობილური</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className={`relative overflow-hidden rounded border border-gray-300 bg-white ${previewDevice === 'mobile' ? 'w-[320px] max-w-full mx-auto' : 'w-full'} transition-all duration-300`}>
                      {/* Home Page Preview */}
                      {formData.placement.startsWith('home_') && (
                        <div className="p-2">
                          {/* Home Slider */}
                          {formData.placement === 'home_slider' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-16' : 'h-24'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა სლაიდერში</span>
                                  </div>
                                  <span className="text-xs mt-1 text-blue-600">1200 × 600 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Hero Section */}
                          <div className={`w-full ${previewDevice === 'mobile' ? 'h-20' : 'h-28'} bg-gradient-to-b from-gray-100 to-gray-200 rounded mb-2 flex items-center justify-center p-2 shadow-sm`}>
                            <div className="w-full h-full border border-gray-300 rounded bg-white/70 flex items-center justify-center">
                              <span className="text-xs text-gray-500 font-medium">მთავარი ბანერი</span>
                            </div>
                          </div>
                          
                          {/* Home Banner Highlight */}
                          {formData.placement === 'home_banner' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-10' : 'h-14'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">1200 × 300 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* VIP Section */}
                          <div className="w-full bg-white border border-gray-200 rounded p-2 mb-2 shadow-sm">
                            <div className="flex items-center mb-1.5">
                              <div className="w-4 h-4 bg-yellow-400 rounded-full mr-1.5"></div>
                              <span className="text-xs font-medium text-gray-700">VIP განცხადებები</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-100 rounded p-1 flex flex-col">
                                  <div className="bg-gray-200 w-full rounded-sm h-8 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* After VIP+ Highlight */}
                          {formData.placement === 'home_after_vip_plus' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">რეკლამა VIP+ განცხადებების შემდეგ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">720 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* New Additions */}
                          <div className="w-full bg-white border border-gray-200 rounded p-2 shadow-sm">
                            <div className="flex items-center mb-1.5">
                              <div className="w-4 h-4 bg-green-400 rounded-full mr-1.5"></div>
                              <span className="text-xs font-medium text-gray-700">ახალი განცხადებები</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-100 rounded p-1 flex flex-col">
                                  <div className="bg-gray-200 w-full rounded-sm h-8 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Car Listing Preview */}
                      {formData.placement.startsWith('car_listing_') && (
                        <div className="p-2">
                          {/* Top Banner Highlight */}
                          {formData.placement === 'car_listing_top' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">728 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Filter and Content */}
                          <div className={`${previewDevice === 'mobile' ? 'flex flex-col gap-2' : 'flex gap-2'}`}>
                            <div className={`${previewDevice === 'mobile' ? 'w-full h-20' : 'w-1/4 h-32'} bg-white border border-gray-200 rounded p-2 shadow-sm`}>
                              <div className="flex items-center mb-1.5">
                                <div className="w-3 h-3 bg-blue-400 rounded-full mr-1.5"></div>
                                <span className="text-xs font-medium text-gray-700">ფილტრები</span>
                              </div>
                              <div className="space-y-1">
                                <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                                <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                                <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                              </div>
                            </div>
                            <div className={`${previewDevice === 'mobile' ? 'w-full' : 'w-3/4'} bg-white border border-gray-200 rounded p-2 shadow-sm`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-gray-700">მანქანების სია</span>
                                <span className="text-xs text-gray-500">12 მანქანა</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                  <div key={i} className="bg-gray-100 rounded p-1 flex flex-col">
                                    <div className="bg-gray-200 w-full rounded-sm h-6 mb-1"></div>
                                    <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                                    <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom Banner Highlight */}
                          {formData.placement === 'car_listing_bottom' && (
                            <div className="w-full mt-2 bg-blue-100 border-2 border-blue-500 rounded overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">720 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Car Details Preview */}
                      {formData.placement.startsWith('car_details_') && (
                        <div className="p-2">
                          {/* Top Banner Highlight */}
                          {formData.placement === 'car_details_top' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded mb-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">728 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Navigation */}
                          <div className="w-full flex items-center text-xs mb-2 px-2 py-1 bg-gray-100 rounded">
                            <span className="text-blue-500">მთავარი</span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-blue-500">მანქანები</span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-gray-500 truncate">მანქანის დასახელება</span>
                          </div>
                          
                          {/* Car Images & Details */}
                          <div className={`${previewDevice === 'mobile' ? 'flex flex-col gap-2' : 'flex gap-2'}`}>
                            <div className={`${previewDevice === 'mobile' ? 'w-full h-24' : 'w-2/3 h-32'} bg-white border border-gray-200 rounded p-2 shadow-sm`}>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-medium text-gray-700">მანქანის ფოტოები</span>
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                </div>
                              </div>
                              <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                                <div className="bg-gray-200 w-full h-16 rounded"></div>
                              </div>
                            </div>
                            <div className={`${previewDevice === 'mobile' ? 'w-full' : 'w-1/3'} bg-white border border-gray-200 rounded p-2 shadow-sm`}>
                              <div className="flex items-center mb-1.5">
                                <span className="text-xs font-medium text-gray-700">მანქანის დეტალები</span>
                              </div>
                              <div className="space-y-1">
                                <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                                <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                                <div className="h-6 bg-blue-100 rounded mt-2 flex items-center justify-center">
                                  <span className="text-[8px] text-blue-700 font-medium">ფასი: 15,000 ₾</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Middle Banner Highlight */}
                          {formData.placement === 'car_details_bottom' && (
                            <div className="w-full mt-2 mb-2 bg-blue-100 border-2 border-blue-500 rounded overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">728 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Similar Cars */}
                          <div className="w-full bg-white border border-gray-200 rounded p-2 shadow-sm mb-2">
                            <div className="flex items-center mb-1.5">
                              <div className="w-3 h-3 bg-green-400 rounded-full mr-1.5"></div>
                              <span className="text-xs font-medium text-gray-700">მსგავსი მანქანები</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-100 rounded p-1 flex flex-col">
                                  <div className="bg-gray-200 w-full rounded-sm h-6 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                                  <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* After Similar Cars Highlight */}
                          {formData.placement === 'car_details_after_similar' && (
                            <div className="w-full bg-blue-100 border-2 border-blue-500 rounded overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 w-full flex items-center justify-center">
                                <div className={`${previewDevice === 'mobile' ? 'h-8' : 'h-12'} w-full flex flex-col items-center justify-center`}>
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-700 font-medium px-3 py-1 rounded bg-white/80 shadow-sm text-xs">თქვენი რეკლამა აქ</span>
                                  </div>
                                  <span className="text-xs mt-0.5 text-blue-600">720 × 140 px</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Placement Description */}
                    <div className="mt-2 text-xs text-gray-600">
                      <p>პოზიცია: <span className="font-medium">{getPlacementName(formData.placement)}</span></p>
                      <p className="mt-0.5">
                        {formData.placement.includes('720') || formData.placement.includes('728') ? 
                          'რეკომენდირებული ზომა: 720×140 პიქსელი (სიგანე × სიმაღლე)' : 
                          formData.placement === 'home_slider' ? 
                            'რეკომენდირებული ზომა: 1200×600 პიქსელი (სიგანე × სიმაღლე)' : 
                            'რეკომენდირებული ზომა: 1200×300 პიქსელი (სიგანე × სიმაღლე)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm text-gray-600">
                  {t('advertisements.title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-200'} rounded focus:outline-none focus:border-blue-500 text-sm`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              
              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm text-gray-600">
                  {t('advertisements.form.imageUpload')} <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  {previewImage ? (
                    <div className="flex items-center space-x-3">
                      <div className="relative w-24 h-24 rounded overflow-hidden border border-gray-200">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="text-xs text-blue-500 cursor-pointer"
                      >
                        სურათის შეცვლა
                      </label>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded p-4 text-center">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-1 text-xs text-gray-500">აირჩიეთ სურათი</p>
                      </label>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                )}
              </div>

              {/* Link URL */}
              <div>
                <label htmlFor="link_url" className="block text-sm text-gray-600">
                  {t('advertisements.form.linkUrl')}
                </label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  რეკლამაზე დაჭერისას მომხმარებელი გადამისამართდება ამ მისამართზე
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm text-gray-600">
                    {t('advertisements.startDate')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.start_date ? 'border-red-300' : 'border-gray-200'} rounded focus:outline-none focus:border-blue-500 text-sm`}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm text-gray-600">
                    {t('advertisements.endDate')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.end_date ? 'border-red-300' : 'border-gray-200'} rounded focus:outline-none focus:border-blue-500 text-sm`}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>
                  )}
                </div>
              </div>

              {/* Active Status - Toggle Switch */}
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-600 cursor-pointer">
                    {t('advertisements.active')}
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  {t('advertisements.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded flex items-center"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
{advertisement ? t('common.update') : t('common.add')}
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>
      );
  };

  return renderForm();
};

export default AdvertisementForm;