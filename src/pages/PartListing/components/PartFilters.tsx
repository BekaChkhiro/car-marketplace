import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PartFilters } from '../../../api/services/partService';
import partService from '../../../api/services/partService';
import { namespaces } from '../../../i18n';

interface FiltersProps {
  filters: PartFilters;
  onFilterChange: (newFilters: Partial<PartFilters>) => void;
  brands: any[];
  categories: any[];
}

const PartFiltersComponent: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange,
  brands,
  categories
}) => {
  const { t } = useTranslation(namespaces.parts);
  const [models, setModels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Load models when a brand is selected
  useEffect(() => {
    const loadModels = async () => {
      if (!filters.brand_id) {
        setModels([]);
        return;
      }
      
      try {
        const modelData = await partService.getModelsByBrand(filters.brand_id);
        setModels(modelData);
      } catch (error) {
        console.error('[PartFilters] Error loading models:', error);
        setModels([]);
      }
    };
    
    loadModels();
  }, [filters.brand_id]);

  // Handle search term changes
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchTerm, page: 1 });
  };

  // Handle price range changes
  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ 
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      page: 1
    });
  };

  // Toggle mobile filter expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle brand change
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value ? Number(e.target.value) : undefined;
    // When brand changes, reset model
    onFilterChange({ brand_id: brandId, model_id: undefined, page: 1 });
  };

  // Handle model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value ? Number(e.target.value) : undefined;
    onFilterChange({ model_id: modelId, page: 1 });
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? Number(e.target.value) : undefined;
    onFilterChange({ category_id: categoryId, page: 1 });
  };

  // Handle condition change
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const condition = e.target.value || undefined;
    onFilterChange({ condition, page: 1 });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      brand_id: undefined,
      model_id: undefined,
      category_id: undefined,
      condition: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      searchTerm: undefined,
      page: 1
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('filterBy')}</h2>
        <button 
          onClick={toggleExpansion} 
          className="md:hidden text-gray-500"
          aria-label={isExpanded ? t('collapse') : t('expand')}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Mobile toggle */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        {/* Search term filter */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">{t('searchPlaceholder')}</h3>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-primary-dark"
            >
              <span className="sr-only">{t('search')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Brand filter */}
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            {t('brand')}
          </label>
          <select
            id="brand"
            value={filters.brand_id || ''}
            onChange={handleBrandChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{t('allBrands')}</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Model filter (only shown when brand is selected) */}
        {filters.brand_id && models.length > 0 && (
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              {t('model')}
            </label>
            <select
              id="model"
              value={filters.model_id || ''}
              onChange={handleModelChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">{t('allModels')}</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Category filter */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            {t('category')}
          </label>
          <select
            id="category"
            value={filters.category_id || ''}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Condition filter */}
        <div className="mb-4">
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
            {t('condition')}
          </label>
          <select
            id="condition"
            value={filters.condition || ''}
            onChange={handleConditionChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{t('allConditions')}</option>
            <option value="new">{t('new')}</option>
            <option value="used">{t('used')}</option>
          </select>
        </div>
        
        {/* Price range filter */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">{t('price')}</h3>
          <form onSubmit={handlePriceSubmit} className="flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-price" className="sr-only">{t('minPrice')}</label>
                <input
                  type="number"
                  id="min-price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  placeholder={t('minPrice')}
                  min="0"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="sr-only">{t('maxPrice')}</label>
                <input
                  type="number"
                  id="max-price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  placeholder={t('maxPrice')}
                  min="0"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 w-full"
            >
              {t('apply')}
            </button>
          </form>
        </div>
        
        {/* Reset filters */}
        <button
          onClick={handleResetFilters}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};

export default PartFiltersComponent;
