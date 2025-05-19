import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import advertisementService, { Advertisement } from '../../../../api/services/advertisementService';

interface AdvertisementFormProps {
  advertisement: Advertisement | null;
  onClose: () => void;
  onSave: () => void;
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({ advertisement, onClose, onSave }) => {
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

  // Helper function to get placement name in Georgian
  const getPlacementName = (placement: string): string => {
    switch (placement) {
      case 'home_slider':
        return 'მთავარი გვერდის სლაიდერი';
      case 'home_banner':
        return 'მთავარი გვერდის ბანერი';
      case 'car_listing_top':
        return 'მანქანების ყიდვის გვერდი - ზედა';
      case 'car_details_top':
        return 'მანქანის დეტალების გვერდი - ზედა';
      case 'car_details_bottom':
        return 'მანქანის დეტალების გვერდი - ქვედა';
      default:
        return placement;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.placement) {
      newErrors.placement = 'განთავსების ადგილი აუცილებელია';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'სახელი აუცილებელია';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'დაწყების თარიღი აუცილებელია';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'დასრულების თარიღი აუცილებელია';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ';
    }
    
    if (!advertisement && !imageFile) {
      newErrors.image = 'სურათი აუცილებელია';
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
      
      if (advertisement) {
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
            {advertisement ? 'რეკლამის რედაქტირება' : 'ახალი რეკლამის დამატება'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 ">
              {/* Placement Dropdown */}
              <div>
                <label htmlFor="placement" className="block text-sm text-gray-600">
                  განთავსების ადგილი <span className="text-red-500">*</span>
                </label>
                <select
                  id="placement"
                  name="placement"
                  value={formData.placement}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.placement ? 'border-red-300' : 'border-gray-200'} rounded focus:outline-none focus:border-blue-500 text-sm`}
                >
                  <option value="" disabled>აირჩიეთ განთავსების ადგილი</option>
                  <option value="home_slider">მთავარი გვერდის სლაიდერი (1200×600px)</option>
                  <option value="home_banner">მთავარი გვერდის ბანერი (1200×300px)</option>
                  <option value="car_listing_top">მანქანების ყიდვის გვერდი - ზედა (728×140px)</option>
                  <option value="car_details_top">მანქანის დეტალების გვერდი - ზედა (728×140px)</option>
                  <option value="car_details_bottom">მანქანის დეტალების გვერდი - ქვედა (728×140px)</option>
                </select>
                {errors.placement && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.placement}
                  </p>
                )}
              </div>
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm text-gray-600">
                  სახელი <span className="text-red-500">*</span>
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
                  სურათი <span className="text-red-500">*</span>
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
                  ბმული
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
                    დაწყების თარიღი <span className="text-red-500">*</span>
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
                    დასრულების თარიღი <span className="text-red-500">*</span>
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
                    აქტიური
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  გაუქმება
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
                  {advertisement ? 'განახლება' : 'დამატება'}
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
