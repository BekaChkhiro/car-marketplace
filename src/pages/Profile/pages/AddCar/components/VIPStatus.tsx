import React, { useState, useEffect } from 'react';
import { Star, Check, AlertCircle, Paintbrush, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vipService, { VipStatus } from '../../../../../api/services/vipService';
import { useToast } from '../../../../../context/ToastContext';
import balanceService from '../../../../../api/services/balanceService';

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
  
  useEffect(() => {
    fetchUserBalance();
  }, []);

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
    switch (status) {
      case 'vip':
        return 2;
      case 'vip_plus':
        return 5;
      case 'super_vip':
        return 7;
      default:
        return 0;
    }
  };
  
  const getAdditionalServicesPrice = (): number => {
    let price = 0;
    if (colorHighlighting) price += 0.5;
    if (autoRenewal) price += 0.5;
    return price;
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
      // The car isn't created yet, so we can't use the purchase API
      // Instead we'll just select the status and it will be applied when the car is created
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
      showToast(`${statusName}${additionalServicesText} selected. After adding the car, ${totalPrice} GEL will be deducted from your balance.`, 'success');
    } catch (error) {
      console.error('Error setting VIP status:', error);
      showToast('Failed to select VIP status', 'error');
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
                  {colorHighlighting && <li>{t('addCar.vipStatus.colorHighlighting')} ({t('addCar.vipStatus.pricePerDay', { price: '0.5' })})</li>}
                  {autoRenewal && <li>{t('addCar.vipStatus.autoRenewal')} ({t('addCar.vipStatus.pricePerDay', { price: '0.5' })})</li>}
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{t('addCar.vipStatus.pricePerDay', { price: '0.5' })}</span>
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
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">1 დღე 0.5 ლარი</span>
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
      
      <h4 className="font-medium mb-3">{t('addCar.vipStatus.title')}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'none' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('none')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.none')}</h4>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{t('addCar.vipStatus.free')}</span>
          </div>
          <p className="text-xs text-gray-500">{t('addCar.vipStatus.descriptions.none')}</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.vip')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('addCar.vipStatus.pricePerDay', { price: '2' })}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.vip')}</p>
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
              disabled={userBalance < 2}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < 2 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'vip_plus' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.vip_plus')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('addCar.vipStatus.pricePerDay', { price: '5' })}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.vip_plus')}</p>
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
              disabled={userBalance < 5}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < 5 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'super_vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{t('addCar.vipStatus.types.super_vip')}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('addCar.vipStatus.pricePerDay', { price: '7' })}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.vipStatus.descriptions.super_vip')}</p>
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
              disabled={userBalance < 7}
            >
              {t('addCar.vipStatus.purchase')}
            </button>
          </div>
          {userBalance < 7 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addCar.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Function to get VIP status features for localization
const getVipStatusFeatures = (status: VipStatus, t: any): string[] => {
  switch (status) {
    case 'vip':
      return t('addCar.vipStatus.features.vip', { returnObjects: true }) || [];
    case 'vip_plus':
      return t('addCar.vipStatus.features.vip_plus', { returnObjects: true }) || [];
    case 'super_vip':
      return t('addCar.vipStatus.features.super_vip', { returnObjects: true }) || [];
    default:
      return [];
  }
};

export default VIPStatus;
