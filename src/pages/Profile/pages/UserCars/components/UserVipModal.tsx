import React, { useState, useEffect } from 'react';
import { Crown, X, Check, Paintbrush, RefreshCw, Star, Award, Zap, Shield } from 'lucide-react';
import { Car } from '../../../../../api/types/car.types';
import { VipStatus } from '../../../../../api/services/vipService';
import vipPricingService, { VipServicePricing } from '../../../../../api/services/vipPricingService';
import balanceService from '../../../../../api/services/balanceService';
import { useToast } from '../../../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

// Import subcomponents
import BalanceDisplay from './BalanceDisplay';
import PriceDisplay from './PriceDisplay';
import ErrorDisplay from './ErrorDisplay';
import ExpirationDateDisplay from './ExpirationDateDisplay';

interface UserVipModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const UserVipModal: React.FC<UserVipModalProps> = ({
  car,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const [selectedStatus, setSelectedStatus] = useState<VipStatus>('none');
  const [daysCount, setDaysCount] = useState<number>(1); // default 1 days
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<VipServicePricing[]>([]);
  const [additionalServicesPricing, setAdditionalServicesPricing] = useState<VipServicePricing[]>([]);
  const [pricingLoaded, setPricingLoaded] = useState<boolean>(false);
  
  // Additional services state
  const [colorHighlighting, setColorHighlighting] = useState<boolean>(false);
  const [colorHighlightingDays, setColorHighlightingDays] = useState<number>(1);
  const [autoRenewal, setAutoRenewal] = useState<boolean>(false);
  const [autoRenewalDays, setAutoRenewalDays] = useState<number>(1);
  
  const { showToast } = useToast();

  // VIP პაკეტების ფასები - დინამიური ფასები API-დან (role-based)
  const getVipPricePerDay = (status: Exclude<VipStatus, 'none'>): number => {
    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback prices - using role-based fallback
      const fallbackPrices: Record<Exclude<VipStatus, 'none'>, number> = {
        vip: 2,
        vip_plus: 5,
        super_vip: 7
      };
      return fallbackPrices[status];
    }
    
    const pricing = vipPricing.find(p => p.service_type === status);
    return pricing ? Number(pricing.price) : 0;
  };
  
  // VIP პაკეტის ფასის ფორმატირება is_daily_price-ის მიხედვით
  const getVipPriceDisplay = (status: Exclude<VipStatus, 'none'>): string => {
    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback display
      const price = getVipPricePerDay(status);
      return `${price} ${t('profile:cars.vip.modal.currency')}/${t('profile:cars.vip.modal.day')}`;
    }
    
    const pricing = vipPricing.find(p => p.service_type === status);
    if (!pricing) {
      const price = getVipPricePerDay(status);
      return `${price} ${t('profile:cars.vip.modal.currency')}/${t('profile:cars.vip.modal.day')}`;
    }
    
    const price = Number(pricing.price);
    const currency = t('profile:cars.vip.modal.currency');
    
    if (pricing.is_daily_price) {
      return `${price} ${currency}/${t('profile:cars.vip.modal.day')}`;
    } else {
      const duration = pricing.duration_days || 1;
      const daysText = duration === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days');
      return `${price} ${currency} (${duration} ${daysText})`;
    }
  };
  
  // VIP პაკეტის ინფორმაციის მიღება
  const getVipPricingInfo = (status: Exclude<VipStatus, 'none'>) => {
    const pricing = vipPricing.find(p => p.service_type === status);
    return pricing || null;
  };
  
  // შევამოწმოთ არის თუ არა არჩეული სტატუსი ფიქსირებული ვადით
  const isFixedDurationPackage = (status: VipStatus): boolean => {
    if (status === 'none') return false;
    const pricingInfo = getVipPricingInfo(status as Exclude<VipStatus, 'none'>);
    return pricingInfo ? !pricingInfo.is_daily_price : false;
  };
  
  // VIP packages descriptions
  const vipStatusDescriptions: Record<Exclude<VipStatus, 'none'>, string> = {
    vip: t('profile:cars.vip.modal.types.standard'),
    vip_plus: t('profile:cars.vip.modal.types.enhanced'),
    super_vip: t('profile:cars.vip.modal.types.premium')
  };
  
  // VIP package labels
  const vipStatusLabels: Record<Exclude<VipStatus, 'none'>, string> = {
    vip: 'VIP',
    vip_plus: 'VIP+',
    super_vip: 'SUPER VIP'
  };
  
  // Get daily price for individual additional service
  const getAdditionalServicePrice = (serviceType: string): number => {
    const pricing = additionalServicesPricing.find(s => s.service_type === serviceType);
    return pricing ? pricing.price : (serviceType === 'color_highlighting' || serviceType === 'auto_renewal' ? 0.5 : 0);
  };

  // Get total price for additional services
  const getAdditionalServicesPrice = (): number => {
    let price = 0;
    
    if (colorHighlighting) {
      const colorPricing = additionalServicesPricing.find(s => s.service_type === 'color_highlighting');
      const dailyPrice = colorPricing ? colorPricing.price : 0.5;
      price += dailyPrice * colorHighlightingDays;
    }
    
    if (autoRenewal) {
      const renewalPricing = additionalServicesPricing.find(s => s.service_type === 'auto_renewal');
      const dailyPrice = renewalPricing ? renewalPricing.price : 0.5;
      price += dailyPrice * autoRenewalDays;
    }
    
    return price;
  };

  // Helper function to format price - shows "Free" if price is 0
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : price || 0;
    return numPrice === 0 ? t('profile:cars.vip.modal.free') : `${numPrice.toFixed(2)} ${t('profile:cars.vip.modal.currency')}`;
  };

  // ჯამური ფასის გამოთვლა (VIP + additional services)
  const calculateTotalPrice = (status: VipStatus, days: number): number => {
    let totalPrice = 0;
    
    // VIP status price
    if (status !== 'none') {
      // ვამოწმოთ, რომ days არის მთელი რიცხვი და არა ნული
      const validDays = Math.max(1, Math.round(days));
      
      // გამოვიყენოთ ტიპიზირებული სტატუსი TypeScript-ისთვის
      const typedStatus = status as Exclude<VipStatus, 'none'>;
      
      // მივიღოთ pricing ინფორმაცია
      const pricingInfo = getVipPricingInfo(typedStatus);
      
      if (pricingInfo && !pricingInfo.is_daily_price) {
        // თუ ფასი არ არის დღიური, გამოვიყენოთ ფიქსირებული ფასი დადგენილი ვადისთვის
        const packagePrice = Number(pricingInfo.price);
        const packageDuration = pricingInfo.duration_days || 1;
        
        // გამოვთვალოთ რამდენი პაკეტი სჭირდება
        const packagesNeeded = Math.ceil(validDays / packageDuration);
        totalPrice += packagePrice * packagesNeeded;
      } else {
        // დღიური ფასის გამოთვლა
        const pricePerDay = parseFloat(getVipPricePerDay(typedStatus).toString());
        const daysNum = parseInt(validDays.toString(), 10);
        totalPrice += pricePerDay * daysNum;
      }
    }
    
    // Add additional services price
    totalPrice += getAdditionalServicesPrice();
    
    return totalPrice;
  };
  
  // VIP სტატუსის ვადის გასვლის თარიღის გამოთვლა
  const calculateExpirationDate = (days: number): string => {
    // ვამოწმოთ, რომ days არის მთელი რიცხვი და არა ნული
    const validDays = Math.max(1, Math.round(days));
    
    const expirationDate = new Date();
    
    // დავაყენოთ მიმდინარე დღის ბოლოს დრო (23:59:59), რომ მთელი დღე იყოს გათვალისწინებული
    expirationDate.setHours(23, 59, 59, 999);
    
    // დავამატოთ დღეები
    expirationDate.setDate(expirationDate.getDate() + validDays);
    
    // დავაფორმატოთ თარიღი: DD.MM.YYYY
    const day = expirationDate.getDate().toString().padStart(2, '0');
    const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expirationDate.getFullYear();
    
    return `${day}.${month}.${year}`;
  };
  
  // მომხმარებლის ბალანსის მიღება
  const fetchUserBalance = async () => {
    try {
      setLoadingBalance(true);
      const balance = await balanceService.getBalance();
      setUserBalance(balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setUserBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };
  
  const fetchVipPricing = async () => {
    try {
      // Force refresh user-specific pricing to get latest data
      const pricingData = await vipPricingService.refreshUserPricing();
      setVipPricing(pricingData.packages);
      setAdditionalServicesPricing(pricingData.additionalServices);
      setPricingLoaded(true);
      console.log('UserVipModal - refreshed pricing data:', pricingData);
    } catch (error) {
      console.error('Error fetching VIP pricing:', error);
      // Fallback to general pricing if user-specific fails
      try {
        const fallbackData = await vipPricingService.getAllPricing();
        setVipPricing(fallbackData.packages);
        setAdditionalServicesPricing(fallbackData.additionalServices);
      } catch (fallbackError) {
        console.error('Error fetching fallback VIP pricing:', fallbackError);
      }
      setPricingLoaded(true); // Still set to true to show fallback prices
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // თუ VIP სტატუსი უკვე აქვს, დავაყენოთ არსებული სტატუსი
      if (car.vip_status && car.vip_status !== 'none') {
        setSelectedStatus(car.vip_status as VipStatus);
      } else {
        // დეფოლტად ვირჩევთ 'none' რომ მომხმარებელმა შეძლოს მხოლოდ დამატებითი სერვისების არჩევა
        setSelectedStatus('none');
      }
      
      // დაწყების თარიღისთვის დავაყენოთ დღევანდელი დღე
      const today = new Date();
      setStartDate(today);
      setDaysCount(1);
      
      // მივიღოთ მომხმარებლის ბალანსი და VIP ფასები
      fetchUserBalance();
      fetchVipPricing();
    }
  }, [isOpen, car]);
  
  // ფასის განახლება, როცა იცვლება სტატუსი ან დღეების რაოდენობა ან დამატებითი სერვისები
  useEffect(() => {
    // დავრწმუნდეთ, რომ დღეების რაოდენობა არის მთელი რიცხვი
    const validDaysCount = Math.max(1, Math.round(daysCount));
    if (validDaysCount !== daysCount) {
      // თუ დღეების რაოდენობა შეიცვალა, განვაახლოთ ვალიდური მნიშვნელობით
      setDaysCount(validDaysCount);
      return;
    }
    
    setTotalPrice(calculateTotalPrice(selectedStatus, validDaysCount));
  }, [selectedStatus, daysCount, colorHighlighting, colorHighlightingDays, autoRenewal, autoRenewalDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // შევამოწმოთ, აქვს თუ არა მომხმარებელს საკმარისი ბალანსი
    if (userBalance !== null && userBalance < totalPrice) {
      setError(t('profile:cars.vip.modal.insufficientBalance'));
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // დავრწმუნდეთ, რომ დღეების რაოდენობა არის მთელი რიცხვი და არა ნული
      const validDaysCount = Math.max(1, Math.round(daysCount));
      
      // ვრწმუნდებით რომ დღეების რაოდენობა არის მთელი რიცხვი
      // ყოველთვის გადავიყვანოთ მთელ რიცხვად, რომ თავიდან ავიცილოთ ტიპის პრობლემები
      const daysInt = parseInt(String(daysCount), 10);
      const finalDays = Math.max(1, daysInt);
      
      // გამოვთვალოთ ჯამური ფასი
      const calculatedPrice = calculateTotalPrice(selectedStatus, finalDays);
      
      // Use comprehensive VIP purchase API that supports role-based pricing
      let result;
      
      try {
        // Import vipService for comprehensive package purchase with role-based pricing
        const vipService = (await import('../../../../../api/services/vipService')).default;
        
        // Check if we have VIP status selected or only additional services
        if (selectedStatus !== 'none') {
          // VIP status with optional additional services
          const vipPackage = {
            vip_status: selectedStatus,
            vip_days: finalDays,
            color_highlighting: colorHighlighting,
            color_highlighting_days: colorHighlightingDays,
            auto_renewal: autoRenewal,
            auto_renewal_days: autoRenewalDays
          };
          
          console.log('Purchasing VIP package with role-based pricing:', vipPackage);
          result = await vipService.purchaseVipPackage(car.id, vipPackage);
        } else if (colorHighlighting || autoRenewal) {
          // Only additional services without VIP status
          const servicesPackage = {
            vip_status: 'none' as VipStatus,
            vip_days: 0,
            color_highlighting: colorHighlighting,
            color_highlighting_days: colorHighlightingDays,
            auto_renewal: autoRenewal,
            auto_renewal_days: autoRenewalDays
          };
          
          console.log('Purchasing additional services only with role-based pricing:', servicesPackage);
          result = await vipService.purchaseVipPackage(car.id, servicesPackage);
        } else {
          // No VIP and no additional services selected
          setError(t('profile:cars.vip.modal.selectAtLeastOne'));
          return;
        }
      } catch (error) {
        console.error('VIP package purchase failed:', error);
        setError(t('profile:cars.vip.modal.purchaseFailed'));
        return;
      }
      
      if (result.success) {
        setUserBalance(result.newBalance); // განვაახლოთ ბალანსი
        
        // გამოვიძახოთ სტატუსის განახლების callback
        onStatusUpdate();
        showToast(t('profile:cars.vip.modal.success'), 'success');
        onClose();
        
        // დავაყოვნოთ 500ms და გადავტვირთოთ გვერდი
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // თუ არასაკმარისი ბალანსია
        if (result.requiredAmount && result.currentBalance) {
          setError(t('profile:cars.vip.modal.insufficientBalance', { requiredAmount: result.requiredAmount, currentBalance: result.currentBalance }));
        } else {
          setError(result.message || t('common:error'));
        }
      }
    } catch (err: any) {
      setError(err.message || t('common:error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ბალანსის შევსების გვერდზე გადასვლა
  const handleAddFunds = () => {
    onClose();
    navigate('/profile/balance');
  };
  
  // სტატუსის არჩევის ფუნქცია - allows unchecking by clicking selected status
  const handleStatusChange = (status: VipStatus) => {
    // If clicking the already selected status, uncheck it (set to 'none')
    if (selectedStatus === status && status !== 'none') {
      setSelectedStatus('none');
      return;
    }
    
    setSelectedStatus(status);
    
    // თუ არჩეული სტატუსი ფიქსირებული ვადით არის, ავტომატურად დავაყენოთ დღეები
    if (status !== 'none') {
      const pricingInfo = getVipPricingInfo(status as Exclude<VipStatus, 'none'>);
      if (pricingInfo && !pricingInfo.is_daily_price && pricingInfo.duration_days) {
        // ფიქსირებული ვადის შემთხვევაში დავაყენოთ განსაზღვრული დღეები
        setDaysCount(pricingInfo.duration_days);
      }
    }
  };
  
  // დღეების რაოდენობის ცვლილება
  const handleDaysChange = (days: number) => {
    // შევამოწმოთ არის თუ არა არჩეული სტატუსი ფიქსირებული ვადით
    if (selectedStatus !== 'none') {
      const pricingInfo = getVipPricingInfo(selectedStatus as Exclude<VipStatus, 'none'>);
      if (pricingInfo && !pricingInfo.is_daily_price) {
        // ფიქსირებული ვადის შემთხვევაში არ ვცვლით დღეების რაოდენობას
        return;
      }
    }
    
    // დავრწმუნდეთ, რომ days არის მთელი რიცხვი და არა ნული
    const validDays = Math.max(1, Math.round(days));
    setDaysCount(validDays);
    
    // განვაახლოთ ფასი ახალი დღეების რაოდენობის მიხედვით
    setTotalPrice(calculateTotalPrice(selectedStatus, validDays));
  };

  // თუ მოდალი დახურულია, არაფერი გამოვაჩინოთ
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
            {t('profile:cars.vip.modal.buyVip')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* მომხმარებლის ბალანსი */}
          <BalanceDisplay balance={userBalance} loading={loadingBalance} />
          
          <form onSubmit={handleSubmit}>
            {/* VIP სტატუსის არჩევა */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">{t('profile:cars.vip.modal.selectStatus')}</label>
              
              {/* VIP Status Cards with inline days selectors */}
              <div className="grid grid-cols-2 gap-4">
                {/* None Status Card */}
                <div
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${selectedStatus === 'none' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  onClick={() => handleStatusChange('none')}
                >
                  {selectedStatus === 'none' && (
                    <div className="absolute top-3 right-3">
                      <Check className="text-blue-600" size={24} />
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-gray-500" size={24} />
                      <h4 className="font-semibold m-0 text-lg">{t('profile:cars.vip.modal.noVip')}</h4>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {t('profile:cars.vip.modal.additionalServicesOnly')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('profile:cars.vip.modal.additionalServicesOnlyDesc')}</p>
                </div>

                {/* VIP Card */}
                <div
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${selectedStatus === 'vip' ? 'border-yellow-500 bg-yellow-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  onClick={() => handleStatusChange('vip')}
                >
                  {selectedStatus === 'vip' && (
                    <div className="absolute top-3 right-3">
                      <Check className="text-yellow-600" size={24} />
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={24} fill="currentColor" />
                        <Award className="text-yellow-500" size={20} />
                      </div>
                      <Crown className="text-yellow-500" size={28} fill="currentColor" />
                      <h4 className="font-semibold m-0 text-lg text-yellow-700">{vipStatusLabels['vip']}</h4>
                    </div>
                    <span className="text-sm font-medium text-yellow-700">
                      {getVipPriceDisplay('vip')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{vipStatusDescriptions['vip']}</p>

                  {/* Days input field for VIP status */}
                  {selectedStatus === 'vip' && (
                    <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <select
                          value={daysCount}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 1;
                            setDaysCount(days);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span className="text-sm text-yellow-600">{t('profile:cars.vip.modal.days')}</span>
                        <div className="ml-auto text-sm font-medium text-yellow-700">
                          {formatPrice(getVipPricePerDay('vip') * daysCount)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* VIP Plus Card */}
                <div
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${selectedStatus === 'vip_plus' ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  onClick={() => handleStatusChange('vip_plus')}
                >
                  {selectedStatus === 'vip_plus' && (
                    <div className="absolute top-3 right-3">
                      <Check className="text-orange-600" size={24} />
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="text-orange-500" size={24} fill="currentColor" />
                        <Star className="text-orange-500" size={24} fill="currentColor" />
                        <Zap className="text-orange-500" size={20} />
                      </div>
                      <Crown className="text-orange-500" size={28} fill="currentColor" />
                      <h4 className="font-semibold m-0 text-lg text-orange-700">{vipStatusLabels['vip_plus']}</h4>
                    </div>
                    <span className="text-sm font-medium text-orange-700">
                      {getVipPriceDisplay('vip_plus')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{vipStatusDescriptions['vip_plus']}</p>

                  {/* Days input field for VIP Plus status */}
                  {selectedStatus === 'vip_plus' && (
                    <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <select
                          value={daysCount}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 1;
                            setDaysCount(days);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span className="text-sm text-orange-600">{t('profile:cars.vip.modal.days')}</span>
                        <div className="ml-auto text-sm font-medium text-orange-700">
                          {formatPrice(getVipPricePerDay('vip_plus') * daysCount)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Super VIP Card */}
                <div
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${selectedStatus === 'super_vip' ? 'border-purple-500 bg-purple-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  onClick={() => handleStatusChange('super_vip')}
                >
                  {selectedStatus === 'super_vip' && (
                    <div className="absolute top-3 right-3">
                      <Check className="text-purple-600" size={24} />
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Crown className="text-purple-500" size={28} fill="currentColor" />
                        <Star className="text-purple-500" size={20} fill="currentColor" />
                        <Star className="text-purple-500" size={20} fill="currentColor" />
                        <Star className="text-purple-500" size={20} fill="currentColor" />
                      </div>
                      <Crown className="text-purple-500" size={28} fill="currentColor" />
                      <h4 className="font-semibold m-0 text-lg text-purple-700">{vipStatusLabels['super_vip']}</h4>
                    </div>
                    <span className="text-sm font-medium text-purple-700">
                      {getVipPriceDisplay('super_vip')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{vipStatusDescriptions['super_vip']}</p>

                  {/* Days input field for Super VIP status */}
                  {selectedStatus === 'super_vip' && (
                    <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <select
                          value={daysCount}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 1;
                            setDaysCount(days);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span className="text-sm text-purple-600">{t('profile:cars.vip.modal.days')}</span>
                        <div className="ml-auto text-sm font-medium text-purple-700">
                          {formatPrice(getVipPricePerDay('super_vip') * daysCount)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional Services */}
            <div className="mb-6">
              <h4 className="block text-gray-700 font-medium mb-4">{t("profile:addCar.vipStatus.additionalServices")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Color Highlighting Card */}
                <div 
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    colorHighlighting ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`} 
                  onClick={() => setColorHighlighting(!colorHighlighting)}
                >
                  {colorHighlighting && (
                    <div className="absolute top-2 right-2">
                      <Check className="text-blue-600" size={16} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Paintbrush className="text-blue-500" size={18} />
                    <h5 className="font-medium text-sm text-blue-700">{t("profile:addCar.vipStatus.colorHighlighting")}</h5>
                  </div>
                  <div className="text-xs font-medium text-blue-700 mb-2">
                    {getAdditionalServicePrice('color_highlighting') === 0 ? t("profile:addCar.vipStatus.free") : `${getAdditionalServicePrice('color_highlighting')} ${t("profile:addCar.vipStatus.currency")}/${t('profile:cars.vip.modal.days')}`}
                  </div>
                  
                  {/* Days input for Color Highlighting */}
                  {colorHighlighting && (
                    <div className="mt-2 p-2 bg-blue-100 rounded border border-blue-200">
                      <div className="flex items-center gap-2">
                        <select
                          value={colorHighlightingDays}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 1;
                            setColorHighlightingDays(days);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 px-1 py-1 border border-blue-300 rounded text-xs"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span className="text-xs text-blue-600">{t("profile:cars.vip.modal.days")}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto Renewal Card */}
                <div 
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    autoRenewal ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`} 
                  onClick={() => setAutoRenewal(!autoRenewal)}
                >
                  {autoRenewal && (
                    <div className="absolute top-2 right-2">
                      <Check className="text-green-600" size={16} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="text-green-500" size={18} />
                    <h5 className="font-medium text-sm text-green-700">{t("profile:addCar.vipStatus.autoRenewal")}</h5>
                  </div>
                  <div className="text-xs font-medium text-green-700 mb-2">
                    {getAdditionalServicePrice('auto_renewal') === 0 ? t("profile:addCar.vipStatus.free") : `${getAdditionalServicePrice('auto_renewal')} ${t("profile:addCar.vipStatus.currency")}/${t('profile:cars.vip.modal.days')}`}
                  </div>
                  
                  {/* Days input for Auto Renewal */}
                  {autoRenewal && (
                    <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                      <div className="flex items-center gap-2">
                        <select
                          value={autoRenewalDays}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 1;
                            setAutoRenewalDays(days);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 px-1 py-1 border border-green-300 rounded text-xs"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span className="text-xs text-green-600">{t("profile:cars.vip.modal.days")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* ვადის გასვლის თარიღი */}
            {selectedStatus !== 'none' && daysCount > 0 && (
              <div className="mb-4">
                <ExpirationDateDisplay 
                  expirationDate={calculateExpirationDate(daysCount)}
                  daysCount={Math.max(1, Math.round(daysCount))} // ვიყენებთ ვალიდურ დღეებს
                />
              </div>
            )}
            
            {/* Show expiration for additional services even without VIP */}
            {selectedStatus === 'none' && (colorHighlighting || autoRenewal) && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('profile:cars.vip.modal.serviceDuration')}</h4>
                {colorHighlighting && (
                  <p className="text-xs text-blue-600">{t('profile:addCar.vipStatus.colorHighlighting')}: {colorHighlightingDays} {colorHighlightingDays === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days')}</p>
                )}
                {autoRenewal && (
                  <p className="text-xs text-green-600">{t('profile:addCar.vipStatus.autoRenewal')}: {autoRenewalDays} {autoRenewalDays === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days')}</p>
                )}
              </div>
            )}
            
            {/* ჯამური ღირებულება */}
            <PriceDisplay totalPrice={totalPrice} />
            
            {/* შეცდომის გამოტანა */}
            <ErrorDisplay 
              error={error} 
              insufficientBalance={userBalance !== null && userBalance < totalPrice}
              onAddFunds={handleAddFunds}
            />
            
            {/* ქმედებების ღილაკები */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {t('profile:cars.vip.modal.cancel')}
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  userBalance !== null && userBalance < totalPrice || (selectedStatus === 'none' && !colorHighlighting && !autoRenewal)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-green-600 transition-colors'
                }`}
                disabled={loading || (userBalance !== null && userBalance < totalPrice) || (selectedStatus === 'none' && !colorHighlighting && !autoRenewal)}
              >
                {loading ? t('profile:cars.vip.modal.loading') : (selectedStatus === 'none' ? t('profile:cars.vip.modal.buyServices') : t('profile:cars.vip.modal.buy'))}
                {!loading && <Check className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserVipModal;