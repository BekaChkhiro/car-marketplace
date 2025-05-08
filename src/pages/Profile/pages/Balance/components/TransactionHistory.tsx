import React, { useState, useEffect } from 'react';
import balanceService, { Transaction } from '../../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { RefreshCw, ArrowUpCircle, ArrowDownCircle, CreditCard } from 'lucide-react';

// ტრანსლაციისთვის დროებითი ფუნქცია
const useTranslation = () => {
  return {
    t: (key: string) => {
      // დროებითი ტრანსლაციების ობიექტი
      const translations: {[key: string]: string} = {
        'common.loading': 'იტვირთება...',
        'transaction.deposit': 'შევსება',
        'transaction.withdrawal': 'გატანა',
        'transaction.vipPurchase': 'VIP შეძენა',
        'transaction.completed': 'დასრულებული',
        'transaction.pending': 'მიმდინარე',
        'transaction.failed': 'წარუმატებელი',
        'transaction.noTransactions': 'ტრანზაქციები არ მოიძებნა',
        'transaction.date': 'თარიღი',
        'transaction.type': 'ტიპი',
        'transaction.amount': 'თანხა',
        'transaction.description': 'აღწერა',
        'transaction.status': 'სტატუსი',
        'error.fetchTransactions': 'ტრანზაქციების ისტორიის მიღება ვერ მოხერხდა'
      };
      return translations[key] || key;
    }
  };
};

// ფორმატირების ფუნქცია თარიღისთვის
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const TransactionHistory: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTransactions();
    // We'll only use the timeout for development/testing purposes
    // and will remove it in production to ensure real data is shown
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching transaction history...');
      // The balanceService now handles fallback internally
      const data = await balanceService.getTransactionHistory();
      console.log('Transaction data received:', data);
      
      // Set the transactions regardless of whether they're real or mock
      // The service will return mock data as a fallback if needed
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(t('error.fetchTransactions'));
    } finally {
      setIsLoading(false);
    }
  };

  // Removed getMockTransactions as it's now handled in the balanceService

  const getTransactionTypeLabel = (type: string): string => {
    switch (type) {
      case 'deposit':
        return t('transaction.deposit');
      case 'withdrawal':
        return t('transaction.withdrawal');
      case 'vip_purchase':
        return t('transaction.vipPurchase');
      // Handle potential cases from the backend
      case 'transaction_type':
        return t('transaction.deposit');
      default:
        return type;
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle size={18} className="text-success mr-2" />;
      case 'withdrawal':
        return <ArrowDownCircle size={18} className="text-error mr-2" />;
      case 'vip_purchase':
        return <CreditCard size={18} className="text-info mr-2" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return t('transaction.completed');
      case 'pending':
        return t('transaction.pending');
      case 'failed':
        return t('transaction.failed');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-light/30 text-success';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'failed':
        return 'bg-red-100 text-error';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getAmountColor = (amount: number): string => {
    return amount >= 0 ? 'text-success' : 'text-error';
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <RefreshCw size={20} className="animate-spin text-primary inline-block mr-2" />
        <span className="text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  // Show empty state when no transactions are found
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 border-t border-green-lighter mt-2">
        <p className="text-gray-600 mt-4">{t('transaction.noTransactions')}</p>
        <p className="text-gray-500 text-sm mt-1">ტრანზაქციები გამოჩნდება ბალანსის შევსების შემდეგ</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-green-light/20">
          <tr>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-700">{t('transaction.date')}</th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-700">{t('transaction.type')}</th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-700">{t('transaction.amount')}</th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-700">{t('transaction.description')}</th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-700">{t('transaction.status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-lighter">
          {transactions.map((transaction, index) => (
            <tr key={transaction.id} className={`hover:bg-green-light/10 ${index % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
              <td className="py-2 px-3 text-sm text-gray-600">
                {formatDate(new Date(transaction.created_at))}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                <div className="flex items-center">
                  {getTransactionTypeIcon(transaction.type)}
                  {getTransactionTypeLabel(transaction.type)}
                </div>
              </td>
              <td className={`py-2 px-3 text-sm font-medium ${getAmountColor(transaction.amount)}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount} GEL
              </td>
              <td className="py-2 px-3 text-sm text-gray-600">
                {transaction.description}
              </td>
              <td className="py-2 px-3 text-sm">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)}`}>
                  {getStatusLabel(transaction.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
