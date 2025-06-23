import React, { useState, useEffect } from 'react';
import { Star, Check, AlertCircle } from 'lucide-react';
import vipService, { VipStatus } from '../../../../../api/services/vipService';
import { useToast } from '../../../../../context/ToastContext';
import balanceService from '../../../../../api/services/balanceService';

interface VIPStatusProps {
  vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  onChange: (field: string, value: any) => void;
}

const VIPStatus: React.FC<VIPStatusProps> = ({ vipStatus, onChange }) => {
  const { showToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedVipStatus, setSelectedVipStatus] = useState<VipStatus>('none');
  
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
  
  const handlePurchaseClick = (status: VipStatus) => {
    setSelectedVipStatus(status);
    setShowConfirmModal(true);
  };
  
  const confirmPurchase = async () => {
    if (selectedVipStatus === 'none') return;
    
    const price = getVipPrice(selectedVipStatus);
    
    if (userBalance < price) {
      showToast('არასაკმარისი ბალანსი', 'error');
      setShowConfirmModal(false);
      return;
    }
    
    setIsPurchasing(true);
    try {
      // The car isn't created yet, so we can't use the purchase API
      // Instead we'll just select the status and it will be applied when the car is created
      handleStatusChange(selectedVipStatus);
      showToast(`VIP სტატუსი არჩეულია. მანქანის დამატების შემდეგ ${price} ლარი ჩამოგეჭრებათ ბალანსიდან.`, 'success');
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
          <h3 className="text-lg font-medium">VIP სტატუსი</h3>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
          ბალანსი: {userBalance} ლარი
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        აირჩიეთ VIP სტატუსი თქვენი განცხადებისთვის. VIP სტატუსი გაზრდის თქვენი განცხადების ხილვადობას.
      </p>
      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">VIP სტატუსის შეძენის დადასტურება</h3>
            <p className="mb-4">
              გსურთ შეიძინოთ {selectedVipStatus === 'vip' ? 'VIP' : selectedVipStatus === 'vip_plus' ? 'VIP+' : 'SUPER VIP'} სტატუსი?
            </p>
            <p className="mb-6">ფასი: {getVipPrice(selectedVipStatus)} ლარი (1 დღე)</p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                გაუქმება
              </button>
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing || userBalance < getVipPrice(selectedVipStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPurchasing ? 'მიმდინარეობს...' : 'დადასტურება'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'none' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('none')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">სტანდარტული</h4>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">უფასო</span>
          </div>
          <p className="text-xs text-gray-500">სტანდარტული განთავსება</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">1 დღე 2 ლარი</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">გაზრდილი ხილვადობა</p>
          <div className="grid grid-cols-2 gap-1">
            <button 
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('vip')}
            >
              არჩევა
            </button>
            <button 
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('vip')}
              disabled={userBalance < 2}
            >
              შეძენა
            </button>
          </div>
          {userBalance < 2 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>არასაკმარისი ბალანსი</span>
            </div>
          )}
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'vip_plus' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP+</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">1 დღე 5 ლარი</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">მაღალი ხილვადობა და გამორჩეული ბეჯი</p>
          <div className="grid grid-cols-2 gap-1">
            <button 
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('vip_plus')}
            >
              არჩევა
            </button>
            <button 
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('vip_plus')}
              disabled={userBalance < 5}
            >
              შეძენა
            </button>
          </div>
          {userBalance < 5 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>არასაკმარისი ბალანსი</span>
            </div>
          )}
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 transition-all ${
            vipStatus === 'super_vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">SUPER VIP</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">1 დღე 7 ლარი</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">მაქსიმალური ხილვადობა და პრემიუმ ბეჯი</p>
          <div className="grid grid-cols-2 gap-1">
            <button 
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded transition-colors"
              onClick={() => handleStatusChange('super_vip')}
            >
              არჩევა
            </button>
            <button 
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              onClick={() => handlePurchaseClick('super_vip')}
              disabled={userBalance < 7}
            >
              შეძენა
            </button>
          </div>
          {userBalance < 7 && (
            <div className="flex items-center mt-2 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>არასაკმარისი ბალანსი</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ფუნქცია VIP სტატუსის მახასიათებლების მისაღებად
const getVipStatusFeatures = (status: VipStatus): string[] => {
  switch (status) {
    case 'vip':
      return [
        'გამოკვეთილი განცხადება',
        '5-ჯერ მეტი ხილვადობა'
      ];
    case 'vip_plus':
      return [
        'გამოკვეთილი განცხადება',
        'კატეგორიაში ზედა პოზიცია',
        '10-ჯერ მეტი ხილვადობა'
      ];
    case 'super_vip':
      return [
        'გამოკვეთილი განცხადება',
        'კატეგორიაში ზედა პოზიცია',
        'ძიების შედეგებში პირველობა',
        '20-ჯერ მეტი ხილვადობა'
      ];
    default:
      return [];
  }
};

export default VIPStatus;
