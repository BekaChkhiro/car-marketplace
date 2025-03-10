import React, { useState } from 'react';
import { User, ChevronDown, ChevronUp, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'blocked';
  joinDate: string;
}

const UsersPage = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Mock data - შეცვალეთ API-დან მიღებული მონაცემებით
  const users: UserData[] = [
    {
      id: 1,
      username: "giorgi123",
      email: "giorgi@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      username: "nino_90",
      email: "nino@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-16"
    },
    // დაამატეთ მეტი მომხმარებელი საჭიროებისამებრ
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">მომხმარებლები</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="მოძებნე მომხმარებელი..."
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">ყველა</option>
            <option value="active">აქტიური</option>
            <option value="blocked">დაბლოკილი</option>
          </select>
        </div>
      </div>

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
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
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
                  <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
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
    </div>
  );
};

export default UsersPage;