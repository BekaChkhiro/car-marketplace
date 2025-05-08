import React, { useState, useEffect } from 'react';
import { Crown, X, Check } from 'lucide-react';
import { Car } from '../../../../../api/types/car.types';
import { VipStatus } from '../../../../../api/services/vipService';
import balanceService from '../../../../../api/services/balanceService';
import { useToast } from '../../../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

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
  const [selectedStatus, setSelectedStatus] = useState<VipStatus>('none');
  const [daysCount, setDaysCount] = useState<number>(7); // დეფოლტად 7 დღე
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { showToast } = useToast();

  // VIP პაკეტების ფასები დღეში
  const vipPricePerDay: Record<Exclude<VipStatus, 'none'>, number> = {
    vip: 2.5,
    vip_plus: 5,
    super_vip: 8
  };
  
  // VIP პაკეტების აღწერები
  const vipStatusDescriptions: Record<Exclude<VipStatus, 'none'>, string> = {
    vip: 'სტანდარტული',
    vip_plus: 'გაძლიერებული',
    super_vip: 'პრემიუმი'
  };
  
  // VIP პაკეტების სახელები
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
    
    // ვრწმუნდებით რომ ფასის გამოთვლისას ვიყენებთ ზუსტად იმ რაოდენობის დღეებს, რაც მომხმარებელმა აირჩია
    // ვრწმუნდებით რომ გამოვიყენოთ რიცხვით ტიპებს გამრავლებისთვის
    const pricePerDay = parseFloat(vipPricePerDay[typedStatus].toString());
    const daysNum = parseInt(validDays.toString(), 10);
    const price = pricePerDay * daysNum;
    
    console.log(`FIXED PRICE CALCULATION:`);
    console.log(`დღიური ფასი: ${pricePerDay}, ტიპი: ${typeof pricePerDay}`);
    console.log(`დღეები: ${daysNum}, ტიპი: ${typeof daysNum}`);
    console.log(`ჯამური ფასი: ${price} = ${pricePerDay} * ${daysNum}`);
    
    return price;
  };
  
  // VIP სტატუსის ვადის გასვლის თარიღის გამოთვლა
  const calculateExpirationDate = (days: number): string => {
    // ვამოწმოთ, რომ days არის მთელი რიცხვი და არა ნული
    const validDays = Math.max(1, Math.round(days));
    console.log(`ვადის გასვლის თარიღის გამოთვლა ${validDays} დღისთვის`);
    
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
      
      // მივიღოთ მომხმარებლის ბალანსი
      fetchUserBalance();
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
      setError(`არასაკმარისი ბალანსი. გესაჭიროებათ ${totalPrice} ₾, თქვენი ბალანსია ${userBalance} ₾`);
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
      
      console.log('FIXED VIP PURCHASE REQUEST:');
      console.log(`სტატუსი: ${selectedStatus}`);
      console.log(`მანქანის ID: ${car.id}`);
      console.log(`დღეები (ორიგინალი): ${daysCount}, ტიპი: ${typeof daysCount}`);
      console.log(`დღეები (გადაყვანილი): ${daysInt}, ტიპი: ${typeof daysInt}`);
      console.log(`საბოლოო დღეები: ${finalDays}, ტიპი: ${typeof finalDays}`);
      
      // გამოვთვალოთ ჯამური ფასი
      const calculatedPrice = calculateTotalPrice(selectedStatus, finalDays);
      console.log(`ჯამური ფასი: ${calculatedPrice}`);
      
      // გამოვიყენოთ balanceService-ის purchaseVipStatus მეთოდი
      const result = await balanceService.purchaseVipStatus(
        car.id,
        selectedStatus as 'vip' | 'vip_plus' | 'super_vip',
        finalDays // ვრწმუნდებით რომ გადავცემთ მთელ რიცხვს
      );
      
      if (result.success) {
        console.log('VIP სტატუსი წარმატებით შეძენილია:', result);
        setUserBalance(result.newBalance); // განვაახლოთ ბალანსი
        
        // გამოვიძახოთ სტატუსის განახლების callback
        onStatusUpdate();
        showToast(result.message || 'VIP სტატუსი წარმატებით შეძენილია', 'success');
        onClose();
        
        // დავაყოვნოთ 500ms და გადავტვირთოთ გვერდი
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // თუ არასაკმარისი ბალანსია
        if (result.requiredAmount && result.currentBalance) {
          setError(`არასაკმარისი ბალანსი. გესაჭიროებათ ${result.requiredAmount} ₾, თქვენი ბალანსია ${result.currentBalance} ₾`);
        } else {
          setError(result.message || 'შეცდომა VIP სტატუსის შეძენისას');
        }
      }
    } catch (err: any) {
      setError(err.message || 'შეცდომა VIP სტატუსის შეძენისას');
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
  };
  
  // დღეების რაოდენობის ცვლილება
  const handleDaysChange = (days: number) => {
    // დავრწმუნდეთ, რომ days არის მთელი რიცხვი და არა ნული
    const validDays = Math.max(1, Math.round(days));
    console.log(`handleDaysChange: original days=${days}, validDays=${validDays}`);
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
            VIP სტატუსის შეძენა
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
              <label className="block text-gray-700 font-medium mb-2">VIP სტატუსი</label>
              <div className="grid grid-cols-3 gap-3">
                {(['vip', 'vip_plus', 'super_vip'] as Array<Exclude<VipStatus, 'none'>>).map(status => (
                  <VipStatusOption
                    key={status}
                    status={status}
                    selectedStatus={selectedStatus}
                    price={vipPricePerDay[status]}
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
                გაუქმება
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${userBalance !== null && userBalance < totalPrice ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-green-600 transition-colors'}`}
                disabled={loading || (userBalance !== null && userBalance < totalPrice)}
              >
                {loading ? 'მიმდინარეობს...' : 'VIP სტატუსის შეძენა'}
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
