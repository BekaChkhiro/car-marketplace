import React, { useState, useEffect, useRef } from 'react';
import balanceService, { Transaction } from '../../../../../api/services/balanceService';
import { toast } from 'react-hot-toast';
import { RefreshCw, ArrowUpCircle, ArrowDownCircle, CreditCard, Search, Calendar, Filter, X, Check } from 'lucide-react';

// ტრანსლაციისთვის დროებითი ფუნქცია
const useTranslation = () => {
  return {
    t: (key: string) => {
      // დროებითი ტრანსლაციების ობიექტი
      const translations: {[key: string]: string} = {
        'common.loading': 'იტვირთება...',
        'transaction.deposit': 'შევსება',
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

// Add keyframe animation for dropdown menus
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`;

const TransactionHistory: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    // We'll only use the timeout for development/testing purposes
    // and will remove it in production to ensure real data is shown
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
      case 'vip_purchase':
        return t('transaction.vipPurchase');
      default:
        return type;
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle size={18} className="text-success" />;
      case 'vip_purchase':
        return <CreditCard size={18} className="text-purple-500" />;
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
        return 'bg-green-light/30 text-success ring-1 ring-green-light';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600 ring-1 ring-yellow-200';
      case 'failed':
        return 'bg-red-100 text-error ring-1 ring-red-200';
      default:
        return 'bg-gray-100 text-gray-500 ring-1 ring-gray-200';
    }
  };

  const getAmountColor = (amount: number | string): string => {
    // თუ სტრიქონია, გადავაკონვერტიროთ რიცხვად
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numericAmount > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 rounded-lg bg-green-light/5">
        <RefreshCw size={24} className="animate-spin text-primary inline-block mr-3" />
        <span className="text-gray-600 font-medium">{t('common.loading')}</span>
      </div>
    );
  }

  // Show empty state when no transactions are found
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-green-lighter rounded-lg bg-green-light/5 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-light/20 rounded-full mb-4">
          <CreditCard size={24} className="text-primary" />
        </div>
        <p className="text-gray-700 font-medium text-lg">{t('transaction.noTransactions')}</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">ტრანზაქციები გამოჩნდება ბალანსის შევსების შემდეგ</p>
      </div>
    );
  }

  // Helper function to check if a date is within the selected range
  const isDateInRange = (dateString: string): boolean => {
    if (!startDate && !endDate) return true;

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }

    return true;
  };

  // Calculate the currently displayed transactions with all filters applied
  const filteredTransactions = transactions.filter(transaction => {
    // Apply text search filter
    const matchesSearch = searchQuery === '' || 
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      getTransactionTypeLabel(transaction.type).toLowerCase().includes(searchQuery.toLowerCase());

    // Apply date filter
    const matchesDate = !isDateFilterActive || isDateInRange(transaction.created_at);

    // Apply type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(transaction.type);

    // Apply status filter
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(transaction.status);

    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Date filter handlers
  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
    setShowFilter(false); // Close the other filter if open
  };

  const applyDateFilter = () => {
    setIsDateFilterActive(Boolean(startDate || endDate));
    setShowDateFilter(false);
    setCurrentPage(1); // Reset to first page when applying filter
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsDateFilterActive(false);
    setCurrentPage(1); // Reset to first page when clearing filter
  };

  // General filter handlers
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setShowDateFilter(false); // Close the other filter if open
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const applyFilters = () => {
    setIsFilterActive(selectedTypes.length > 0 || selectedStatuses.length > 0);
    setShowFilter(false);
    setCurrentPage(1); // Reset to first page when applying filter
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setIsFilterActive(false);
    setCurrentPage(1); // Reset to first page when clearing filter
  };

  // All possible transaction types and statuses for filters
  const allTransactionTypes = ['deposit', 'vip_purchase'];
  const allTransactionStatuses = ['completed', 'pending', 'failed'];

  return (
    <div className="space-y-4">
      {/* Add the keyframe animation styles */}
      <style>{fadeInAnimation}</style>
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-3 justify-between bg-white p-4 rounded-lg border border-green-lighter shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-green-lighter rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all duration-200"
            placeholder="ძიება აღწერილობით..."
          />
        </div>
        <div className="flex space-x-2">
          {/* Date filter button */}
          <div className="relative" ref={dateFilterRef}>
            <button 
              onClick={toggleDateFilter}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${isDateFilterActive ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-green-lighter text-gray-700 bg-white hover:bg-green-light/10'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
            >
              <Calendar size={16} className={`mr-2 ${isDateFilterActive ? 'text-primary' : 'text-primary'}`} />
              <span className="font-medium">თარიღი</span>
              {isDateFilterActive && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">✓</span>
              )}
            </button>
            
            {/* Date filter dropdown with improved design */}
            {showDateFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border border-green-lighter overflow-hidden animate-fadeIn" style={{transformOrigin: 'top right'}}>
                <div className="bg-primary/5 p-3 border-b border-green-lighter">
                  <div className="text-gray-800 font-semibold flex items-center">
                    <Calendar size={16} className="mr-2 text-primary" />
                    აირჩიეთ თარიღის დიაპაზონი
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">საწყისი თარიღი</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-green-lighter rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">საბოლოო თარიღი</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-green-lighter rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 border-t border-green-lighter">
                  <button 
                    onClick={clearDateFilter}
                    className="px-3 py-1.5 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-200 flex items-center transition-colors duration-150"
                  >
                    <X size={14} className="mr-1.5" /> გასუფთავება
                  </button>
                  <button 
                    onClick={applyDateFilter}
                    className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 flex items-center transition-colors duration-150 shadow-sm"
                  >
                    <Check size={14} className="mr-1.5" /> გამოყენება
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* General filter button with improved design */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={toggleFilter}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${isFilterActive ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-green-lighter text-gray-700 bg-white hover:bg-green-light/10'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
            >
              <Filter size={16} className={`mr-2 ${isFilterActive ? 'text-primary' : 'text-primary'}`} />
              <span className="font-medium">ფილტრი</span>
              {isFilterActive && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                  {selectedTypes.length + selectedStatuses.length}
                </span>
              )}
            </button>
            
            {/* Filter dropdown with improved design */}
            {showFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border border-green-lighter overflow-hidden animate-fadeIn" style={{transformOrigin: 'top right'}}>
                <div className="bg-primary/5 p-3 border-b border-green-lighter">
                  <div className="text-gray-800 font-semibold flex items-center">
                    <Filter size={16} className="mr-2 text-primary" />
                    ფილტრის პარამეტრები
                  </div>
                </div>
                
                <div className="p-4 space-y-5">
                  <div>
                    <h3 className="text-gray-800 font-semibold mb-3 flex items-center">
                      <span className="w-2 h-5 bg-primary rounded-sm mr-2"></span>
                      ტრანზაქციის ტიპი
                    </h3>
                    <div className="grid grid-cols-1 gap-2 ml-2">
                      {allTransactionTypes.map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-md hover:bg-gray-50 transition-colors duration-150">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              id={`type-${type}`}
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleTypeFilter(type)}
                              className="rounded border-green-lighter text-primary focus:ring-2 focus:ring-primary/30 h-5 w-5"
                            />
                            <div className="ml-3 flex items-center">
                              <div className="p-1 rounded-full bg-gray-50 mr-2">
                                {getTransactionTypeIcon(type)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{getTransactionTypeLabel(type)}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-800 font-semibold mb-3 flex items-center">
                      <span className="w-2 h-5 bg-primary rounded-sm mr-2"></span>
                      სტატუსი
                    </h3>
                    <div className="grid grid-cols-1 gap-2 ml-2">
                      {allTransactionStatuses.map(status => (
                        <label key={status} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-md hover:bg-gray-50 transition-colors duration-150">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onChange={() => toggleStatusFilter(status)}
                              className="rounded border-green-lighter text-primary focus:ring-2 focus:ring-primary/30 h-5 w-5"
                            />
                            <div className="ml-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {getStatusLabel(status)}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 border-t border-green-lighter">
                  <button 
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-200 flex items-center transition-colors duration-150"
                  >
                    <X size={14} className="mr-1.5" /> გასუფთავება
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 flex items-center transition-colors duration-150 shadow-sm"
                  >
                    <Check size={14} className="mr-1.5" /> გამოყენება
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Transaction table with card-based design */}
      <div className="overflow-x-auto bg-white rounded-lg border border-green-lighter shadow-sm">
        <table className="min-w-full divide-y divide-green-lighter">
          <thead>
            <tr className="bg-green-light/20">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('transaction.date')}</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('transaction.type')}</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('transaction.amount')}</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('transaction.description')}</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t('transaction.status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-lighter">
            {currentTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover:bg-green-light/10 transition-colors duration-150">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-2" />
                    {formatDate(new Date(transaction.created_at))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTransactionTypeIcon(transaction.type)}
                    <span className="font-medium">{getTransactionTypeLabel(transaction.type)}</span>
                  </div>
                </td>
                <td className={`py-3 px-4 text-sm font-medium whitespace-nowrap ${getAmountColor(transaction.amount)}`}>
                  <span className="font-semibold">
                    {typeof transaction.amount === 'string' 
                      ? (parseFloat(transaction.amount) > 0 ? '+' : '') 
                      : (transaction.amount > 0 ? '+' : '')}
                    {transaction.amount} GEL
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {transaction.description || '—'}
                </td>
                <td className="py-3 px-4 text-sm whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-green-lighter shadow-sm mt-4">
        <div className="text-sm text-gray-600 flex items-center gap-4">
          <span>სულ {filteredTransactions.length} ტრანზაქცია</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">გვერდზე:</span>
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
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-green-lighter rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-light/10 text-gray-700'}`}
          >
            წინა
          </button>
          
          <div className="flex items-center gap-1">
            {/* Page number buttons */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers for better UX
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm ${pageNumber === currentPage ? 'bg-primary text-white' : 'border border-green-lighter bg-white hover:bg-green-light/10 text-gray-700'}`}
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
            className={`px-3 py-1 border border-green-lighter rounded text-sm ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-light/10 text-gray-700'}`}
          >
            შემდეგი
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
