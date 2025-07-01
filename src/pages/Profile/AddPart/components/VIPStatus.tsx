import React, { useState, useEffect } from 'react';
import { Star, Check, AlertCircle, Paintbrush, RefreshCw } from 'lucide-react';
import vipService, { VipStatus } from '../../../../api/services/vipService';
import { useToast } from '../../../../context/ToastContext';
import balanceService from '../../../../api/services/balanceService';

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
      showToast('არასაკმარისი ბალანსი', 'error');
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
      if (colorHighlighting) additionalServices.push('ფერის გამოყოფა');
      if (autoRenewal) additionalServices.push('ავტომატური განახლება');
      
      const additionalServicesText = additionalServices.length > 0 
        ? ` და დამატებითი სერვისები: ${additionalServices.join(', ')}` 
        : '';
      
      showToast(`VIP სტატუსი${additionalServicesText} არჩეულია. ნაწილის დამატების შემდეგ ${totalPrice} ლარი ჩამოგეჭრებათ ბალანსიდან.`, 'success');
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
          <h3 className="text-lg font-medium">VIP სტატუსი და დამატებითი სერვისები</h3>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
          ბალანსი: {userBalance} ლარი
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        აირჩიეთ VIP სტატუსი და დამატებითი სერვისები თქვენი განცხადებისთვის.
      </p>
      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">VIP სტატუსის შეძენის დადასტურება</h3>
            <p className="mb-2">
              გსურთ შეიძინოთ {selectedVipStatus === 'vip' ? 'VIP' : selectedVipStatus === 'vip_plus' ? 'VIP+' : 'SUPER VIP'} სტატუსი?
            </p>
            
            {/* Show selected additional services */}
            {(colorHighlighting || autoRenewal) && (
              <div className="mb-3 text-sm">
                <p className="font-medium">დამატებითი სერვისები:</p>
                <ul className="list-disc list-inside pl-2">
                  {colorHighlighting && <li>ფერის გამოყოფა (0.5 ლარი/დღე)</li>}
                  {autoRenewal && <li>ავტომატური განახლება (0.5 ლარი/დღე)</li>}
                </ul>
              </div>
            )}
            
            <p className="mb-6 font-medium">საერთო ფასი: {getTotalPrice(selectedVipStatus)} ლარი (1 დღე)</p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                გაუქმება
              </button>
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing || userBalance < getTotalPrice(selectedVipStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPurchasing ? 'მიმდინარეობს...' : 'დადასტურება'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* VIP Status Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* No VIP */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${vipStatus === 'none' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
          onClick={() => handleStatusChange('none')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">სტანდარტული</h4>
            {vipStatus === 'none' && <Check size={16} className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-2">ჩვეულებრივი განცხადება</p>
          <p className="font-bold">უფასო</p>
        </div>
        
        {/* VIP */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${vipStatus === 'vip' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
          onClick={() => handlePurchaseClick('vip')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP</h4>
            {vipStatus === 'vip' && <Check size={16} className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-2">გამორჩეული განცხადება</p>
          <p className="font-bold">2 ლარი / დღე</p>
        </div>
        
        {/* VIP+ */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${vipStatus === 'vip_plus' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
          onClick={() => handlePurchaseClick('vip_plus')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP+</h4>
            {vipStatus === 'vip_plus' && <Check size={16} className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-2">პრემიუმ განცხადება</p>
          <p className="font-bold">5 ლარი / დღე</p>
        </div>
        
        {/* SUPER VIP */}
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${vipStatus === 'super_vip' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
          onClick={() => handlePurchaseClick('super_vip')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">SUPER VIP</h4>
            {vipStatus === 'super_vip' && <Check size={16} className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-2">მაქსიმალური გამოჩენა</p>
          <p className="font-bold">7 ლარი / დღე</p>
        </div>
      </div>
      
      {/* Additional Services - Independent of VIP status */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">დამატებითი სერვისები</h4>
        <div className="space-y-4">
          {/* Color Highlighting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Paintbrush size={16} className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium">ფერის გამოყოფა</p>
                <p className="text-xs text-gray-500">თქვენი განცხადება გამოირჩევა ფერადი ფონით</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">1 დღე 0.5 ლარი</span>
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
              <RefreshCw size={16} className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium">ავტომატური განახლება</p>
                <p className="text-xs text-gray-500">განცხადება ავტომატურად განახლდება ყოველ 24 საათში</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">1 დღე 0.5 ლარი</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoRenewal}
                  onChange={(e) => handleAutoRenewalChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* VIP Status Benefits */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">VIP სტატუსის უპირატესობები</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getVipStatusFeatures(vipStatus).map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-0.5" />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ფუნქცია VIP სტატუსის მახასიათებლების მისაღებად
const getVipStatusFeatures = (status: VipStatus): string[] => {
  const baseFeatures = [
    'განცხადების განთავსება',
    'ძებნის შედეგებში ჩვენება',
    'მყიდველებთან დაკავშირება'
  ];
  
  if (status === 'none') return baseFeatures;
  
  const vipFeatures = [
    ...baseFeatures,
    'სიის თავში გამოჩენა',
    'მეტი დათვალიერება',
    'გამოჩენა VIP ნაწილების სექციაში'
  ];
  
  if (status === 'vip') return vipFeatures;
  
  const vipPlusFeatures = [
    ...vipFeatures,
    'პრიორიტეტული პოზიცია VIP სექციაში',
    'გამოჩენა მთავარ გვერდზე',
    'გაზრდილი ინტერესი მყიდველებისგან'
  ];
  
  if (status === 'vip_plus') return vipPlusFeatures;
  
  // Super VIP features
  return [
    ...vipPlusFeatures,
    'მაქსიმალური გამოჩენა ყველა სექციაში',
    'პრიორიტეტული პოზიცია მთავარ გვერდზე',
    'მაქსიმალური ყურადღება მყიდველებისგან'
  ];
};

export default VIPStatus;
