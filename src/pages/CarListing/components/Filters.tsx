import React, { useEffect, useState } from 'react';
import { CarFilters, Category, Brand } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { RefreshCw } from 'lucide-react';

interface FiltersProps {
  filters: CarFilters;
  onFilterChange: (filters: Partial<CarFilters>) => void;
  categories: Category[];
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, categories }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempFilters, setTempFilters] = useState<CarFilters>({
    ...filters
  });
  
  // Fetch brands when component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await carService.getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Fetch models when brand_id changes in temp filters
  useEffect(() => {
    const fetchModels = async () => {
      if (!tempFilters.brand_id) {
        setModels([]);
        return;
      }
      
      try {
        setLoading(true);
        // Make sure brand ID is a number
        const brandId = Number(tempFilters.brand_id);
        console.log('Fetching models for brand ID:', brandId);
        
        if (!isNaN(brandId)) {
          // დავლოგოთ მეტი ინფორმაცია იმის შესახებ, თუ რა პარამეტრებს ვიყენებთ მოდელების ჩასატვირთად
          console.log(`[Filters] Call carService.getModelsByBrand with ID: ${brandId}`);
          
          const modelsData = await carService.getModelsByBrand(brandId);
          console.log('[Filters] Retrieved models from API:', modelsData);
          
          if (Array.isArray(modelsData) && modelsData.length > 0) {
            setModels(modelsData);
          } else {
            console.warn('[Filters] No models returned from API or empty array');
            // სარეზერვო მოდელები თუ API ვერაფერს აბრუნებს
            setModels(['Model 1', 'Model 2', 'Model 3', 'Other']);
          }
        }
      } catch (error) {
        console.error('[Filters] Error fetching models:', error);
        // სარეზერვო მოდელები შეცდომის შემთხვევაში
        setModels(['Model 1', 'Model 2', 'Model 3', 'Other']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [tempFilters.brand_id]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">ფილტრები</h2>
      
      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          კატეგორია
        </label>
        <select
          value={tempFilters.category || ''}
          onChange={(e) => {
            const newCategory = e.target.value;
            
            // Update local filters state
            setTempFilters({ 
              ...tempFilters,
              category: newCategory
            });
            
            // Auto-filter by category immediately on selection
            if (newCategory) {
              console.log('[Filters] Auto-filtering by category:', newCategory);
              onFilterChange({ 
                ...tempFilters,
                category: newCategory,
                // Keep brand and model if they exist
                brand_id: tempFilters.brand_id || '',
                model: tempFilters.model || ''
              });
            } else {
              // If category is cleared but brand is selected, keep filtering by brand
              if (tempFilters.brand_id) {
                onFilterChange({ 
                  category: '',
                  brand_id: tempFilters.brand_id,
                  model: tempFilters.model || ''
                });
              } else {
                // Clear all filters if no category or brand is selected
                console.log('[Filters] Clearing category filter');
                onFilterChange({ category: '', brand_id: '', model: '' });
              }
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">ყველა კატეგორია</option>
          {categories.map(category => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Brand */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          მარკა
        </label>
        <select
          value={tempFilters.brand_id || ''}
          onChange={(e) => {
            const newBrandId = e.target.value;
            
            // Update local filters state
            setTempFilters({ 
              ...tempFilters,
              brand_id: newBrandId,
              model: '' // Reset model when brand changes
            });
            
            // Auto-filter by brand immediately on selection
            if (newBrandId) {
              console.log('[Filters] Auto-filtering by brand_id:', newBrandId);
              onFilterChange({ 
                ...tempFilters,  // Keep existing filters (like category)
                brand_id: newBrandId, 
                model: '',
                category: tempFilters.category || '' // Keep category if set
              });
            } else {
              // Reset brand and model filters, but keep category if set
              console.log('[Filters] Clearing brand filters');
              if (tempFilters.category) {
                onFilterChange({ brand_id: '', model: '', category: tempFilters.category });
              } else {
                onFilterChange({ brand_id: '', model: '', category: '' });
              }
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">ყველა მარკა</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id.toString()}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          მოდელი
        </label>
        <select
          value={tempFilters.model || ''}
          onChange={(e) => {
            console.log('[Filters] Selected model:', e.target.value);
            const newModel = e.target.value;
            
            // Update local filters state
            setTempFilters({ ...tempFilters, model: newModel });
            
            // Auto-filter when model is selected
            if (newModel) {
              console.log('[Filters] Auto-filtering with model:', newModel);
              onFilterChange({
                brand_id: tempFilters.brand_id,
                model: newModel,
                category: tempFilters.category || '' // Keep category if set
              });
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2"
          disabled={!tempFilters.brand_id || loading}
        >
          <option value="">{loading ? 'იტვირთება...' : 'ყველა მოდელი'}</option>
          {models.length > 0 ? (
            models.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          ) : (
            <option value="" disabled>მოდელები ვერ მოიძებნა</option>
          )}
        </select>
      </div>

      {/* No filter button needed - auto-filtering happens on brand selection */}
      
      {/* Reset Filters */}
      <button
        onClick={() => {
          const resetFilters = {
            category: '',
            brand_id: '',
            model: ''
          };
          setTempFilters(resetFilters);
          onFilterChange(resetFilters);
          console.log('[Filters] Reset all filters');
        }}
        className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
      >
        <RefreshCw className="mr-2" size={18} />
        ფილტრების გასუფთავება
      </button>
    </div>
  );
};

export default Filters;
