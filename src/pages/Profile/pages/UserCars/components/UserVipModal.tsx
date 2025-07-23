import React, { useState, useEffect } from 'react';
import { Crown, X, Check } from 'lucide-react';
import { Car } from '../../../../../api/types/car.types';
import { VipStatus } from '../../../../../api/services/vipService';
import vipPricingService, { VipServicePricing } from '../../../../../api/services/vipPricingService';
import balanceService from '../../../../../api/services/balanceService';
import { useToast } from '../../../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

// Import subcomponents
import VipStatusOption from './VipStatusOption';
import DaysSelector from './DaysSelector';
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
  const [daysCount, setDaysCount] = useState<number>(7); // default 7 days
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [vipPricing, setVipPricing] = useState<VipServicePricing[]>([]);
  const [pricingLoaded, setPricingLoaded] = useState<boolean>(false);
  const { showToast } = useToast();

  // VIP პაკეტების ფასები - დინამიური ფასები API-დან
  const getVipPricePerDay = (status: Exclude<VipStatus, 'none'>): number => {
    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback prices
      const fallbackPrices: Record<Exclude<VipStatus, 'none'>, number> = {
        vip: 2.5,
        vip_plus: 5,
        super_vip: 8
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
  
  // ჯამური ფასის გამოთვლა
  const calculateTotalPrice = (status: VipStatus, days: number): number => {
    if (status === 'none') return 0;
    
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
      const price = packagePrice * packagesNeeded;
      
      return price;
    } else {
      // დღიური ფასის გამოთვლა
      const pricePerDay = parseFloat(getVipPricePerDay(typedStatus).toString());
      const daysNum = parseInt(validDays.toString(), 10);
      const price = pricePerDay * daysNum;
      
      return price;
    }
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
      const pricingData = await vipPricingService.getAllPricing();
      setVipPricing(pricingData.packages);
      setPricingLoaded(true);
    } catch (error) {
      console.error('Error fetching VIP pricing:', error);
      setPricingLoaded(true); // Still set to true to show fallback prices
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // თუ VIP სტატუსი უკვე აქვს, დავაყენოთ არსებული სტატუსი
      if (car.vip_status && car.vip_status !== 'none') {
        setSelectedStatus(car.vip_status as VipStatus);
      } else {
        // დეფოლტად ვირჩევთ VIP
        setSelectedStatus('vip');
      }
      
      // დაწყების თარიღისთვის დავაყენოთ დღევანდელი დღე
      const today = new Date();
      setStartDate(today);
      setDaysCount(7);
      
      // მივიღოთ მომხმარებლის ბალანსი და VIP ფასები
      fetchUserBalance();
      fetchVipPricing();
    }
  }, [isOpen, car]);
  
  // ფასის განახლება, როცა იცვლება სტატუსი ან დღეების რაოდენობა
  useEffect(() => {
    // დავრწმუნდეთ, რომ დღეების რაოდენობა არის მთელი რიცხვი
    const validDaysCount = Math.max(1, Math.round(daysCount));
    if (validDaysCount !== daysCount) {
      // თუ დღეების რაოდენობა შეიცვალა, განვაახლოთ ვალიდური მნიშვნელობით
      setDaysCount(validDaysCount);
      return;
    }
    
    setTotalPrice(calculateTotalPrice(selectedStatus, validDaysCount));
  }, [selectedStatus, daysCount]);

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
      
      // გამოვიყენოთ balanceService-ის purchaseVipStatus მეთოდი
      const result = await balanceService.purchaseVipStatus(
        car.id,
        selectedStatus as 'vip' | 'vip_plus' | 'super_vip',
        finalDays // ვრწმუნდებით რომ გადავცემთ მთელ რიცხვს
      );
      
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
  
  // სტატუსის არჩევის ფუნქცია
  const handleStatusChange = (status: VipStatus) => {
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
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
              <div className="grid grid-cols-3 gap-3">
                {(['vip', 'vip_plus', 'super_vip'] as Array<Exclude<VipStatus, 'none'>>).map(status => (
                  <VipStatusOption
                    key={status}
                    status={status}
                    selectedStatus={selectedStatus}
                    price={getVipPricePerDay(status)}
                    priceDisplay={getVipPriceDisplay(status)}
                    label={vipStatusLabels[status]}
                    description={vipStatusDescriptions[status]}
                    onClick={handleStatusChange}
                  />
                ))}
              </div>
            </div>
            
            {/* დღეების რაოდენობა */}
            <DaysSelector 
              daysCount={daysCount} 
              onChange={handleDaysChange} 
              options={[1, 3, 7, 14, 30]} 
              minDays={1}
              maxDays={30}
              disabled={isFixedDurationPackage(selectedStatus)}
              fixedDuration={isFixedDurationPackage(selectedStatus)}
            />
            
            {/* ვადის გასვლის თარიღი */}
            {selectedStatus !== 'none' && daysCount > 0 && (
              <ExpirationDateDisplay 
                expirationDate={calculateExpirationDate(daysCount)}
                daysCount={Math.max(1, Math.round(daysCount))} // ვიყენებთ ვალიდურ დღეებს
              />
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
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${userBalance !== null && userBalance < totalPrice ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-green-600 transition-colors'}`}
                disabled={loading || (userBalance !== null && userBalance < totalPrice)}
              >
                {loading ? t('profile:cars.vip.modal.loading') : t('profile:cars.vip.modal.buy')}
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
