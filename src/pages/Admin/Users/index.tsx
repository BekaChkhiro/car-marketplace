import React, { useState, useEffect } from 'react';
import { User as UserIcon, ChevronDown, ChevronUp, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react';
import authService from '../../../api/services/authService';
import { useToast } from '../../../context/ToastContext';
import { User } from '../../../api/types/auth.types';
import { useTranslation } from 'react-i18next';


// Delete confirmation dialog state
interface DeleteConfirmationState {
  show: boolean;
  userId: number | null;
}

const UsersPage = () => {
  const { showToast } = useToast();
  const { t } = useTranslation('admin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    show: false,
    userId: null
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Helper function to get filtered users
  const getFilteredUsers = () => {
    return users
      .filter(user => {
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            user.username?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(user => {
        // Apply status filter
        if (statusFilter === 'all') return true;
        return user.status === statusFilter;
      })
      .sort((a, b) => {
        // Apply sorting
        const nameA = a.username?.toLowerCase() || '';
        const nameB = b.username?.toLowerCase() || '';
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      });
  };

  // Helper function to get paginated users
  const getPaginatedUsers = () => {
    const filteredUsers = getFilteredUsers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredUsers().length / itemsPerPage);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from authService...');
      const usersData = await authService.getAllUsers();
      
      // Check if we received data
      if (usersData && Array.isArray(usersData)) {
        console.log('Received user data:', usersData);
        
        // Add default status if not present
        const usersWithDefaults = usersData.map(user => ({
          ...user,
          status: user.status || 'active'
        }));
        
        setUsers(usersWithDefaults);
        setTotalUsers(usersWithDefaults.length);
        setError(null);
      } else {
        console.error('Invalid user data received:', usersData);
        throw new Error('Invalid user data received');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
      showToast(t('users.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    try {
      setLoading(true);
      console.log('Deleting user with ID:', userId);
      
      const success = await authService.deleteUser(userId);
      
      if (success) {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Update total users count
        setTotalUsers(prev => prev - 1);
        
        // Show success message
        showToast(t('users.deleteSuccess'), 'success');
        
        // Check if we need to adjust pagination
        const filteredUsers = getFilteredUsers();
        const newTotalPages = Math.ceil((filteredUsers.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      showToast(t('users.deleteError'), 'error');
    } finally {
      setLoading(false);
      // Close confirmation dialog
      setDeleteConfirmation({ show: false, userId: null });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">{t('users.title')}</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder={t('users.searchUsers')}
            className="px-4 py-3 sm:py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-3 sm:py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t('users.allRoles')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="blocked">{t('common.blocked')}</option>
          </select>
        </div>
      </div>

      {loading && !deleteConfirmation.show ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-xl text-red-600 text-center">
          <p className="mb-2">{error}</p>
          <button 
            onClick={fetchUsers} 
            className="ml-4 underline hover:text-red-800"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    >
                      {t('users.user')}
                      {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('users.name')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('users.lastName')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('users.email')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('users.status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('analytics.cars')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('users.registrationDate')}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getPaginatedUsers().map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <UserIcon size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.first_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' ? t('common.active') : t('common.blocked')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {user.car_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('ka-GE')
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                          title={t('users.edit')}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
                          title={t('users.delete')}
                          onClick={() => setDeleteConfirmation({ show: true, userId: user.id })}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* If no users match the filter criteria */}
                {getFilteredUsers().length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      {t('users.noUsersFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {getPaginatedUsers().map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <UserIcon size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                      title={t('users.edit')}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
                      title={t('users.delete')}
                      onClick={() => setDeleteConfirmation({ show: true, userId: user.id })}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="ml-13 pl-3">
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <p className="text-xs text-gray-500">{t('users.name')}:</p>
                    <p className="text-xs font-medium">{user.first_name || '-'}</p>
                    
                    <p className="text-xs text-gray-500">{t('users.lastName')}:</p>
                    <p className="text-xs font-medium">{user.last_name || '-'}</p>
                    
                    <p className="text-xs text-gray-500">{t('users.email')}:</p>
                    <p className="text-xs font-medium">{user.email || '-'}</p>
                    
                    <p className="text-xs text-gray-500">{t('users.status')}:</p>
                    <p className="text-xs">
                      <span 
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' ? t('common.active') : t('common.blocked')}
                      </span>
                    </p>
                    
                    <p className="text-xs text-gray-500">Cars:</p>
                    <p className="text-xs font-medium">{user.car_count || 0}</p>
                    
                    <p className="text-xs text-gray-500">{t('users.registrationDate')}:</p>
                    <p className="text-xs font-medium">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('ka-GE')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* If no users match the filter criteria */}
            {getFilteredUsers().length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                {t('users.noUsersFound')}
              </div>
            )}
          </div>

          {/* Pagination - Responsive */}
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              {getFilteredUsers().length > 0 ? (
                <>
                  {t('common.showing')} {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, getFilteredUsers().length)} / {getFilteredUsers().length}
                </>
              ) : (
                t('users.noUsersFound')
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Page numbers */}
              {totalPages > 1 && (
                <div className="hidden sm:flex gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    // Calculate which pages to show
                    let pageNum;
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      // If current page is near start
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If current page is near end
                      pageNum = totalPages - 4 + index;
                    } else {
                      // Current page is in the middle, show current and surrounding
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex gap-2 w-full sm:w-auto justify-center">
                <button 
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-5 py-3 sm:py-2 text-sm font-medium border rounded-lg flex-1 sm:flex-auto max-w-[120px] ${
                    currentPage === 1 
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  {t('common.previous')}
                </button>
                <button 
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-5 py-3 sm:py-2 text-sm font-medium rounded-lg flex-1 sm:flex-auto max-w-[120px] ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-primary/50 text-white cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-secondary active:bg-secondary/90'
                  }`}
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4 text-amber-600">
              <AlertCircle className="mr-2" size={24} />
              <h3 className="text-lg font-medium">{t('users.deleteUser')}</h3>
            </div>
            <p className="mb-6 text-gray-700">{t('users.deleteConfirmation')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation({show: false, userId: null})}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => deleteConfirmation.userId && handleDeleteUser(deleteConfirmation.userId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('users.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
