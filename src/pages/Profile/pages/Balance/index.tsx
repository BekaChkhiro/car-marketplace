import React, { useState, useEffect } from 'react';
import { TransactionHistory } from './components';
import balanceService from '../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { Button } from '../../../../components/ui';
import { PlusCircle, RefreshCw, ChevronDown, ChevronUp, CreditCard, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';



// Bank option interface
interface BankOption {
  id: string;
  name: string;
  logoUrl: string;
}

const BalancePage: React.FC = () => {
  const { t } = useTranslation(['profile', 'common', 'transaction']);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState<number>(0);
  const [addAmount, setAddAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnlineLoading, setIsOnlineLoading] = useState<boolean>(false);
  const [showTransactions, setShowTransactions] = useState<boolean>(true);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [showBankOptions, setShowBankOptions] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>('flitt');
  
  // Available bank options
  const bankOptions: BankOption[] = [
    { 
      id: 'flitt', 
      name: 'Flitt', 
      logoUrl: 'https://www.fin.ge/uploads/articles/file/Flitt_Logo.webp'
    },
    { 
      id: 'bog', 
      name: t('profile:balance.bankOfGeorgia', 'Bank of Georgia'), 
      logoUrl: 'https://bog.ge/img/xlogo.svg.pagespeed.ic.KR-zg_zuDw.webp'
    },
    { 
      id: 'tbc', 
      name: 'TBC Bank', 
      logoUrl: 'https://www.tbcbank.ge/web/static/media/tbc.c89cbb5a.svg'
    }
  ];

  // Check for query parameters on component mount for payment completion
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('status');
    const orderId = queryParams.get('orderId');
    const errorParam = queryParams.get('error');
    const provider = queryParams.get('provider') || 'online';
    const isBogPayment = provider === 'bog';

    if (orderId) {
      if (paymentStatus === 'success') {
        // Different message for Bank of Georgia payments
        if (isBogPayment) {
          toast.success(t('profile:balance.bogPaymentSuccess', 'საქართველოს ბანკის გადახდა წარმატებით დასრულდა'));
        } else {
          toast.success(t('profile:balance.onlinePaymentSuccess', 'ონლაინ გადახდა წარმატებით დასრულდა'));
        }
        
        // Refresh balance
        fetchBalance();
        
        // Clear query params
        navigate('/profile/balance', { replace: true });
      } else if (paymentStatus === 'failed') {
        if (isBogPayment) {
          toast.error(t('profile:balance.bogPaymentFailed', 'საქართველოს ბანკის გადახდა ვერ დასრულდა'));
        } else {
          toast.error(t('profile:balance.onlinePaymentFailed', 'ონლაინ გადახდა ვერ დასრულდა'));
        }
        
        // Clear query params
        navigate('/profile/balance', { replace: true });
      } else if (paymentStatus === 'pending') {
        setPaymentProcessing(true);
        // Show a toast that we're waiting for payment confirmation
        toast.loading(
          isBogPayment 
            ? t('profile:balance.waitingForBogPayment', 'ველოდებით საქართველოს ბანკის გადახდის დასტურს...')
            : t('profile:balance.waitingForPayment', 'ველოდებით გადახდის დასტურს...'), 
          { duration: 8000 }
        );
        
        // Check for payment completion a few times
        const checkPaymentStatus = async () => {
          try {
            // Check if transaction is completed
            const isComplete = await balanceService.checkPaymentStatus(orderId);
            if (isComplete) {
              toast.success(
                isBogPayment
                  ? t('profile:balance.bogPaymentProcessed', 'საქართველოს ბანკის გადახდა დამუშავებულია')
                  : t('profile:balance.paymentProcessed', 'გადახდა დამუშავებულია')
              );
              await fetchBalance();
              setPaymentProcessing(false);
              navigate('/profile/balance', { replace: true });
              return true;
            }
            return false;
          } catch (error) {
            console.error('Error checking payment status:', error);
            return false;
          }
        };
        
        // Try checking a few times with increasing intervals
        setTimeout(async () => {
          if (await checkPaymentStatus()) return;
          
          setTimeout(async () => {
            if (await checkPaymentStatus()) return;
            
            setTimeout(async () => {
              await checkPaymentStatus();
              // Clear processing state even if not successful after final check
              setPaymentProcessing(false);
              navigate('/profile/balance', { replace: true });
            }, 5000); // Third check after 5 more seconds
          }, 3000); // Second check after 3 seconds
        }, 2000); // First check after 2 seconds
      } else {
        // Unknown payment status
        setPaymentProcessing(true);
        toast.loading(t('profile:balance.checkingPayment', 'ვამოწმებთ გადახდის სტატუსს...'), { duration: 3000 });
        
        // After a brief delay, refresh and stop processing
        setTimeout(() => {
          fetchBalance();
          setPaymentProcessing(false);
          navigate('/profile/balance', { replace: true });
        }, 3000);
      }
    }
    
    if (errorParam) {
      toast.error(t('profile:balance.paymentError', 'გადახდის დამუშავებისას მოხდა შეცდომა'));
      // Clear query params
      navigate('/profile/balance', { replace: true });
    }
  }, [location.search, navigate, t]);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const balance = await balanceService.getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error(t('profile:balance.updateFailed', 'ბალანსის მიღება ვერ მოხერხდა'));
    }
  };

  const handleAddFunds = async () => {
    if (addAmount <= 0) {
      toast.error(t('profile:balance.invalidAmount', 'გთხოვთ შეიყვანოთ სწორი თანხა'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await balanceService.addFunds(addAmount);
      setBalance(response.balance);
      toast.success(t('profile:balance.fundsAdded', 'თანხა წარმატებით დაემატა'));
      setAddAmount(10);      // Transaction completed successfully
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error(t('profile:balance.addFailed', 'თანხის დამატება ვერ მოხერხდა'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // New method for online payment with bank selection
  const handleOnlinePayment = async () => {
    if (addAmount <= 0) {
      toast.error(t('profile:balance.invalidAmount', 'გთხოვთ შეიყვანოთ სწორი თანხა'));
      return;
    }
    
    setIsOnlineLoading(true);
    try {
      // Pass the selectedBank to the service
      const response = await balanceService.addFundsOnline(addAmount, selectedBank);
      
      if (response.success && response.paymentUrl) {
        // Show which bank is being used
        const bankName = bankOptions.find(b => b.id === selectedBank)?.name || 'Online';
        toast.success(
          t('profile:balance.redirectingToBank', { defaultValue: 'მიმდინარეობს გადამისამართება {{bank}}-ზე...', bank: bankName }),
          { duration: 2000 }
        );
        
        // Redirect to payment page
        setTimeout(() => {
          window.location.href = response.paymentUrl;
        }, 500);
        // Don't reset loading state as we're redirecting away
      } else {
        toast.error(t('profile:balance.paymentInitFailed', 'გადახდის ინიციალიზაცია ვერ მოხერხდა'));
        setIsOnlineLoading(false);
      }
    } catch (error) {
      console.error('Error initializing online payment:', error);
      toast.error(t('profile:balance.paymentInitFailed', 'გადახდის ინიციალიზაცია ვერ მოხერხდა'));
      setIsOnlineLoading(false);
    }
  };
  
  // Toggle bank selection options
  const toggleBankOptions = () => {
    setShowBankOptions(!showBankOptions);
  };
  
  // Select a bank for payment
  const selectBank = (bankId: string) => {
    setSelectedBank(bankId);
    setShowBankOptions(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 animate-fade-in max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-dark mb-4 sm:mb-6">{t('profile:balance.title')}</h1>
      
      {/* Balance Card - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-green-lighter">
        {/* Balance Display - Always Visible */}        <div className="flex flex-col sm:flex-row items-start">
          <div className="w-full text-left mb-3 sm:mb-0">
            <h2 className="text-base sm:text-lg font-medium text-text-dark">{t('profile:balance.currentBalance')}</h2>
            <div className="mt-2">
              <div className="bg-green-light px-4 py-2 rounded-md inline-flex">
                <span className="text-xl sm:text-2xl font-medium text-primary">{balance} GEL</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-3">{t('transaction:yourCurrentBalance')}</p>
          </div>
        </div>
          {/* Add Funds Section - Always visible on mobile and desktop */}
        <div className="border-t-2 sm:border-t border-green-lighter mt-6 sm:mt-4 pt-6 sm:pt-4">
          <h3 className="text-base font-medium mb-3 text-text-dark text-left">
            {t('profile:balance.addFunds')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="border border-green-lighter rounded-md px-3 py-3 sm:py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left"
                min="1"
                placeholder={t('profile:balance.amount', 'თანხა')}
                inputMode="numeric" // Better numeric keyboard on mobile
                disabled={paymentProcessing}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">GEL</span>
            </div>
            
            {/* Bank selection */}
            <div className="relative w-full sm:w-48">
              <div 
                onClick={toggleBankOptions} 
                className="cursor-pointer border border-green-lighter bg-white rounded-md py-3 sm:py-2 px-3 flex justify-between items-center"
                aria-haspopup="listbox"
                aria-expanded={showBankOptions}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={bankOptions.find(b => b.id === selectedBank)?.logoUrl || ''}
                      alt={bankOptions.find(b => b.id === selectedBank)?.name || 'Bank'}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-sm truncate">
                    {bankOptions.find(b => b.id === selectedBank)?.name || 'Bank'}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              
              {showBankOptions && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-green-lighter rounded-md shadow-lg py-1">
                  {bankOptions.map(bank => (
                    <div
                      key={bank.id}
                      onClick={() => selectBank(bank.id)}
                      className="px-3 py-2 flex items-center hover:bg-green-lightest cursor-pointer"
                    >
                      <div className="w-6 h-6 mr-2 flex items-center justify-center overflow-hidden">
                        <img 
                          src={bank.logoUrl}
                          alt={bank.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className="text-sm">{bank.name}</span>
                      {selectedBank === bank.id && (
                        <Check size={14} className="ml-auto text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Payment button */}
            <div className="w-full sm:w-auto">
              {/* Online payment with selected bank */}
              <Button
                onClick={handleOnlinePayment}
                disabled={isOnlineLoading || paymentProcessing}
                variant="primary"
                className="py-3 sm:py-2.5 w-full"
              >
                {isOnlineLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    {t('common:loading')}
                  </>
                ) : (
                  <>
                    <CreditCard size={16} className="mr-2" />
                    {t('profile:balance.payOnline', 'ონლაინ გადახდა')}
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Payment processing indicator */}
          {paymentProcessing && (
            <div className="mt-3 text-sm text-primary flex items-center">
              <RefreshCw size={14} className="mr-2 animate-spin" />
              {t('profile:balance.processingPayment', 'მიმდინარეობს გადახდის დამუშავება...')}
            </div>
          )}
        </div>
      </div>
      
      {/* Transactions Card - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-green-lighter">
        <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-green-lighter">
          <h2 className="text-base sm:text-lg font-medium text-text-dark">{t('profile:balance.transactions')}</h2>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-primary text-xs sm:text-sm hover:underline focus:outline-none flex items-center"
          >
            {showTransactions ? (
              <>
                {t('transaction:hide')} <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                {t('common:show')} <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
        
        {showTransactions && <TransactionHistory />}
      </div>
    </div>
  );
};

export default BalancePage;