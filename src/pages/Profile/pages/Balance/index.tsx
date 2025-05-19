import React, { useState, useEffect } from 'react';
import { TransactionHistory } from './components';
import balanceService from '../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { Button } from '../../../../components/ui';
import { PlusCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// ტრანსლაციისთვის დროებითი ფუნქცია
const useTranslation = () => {
  return {
    t: (key: string) => {
      // დროებითი ტრანსლაციების ობიექტი
      const translations: {[key: string]: string} = {
        'common.loading': 'იტვირთება...',
        'balance.title': 'ჩემი ბალანსი',
        'balance.currentBalance': 'მიმდინარე ბალანსი',
        'balance.addFunds': 'თანხის დამატება',
        'balance.add': 'დამატება',
        'balance.transactions': 'ტრანზაქციების ისტორია',
        'balance.invalidAmount': 'გთხოვთ შეიყვანოთ სწორი თანხა',
        'balance.fundsAdded': 'თანხა წარმატებით დაემატა',
        'common.show': 'ჩვენება',
        'common.hide': 'დამალვა',
        'error.fetchBalance': 'ბალანსის მიღება ვერ მოხერხდა',
        'error.addFunds': 'თანხის დამატება ვერ მოხერხდა'
      };
      return translations[key] || key;
    }
  };
};

const BalancePage: React.FC = () => {
  const { t } = useTranslation();  const [balance, setBalance] = useState<number>(0);
  const [addAmount, setAddAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTransactions, setShowTransactions] = useState<boolean>(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const balance = await balanceService.getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error(t('error.fetchBalance'));
    }
  };

  const handleAddFunds = async () => {
    if (addAmount <= 0) {
      toast.error(t('balance.invalidAmount'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await balanceService.addFunds(addAmount);
      setBalance(response.balance);
      toast.success(t('balance.fundsAdded'));
      setAddAmount(10);      // Transaction completed successfully
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error(t('error.addFunds'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 animate-fade-in max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-dark mb-4 sm:mb-6">{t('balance.title')}</h1>
      
      {/* Balance Card - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-green-lighter">
        {/* Balance Display - Always Visible */}        <div className="flex flex-col sm:flex-row items-start">
          <div className="w-full text-left mb-3 sm:mb-0">
            <h2 className="text-base sm:text-lg font-medium text-text-dark">{t('balance.currentBalance')}</h2>
            <div className="mt-2">
              <div className="bg-green-light px-4 py-2 rounded-md inline-flex">
                <span className="text-xl sm:text-2xl font-medium text-primary">{balance} GEL</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-3">თქვენი მიმდინარე ბალანსი</p>
          </div>
        </div>
          {/* Add Funds Section - Always visible on mobile and desktop */}
        <div className="border-t-2 sm:border-t border-green-lighter mt-6 sm:mt-4 pt-6 sm:pt-4"><h3 className="text-base font-medium mb-3 text-text-dark text-left">
            {t('balance.addFunds')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="border border-green-lighter rounded-md px-3 py-3 sm:py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left"
                min="1"
                placeholder="თანხა"
                inputMode="numeric" // Better numeric keyboard on mobile
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">GEL</span>
            </div>
            <Button
              onClick={handleAddFunds}
              disabled={isLoading}
              variant="primary"
              className="py-3 sm:py-2.5 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <PlusCircle size={16} className="mr-2" />
                  {t('balance.add')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Transactions Card - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-green-lighter">
        <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-green-lighter">
          <h2 className="text-base sm:text-lg font-medium text-text-dark">{t('balance.transactions')}</h2>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-primary text-xs sm:text-sm hover:underline focus:outline-none flex items-center"
          >
            {showTransactions ? (
              <>
                {t('common.hide')} <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                {t('common.show')} <ChevronDown size={16} className="ml-1" />
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