import React, { useState, useEffect } from 'react';
import vipService, { VipPrice, VipStatus } from '../../../../../api/services/vipService';
import carService from '../../../../../api/services/carService';
import { Car } from '../../../../../api/types/car.types';
import { toast } from 'react-hot-toast';
import { Check, Tag, Clock } from 'lucide-react';

// ტრანსლაციისთვის დროებითი ფუნქცია
const useTranslation = () => {
  return {
    t: (key: string) => {
      // დროებითი ტრანსლაციების ობიექტი
      const translations: {[key: string]: string} = {
        'common.loading': 'იტვირთება...',
        'common.processing': 'მიმდინარეობს...',
        'vip.selectCar': 'აირჩიეთ მანქანა',
        'vip.selectCarOption': 'აირჩიეთ მანქანა',
        'vip.purchase': 'შეძენა',
        'vip.insufficientBalance': 'არასაკმარისი ბალანსი',
        'vip.needMoreFunds': 'საჭიროა მეტი თანხა',
        'vip.days': 'დღე',
        'vip.purchaseSuccess': 'VIP სტატუსი წარმატებით შეძენილია',
        'vip.feature.highlighted': 'გამოკვეთილია სიაში',
        'vip.feature.topCategory': 'ზედა პოზიცია კატეგორიაში',
        'vip.feature.topSearch': 'ჩანს ძიების შედეგების თავში',
        'vip.feature.priority5': '5-ჯერ მეტი ხილვადობა',
        'vip.feature.priority10': '10-ჯერ მეტი ხილვადობა',
        'vip.feature.priority20': '20-ჯერ მეტი ხილვადობა',
        'error.fetchVipPrices': 'VIP ფასების მიღება ვერ მოხერხდა',
        'error.fetchUserCars': 'თქვენი მანქანების მიღება ვერ მოხერხდა',
        'error.purchaseVip': 'VIP სტატუსის შეძენა ვერ მოხერხდა'
      };
      return translations[key] || key;
    }
  };
};

interface VipPackagesProps {
  balance: number;
  onPurchase: () => void;
}

interface CarOption {
  id: number;
  title: string;
}

const VipPackages: React.FC<VipPackagesProps> = ({ balance, onPurchase }) => {
  const { t } = useTranslation();
  const [vipPrices, setVipPrices] = useState<VipPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [userCars, setUserCars] = useState<CarOption[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

  useEffect(() => {
    fetchVipPrices();
    fetchUserCars();
  }, []);

  const fetchVipPrices = async () => {
    try {
      const prices = await vipService.getVipPrices();
      setVipPrices(prices);
    } catch (error) {
      console.error('Error fetching VIP prices:', error);
      toast.error(t('error.fetchVipPrices'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCars = async () => {
    try {
      const cars = await carService.getUserCars();
      if (cars && Array.isArray(cars) && cars.length > 0) {
        const formattedCars = cars.map(car => ({
          id: car.id,
          title: car.title || `${car.brand} ${car.model} ${car.year}`
        }));
        setUserCars(formattedCars);
      } else {
        // Fallback to mock data if no cars found
        setUserCars([
          { id: 1, title: 'Toyota Camry 2020' },
          { id: 2, title: 'Honda Accord 2019' },
          { id: 3, title: 'BMW X5 2021' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user cars:', error);
      toast.error(t('error.fetchUserCars'));
      // Fallback to mock data on error
      setUserCars([
        { id: 1, title: 'Toyota Camry 2020' },
        { id: 2, title: 'Honda Accord 2019' },
        { id: 3, title: 'BMW X5 2021' }
      ]);
    }
  };

  const handlePurchase = async (vipStatus: VipStatus, price: number) => {
    if (!selectedCar) {
      toast.error(t('vip.selectCar'));
      return;
    }

    if (balance < price) {
      toast.error(t('vip.insufficientBalance'));
      return;
    }

    setIsPurchasing(true);
    try {
      await vipService.purchaseVipStatus(selectedCar, vipStatus);
      toast.success(t('vip.purchaseSuccess'));
      onPurchase();
    } catch (error) {
      console.error('Error purchasing VIP status:', error);
      toast.error(t('error.purchaseVip'));
    } finally {
      setIsPurchasing(false);
    }
  };

  const getVipStatusLabel = (status: VipStatus): string => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'vip_plus':
        return 'VIP+';
      case 'super_vip':
        return 'Super VIP';
      default:
        return status;
    }
  };

  const getVipStatusFeatures = (status: VipStatus): string[] => {
    switch (status) {
      case 'vip':
        return [
          t('vip.feature.highlighted'),
          t('vip.feature.priority5')
        ];
      case 'vip_plus':
        return [
          t('vip.feature.highlighted'),
          t('vip.feature.topCategory'),
          t('vip.feature.priority10')
        ];
      case 'super_vip':
        return [
          t('vip.feature.highlighted'),
          t('vip.feature.topCategory'),
          t('vip.feature.topSearch'),
          t('vip.feature.priority20')
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('vip.selectCar')}
        </label>
        <select
          value={selectedCar || ''}
          onChange={(e) => setSelectedCar(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">{t('vip.selectCarOption')}</option>
          {userCars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vipPrices.map((vipPrice) => (
          <div 
            key={vipPrice.vip_status} 
            className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-600 text-white p-4 text-center">
              <h3 className="text-xl font-bold">{getVipStatusLabel(vipPrice.vip_status)}</h3>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center items-center mb-4">
                <Tag className="text-blue-600 mr-2" />
                <span className="text-2xl font-bold">{vipPrice.price} GEL</span>
              </div>
              
              <div className="flex items-center justify-center mb-4 text-gray-600">
                <Clock className="mr-2 h-4 w-4" />
                <span>{vipPrice.duration_days} {t('vip.days')}</span>
              </div>
              
              <ul className="mb-6 space-y-2">
                {getVipStatusFeatures(vipPrice.vip_status).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePurchase(vipPrice.vip_status, vipPrice.price)}
                disabled={!selectedCar || balance < vipPrice.price || isPurchasing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isPurchasing ? t('common.processing') : t('vip.purchase')}
              </button>
              
              {balance < vipPrice.price && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {t('vip.needMoreFunds')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VipPackages;
