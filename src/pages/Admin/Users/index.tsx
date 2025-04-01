import React, { useState, useEffect } from 'react';
import { User as UserIcon, ChevronDown, ChevronUp, MoreVertical, Edit, Trash2 } from 'lucide-react';
import authService from '../../../api/services/authService';
import { useToast } from '../../../context/ToastContext';
import { User } from '../../../api/types/auth.types';

// Extended user interface with status field which might not be in the original User type
interface UserWithStatus extends User {
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const UsersPage = () => {
  const { showToast } = useToast();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from authService...');
      const usersData = await authService.getAllUsers();
      
      // Check if we received data
      if (usersData && Array.isArray(usersData)) {
        console.log('Received user data:', usersData);
        
        // Determine if we're using mock data (mock users have IDs 1, 2, 3)
        const isMockData = usersData.length > 0 && usersData.some(user => [1, 2, 3].includes(user.id));
        
        // Add status field if not present (assuming all users are active by default)
        const usersWithStatus = usersData.map(user => ({
          ...user,
          // Add a default status since it's not in the User type
          status: user.status || 'active',
          // Add default dates if not present (for mock data)
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        }));
        
        setUsers(usersWithStatus);
        setError(null);
        
        // If we're showing mock data, inform the user
        if (isMockData) {
          console.log('Using mock data for users');
          showToast('სერვერთან კავშირი ვერ მოხერხდა. ნაჩვენებია მოდელირებული მონაცემები.', 'warning');
        }
      } else {
        console.error('Invalid user data received:', usersData);
        throw new Error('Invalid user data received');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      
      // Try to get mock data directly if the fetch failed
      try {
        console.log('Attempting to use mock data after error...');
        const mockData = await authService.getAllUsers();
        if (mockData && Array.isArray(mockData) && mockData.length > 0) {
          console.log('Successfully retrieved mock data:', mockData);
          
          const usersWithStatus = mockData.map(user => ({
            ...user,
            status: user.status || 'active',
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString()
          }));
          
          setUsers(usersWithStatus);
          setError('სერვერთან კავშირი ვერ მოხერხდა. ნაჩვენებია მოდელირებული მონაცემები.');
          showToast('სერვერთან კავშირი ვერ მოხერხდა. ნაჩვენებია მოდელირებული მონაცემები.', 'warning');
        } else {
          throw new Error('Failed to retrieve mock data');
        }
      } catch (mockErr) {
        console.error('Failed to use mock data:', mockErr);
        setError(err.message || 'Failed to load users');
        showToast('მომხმარებლების ჩატვირთვა ვერ მოხერხდა', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">მომხმარებლები</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="მოძებნე მომხმარებელი..."
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ყველა</option>
            <option value="active">აქტიური</option>
            <option value="blocked">დაბლოკილი</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-xl text-red-600 text-center">
          <p className="mb-2">{error}</p>
          {users.length > 0 && (
            <p className="text-amber-600 mb-2">
              ნაჩვენებია მოდელირებული მონაცემები სერვერის პრობლემის გამო.
            </p>
          )}
          <button 
            onClick={fetchUsers} 
            className="ml-4 underline hover:text-red-800"
          >
            სცადეთ თავიდან
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    მომხმარებელი
                    {sortDirection === 'asc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ელ-ფოსტა</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">როლი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">სტატუსი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">რეგისტრაციის თარიღი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {users
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
                })
                .map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon size={16} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? 'აქტიური' : 'დაბლოკილი'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('ka-GE') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="text-sm text-gray-600">
            ნაჩვენებია 1-10 / 100
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              უკან
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-secondary">
              შემდეგი
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default UsersPage;