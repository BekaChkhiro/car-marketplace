import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Car,
  Calendar, 
  Fuel, 
  Settings,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';
import data from '../../../data/cars.json';
import axios from '../../../api/config/axios';
import CustomSelect from '../../../components/common/CustomSelect';

interface FilterSidebarProps {
  filters: {
    brand: string;
    model: string;
    category: string;
    priceRange: string;
    year: string;
    fuelType: string;
    transmission: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const { t } = useTranslation([namespaces.filter]);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const { brands } = data;
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  
  const fuelTypes = [
    t('fuel.petrol'),
    t('fuel.diesel'),
    t('fuel.hybrid'),
    t('fuel.electric')
  ];
  
  const transmissions = [
    t('transmissions.automatic'),
    t('transmissions.manual')
  ];
  
  const locations = [
    t('locations.tbilisi'),
    t('locations.batumi'),
    t('locations.kutaisi'),
    t('locations.rustavi'),
    t('locations.gori'),
    t('locations.zugdidi'),
    t('locations.poti')
  ];
  const priceRanges = [
    { value: '0-5000', label: '0₾ - 5,000₾' },
    { value: '5000-10000', label: '5,000₾ - 10,000₾' },
    { value: '10000-20000', label: '10,000₾ - 20,000₾' },
    { value: '20000-30000', label: '20,000₾ - 30,000₾' },
    { value: '30000-50000', label: '30,000₾ - 50,000₾' },
    { value: '50000+', label: '50,000₾ +' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/cars/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const handleReset = () => {
    onFilterChange({
      brand: '',
      model: '',
      category: '',
      priceRange: '',
      year: '',
      fuelType: '',
      transmission: '',
      location: ''
    });
  };

  const selectedBrand = brands.find(b => b.name === filters.brand);
  const availableModels = selectedBrand?.models || [];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all duration-200`}
        onClick={toggleSidebar}
      />
      
      <aside className={`fixed top-0 right-0 h-full bg-white w-80 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto md:translate-x-0 md:static md:w-full md:shadow-none md:bg-transparent`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-xl font-semibold">{t('filterSidebar.title')}</h2>
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <Car className="text-primary" size={18} /> {t('filterSidebar.brandModel')}
              </h4>
              <div className="space-y-4">
                <CustomSelect
                  options={brands.map(brand => ({
                    value: brand.name,
                    label: brand.name
                  }))}
                  value={filters.brand}
                  onChange={(value) => onFilterChange({ ...filters, brand: value, model: '' })}
                  placeholder={t('filterSidebar.allBrands')}
                />
                
                <CustomSelect
                  options={availableModels.map(model => ({
                    value: model,
                    label: model
                  }))}
                  value={filters.model}
                  onChange={(value) => onFilterChange({ ...filters, model: value })}
                  placeholder={t('filterSidebar.allModels')}
                  disabled={!filters.brand}
                />
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <Car className="text-primary" size={18} /> {t('category')}
              </h4>
              <CustomSelect
                options={categories.map(category => ({
                  value: String(category.id),
                  label: category.name
                }))}
                value={filters.category}
                onChange={(value) => onFilterChange({ ...filters, category: value })}
                placeholder={t('filterSidebar.allCategories')}
              />
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <Calendar className="text-primary" size={18} /> {t('year')}
              </h4>
              <CustomSelect
                options={years.map(year => ({
                  value: String(year),
                  label: String(year)
                }))}
                value={filters.year}
                onChange={(value) => onFilterChange({ ...filters, year: value })}
                placeholder={t('filterSidebar.anyYear')}
              />
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <Fuel className="text-primary" size={18} /> {t('filterSidebar.fuelTypeLabel')}
              </h4>
              <CustomSelect
                options={fuelTypes.map(type => ({
                  value: type,
                  label: type
                }))}
                value={filters.fuelType}
                onChange={(value) => onFilterChange({ ...filters, fuelType: value })}
                placeholder={t('fuelType')}
              />
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <Settings className="text-primary" size={18} /> {t('filterSidebar.transmissionLabel')}
              </h4>
              <CustomSelect
                options={transmissions.map(type => ({
                  value: type,
                  label: type
                }))}
                value={filters.transmission}
                onChange={(value) => onFilterChange({ ...filters, transmission: value })}
                placeholder={t('transmission')}
              />
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
                <MapPin className="text-primary" size={18} /> {t('filterSidebar.locationLabel')}
              </h4>
              <CustomSelect
                options={locations.map(location => ({
                  value: location,
                  label: location
                }))}
                value={filters.location}
                onChange={(value) => onFilterChange({ ...filters, location: value })}
                placeholder={t('location')}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-gray-600 font-medium border-2 border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={16} /> {t('filterSidebar.clear')}
              </button>
              <button
                type="button"
                onClick={toggleSidebar}
                className="md:hidden flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-white font-medium bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                <SlidersHorizontal size={16} /> {t('filterSidebar.filter')}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;