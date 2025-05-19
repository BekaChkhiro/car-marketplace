import React, { useEffect, useState } from 'react';
import balanceService, { Transaction, AdminTransaction } from '../../../../api/services/balanceService';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  Users, 
  RefreshCw, 
  BarChart4, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User,
  Activity,
  CircleDollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

// Helper for calculating percentage
const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

const TransactionAnalytics: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    deposit: 0,
    depositAmount: 0,
    vipPurchase: 0,
    vipPurchaseAmount: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    successRate: 0,
    dailyAverage: 0,
    averageDepositAmount: 0,
    lastWeekCount: 0,
    lastWeekAmount: 0,
    lastMonthCount: 0,
    lastMonthAmount: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    topUsers: []
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const transactionData = await balanceService.getAdminTransactions();
      setTransactions(transactionData);
      calculateStats(transactionData);
    } catch (error) {
      console.error('Error fetching transactions for analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: AdminTransaction[]) => {
    // Filter data to only include deposit transactions
    const depositTransactions = data.filter(transaction => transaction.type === 'deposit');
    
    // Initialize counters
    let totalAmount = 0;
    let depositCount = 0;
    let depositAmount = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    const userDeposits: {[key: string]: {count: number, amount: number}} = {};

    // Define time periods for analysis
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setDate(now.getDate() - 30);
    
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setDate(now.getDate() - 60);

    // Counters for time-based analysis
    let lastWeekCount = 0;
    let lastWeekAmount = 0;
    let previousWeekCount = 0;
    let previousWeekAmount = 0;
    let lastMonthCount = 0;
    let lastMonthAmount = 0;
    let previousMonthCount = 0;
    let previousMonthAmount = 0;

    // Process each deposit transaction
    depositTransactions.forEach(transaction => {
      // Parse amount to number if it's a string
      const amountNum = typeof transaction.amount === 'string' ? 
        parseFloat(transaction.amount) : transaction.amount;
      
      // Add to total amount 
      totalAmount += Math.abs(amountNum);

      // All transactions are deposits at this point
      depositCount++;
      depositAmount += amountNum;

      // Count by status
      switch (transaction.status) {
        case 'completed':
          completedCount++;
          break;
        case 'pending':
          pendingCount++;
          break;
        case 'failed':
          failedCount++;
          break;
      }

      // Track user deposits for top users analysis
      if (transaction.user && transaction.user.id) {
        const userId = String(transaction.user.id);
        const userName = transaction.user.name || 'Unknown User';
        const userKey = `${userId}:${userName}`;
        
        if (!userDeposits[userKey]) {
          userDeposits[userKey] = { count: 0, amount: 0 };
        }
        
        userDeposits[userKey].count += 1;
        userDeposits[userKey].amount += amountNum;
      }

      // Time-based analysis
      const transactionDate = new Date(transaction.created_at);
      
      if (transactionDate >= oneWeekAgo) {
        lastWeekCount++;
        lastWeekAmount += amountNum;
      } else if (transactionDate >= twoWeeksAgo && transactionDate < oneWeekAgo) {
        previousWeekCount++;
        previousWeekAmount += amountNum;
      }
      
      if (transactionDate >= oneMonthAgo) {
        lastMonthCount++;
        lastMonthAmount += amountNum;
      } else if (transactionDate >= twoMonthsAgo && transactionDate < oneMonthAgo) {
        previousMonthCount++;
        previousMonthAmount += amountNum;
      }
    });

    // Calculate success rate
    const successRate = calculatePercentage(completedCount, depositTransactions.length);

    // Calculate daily average (using last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = depositTransactions.filter(t => 
      new Date(t.created_at) >= thirtyDaysAgo
    );
    
    const dailyAverage = recentTransactions.length > 0 
      ? Math.round(recentTransactions.length / 30 * 10) / 10
      : 0;
      
    // Calculate average deposit amount
    const averageDepositAmount = depositCount > 0 
      ? Math.round((depositAmount / depositCount) * 100) / 100
      : 0;
      
    // Calculate growth rates
    const weeklyGrowth = previousWeekCount > 0
      ? Math.round(((lastWeekCount - previousWeekCount) / previousWeekCount) * 100)
      : lastWeekCount > 0 ? 100 : 0;
      
    const monthlyGrowth = previousMonthCount > 0
      ? Math.round(((lastMonthCount - previousMonthCount) / previousMonthCount) * 100)
      : lastMonthCount > 0 ? 100 : 0;
      
    // Extract top users by deposit amount
    const topUsers = Object.entries(userDeposits)
      .map(([key, value]) => {
        const [userId, userName] = key.split(':');
        return {
          id: userId,
          name: userName,
          count: value.count,
          amount: value.amount
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Update state with calculated stats
    setStats({
      total: depositTransactions.length,
      totalAmount,
      deposit: depositCount,
      depositAmount,
      vipPurchase: 0,  // Setting to 0 as we're only showing deposits
      vipPurchaseAmount: 0,  // Setting to 0 as we're only showing deposits
      completed: completedCount,
      pending: pendingCount,
      failed: failedCount,
      successRate,
      dailyAverage,
      averageDepositAmount,
      lastWeekCount,
      lastWeekAmount,
      lastMonthCount,
      lastMonthAmount,
      weeklyGrowth,
      monthlyGrowth,
      topUsers
    });
  };

  // Generate data for transaction type distribution - only showing deposits
  const typeDistribution = [
    { type: 'deposit', count: stats.deposit, color: 'bg-green-500' }
  ];

  // Generate data for transaction status distribution
  const statusDistribution = [
    { status: 'completed', count: stats.completed, color: 'bg-green-500' },
    { status: 'pending', count: stats.pending, color: 'bg-yellow-500' },
    { status: 'failed', count: stats.failed, color: 'bg-red-500' }
  ];

  const getTransactionTypeLabel = (type: string): string => {
    switch (type) {
      case 'deposit':
        return 'შევსება';
      case 'vip_purchase':
        return 'VIP შეძენა';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'დასრულებული';
      case 'pending':
        return 'მიმდინარე';
      case 'failed':
        return 'წარუმატებელი';
      default:
        return status;
    }
  };

  // Get transaction type icon component
  const getTypeIcon = (type: string) => {
    // Since we're only showing deposit transactions
    return <ArrowUpCircle size={16} className="text-green-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
          შევსების ანალიტიკა
        </h2>
        <button 
          onClick={fetchTransactions}
          className="text-primary p-2 rounded-lg hover:bg-primary/10 transition-all duration-300 transform hover:scale-110"
          title="განახლება"
        >
          <RefreshCw size={18} className="transition-transform hover:rotate-180 duration-700" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          <div className="flex flex-col items-center">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <span className="text-sm font-medium">იტვირთება...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4  ">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-start  gap-2 mb-1">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <DollarSign size={16} className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">ჯამური ბრუნვა</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.totalAmount.toLocaleString()} ₾</p>
                  <p className="text-xs text-gray-500 mt-1">საშ. {stats.averageDepositAmount.toLocaleString()} ₾</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <BarChart4 size={16} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">შევსებები</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">დღიური საშ. {stats.dailyAverage}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-start  gap-2 mb-1">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Calendar size={16} className="text-teal-600" />
                    </div>
                    <p className="text-sm text-gray-600">ბოლო კვირა</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.lastWeekAmount.toLocaleString()} ₾</p>
                  <div className=" flex items-start  gap-1 mt-1">
                    {stats.weeklyGrowth > 0 ? (
                      <>
                        <TrendingUp size={12} className="text-green-600 mt-1 " />
                        <p className="text-xs text-green-600 font-medium">+{stats.weeklyGrowth}%</p>
                      </>
                    ) : stats.weeklyGrowth < 0 ? (
                      <>
                        <TrendingDown size={12} className="text-red-600 mt-1" />
                        <p className="text-xs text-red-600 font-medium">{stats.weeklyGrowth}%</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">0%</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <Activity size={16} className="text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">წარმატება</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.successRate}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Status Distribution */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Activity size={14} className="text-orange-600" />
                </div>
                ტრანზაქციების სტატუსი
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col items-center gap-1.5 mb-1">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <CheckCircle size={14} className="text-green-600" />
                    </div>
                    <p className="text-xs font-medium">წარმატებული</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">{stats.completed}</p>
                    <p className="text-xs text-gray-500">{calculatePercentage(stats.completed, stats.total)}%</p>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col items-center gap-1.5 mb-1">
                    <div className="p-1 bg-yellow-100 rounded-lg">
                      <Clock size={14} className="text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium">მიმდინარე</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">{stats.pending}</p>
                    <p className="text-xs text-gray-500">{calculatePercentage(stats.pending, stats.total)}%</p>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col items-center gap-1.5 mb-1">
                    <div className="p-1 bg-red-100 rounded-lg">
                      <XCircle size={14} className="text-red-600" />
                    </div>
                    <p className="text-xs font-medium">წარუმატებელი</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">{stats.failed}</p>
                    <p className="text-xs text-gray-500">{calculatePercentage(stats.failed, stats.total)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {statusDistribution.map(item => (
                  <div key={item.status} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-xs font-medium">{getStatusLabel(item.status)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{item.count}</span>
                        <span className="text-xs text-gray-500">({calculatePercentage(item.count, stats.total)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500 ease-out`} 
                        style={{ width: `${calculatePercentage(item.count, stats.total)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Periodic Analysis */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                პერიოდული ანალიზი
              </h3>
              
              <div className="space-y-3">
                {/* Weekly analysis */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">ბოლო 7 დღე</p>
                    <div className="flex items-start gap-1.5">
                      {stats.weeklyGrowth > 0 ? (
                        <>
                          <div className="p-1 bg-green-100 rounded-lg">
                            <TrendingUp size={12} className="text-green-600" />
                          </div>
                          <p className="text-xs text-green-600 font-medium">+{stats.weeklyGrowth}%</p>
                        </>
                      ) : stats.weeklyGrowth < 0 ? (
                        <>
                          <div className="p-1 bg-red-100 rounded-lg">
                            <TrendingDown size={12} className="text-red-600" />
                          </div>
                          <p className="text-xs text-red-600 font-medium">{stats.weeklyGrowth}%</p>
                        </>
                      ) : (
                        <p className="text-xs">0%</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">შევსებები:</p>
                        <p className="text-xs font-bold">{stats.lastWeekCount}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">თანხა:</p>
                        <p className="text-xs font-bold">{stats.lastWeekAmount.toLocaleString()} ₾</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Monthly analysis */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">ბოლო 30 დღე</p>
                    <div className="flex items-start gap-1.5">
                      {stats.monthlyGrowth > 0 ? (
                        <>
                          <div className="p-1 bg-green-100 rounded-lg">
                            <TrendingUp size={12} className="text-green-600" />
                          </div>
                          <p className="text-xs text-green-600 font-medium">+{stats.monthlyGrowth}%</p>
                        </>
                      ) : stats.monthlyGrowth < 0 ? (
                        <>
                          <div className="p-1 bg-red-100 rounded-lg">
                            <TrendingDown size={12} className="text-red-600" />
                          </div>
                          <p className="text-xs text-red-600 font-medium">{stats.monthlyGrowth}%</p>
                        </>
                      ) : (
                        <p className="text-xs">0%</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">შევსებები:</p>
                        <p className="text-xs font-bold">{stats.lastMonthCount}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">თანხა:</p>
                        <p className="text-xs font-bold">{stats.lastMonthAmount.toLocaleString()} ₾</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Users */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <User size={14} className="text-purple-600" />
                </div>
                ტოპ მომხმარებლები
              </h3>
              
              {stats.topUsers && stats.topUsers.length > 0 ? (
                <div className="space-y-2 ">
                  {stats.topUsers.slice(0, 3).map((user: any, index: number) => (
                    <div key={user.id} className=" bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-purple-700 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow ">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <div className="flex justify-between items-center mt-1 ">
                            <div className="flex items-start gap-2">
                              <div className="p-1 bg-blue-100 rounded-lg">
                                <Activity size={12} className="text-blue-600" />
                              </div>
                              <p className="text-xs text-gray-500">{user.count} შევს.</p>
                            </div>
                            <div className="flex items-start gap-2 ">
                              <div className="p-1 bg-green-100 rounded-lg">
                                <CircleDollarSign size={12} className="text-green-600" />
                              </div>
                              <p className="text-xs  font-semibold">{user.amount.toLocaleString()} ₾</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl text-center">
                  <p className="text-sm text-gray-500">მომხმარებლების მონაცემები არ არის ხელმისაწვდომი</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionAnalytics;
