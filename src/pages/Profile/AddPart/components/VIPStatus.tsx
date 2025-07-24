import React, { useState, useEffect } from 'react';
import { Star, Check, AlertCircle, Paintbrush, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vipService, { VipStatus } from '../../../../api/services/vipService';
import vipPricingService, { VipServicePricing } from '../../../../api/services/vipPricingService';
import { useToast } from '../../../../context/ToastContext';
import balanceService from '../../../../api/services/balanceService';

interface VIPStatusProps {
  vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  onChange: (field: string, value: any) => void;
}

const VIPStatus: React.FC<VIPStatusProps> = ({ vipStatus, onChange }) => {
  const { t } = useTranslation('profile');
  const { showToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedVipStatus, setSelectedVipStatus] = useState<VipStatus>('none');
  const [colorHighlighting, setColorHighlighting] = useState<boolean>(false);
  const [autoRenewal, setAutoRenewal] = useState<boolean>(false);
  const [vipPricing, setVipPricing] = useState<VipServicePricing[]>([]);
  const [additionalServicesPricing, setAdditionalServicesPricing] = useState<VipServicePricing[]>([]);
  const [pricingLoaded, setPricingLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    fetchUserBalance();
    fetchVipPricing();
  }, []);

  const fetchVipPricing = async () => {
    try {
      const pricingData = await vipPricingService.getAllPricing();
      setVipPricing(pricingData.packages);
      setAdditionalServicesPricing(pricingData.additionalServices);
      setPricingLoaded(true);
    } catch (error) {
      console.error('Error fetching VIP pricing:', error);
      setPricingLoaded(true); // Still set to true to show fallback prices
    }
  };

  const fetchUserBalance = async () => {
    try {
      const balance = await balanceService.getBalance();
      setUserBalance(balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setUserBalance(0);
    }
  };
  
  const handleStatusChange = (status: 'none' | 'vip' | 'vip_plus' | 'super_vip') => {
    onChange('vip_status', status);
  };

  const handleColorHighlightingChange = (enabled: boolean) => {
    setColorHighlighting(enabled);
    onChange('color_highlighting', enabled);
  };

  const handleAutoRenewalChange = (enabled: boolean) => {
    setAutoRenewal(enabled);
    onChange('auto_renewal', enabled);
  };  
  
  const getVipPrice = (status: VipStatus): number => {
    if (status === 'none') {
      const freePricing = vipPricing.find(p => p.service_type === 'free');
      return freePricing ? Number(freePricing.price) : 0;
    }
    
    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback prices
      switch (status) {
        case 'vip': return 2;
        case 'vip_plus': return 5;
        case 'super_vip': return 7;
        default: return 0;
      }
    }
    
    const pricing = vipPricing.find(p => p.service_type === status);
    const price = pricing ? Number(pricing.price) : 0;
    return price;
  };

  // VIP პაკეტის ფასის ფორმატირება is_daily_price-ის მიხედვით
  const getVipPriceDisplay = (status: Exclude<VipStatus, 'none'>): string => {
    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback display
      const price = getVipPrice(status);
      return `${price} ${t('addCar.vipStatus.currency')}/${t('profile:cars.vip.modal.day')}`;
    }
    
    const pricing = vipPricing.find(p => p.service_type === status);
    if (!pricing) {
      const price = getVipPrice(status);
      return `${price} ${t('addCar.vipStatus.currency')}/${t('profile:cars.vip.modal.day')}`;
    }
    
    const price = Number(pricing.price);
    const currency = t('addCar.vipStatus.currency');
    
    if (pricing.is_daily_price) {
      return `${price} ${currency}/${t('profile:cars.vip.modal.day')}`;
    } else {
      const duration = pricing.duration_days || 1;
      const daysText = duration === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days');
      return `${price} ${currency} (${duration} ${daysText})`;
    }
  };

  // შევამოწმოთ არის თუ არა არჩეული სტატუსი ფიქსირებული ვადით
  const isFixedDurationPackage = (status: VipStatus): boolean => {
    if (status === 'none') return false;
    const pricing = vipPricing.find(p => p.service_type === status);
    return pricing ? !pricing.is_daily_price : false;
  };

  // VIP პაკეტის ინფორმაციის მიღება
  const getVipPricingInfo = (status: Exclude<VipStatus, 'none'>) => {
    const pricing = vipPricing.find(p => p.service_type === status);
    return pricing || null;
  };
  
  const getAdditionalServicesPrice = (): number => {
    let price = 0;
    
    if (colorHighlighting) {
      const colorPricing = additionalServicesPricing.find(s => s.service_type === 'color_highlighting');
      price += colorPricing ? colorPricing.price : 0.5;
    }
    
    if (autoRenewal) {
      const renewalPricing = additionalServicesPricing.find(s => s.service_type === 'auto_renewal');
      price += renewalPricing ? renewalPricing.price : 0.5;
    }
    
    return price;
  };
  
  const getAdditionalServicePrice = (serviceType: string): number => {
    const pricing = additionalServicesPricing.find(s => s.service_type === serviceType);
    return pricing ? pricing.price : (serviceType === 'color_highlighting' || serviceType === 'auto_renewal' ? 0.5 : 0);
  };
  
  const getTotalPrice = (status: VipStatus): number => {
    return getVipPrice(status) + getAdditionalServicesPrice();
  };
  
  const handlePurchaseClick = (status: VipStatus) => {
    setSelectedVipStatus(status);
    setShowConfirmModal(true);
  };
  
  const confirmPurchase = async () => {
    if (selectedVipStatus === 'none') return;
    
    const totalPrice = getTotalPrice(selectedVipStatus);
    
    if (userBalance < totalPrice) {
      showToast(t('addCar.vipStatus.insufficientBalance'), 'error');
      setShowConfirmModal(false);
      return;
    }
    
    setIsPurchasing(true);
    try {
      // The part isn't created yet, so we can't use the purchase API
      // Instead we'll just select the status and it will be applied when the part is created
      handleStatusChange(selectedVipStatus);
      
      // Also save the additional options state
      onChange('color_highlighting', colorHighlighting);
      onChange('auto_renewal', autoRenewal);
      
      let additionalServices = [];
      if (colorHighlighting) additionalServices.push(t('addCar.vipStatus.colorHighlighting'));
      if (autoRenewal) additionalServices.push(t('addCar.vipStatus.autoRenewal'));
      
      const additionalServicesText = additionalServices.length > 0 
        ? ` ${t('addCar.vipStatus.additionalServices')}: ${additionalServices.join(', ')}` 
        : '';
      
      const statusName = selectedVipStatus === 'vip' ? t('addCar.vipStatus.types.vip') : selectedVipStatus === 'vip_plus' ? t('addCar.vipStatus.types.vip_plus') : t('addCar.vipStatus.types.super_vip');
      showToast(`${statusName}${additionalServicesText} არჩეულია. ნაწილის დამატების შემდეგ ${totalPrice} ${t('addCar.vipStatus.currency')} ჩამოგეჭრებათ ბალანსიდან.`, 'success');
    } catch (error) {
      console.error('Error setting VIP status:', error);
      showToast('VIP სტატუსის არჩევა ვერ მოხერხდა', 'error');
    } finally {
      setIsPurchasing(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="text-yellow-500 mr-2" size={20} />
          <h3 className="text-lg font-medium">{t('addCar.vipStatus.titleFull')}</h3>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
          {t('addCar.vipStatus.balance')}: {userBalance} {t('addCar.vipStatus.currency')}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        {t('addCar.vipStatus.description')}
      </p>
      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t('addCar.vipStatus.confirmTitle')}</h3>
            <p className="mb-2">
              {t('addCar.vipStatus.confirmQuestion', { status: selectedVipStatus === 'vip' ? t('addCar.vipStatus.types.vip') : selectedVipStatus === 'vip_plus' ? t('addCar.vipStatus.types.vip_plus') : t('addCar.vipStatus.types.super_vip') })}
            </p>
            
            {/* Show selected additional services */}
            {(colorHighlighting || autoRenewal) && (
              <div className="mb-3 text-sm">
                <p className="font-medium">{t('addCar.vipStatus.additionalServices')}:</p>
                <ul className="list-disc list-inside pl-2">
                  {colorHighlighting && <li>{t('addCar.vipStatus.colorHighlighting')} ({t('addCar.vipStatus.pricePerDay', { price: getAdditionalServicePrice('color_highlighting').toString() })})</li>}
                  {autoRenewal && <li>{t('addCar.vipStatus.autoRenewal')} ({t('addCar.vipStatus.pricePerDay', { price: getAdditionalServicePrice('auto_renewal').toString() })})</li>}
                </ul>
              </div>
            )}
            
            <p className="mb-6 font-medium">{t('addCar.vipStatus.totalPrice', { price: getTotalPrice(selectedVipStatus) })}</p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('addCar.vipStatus.cancel')}
              </button>
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing || userBalance < getTotalPrice(selectedVipStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPurchasing ? t('addCar.vipStatus.processing') : t('addCar.vipStatus.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional Services - Independent of VIP status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${vipStatus === 'none' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
            }`}
          onClick={() => handleStatusChange('none')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.none')}</h4>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {getVipPrice('none')=== 0 ? t('addCar.vipStatus.free') : t('addCar.vipStatus.pricePerDay') + " " + getVipPrice('none').toString() + " " + t("addCar.vipStatus.currency")}
            </span>
          </div>
          <p className="text-xs text-gray-500">{t('addCar.vipStatus.descriptions.none')}</p>
        </div>

        <div
          className={`border-2 rounded-lg p-4 transition-all ${vipStatus === 'vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
            }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.vip')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {getVipPrice("vip") === 0 ? t('addCar.vipStatus.free') : getVipPriceDisplay('vip')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.vip')}</p>
          {/* ფიქსირებული ვადის შეტყობინება */}
          {isFixedDurationPackage('vip') && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="text-blue-700">
                {t('profile:cars.vip.modal.fixedDurationMessage', { days: getVipPricingInfo('vip')?.duration_days || 1 })}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1">
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('vip')}
            >
              {t('addCar.vipStatus.select')}
            </button>
            <button
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('vip')}
              disabled={userBalance < getVipPrice('vip')}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < getVipPrice('vip') && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>

        <div
          className={`border-2 rounded-lg p-4 transition-all ${vipStatus === 'vip_plus' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
            }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.vip_plus')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {getVipPrice("vip_plus") === 0 ? t('addCar.vipStatus.free') : getVipPriceDisplay('vip_plus')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.vip_plus')}</p>
          {/* ფიქსირებული ვადის შეტყობინება */}
          {isFixedDurationPackage('vip_plus') && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="text-blue-700">
                {t('profile:cars.vip.modal.fixedDurationMessage', { days: getVipPricingInfo('vip_plus')?.duration_days || 1 })}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1">
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('vip_plus')}
            >
              {t('addCar.vipStatus.select')}
            </button>
            <button
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('vip_plus')}
              disabled={userBalance < getVipPrice('vip_plus')}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < getVipPrice('vip_plus') && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>

        <div
          className={`border-2 rounded-lg p-4 transition-all ${vipStatus === 'super_vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
            }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.super_vip')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {getVipPrice("super_vip") === 0 ? t('addCar.vipStatus.free') : getVipPriceDisplay('super_vip')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.super_vip')}</p>
          {/* ფიქსირებული ვადის შეტყობინება */}
          {isFixedDurationPackage('super_vip') && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="text-blue-700">
                {t('profile:cars.vip.modal.fixedDurationMessage', { days: getVipPricingInfo('super_vip')?.duration_days || 1 })}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1">
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('super_vip')}
            >
              {t('addCar.vipStatus.select')}
            </button>
            <button
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('super_vip')}
              disabled={userBalance < getVipPrice('super_vip')}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < getVipPrice('super_vip') && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>
      </div>
      
      <h4 className="font-medium mb-3">{t('addCar.vipStatus.title')}</h4>
      <div className="mb-2 text-sm text-red-500">
        DEBUG: VIP Price: {getVipPrice('vip')}, VIP+ Price: {getVipPrice('vip_plus')}, Super VIP Price: {getVipPrice('super_vip')}
      </div>
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">{t('addCar.vipStatus.additionalServices')}</h4>
        <div className="space-y-4">
          {/* Color Highlighting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Paintbrush size={16} className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium">{t('addCar.vipStatus.colorHighlighting')}</p>
                <p className="text-xs text-gray-500">{t('addCar.vipStatus.colorHighlightingDescription')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{getAdditionalServicePrice('color_highlighting').toString() === '0.00' ? t('addCar.vipStatus.free') : t('addCar.vipStatus.pricePerDay') + " " + getAdditionalServicePrice('color_highlighting').toString() + " " + t("addCar.vipStatus.currency")}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={colorHighlighting}
                  onChange={(e) => handleColorHighlightingChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          {/* Auto Renewal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw size={16} className="text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium">{t('addCar.vipStatus.autoRenewal')}</p>
                <p className="text-xs text-gray-500">{t('addCar.vipStatus.autoRenewalDescription')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">{getAdditionalServicePrice('auto_renewal').toString() === '0.00' ? t('addCar.vipStatus.free') : t('addCar.vipStatus.pricePerDay') + " " + getAdditionalServicePrice('auto_renewal').toString() + " " + t("addCar.vipStatus.currency")}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoRenewal}
                  onChange={(e) => handleAutoRenewalChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPStatus;
