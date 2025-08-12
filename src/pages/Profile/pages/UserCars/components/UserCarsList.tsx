import React, { useState, useEffect } from 'react';
import { Car } from '../../../../../api/types/car.types';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrice } from '../../../../../context/usePrice';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { Edit2, Trash2, Eye, Calendar, MapPin, Gauge, Fuel, Settings, CheckCircle, Clock, AlertTriangle, Star, XCircle, Crown, RefreshCw } from 'lucide-react';
import UserVipModal from './UserVipModal';
import vipService, { VipStatusResponse } from '../../../../../api/services/vipService';
import { useToast } from '../../../../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface UserCarsListProps {
  cars: Car[];
  onDelete: (carId: number) => void;
  onVipUpdate: () => void;
}

// ფუნქცია VIP სტატუსის ვადის გასვლამდე დარჩენილი დროის გამოსათვლელად
const getRemainingTime = (expirationDate: string | undefined | null): { days: number; hours: number; minutes: number } => {
  if (!expirationDate) return { days: 0, hours: 0, minutes: 0 };

  // ვადის გასვლის თარიღი და მიმდინარე თარიღი
  const expDate = new Date(expirationDate);
  const now = new Date();

  // დებაგინგისთვის
  console.log(`Calculating time for ${expirationDate}`);
  console.log(`Current date: ${now.toISOString()}`);

  // გამოვთვალოთ მილიწამებს შორის სხვაობა
  const diffTime = expDate.getTime() - now.getTime();

  // თუ დრო უარყოფითია, ვადა ამოიწურა
  if (diffTime <= 0) return { days: 0, hours: 0, minutes: 0 };

  // გადავიყვანოთ მილიწამები დღეებად, საათებად და წუთებად
  const msPerMinute = 1000 * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const days = Math.floor(diffTime / msPerDay);
  const remainingMs = diffTime % msPerDay;

  const hours = Math.floor(remainingMs / msPerHour);
  const remainingMsAfterHours = remainingMs % msPerHour;

  const minutes = Math.floor(remainingMsAfterHours / msPerMinute);

  console.log(`Remaining time: ${days} days, ${hours} hours, ${minutes} minutes`);

  return { days, hours, minutes };
};

// დარჩენილი დღეების მიღება ძველი ფუნქციის შესანარჩუნებლად
const getRemainingDays = (expirationDate: string | undefined | null): number => {
  const { days } = getRemainingTime(expirationDate);
  return days;
};

// ფუნქცია დარჩენილი დროის ქართულად გამოსახატად
const formatRemainingTime = (expirationDate: string | undefined | null): string => {
  if (!expirationDate) return 'ვადა ამოიწურა';

  const { days, hours, minutes } = getRemainingTime(expirationDate);

  if (days === 0 && hours === 0 && minutes === 0) return 'ვადა ამოიწურა';

  // თუ 1 დღეზე ნაკლებია დარჩენილი, ვაჩვენოთ საათები და წუთები
  if (days === 0) {
    if (hours === 0) {
      return `დარჩენილია ${minutes} წუთი`;
    }
    return `დარჩენილია ${hours} საათი და ${minutes} წუთი`;
  }

  // თუ 1 დღე ან მეტია დარჩენილი, ვაჩვენოთ მხოლოდ დღეები
  if (days === 1) return 'დარჩენილია 1 დღე';
  return `დარჩენილია ${days} დღე`;
};

// ძველი ფუნქცია შესანარჩუნებლად, მაგრამ ახლა იყენებს ახალ ლოგიკას
const formatRemainingDays = (days: number): string => {
  if (days === 0) return 'ვადა ამოიწურა';
  if (days === 1) return 'დარჩენილია 1 დღე';
  return `დარჩენილია ${days} დღე`;
};

const UserCarsList: React.FC<UserCarsListProps> = ({ cars, onDelete, onVipUpdate }) => {
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();

  // Get current language from URL params or use default
  const currentLang = lang || 'ka';
  // ვინახავთ მანქანების VIP სტატუსის ინფორმაციას
  const [vipStatusInfo, setVipStatusInfo] = useState<Record<number, VipStatusResponse>>({});
  const [loadingVipInfo, setLoadingVipInfo] = useState<boolean>(false);

  // კონსოლში გამოვიტანოთ მანქანები, რომლებსაც აქვთ VIP სტატუსი
  console.log('UserCarsList received cars with VIP status:', cars.filter(car => car.vip_status && car.vip_status !== 'none').map(car => ({ id: car.id, vip_status: car.vip_status, vip_expiration_date: car.vip_expiration_date, remaining_days: car.vip_expiration_date ? getRemainingDays(car.vip_expiration_date) : 'N/A' })));

  // Debug auto-renewal data
  console.log('UserCarsList received cars with auto-renewal:', cars.filter(car => car.auto_renewal_enabled).map(car => ({
    id: car.id,
    auto_renewal_enabled: car.auto_renewal_enabled,
    auto_renewal_expiration_date: car.auto_renewal_expiration_date,
    auto_renewal_remaining_days: car.auto_renewal_remaining_days,
    auto_renewal_days: car.auto_renewal_days
  })));

  // Debug all car properties for first car to see what's available
  if (cars.length > 0) {
    console.log('First car properties:', Object.keys(cars[0]));
    console.log('First car auto-renewal properties:', {
      auto_renewal_enabled: cars[0].auto_renewal_enabled,
      auto_renewal_expiration_date: cars[0].auto_renewal_expiration_date,
      auto_renewal_days: cars[0].auto_renewal_days,
      auto_renewal_remaining_days: cars[0].auto_renewal_remaining_days
    });
  }

  // ვნახოთ მანქანის ობიექტის სრული სტრუქტურა
  if (cars.length > 0 && cars[0].vip_status && cars[0].vip_status !== 'none') {
    const carWithVip = cars.filter(car => car.vip_status && car.vip_status !== 'none')[0];
    console.log('Full car object with VIP status:', carWithVip);
    // შევამოწმოთ ყველა ველი
    console.log('All properties of car object:', Object.keys(carWithVip));
    console.log('All properties with values:', Object.entries(carWithVip).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any));
  }

  // მივიღოთ VIP სტატუსის ინფორმაცია სერვერიდან
  useEffect(() => {
    const fetchVipStatusInfo = async () => {
      // ფილტრაცია მანქანების, რომლებსაც აქვთ VIP სტატუსი
      const carsWithVip = cars.filter(car => car.vip_status && car.vip_status !== 'none');
      if (carsWithVip.length === 0) return;

      setLoadingVipInfo(true);

      try {
        const vipInfoPromises = carsWithVip.map(car => vipService.getVipStatusInfo(car.id));
        const vipInfoResults = await Promise.all(vipInfoPromises);

        const vipInfoMap: Record<number, VipStatusResponse> = {};
        vipInfoResults.forEach(info => {
          vipInfoMap[info.id] = info;
        });

        setVipStatusInfo(vipInfoMap);
        console.log('Fetched VIP status info:', vipInfoMap);
      } catch (error) {
        console.error('Error fetching VIP status info:', error);
      } finally {
        setLoadingVipInfo(false);
      }
    };

    fetchVipStatusInfo();
  }, [cars]);
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { formatPrice } = usePrice();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState<number | null>(null);
  const { showToast } = useToast();

  // Function to translate status value based on i18n
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
      case 'available':
        return t('profile:cars.active');
      case 'inactive':
        return t('profile:cars.inactive');
      case 'pending':
        return t('profile:cars.pending');
      case 'sold':
        return t('profile:cars.sold');
      default:
        return status;
    }
  };

  // ფუნქციები გადატანილია კომპონენტის გარეთ

  // VIP სტატუსის გათიშვის ფუნქცია
  const handleDisableVip = async (carId: number) => {
    try {
      console.log(`[UserCarsList] Attempting to disable VIP for car ${carId}`);
      setLoading(carId);
      const result = await vipService.disableVipStatus(carId);
      console.log(`[UserCarsList] VIP disable result:`, result);
      showToast(t('profile:cars.vip.disabled'), 'success');
      onVipUpdate(); // განაახლეთ მშობელი კომპონენტი
    } catch (error) {
      console.error('[UserCarsList] Error disabling VIP status:', error);
      // Log more details about the error
      if (error?.response?.data) {
        console.error('[UserCarsList] Server error response:', error.response.data);
      }
      showToast(t('profile:cars.vip.disableError'), 'error');
    } finally {
      setLoading(null);
    }
  };

  // ფუნქცია სტატუსის შესაბამისი ფერების და იკონის დასაბრუნებლად
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          icon: <CheckCircle size={16} className="mr-2 text-green-600" />
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          icon: <Clock size={16} className="mr-2 text-yellow-600" />
        };
      case 'sold':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          icon: <CheckCircle size={16} className="mr-2 text-blue-600" />
        };
      case 'inactive':
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          icon: <AlertTriangle size={16} className="mr-2 text-gray-600" />
        };
      case 'deleted':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          icon: <AlertTriangle size={16} className="mr-2 text-red-600" />
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          icon: <AlertTriangle size={16} className="mr-2 text-gray-600" />
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Desktop view - Table */}
      {/* დებაგ: VIP სტატუსის მანქანების ჩვენება გამორთულია */}

      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile:cars.tableHeaders.car')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile:cars.price', 'ფასი')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile:cars.tableHeaders.basicInfo')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile:cars.tableHeaders.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile:cars.tableHeaders.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => {
                const statusStyle = getStatusStyle(car.status);
                // Check if VIP has expired by comparing actual timestamps
                const isVipExpired = car.vip_expiration_date ? new Date(car.vip_expiration_date).getTime() < new Date().getTime() : true;
                // Force vip_status to 'none' if expired to hide all VIP related UI elements
                const effectiveVipStatus = isVipExpired ? 'none' : car.vip_status;

                return (
                  <tr
                    key={car.id}
                    className="group hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-14 w-20 bg-gray-100 rounded-md overflow-hidden relative">
                          <img
                            src={car.images[0]?.medium_url || '/images/car-placeholder.png'}
                            alt={`${car.brand} ${car.model}`}
                            className="h-full w-full object-cover"
                          />
                          {/* VIP ბეჯი სურათზე გამორთულია */}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {car.title || `${car.brand} ${car.model}`}
                            </div>
                            {/* VIP სტატუსის ბეჯი გამორთულია */}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar size={14} className="mr-1" /> {car.year}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1" /> {car.location.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        {formatPrice(car.price, car.currency as 'GEL' | 'USD')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs text-gray-500" title={t('profile:cars.tableHeaders.km')}>
                          <Gauge size={14} className="mr-2" />
                          <span>{car.specifications?.mileage ? car.specifications.mileage.toLocaleString() : '0'} {t('profile:cars.tableHeaders.km')}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500" title={t('profile:cars.tableHeaders.fuel')}>
                          <Fuel size={14} className="mr-2" />
                          <span>{car.specifications?.fuel_type}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Settings size={14} className="mr-2" />
                          <span>{car.specifications?.transmission}</span>
                        </div>
                        {/* Auto-renewal status */}
                        {car.auto_renewal_enabled && car.auto_renewal_expiration_date && new Date(car.auto_renewal_expiration_date) > new Date() && (
                          <div className="flex items-center text-xs mt-1">
                            <div className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
                              <span className="font-medium">
                                {t('profile:cars.autoRenewal', 'ავტო-განახლება')}: {car.auto_renewal_remaining_days || 0} {t('profile:cars.daysLeft', 'დღე')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                        {statusStyle.icon}
                        {getStatusText(car.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        {effectiveVipStatus && effectiveVipStatus !== 'none' ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setSelectedCar(car);
                                setIsVipModalOpen(true);
                              }}
                              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${car.vip_status === 'vip' ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : car.vip_status === 'vip_plus' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'}`}
                              title={t('profile:cars.vip.title') + ': ' + (car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER VIP')}
                            >
                              <Star
                                size={16}
                                fill="currentColor"
                              />
                              <span className="text-xs font-medium">
                                {car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER'}
                                {/* Days remaining display in desktop version */}
                                <span className="ml-1 px-1 py-0.5 bg-white bg-opacity-70 rounded text-xs">
                                  {(() => {
                                    if (loadingVipInfo) {
                                      return '...';
                                    }

                                    // First try to get date from vipStatusInfo
                                    if (vipStatusInfo[car.id]?.vip_expiration_date) {
                                      return `${t('profile:cars.vip.daysLeft')}: ${getRemainingDays(vipStatusInfo[car.id].vip_expiration_date)}`;
                                    }

                                    // If not in vipStatusInfo, try from car object
                                    if (car.vip_expiration_date) {
                                      return `${getRemainingDays(car.vip_expiration_date)} ${t('profile:cars.vip.daysLeft')}`;
                                    }

                                    return '?';
                                  })()}
                                </span>
                              </span>
                            </button>
                            <button
                              onClick={() => handleDisableVip(car.id)}
                              disabled={loading === car.id}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              title="VIP სტატუსის გათიშვა"
                            >
                              <XCircle
                                size={16}
                                className={`${loading === car.id ? 'text-gray-400' : 'text-red-500'}`}
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCar(car);
                              setIsVipModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-yellow-100 rounded-lg transition-colors group-hover:bg-yellow-100"
                            title="VIP სტატუსის დამატება"
                          >
                            <Star
                              size={16}
                              className="text-gray-600 group-hover:text-yellow-600"
                              fill="none"
                            />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/cars/${car.id}`)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-100"
                          title="ნახვა"
                        >
                          <Eye size={16} className="text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/${currentLang}/profile/cars/edit/${car.id}`)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-100"
                          title={t('profile:cars.actions.edit')}
                        >
                          <Edit2 size={16} className="text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => onDelete(car.id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group-hover:bg-red-100"
                          title={t('profile:cars.actions.delete')}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view - Card layout */}
      <div className="md:hidden space-y-4">
        {cars.map((car) => {
          const statusStyle = getStatusStyle(car.status);
          // Check if VIP has expired by comparing actual timestamps
          const isVipExpired = car.vip_expiration_date ? new Date(car.vip_expiration_date).getTime() < new Date().getTime() : true;
          // Force vip_status to 'none' if expired to hide all VIP related UI elements
          const effectiveVipStatus = isVipExpired ? 'none' : car.vip_status;

          return (
            <div
              key={car.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${car.color_highlighting_enabled ? 'border-2 border-green-500 shadow-green-100' : 'border border-gray-100'
                }`}
            >
              <div className="flex items-center p-2 border-b border-gray-100">
                <div className="flex-shrink-0 h-18 w-20 bg-gray-100 rounded-md overflow-hidden mr-4 relative">
                  <img
                    src={car.images[0]?.medium_url || '/images/car-placeholder.png'}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                  {/* VIP ბეჯი სურათზე გამორთულია */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <div className="text-base font-medium text-gray-900">
                      {car.title || `${car.brand} ${car.model}`}
                    </div>
                    {/* VIP სტატუსის ბეჯი გამორთულია */}
                  </div>
                  <div className="text-md font-semibold text-primary mb-1">
                    {formatPrice(car.price, car.currency as 'GEL' | 'USD')}
                  </div>
                  <div className={`inline-flex items-center mr-2 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                    {statusStyle.icon}
                    {getStatusText(car.status)}
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 bg-gray-50">

                {effectiveVipStatus && effectiveVipStatus !== 'none' && (
                  <div className={`mb-3 p-2 rounded-lg ${car.vip_status === 'vip' ? 'bg-blue-100 text-blue-700' : car.vip_status === 'vip_plus' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Star size={18} fill="currentColor" />
                      <span className="font-semibold text-sm">
                        {car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER VIP'}
                        {/* დარჩენილი დღეების ჩვენება VIP ბეიჯის გვერდით */}
                        <span className="ml-2 px-1.5 py-0.5 bg-white bg-opacity-50 rounded-md text-xs">
                          {(() => {
                            if (loadingVipInfo) {
                              return '...';
                            }

                            // პირველად ვცდილობთ vipStatusInfo-დან მივიღოთ თარიღი
                            if (vipStatusInfo[car.id]?.vip_expiration_date) {
                              return `${getRemainingDays(vipStatusInfo[car.id].vip_expiration_date)} დღე`;
                            }

                            // თუ vipStatusInfo-ში არ არის, ვცდილობთ car ობიექტიდან
                            if (car.vip_expiration_date) {
                              return `${getRemainingDays(car.vip_expiration_date)} დღე`;
                            }

                            return '?';
                          })()}
                        </span>
                      </span>
                    </div>

                    {/* დამატებითი ინფორმაცია ვადის შესახებ */}
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Clock size={14} />
                      <span className="text-xs font-medium">
                        {(() => {
                          if (loadingVipInfo) {
                            return 'იტვირთება...';
                          }

                          // პირველად ვცდილობთ vipStatusInfo-დან მივიღოთ თარიღი
                          if (vipStatusInfo[car.id]?.vip_expiration_date) {
                            const expDate = new Date(vipStatusInfo[car.id].vip_expiration_date);
                            const day = expDate.getDate().toString().padStart(2, '0');
                            const month = (expDate.getMonth() + 1).toString().padStart(2, '0');
                            const year = expDate.getFullYear();
                            return `ვადა: ${day}.${month}.${year}`;
                          }

                          // თუ vipStatusInfo-ში არ არის, ვცდილობთ car ობიექტიდან
                          if (car.vip_expiration_date) {
                            const expDate = new Date(car.vip_expiration_date);
                            const day = expDate.getDate().toString().padStart(2, '0');
                            const month = (expDate.getMonth() + 1).toString().padStart(2, '0');
                            const year = expDate.getFullYear();
                            return `ვადა: ${day}.${month}.${year}`;
                          }

                          return 'ვადა უცნობია';
                        })()}
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2  ">
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Calendar size={16} />
                    </div>
                    <div className="text-sm font-medium">{car.year}</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Gauge size={16} />
                    </div>
                    <div className="text-sm font-medium">{car.specifications.mileage ? car.specifications.mileage.toLocaleString() : '0'} კმ</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Fuel size={16} />
                    </div>
                    <div className="text-sm font-medium">{car.specifications.fuel_type}</div>
                  </div>
                </div>

                {/* Auto-renewal status for mobile */}
                {car.auto_renewal_enabled && car.auto_renewal_expiration_date && new Date(car.auto_renewal_expiration_date) > new Date() && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <RefreshCw size={14} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {t('profile:cars.autoRenewal', 'ავტო-განახლება')}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-green-600">
                        {car.auto_renewal_remaining_days || 0} {t('profile:cars.daysLeft', 'დღე დარჩენილია')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-1" /> {car.location.city}
                </div>
                <div className="flex gap-2 mt-3 justify-end p-1 pt-0">
                  {effectiveVipStatus && effectiveVipStatus !== 'none' ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setIsVipModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${car.vip_status === 'vip' ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : car.vip_status === 'vip_plus' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'}`}
                        title={`აქტიური VIP სტატუსი: ${car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER VIP'} - ${formatRemainingDays(getRemainingDays(car.vip_expiration_date))}`}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Crown
                                size={16}
                                fill="currentColor"
                              />
                              <span className="text-xs font-medium">{car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER'}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ვაჩერებთ მშობელი ღილაკის კლიკს
                                handleDisableVip(car.id);
                              }}
                              disabled={loading === car.id}
                              className="ml-2 p-1 hover:bg-red-200 rounded transition-colors"
                              title="VIP სტატუსის გათიშვა"
                            >
                              <XCircle
                                size={14}
                                className={`${loading === car.id ? 'text-gray-400' : 'text-red-500'}`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                            <Clock size={12} />
                            <span>
                              {(() => {
                                if (loadingVipInfo) {
                                  return t('common:loading');
                                }

                                if (vipStatusInfo[car.id]?.vip_expiration_date) {
                                  return formatRemainingTime(vipStatusInfo[car.id].vip_expiration_date);
                                }

                                if (car.vip_expiration_date) {
                                  return formatRemainingTime(car.vip_expiration_date);
                                }

                                return t('profile:cars.vip.inactive');
                              })()}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setIsVipModalOpen(true);
                      }}
                      className="p-2 hover:bg-yellow-100 rounded-lg transition-colors relative"
                      title="VIP სტატუსის დამატება"
                    >
                      <Crown
                        size={16}
                        className="text-gray-600 hover:text-yellow-600"
                        fill="none"
                      />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/cars/${car.id}`)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="ნახვა"
                  >
                    <Eye size={16} className="text-gray-600 hover:text-blue-600" />
                  </button>
                  <button
                    onClick={() => navigate(`/${currentLang}/profile/cars/edit/${car.id}`)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title={t('profile:cars.actions.edit')}
                  >
                    <Edit2 size={16} className="text-gray-600 hover:text-blue-600" />
                  </button>
                  <button
                    onClick={() => onDelete(car.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title={t('profile:cars.actions.delete')}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIP Status Modal */}
      {selectedCar && (
        <UserVipModal
          car={selectedCar}
          isOpen={isVipModalOpen}
          onClose={() => {
            setIsVipModalOpen(false);
            setSelectedCar(null);
          }}
          onStatusUpdate={() => {
            // ვიძახებთ onVipUpdate კოლბეკს მშობელი კომპონენტიდან, რათა განახლდეს მანქანების სია
            onVipUpdate();
            // ლოკალური რეფრეშის ტრიგერი
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default UserCarsList;