import React, { useEffect, useState, useRef } from 'react';
import { CarFilters, Category, Brand } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { RefreshCw, Filter, ChevronDown, ChevronUp, ArrowUp, Check, Car, Droplets, Gauge, Activity, Sliders, MapPin } from 'lucide-react';
import RangeFilter from '../../../components/ui/RangeFilter';
import CustomSelect from '../../../components/common/CustomSelect';
import ColorDropdown from '../../../components/ColorDropdown';
import InteriorColorDropdown from '../../../components/InteriorColorDropdown';

interface FiltersProps {
  filters: CarFilters;
  onFilterChange: (filters: Partial<CarFilters>) => void;
  categories: Category[];
  totalCars?: number;
  onApplyFilters?: () => void;
  onScrollToTop?: () => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange, 
  categories, 
  totalCars = 0,
  onApplyFilters,
  onScrollToTop
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempFilters, setTempFilters] = useState<CarFilters>({...filters});
  const filterSectionsRef = useRef<HTMLDivElement>(null);
  
  // Update tempFilters when filters prop changes
  useEffect(() => {
    console.log('[Filters] Filters prop changed, updating tempFilters', filters);
    setTempFilters(prevFilters => {
      // Map specific fields that might have different names in the filters prop
      const mappedFilters = {
        ...filters,
        // Map advanced filter fields that might have different names
        fuelType: (filters as any).fuel_type || prevFilters.fuelType,
        color: (filters as any).exterior_color || prevFilters.color,
        driveType: (filters as any).drive_type || prevFilters.driveType,
        steeringWheel: (filters as any).steering_wheel || prevFilters.steeringWheel
      };
      
      console.log('[Filters] Mapped filters:', mappedFilters);
      return mappedFilters;
    });
  }, [filters]);
  
  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    price: true,
    engineDetails: false,
    transmission: false,
    appearance: false,
    location: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };
  
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
          console.log(`[Filters] Call carService.getModelsByBrand with ID: ${brandId}`);
          
          const modelsData = await carService.getModelsByBrand(brandId);
          console.log('[Filters] Retrieved models from API:', modelsData);
          
          if (Array.isArray(modelsData) && modelsData.length > 0) {
            setModels(modelsData);
          } else {
            console.warn('[Filters] No models returned from API or empty array');
            setModels(['Model 1', 'Model 2', 'Model 3', 'Other']);
          }
        }
      } catch (error) {
        console.error('[Filters] Error fetching models:', error);
        setModels(['Model 1', 'Model 2', 'Model 3', 'Other']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [tempFilters.brand_id]);

  // Update local temp filters without triggering API fetch
  const handleFilterChange = (name: string, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Range filter handler
  const handleRangeChange = (name: string, values: { from: string; to: string }) => {
    const from = values.from ? Number(values.from) : undefined;
    const to = values.to ? Number(values.to) : undefined;

    if (name === 'price') {
      setTempFilters(prev => ({
        ...prev,
        priceFrom: from,
        priceTo: to
      }));
    } else if (name === 'year') {
      setTempFilters(prev => ({
        ...prev,
        yearFrom: from,
        yearTo: to
      }));
    } else if (name === 'mileage') {
      setTempFilters(prev => ({
        ...prev,
        mileageFrom: from,
        mileageTo: to
      }));
    } else if (name === 'engineSize') {
      setTempFilters(prev => ({
        ...prev,
        engineSizeFrom: from,
        engineSizeTo: to
      }));
    }
  };

  // Apply all filters 
  const applyFilters = () => {
    console.log('[Filters] Apply filters clicked with temp filters:', tempFilters);
    
    // Create a clean copy of filters without additional properties
    const cleanFilters = { ...tempFilters };
    
    // Create an "any" type object for storage that includes all mappings
    const storageFilters: any = {
      ...cleanFilters,
      fuel_type: tempFilters.fuelType,
      exterior_color: tempFilters.color,
      drive_type: tempFilters.driveType,
      steering_wheel: tempFilters.steeringWheel
    };
    
    // Save filters to localStorage
    try {
      localStorage.setItem('carFilters', JSON.stringify(storageFilters));
      console.log('[Filters] Saved filters to localStorage');
    } catch (error) {
      console.error('[Filters] Error saving filters to localStorage:', error);
    }
    
    onFilterChange(cleanFilters);
    
    if (onApplyFilters) {
      onApplyFilters();
    }
    if (onScrollToTop) {
      onScrollToTop();
    }
  };

  // Reset all filters - simplified approach that works reliably
  const resetFilters = () => {
    console.log('[Filters] Reset filters clicked');
    setTempFilters({});
    
    // Clear localStorage
    localStorage.removeItem('carFilters');
    
    // Clear all URL parameters
    window.history.replaceState(null, '', '/cars');
    
    // Direct full page refresh to reset URL params and refetch everything
    window.location.href = '/cars';
  };

  // Prepare options for select inputs
  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());
  const fuelTypes = ['ბენზინი', 'დიზელი', 'ჰიბრიდი', 'ელექტრო', 'ბუნებრივი აირი'];
  const transmissions = ['ავტომატიკა', 'მექანიკა', 'ვარიატორი', 'ნახევრად ავტომატური'];
  const driveTypes = ['წინა', 'უკანა', '4x4'];
  const steeringWheels = ['მარცხენა', 'მარჯვენა'];
  const colors = ['თეთრი', 'შავი', 'ლურჯი', 'წითელი', 'ვერცხლისფერი', 'რუხი', 'ყავისფერი', 'ბეჟი', 'მწვანე', 'ყვითელი', 'ოქროსფერი', 'სხვა'];
  const interiorMaterials = ['ტყავი', 'ნაჭერი', 'ალკანტარა', 'ველიური', 'სხვა'];
  const interiorColors = ['შავი', 'ბეჟი', 'რუხი', 'ყავისფერი', 'წითელი', 'თეთრი', 'სხვა'];
  const locations = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'ფოთი', 'თელავი', 'სხვა'];
  const cylinderOptions = ['3', '4', '5', '6', '8', '10', '12'];
  const airbagOptions = ['0', '1', '2', '3', '4', '6', '8', '10+'];
  

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-green-100">
        <h2 className="text-xl font-bold text-gray-800">ფილტრი</h2>
        <div className="text-sm font-medium px-2 py-1 bg-green-50 text-primary rounded-full">
          {totalCars > 0 ? `${totalCars} განცხადება` : ""}
        </div>
      </div>

      <div ref={filterSectionsRef} className="space-y-6 pr-1">
        {/* Basic Filters Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('basic')}
          >
            <h3 className="text-md font-semibold text-gray-700">ძირითადი</h3>
            {expandedSections.basic ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.basic && (
            <div className="mt-5 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  კატეგორია
                </label>
                <CustomSelect
                  value={tempFilters.category || ''}
                  onChange={(value) => handleFilterChange('category', value as string)}
                  placeholder="ყველა კატეგორია"
                  options={[
                    { value: '', label: 'ყველა კატეგორია' },
                    ...categories.map(category => ({
                      value: category.id.toString(),
                      label: category.name
                    }))
                  ]}
                  icon={<Car size={18} />}
                />
              </div>
              
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  მარკა
                </label>
                <CustomSelect
                  value={tempFilters.brand_id?.toString() || ''}
                  onChange={(value) => {
                    handleFilterChange('brand_id', value as string);
                    handleFilterChange('model', '');
                  }}
                  placeholder="ყველა მარკა"
                  options={[
                    { value: '', label: 'ყველა მარკა' },
                    ...brands.map(brand => ({
                      value: brand.id.toString(),
                      label: brand.name
                    }))
                  ]}
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  მოდელი
                </label>
                <CustomSelect
                  value={tempFilters.model || ''}
                  onChange={(value) => handleFilterChange('model', value as string)}
                  placeholder={loading ? 'იტვირთება...' : 'ყველა მოდელი'}
                  disabled={loading || !tempFilters.brand_id}
                  options={models.length > 0 ? [
                    { value: '', label: 'ყველა მოდელი' },
                    ...models.map(model => ({
                      value: model,
                      label: model
                    }))
                  ] : [
                    { value: '', label: tempFilters.brand_id ? 'ყველა მოდელი' : 'აირჩიეთ მარკა' }
                  ]}
                />
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  გამოშვების წელი
                </label>
                <RangeFilter
                  name="year"
                  fromValue={tempFilters.yearFrom?.toString() || ''}
                  toValue={tempFilters.yearTo?.toString() || ''}
                  placeholder={{ from: 'დან', to: 'მდე' }}
                  onChange={handleRangeChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('price')}
          >
            <h3 className="text-md font-semibold text-gray-700">ფასი და წელი</h3>
            {expandedSections.price ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.price && (
            <div className="mt-5 space-y-5">
              <RangeFilter
                name="price"
                fromValue={tempFilters.priceFrom?.toString() || ''}
                toValue={tempFilters.priceTo?.toString() || ''}
                placeholder={{ from: 'დან', to: 'მდე' }}
                onChange={handleRangeChange}
              />
            </div>
          )}
        </div>

        {/* Engine Details Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('engineDetails')}
          >
            <h3 className="text-md font-semibold text-gray-700">ძრავი</h3>
            {expandedSections.engineDetails ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.engineDetails && (
            <div className="mt-5 space-y-4">
              {/* Engine Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ძრავის მოცულობა (ლიტრი)
                </label>
                <RangeFilter
                  name="engineSize"
                  fromValue={tempFilters.engineSizeFrom?.toString() || ''}
                  toValue={tempFilters.engineSizeTo?.toString() || ''}
                  placeholder={{ from: 'დან', to: 'მდე' }}
                  onChange={handleRangeChange}
                />
              </div>

              {/* Cylinders */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ცილინდრების რაოდენობა
                </label>
                <CustomSelect
                  value={tempFilters.cylinders?.toString() || ''}
                  onChange={(value) => handleFilterChange('cylinders', value ? Number(value) : undefined)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...cylinderOptions.map(option => ({
                      value: option.toString(),
                      label: option.toString()
                    }))
                  ]}
                  icon={<Activity size={18} />}
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  გარბენი (კმ)
                </label>
                <RangeFilter
                  name="mileage"
                  fromValue={tempFilters.mileageFrom?.toString() || ''}
                  toValue={tempFilters.mileageTo?.toString() || ''}
                  placeholder={{ from: 'დან', to: 'მდე' }}
                  onChange={handleRangeChange}
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  საწვავის ტიპი
                </label>
                <CustomSelect
                  value={tempFilters.fuelType || ''}
                  onChange={(value) => handleFilterChange('fuelType', value as string)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...fuelTypes.map(type => ({
                      value: type,
                      label: type
                    }))
                  ]}
                  icon={<Droplets size={18} />}
                />
              </div>
            </div>
          )}
        </div>

        {/* Transmission Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('transmission')}
          >
            <h3 className="text-md font-semibold text-gray-700">გადაცემათა კოლოფი</h3>
            {expandedSections.transmission ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.transmission && (
            <div className="mt-4 space-y-4">
              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  გადაცემათა კოლოფი
                </label>
                <CustomSelect
                  value={tempFilters.transmission || ''}
                  onChange={(value) => handleFilterChange('transmission', value as string)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...transmissions.map(type => ({
                      value: type,
                      label: type
                    }))
                  ]}
                  icon={<Sliders size={18} />}
                />
              </div>

              {/* Drive Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  წამყვანი თვლები
                </label>
                <CustomSelect
                  value={tempFilters.driveType || ''}
                  onChange={(value) => handleFilterChange('driveType', value as string)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...driveTypes.map(type => ({
                      value: type,
                      label: type
                    }))
                  ]}
                  icon={<Gauge size={18} />}
                />
              </div>

              {/* Steering Wheel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  საჭე
                </label>
                <CustomSelect
                  value={tempFilters.steeringWheel || ''}
                  onChange={(value) => handleFilterChange('steeringWheel', value as string)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...steeringWheels.map(type => ({
                      value: type,
                      label: type
                    }))
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('appearance')}
          >
            <h3 className="text-md font-semibold text-gray-700">გარეგნობა</h3>
            {expandedSections.appearance ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.appearance && (
            <div className="mt-5 space-y-4 grid grid-cols-1 gap-4">
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ფერი
                </label>
                <ColorDropdown
                  value={tempFilters.color || ''}
                  onChange={(value) => handleFilterChange('color', value)}
                  placeholder="ნებისმიერი"
                />
              </div>

              {/* Interior Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  სალონის მასალა
                </label>
                <CustomSelect
                  value={tempFilters.interiorMaterial || ''}
                  onChange={(value) => handleFilterChange('interiorMaterial', value as string)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...interiorMaterials.map(material => ({
                      value: material,
                      label: material
                    }))
                  ]}
                />
              </div>

              {/* Interior Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  სალონის ფერი
                </label>
                <InteriorColorDropdown
                  value={tempFilters.interiorColor || ''}
                  onChange={(value) => handleFilterChange('interiorColor', value)}
                  placeholder="ნებისმიერი"
                />
              </div>

              {/* Airbags Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  უსაფრთხოების ბალიშების რაოდენობა
                </label>
                <CustomSelect
                  value={tempFilters.airbags?.toString() || ''}
                  onChange={(value) => handleFilterChange('airbags', value ? Number(value) : undefined)}
                  placeholder="ნებისმიერი"
                  options={[
                    { value: '', label: 'ნებისმიერი' },
                    ...airbagOptions.map(option => ({
                      value: option.toString(),
                      label: option.toString()
                    }))
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="pb-5 border-b border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('location')}
          >
            <h3 className="text-md font-semibold text-gray-700">მდებარეობა</h3>
            {expandedSections.location ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
          </div>
          
          {expandedSections.location && (
            <div className="mt-5 space-y-4">
              <CustomSelect
                value={tempFilters.location || ''}
                onChange={(value) => handleFilterChange('location', value as string)}
                placeholder="ნებისმიერი"
                options={[
                  { value: '', label: 'ნებისმიერი' },
                  ...locations.map(location => ({
                    value: location,
                    label: location
                  }))
                ]}
                icon={<MapPin size={18} />}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter Action Buttons - At the bottom */}
      <div className="pt-4 flex gap-3 bg-white border-t border-gray-100 mt-2 sticky bottom-[0px] left-0 right-0 z-10 mx-6 -ml-6 -mr-6 px-6 pb-4">
        <button
          onClick={() => {
            console.log('[Filters] Clear button clicked');
            // Clear localStorage
            localStorage.removeItem('carFilters');
            // Direct navigation - most reliable way
            window.location.href = '/cars';
          }}
          className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm hover:shadow"
        >
          <RefreshCw className="mr-2" size={16} />
          გასუფთავება
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <Filter className="mr-2" size={16} />
          გაფილტვრა
        </button>
      </div>

      {/* Scroll to Top Button */}
      {onScrollToTop && (
        <button
          onClick={onScrollToTop}
          className="mt-2 w-full py-2 text-primary flex items-center justify-center hover:text-primary/80 transition-all font-medium"
        >
          <ArrowUp size={16} className="mr-1" />
          ზემოთ ასვლა
        </button>
      )}
    </div>
  );
};

export default Filters;
