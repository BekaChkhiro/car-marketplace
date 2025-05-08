import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, AlertCircle, ChevronRight } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';
import { useAuth } from '../../../../context/AuthContext';
import balanceService from '../../../../api/services/balanceService';
import { Car } from '../../../../api/types/car.types';
import './styles.css';

interface VipStatusPurchaseProps {
  car: Car;
  onSuccess?: () => void;
}

type VipPackage = {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  color: string;
  bgColor: string;
  borderColor: string;
};

const VipStatusPurchase: React.FC<VipStatusPurchaseProps> = ({ car, onSuccess }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  
  const vipPackages: VipPackage[] = [
    {
      id: 'vip',
      name: 'VIP',
      description: 'განცხადების გამოჩენა VIP სიაში',
      pricePerDay: 2.5,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'vip_plus',
      name: 'VIP+',
      description: 'განცხადების გამოჩენა VIP+ სიაში და მთავარ გვერდზე',
      pricePerDay: 5,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'super_vip',
      name: 'SUPER VIP',
      description: 'განცხადების გამოჩენა ყველა სიაში და მთავარ გვერდზე',
      pricePerDay: 8,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];
  
  const dayOptions = [3, 7, 14, 30];
  
  // Fetch user balance if authenticated
  useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const userBalance = await balanceService.getBalance();
          setBalance(userBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBalance();
  }, [isAuthenticated]);
  
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  const handleDaysSelect = (days: number) => {
    setSelectedDays(days);
  };
  
  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    
    const pkg = vipPackages.find(p => p.id === selectedPackage);
    if (!pkg) return 0;
    
    return pkg.pricePerDay * selectedDays;
  };
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      showToast('გთხოვთ გაიაროთ ავტორიზაცია', 'error');
      navigate('/login');
      return;
    }
    
    if (!selectedPackage) {
      showToast('გთხოვთ აირჩიოთ VIP პაკეტი', 'error');
      return;
    }
    
    const totalPrice = calculateTotalPrice();
    
    if (balance !== null && balance < totalPrice) {
      showToast('არასაკმარისი ბალანსი. გთხოვთ შეავსოთ ბალანსი', 'error');
      navigate('/profile/balance');
      return;
    }
    
    try {
      setPurchaseInProgress(true);
      
      const result = await balanceService.purchaseVipStatus(
        car.id,
        selectedPackage as 'vip' | 'vip_plus' | 'super_vip',
        selectedDays
      );
      
      if (result.success) {
        setBalance(result.newBalance);
        showToast(result.message, 'success');
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        if (result.requiredAmount && result.currentBalance) {
          showToast(`არასაკმარისი ბალანსი. საჭიროა ${result.requiredAmount}, თქვენი ბალანსია ${result.currentBalance}`, 'error');
          navigate('/profile/balance');
        } else {
          showToast(result.message, 'error');
        }
      }
    } catch (error: any) {
      console.error('Error purchasing VIP status:', error);
      showToast(error.message || 'შეცდომა VIP სტატუსის შეძენისას', 'error');
    } finally {
      setPurchaseInProgress(false);
    }
  };
  
  // If the car already has VIP status, don't show the purchase component
  if (car.vip_status && car.vip_status !== 'none') {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden mb-4">
      <div className="bg-green-50 p-4 border-b border-green-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
          VIP სტატუსის შეძენა
        </h2>
      </div>
      
      <div className="p-4">
        {!isAuthenticated ? (
          <div className="text-center p-4">
            <p className="mb-3 text-gray-600">VIP სტატუსის შესაძენად გაიარეთ ავტორიზაცია</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm"
            >
              ავტორიზაცია
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-center p-4">
                <p>იტვირთება...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">თქვენი ბალანსი: <span className="font-bold text-primary">{balance} ₾</span></p>
                  <p className="text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    თუ ბალანსი არ არის საკმარისი, შეგიძლიათ <a href="/profile/balance" className="text-primary hover:underline">შეავსოთ ბალანსი</a>
                  </p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">აირჩიეთ VIP პაკეტი:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {vipPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedPackage === pkg.id 
                            ? `${pkg.bgColor} border-2 ${pkg.borderColor} shadow-sm` 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        <div className={`font-bold mb-1 flex items-center ${pkg.color}`}>
                          <Star className="w-4 h-4 mr-1" fill="currentColor" />
                          {pkg.name}
                        </div>
                        <p className="text-xs text-gray-600">{pkg.description}</p>
                        <p className="text-sm font-medium mt-1">{pkg.pricePerDay} ₾/დღეში</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">აირჩიეთ დღეების რაოდენობა:</h3>
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map((days) => (
                      <button
                        key={days}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          selectedDays === days 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleDaysSelect(days)}
                      >
                        {days} დღე
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedPackage && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ჯამური ღირებულება:</span>
                      <span className="font-bold text-primary text-lg">{calculateTotalPrice()} ₾</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handlePurchase}
                  disabled={!selectedPackage || purchaseInProgress || (balance !== null && balance < calculateTotalPrice())}
                  className={`w-full py-3 px-4 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 ${
                    !selectedPackage || purchaseInProgress || (balance !== null && balance < calculateTotalPrice())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-green-600 text-white transition-colors'
                  }`}
                >
                  {purchaseInProgress ? 'მიმდინარეობს...' : 'VIP სტატუსის შეძენა'}
                  {!purchaseInProgress && <ChevronRight className="w-5 h-5" />}
                </button>
                
                {balance !== null && balance < calculateTotalPrice() && selectedPackage && (
                  <div className="mt-2 text-center">
                    <p className="text-red-500 text-sm">
                      არასაკმარისი ბალანსი. გესაჭიროებათ {calculateTotalPrice() - balance} ₾-ით მეტი.
                    </p>
                    <button
                      onClick={() => navigate('/profile/balance')}
                      className="mt-2 text-primary hover:underline text-sm"
                    >
                      ბალანსის შევსება
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VipStatusPurchase;
