import React, { useState, useEffect, useRef } from 'react';
import balanceService, { AdminTransaction } from '../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { 
  RefreshCw, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  CreditCard, 
  Search, 
  Calendar, 
  Filter, 
  X, 
  Check,

  UserCircle
} from 'lucide-react';

// ფორმატირების ფუნქცია თარიღისთვის
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// AdminTransaction interface is now imported from balanceService

// Keyframe animation for dropdown menus
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`;

const TransactionList: React.FC = () => {
  const { t } = useTranslation('admin');
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Date filter states
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);
  
  // General filter states
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  
  // Refs for closing dropdowns when clicking outside
  const dateFilterRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  // Close the dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setShowDateFilter(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get all transactions for admin view using the new admin method
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Using the admin-specific transaction history method
      const adminTransactionData = await balanceService.getAdminTransactions();
      setTransactions(adminTransactionData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(t('transactions.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionTypeLabel = (type: string): string => {
    switch (type) {
      case 'deposit':
        return t('transactions.deposit');
      case 'vip_purchase':
        return t('transactions.vipPurchase');
      default:
        return type;
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle size={18} className="text-green-600" />;
      case 'vip_purchase':
        return <CreditCard size={18} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return t('transactions.completed');
      case 'pending':
        return t('transactions.pending');
      case 'failed':
        return t('transactions.failed');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount: number | string): string => {
    // თუ amount სტრიქონია, გადავაკონვერტიროთ რიცხვად
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numericAmount >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
  };

  // Apply all filters
  const filteredTransactions = transactions.filter(transaction => {
    // Only include deposit transactions
    const isDepositType = transaction.type === 'deposit';
    
    // Check if matches search query
    const matchesSearch = searchQuery === '' || 
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTransactionTypeLabel(transaction.type).toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if matches date range
    const matchesDateRange = !isDateFilterActive || isDateInRange(transaction.created_at);
    
    // Check if matches status filter
    const matchesStatusFilter = selectedStatuses.length === 0 || selectedStatuses.includes(transaction.status);
    
    return isDepositType && matchesSearch && matchesDateRange && matchesStatusFilter;
  });

  // Helper function to check if a date is within the selected range
  const isDateInRange = (dateString: string): boolean => {
    if (!startDate && !endDate) {
      return true;
    }
    
    const transactionDate = new Date(dateString);
    
    if (startDate && !endDate) {
      const start = new Date(startDate);
      // Set start time to beginning of day
      start.setHours(0, 0, 0, 0);
      return transactionDate >= start;
    }
    
    if (!startDate && endDate) {
      const end = new Date(endDate);
      // Set end time to end of day
      end.setHours(23, 59, 59, 999);
      return transactionDate <= end;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set start time to beginning of day and end time to end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return transactionDate >= start && transactionDate <= end;
  };

  // Calculate pagination
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  // Date filter handlers
  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
    setShowFilter(false);
  };

  const applyDateFilter = () => {
    setIsDateFilterActive(true);
    setShowDateFilter(false);
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsDateFilterActive(false);
    setShowDateFilter(false);
  };

  // General filter handlers
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setShowDateFilter(false);
  };

  const toggleTypeFilter = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updatedTypes);
  };

  const toggleStatusFilter = (status: string) => {
    const updatedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(updatedStatuses);
  };

  const applyFilters = () => {
    setIsFilterActive(true);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setIsFilterActive(false);
    setShowFilter(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-green-lighter ">
      <style>{fadeInAnimation}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('transactions.history')}</h2>
        <button 
          onClick={fetchTransactions}
          className="text-primary p-2 rounded-full hover:bg-primary/10 transition-colors duration-300"
          title={t('transactions.refresh')}
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {/* Search box */}
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <input
            type="text"
            placeholder={t('transactions.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full py-2 pl-10 pr-4 border border-green-lighter rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Date filter */}
          <div className="relative">
            <button 
              onClick={toggleDateFilter}
              className={`flex items-center gap-2 py-2 px-4 border rounded-lg ${isDateFilterActive ? 'bg-primary/10 border-primary text-primary' : 'border-green-lighter'}`}
            >
              <Calendar size={18} />
              <span>{t('transactions.dateFilter')}</span>
              {isDateFilterActive && (
                <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center ml-1">
                  <Check size={14} />
                </div>
              )}
            </button>
            
            {showDateFilter && (
              <div 
                ref={dateFilterRef}
                className=" absolute left-0 sm:right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-72 animate-fadeIn"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('transactions.startDate')}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full py-2 px-3 border border-green-lighter rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('transactions.endDate')}</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full py-2 px-3 border border-green-lighter rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={clearDateFilter}
                      className="flex-1 py-2 px-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm"
                    >
                      {t('transactions.clear')}
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="flex-1 py-2 px-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 text-sm"
                    >
                      {t('transactions.applyFilter')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Type and status filter */}
          <div className="relative">
            <button 
              onClick={toggleFilter}
              className={`flex items-center gap-2 py-2 px-4 border rounded-lg ${isFilterActive ? 'bg-primary/10 border-primary text-primary' : 'border-green-lighter'}`}
            >
              <Filter size={18} />
              <span>{t('transactions.filter')}</span>
              {isFilterActive && selectedTypes.length + selectedStatuses.length > 0 && (
                <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center ml-1">
                  <span className="text-xs font-bold">{selectedTypes.length + selectedStatuses.length}</span>
                </div>
              )}
            </button>
            
            {showFilter && (
              <div 
                ref={filterRef}
                className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-72 animate-fadeIn"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('transactions.transactionType')}</h3>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes('deposit')}
                          onChange={() => toggleTypeFilter('deposit')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.deposit')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes('withdrawal')}
                          onChange={() => toggleTypeFilter('withdrawal')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.withdrawal')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes('vip_purchase')}
                          onChange={() => toggleTypeFilter('vip_purchase')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.vipPurchase')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('transactions.status')}</h3>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('completed')}
                          onChange={() => toggleStatusFilter('completed')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.completed')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('pending')}
                          onChange={() => toggleStatusFilter('pending')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.pending')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('failed')}
                          onChange={() => toggleStatusFilter('failed')}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm">{t('transactions.failed')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-2 px-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm"
                    >
                      {t('transactions.clear')}
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 py-2 px-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 text-sm"
                    >
                      {t('transactions.applyFilter')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>        {/* Transaction table */}      
      <div className="overflow-x-auto overflow-y-visible rounded-lg -mx-4 sm:mx-0">
        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-3 px-4 py-2">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <RefreshCw size={24} className="animate-spin mb-2" />
                <span>{t('transactions.loading')}</span>
              </div>
            </div>
          ) : currentTransactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              {t('transactions.noTransactionsFound')}
            </div>
          ) : (
            currentTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-1 sm:p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2 ">
                  <div className="flex items-center gap-2">
                    <UserCircle size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{transaction.user?.name}</p>
                      <p className="text-xs text-gray-500">{transaction.user?.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div>
                    <p className="text-gray-500">{t('transactions.date')}</p>
                    <p className="font-medium">{formatDate(new Date(transaction.created_at))}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('transactions.type')}</p>
                    <div className="flex items-center gap-1 ">
                      {getTransactionTypeIcon(transaction.type)}
                      <span>{getTransactionTypeLabel(transaction.type)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('transactions.amount')}</p>
                    <p className={getAmountColor(transaction.amount)}>
                      {typeof transaction.amount === 'string'
                        ? (parseFloat(transaction.amount) > 0 ? '+' : '') 
                        : (transaction.amount > 0 ? '+' : '')}
                      {transaction.amount} GEL
                    </p>
                  </div>
                  {transaction.description && (
                    <div className="col-span-1 sm:col-span-2 mt-1">
                      <p className="text-gray-500">{t('transactions.description')}</p>
                      <p className="text-gray-600">{transaction.description || '—'}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Desktop View - Table Layout */}
        <div className="min-w-[600px]">
          <table className="w-full text-left table-auto hidden md:table">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">ID</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">{t('transactions.user')}</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">{t('transactions.date')}</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">{t('transactions.type')}</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">{t('transactions.amount')}</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden lg:table-cell">{t('transactions.description')}</th>
                <th className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">{t('transactions.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <RefreshCw size={24} className="animate-spin mb-2" />
                      <span>{t('transactions.loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    {t('transactions.noTransactionsFound')}
                  </td>
                </tr>
              ) : (
                currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">{transaction.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserCircle size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{transaction.user?.name}</p>
                          <p className="text-xs text-gray-500">{transaction.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(new Date(transaction.created_at))}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTransactionTypeIcon(transaction.type)}
                        <span className="text-sm">{getTransactionTypeLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm whitespace-nowrap">
                      <span className={getAmountColor(transaction.amount)}>
                        {/* კონვერტირება რიცხვად შედარებისთვის */}
                        {typeof transaction.amount === 'string' 
                          ? (parseFloat(transaction.amount) > 0 ? '+' : '') 
                          : (transaction.amount > 0 ? '+' : '')}
                        {transaction.amount} GEL
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">
                      {transaction.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg mt-4">
        <div className="text-sm text-gray-600 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto mb-2 sm:mb-0">
          <span className="mb-2 sm:mb-0">{t('transactions.total')} {filteredTransactions.length} {t('transactions.transactions')}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('transactions.perPage')}</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-green-lighter rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`px-3 py-2 sm:py-1 border border-green-lighter rounded text-sm min-w-[70px] ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-light/10 active:bg-gray-100 text-gray-700'}`}
          >
            {t('transactions.previous')}
          </button>
          
          <div className="flex items-center gap-1">
            {/* Page number buttons */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers for better UX on different screen sizes
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (window.innerWidth < 640 && pageNumber === currentPage) ||
                (window.innerWidth >= 640 && pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm ${pageNumber === currentPage ? 'bg-primary text-white' : 'border border-green-lighter bg-white hover:bg-green-light/10 active:bg-gray-100 text-gray-700'}`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              
              // Show ellipsis for page gaps
              if (
                (pageNumber === currentPage - 2 && pageNumber > 2) ||
                (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
              ) {
                return <span key={pageNumber} className="text-gray-400">...</span>;
              }
              
              return null;
            })}
          </div>
            <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-2 sm:py-1 border border-green-lighter rounded text-sm min-w-[70px] ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-light/10 active:bg-gray-100 text-gray-700'}`}
          >
            {t('transactions.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;