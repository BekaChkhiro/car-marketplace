import React, { useState, useEffect, useRef } from 'react';
import { TransactionHistory } from './components';
import balanceService from '../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { Button } from '../../../../components/ui';
import { PlusCircle, RefreshCw } from 'lucide-react';

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
  const { t } = useTranslation();
  const [balance, setBalance] = useState<number>(0);
  const [addAmount, setAddAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTransactions, setShowTransactions] = useState<boolean>(true); // Always show transactions by default
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState<number>(0);
  const transactionHistoryRef = useRef<{ fetchTransactions: () => Promise<void> }>(null)

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
      setAddAmount(10);
      
      // Trigger transaction history refresh after successful payment
      // Using both methods to ensure compatibility
      setTransactionRefreshTrigger(prev => prev + 1);
      if (transactionHistoryRef.current) {
        transactionHistoryRef.current.fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error(t('error.addFunds'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-xl font-semibold text-gray-dark mb-6">{t('balance.title')}</h1>
      
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-green-lighter">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-lg font-medium text-text-dark">{t('balance.currentBalance')}</h2>
            <p className="text-gray-600 text-sm mt-1">თქვენი მიმდინარე ბალანსი</p>
          </div>
          <div className="mt-3 md:mt-0 bg-green-light px-4 py-2 rounded-md">
            <span className="text-xl font-medium text-primary">{balance} GEL</span>
          </div>
        </div>
        
        <div className="border-t border-green-lighter mt-5 pt-5">
          <h3 className="text-base font-medium mb-4 text-text-dark">
            {t('balance.addFunds')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="border border-green-lighter rounded-md px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                min="1"
                placeholder="თანხა"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">GEL</span>
            </div>
            <Button
              onClick={handleAddFunds}
              disabled={isLoading}
              variant="primary"
              className="py-2"
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
      
      {/* Transactions Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-lighter">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-green-lighter">
          <h2 className="text-lg font-medium text-text-dark">{t('balance.transactions')}</h2>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-primary text-sm hover:underline focus:outline-none"
          >
            {showTransactions ? t('common.hide') : t('common.show')}
          </button>
        </div>
        
        {showTransactions && <TransactionHistory ref={transactionHistoryRef} refreshTrigger={transactionRefreshTrigger} />}
      </div>
    </div>
  );
};

export default BalancePage;
