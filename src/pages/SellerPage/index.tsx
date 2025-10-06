import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import carService from '../../api/services/carService';
import { Car, CarFilters } from '../../api/types/car.types';
import { Container, Loading } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import CarGrid from '../CarListing/components/CarGrid';
import SortingHeader from '../CarListing/components/SortingHeader';
import Filters from '../CarListing/components/Filters';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Car as CarIcon } from 'lucide-react';

const SellerPage: React.FC = () => {
  const { t } = useTranslation([namespaces.common, namespaces.carListing]);
  const { sellerId } = useParams<{ sellerId: string }>();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCars, setTotalCars] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const { showToast } = useToast();
  const [sellerInfo, setSellerInfo] = useState<{ name?: string; phone?: string } | null>(null);

  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    limit: 12,
    sortBy: 'newest',
    order: 'desc'
  });

  // Fetch seller cars
  useEffect(() => {
    const fetchSellerCars = async () => {
      if (!sellerId) {
        console.log('No sellerId provided');
        return;
      }

      try {
        setLoading(true);

        // Fetch categories for filters
        try {
          const categoriesData = await carService.getCategories();
          setCategories(categoriesData);
        } catch (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        }

        // Fetch seller cars using the new method
        const carsResponse = await carService.getCarsBySeller(parseInt(sellerId), filters);

        if (carsResponse && carsResponse.cars) {

          setCars(carsResponse.cars);
          setTotalCars(carsResponse.meta?.total || carsResponse.cars.length);

          // Extract seller info from the first car if available
          if (carsResponse.cars.length > 0) {
            const firstCar = carsResponse.cars[0];
            setSellerInfo({
              name: firstCar.author_name,
              phone: firstCar.author_phone
            });
          }
        }
      } catch (error) {
        console.error('Error fetching seller cars:', error);
        showToast(t('common:errors.loadingFailed', 'Failed to load data'), 'error');
        setCars([]);
        setTotalCars(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerCars();
  }, [sellerId, filters, showToast, t]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
      newFilters.page = 1;
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    let sortBy: string;
    let order: 'asc' | 'desc';

    if (sortValue === 'newest') {
      sortBy = 'newest';
      order = 'desc';
    } else if (sortValue.startsWith('price')) {
      sortBy = 'price';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    } else if (sortValue.startsWith('year')) {
      sortBy = 'year';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    } else if (sortValue.startsWith('mileage')) {
      sortBy = 'mileage';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    } else {
      sortBy = 'newest';
      order = 'desc';
    }

    handleFilterChange({ sortBy, order, page: 1 });
  };

  const totalPages = Math.ceil(totalCars / (filters.limit || 12));

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="py-8">
        {/* Seller Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {sellerInfo?.name || t('common:seller', 'Seller')}
              </h1>
              {sellerInfo?.phone && (
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{sellerInfo.phone}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <CarIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-800">
                {totalCars} {totalCars === 1 ? t('carListing:carSingular', 'Car') : t('carListing:carPlural', 'Cars')}
              </span>
            </div>
          </div>
        </div>

        {/* Cars Listing */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-1/4">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              totalCars={totalCars}
              onApplyFilters={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>

          {/* Main content area */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Sorting header with total count */}
            <SortingHeader
              total={totalCars}
              sortBy={filters.sortBy === 'newest' || !filters.sortBy ? 'newest' :
                `${filters.sortBy}-${filters.order}`}
              onSortChange={handleSortChange}
            />

            {/* Car grid */}
            {cars.length > 0 ? (
              <CarGrid cars={cars} categories={categories} />
            ) : (
              <div className="text-center py-12">
                <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {t('common:noCarsFound', 'No cars found')}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="py-4"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SellerPage;
