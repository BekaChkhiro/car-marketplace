import React, { useState, useEffect } from 'react';
import { getVipListings, getVipTransactions } from '../../../../services/vipService';
import { API_URL } from '../../../../config/api';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import { ka } from 'date-fns/locale';
import { Award, Search, Filter, ChevronDown, X, CreditCard, Clock, Calendar, Trash2 } from 'lucide-react';

// Interface for VIP listing data
interface VipListing {
  id: number;
  car_id: number;
  car_title: string;
  user_id: number;
  user_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  days: number;
  amount: number;
  currency: string;
}

// Interface for VIP transaction data
interface VipTransaction {
  id: number;
  transaction_id: string;
  user_id: number;
  user_name: string;
  car_id: number;
  car_title: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'vip_purchase';
  days: number;
}

const VipListingsList: React.FC = () => {
  const [vipListings, setVipListings] = useState<VipListing[]>([]);
  const [transactions, setTransactions] = useState<VipTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'transactions'>('listings');
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsData, transactionsData] = await Promise.all([
          getVipListings(),
          getVipTransactions()
        ]);
        
        setVipListings(listingsData);
        setTransactions(transactionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching VIP data:', err);
        setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
        
        // Fallback mock data for development
        const mockListings: VipListing[] = [];
        const mockTransactions: VipTransaction[] = [];
        
        // Generate 20 mock listings
        for (let i = 1; i <= 20; i++) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
          
          const endDate = new Date(startDate);
          const days = Math.floor(Math.random() * 30) + 1;
          endDate.setDate(endDate.getDate() + days);
          
          const isActive = endDate > new Date();
          
          mockListings.push({
            id: i,
            car_id: 100 + i,
            car_title: `BMW X${i % 9 + 1}`,
            user_id: 200 + i,
            user_name: `მომხმარებელი ${i}`,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: isActive ? 'active' : 'expired',
            days: days,
            amount: days * 5,
            currency: 'GEL'
          });
          
          // Add corresponding transaction
          mockTransactions.push({
            id: i,
            transaction_id: `vip-${10000 + i}`,
            user_id: 200 + i,
            user_name: `მომხმარებელი ${i}`,
            car_id: 100 + i,
            car_title: `BMW X${i % 9 + 1}`,
            amount: days * 5,
            currency: 'GEL',
            date: startDate.toISOString(),
            status: 'completed',
            type: 'vip_purchase',
            days: days
          });
        }
        
        setVipListings(mockListings);
        setTransactions(mockTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredListings = vipListings.filter(listing => {
    const matchesSearch = search === '' || 
      listing.car_title.toLowerCase().includes(search.toLowerCase()) ||
      listing.user_name.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(transaction => {
    return search === '' || 
      transaction.car_title.toLowerCase().includes(search.toLowerCase()) ||
      transaction.user_name.toLowerCase().includes(search.toLowerCase()) ||
      transaction.transaction_id.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !vipListings.length && !transactions.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      {/* Header with title and tab navigation */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {activeTab === 'listings' ? 
              <Award className="text-primary" /> : 
              <CreditCard className="text-primary" />}
            <span>VIP განცხადებების დეტალები</span>
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex p-1 bg-gray-100 rounded-lg self-stretch sm:self-center">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'listings' 
                ? 'bg-white text-primary shadow-sm font-medium' 
                : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Award size={18} />
              <span>განცხადებები</span>
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'transactions' 
                ? 'bg-white text-primary shadow-sm font-medium' 
                : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CreditCard size={18} />
              <span>ტრანზაქციები</span>
            </button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Search bar with icon */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ძებნა სახელით, ID-ით ან მომხმარებლით..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Status filter dropdown */}
          {activeTab === 'listings' && (
            <div className="sm:w-56">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">ყველა სტატუსი</option>
                  <option value="active">აქტიური</option>
                  <option value="expired">ვადაგასული</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {activeTab === 'listings' ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">განცხადება</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">მომხმარებელი</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ვადა</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">დღეები</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">თანხა</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">სტატუსი</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => {
                    // Calculate days remaining (for active listings)
                    const today = new Date();
                    const endDate = new Date(listing.end_date);
                    const daysRemaining = differenceInDays(endDate, today);
                    
                    return (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <Award size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {listing.car_title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">ID: {listing.car_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                              {listing.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{listing.user_name}</div>
                              <div className="text-xs text-gray-500">ID: {listing.user_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-gray-700">დაწყ.: {format(new Date(listing.start_date), 'dd MMM yyyy', { locale: ka })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-gray-700">დასრ.: {format(new Date(listing.end_date), 'dd MMM yyyy', { locale: ka })}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <div className="text-base font-semibold text-gray-900">{listing.days}</div>
                            {listing.status === 'active' && (
                              <div className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 mt-1">
                                {daysRemaining > 0 ? `დარჩა: ${daysRemaining} დღე` : 'იწურება'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.amount.toLocaleString()} {listing.currency}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(listing.amount / listing.days)} {listing.currency}/დღე
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${listing.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}>
                            {listing.status === 'active' ? 'აქტიური' : 'ვადაგასული'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-sm text-gray-500 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Trash2 size={32} className="text-gray-300" />
                        <p>მონაცემები არ მოიძებნა</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 px-2 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              ნაჩვენებია <span className="font-medium">{filteredListings.length}</span> / {vipListings.length} განცხადება
            </div>
            
            {/* Page selector mockup - can be implemented fully later */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-50" disabled>
                წინა
              </button>
              <div className="px-3 py-1 border bg-primary text-white rounded-md text-sm">1</div>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-50" disabled>
                შემდეგი
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ტრანზაქცია</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">მომხმარებელი</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">განცხადება</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">დეტალები</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">თანხა</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">სტატუსი</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.transaction_id}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                                VIP შეძენა
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {transaction.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.user_name}</div>
                            <div className="text-xs text-gray-500">ID: {transaction.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                            <Award size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.car_title}</div>
                            <div className="text-xs text-gray-500">ID: {transaction.car_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-gray-700">{format(new Date(transaction.date), 'dd MMM yyyy', { locale: ka })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-gray-700">{transaction.days} დღე</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(transaction.amount / transaction.days)} {transaction.currency}/დღე
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'}`}>
                          {transaction.status === 'completed' 
                            ? 'დასრულებული' 
                            : transaction.status === 'pending' 
                              ? 'პროცესშია' 
                              : 'წარუმატებელი'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-sm text-gray-500 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Trash2 size={32} className="text-gray-300" />
                        <p>მონაცემები არ მოიძებნა</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 px-2 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              ნაჩვენებია <span className="font-medium">{filteredTransactions.length}</span> / {transactions.length} ტრანზაქცია
            </div>
            
            {/* Page selector mockup - can be implemented fully later */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-50" disabled>
                წინა
              </button>
              <div className="px-3 py-1 border bg-primary text-white rounded-md text-sm">1</div>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-50" disabled>
                შემდეგი
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VipListingsList;
