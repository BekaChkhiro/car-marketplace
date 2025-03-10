import React, { useState } from 'react';
import { Car, ChevronDown, ChevronUp, MoreVertical, Edit, Trash2, Check, X } from 'lucide-react';

interface CarData {
  id: number;
  title: string;
  seller: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  isVip: boolean;
  createdAt: string;
}

const CarsPage = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Mock data - შეცვალეთ API-დან მიღებული მონაცემებით
  const cars: CarData[] = [
    {
      id: 1,
      title: "BMW M5 2020",
      seller: "giorgi123",
      price: 45000,
      status: "pending",
      isVip: false,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Mercedes-Benz C-Class 2021",
      seller: "nino_90",
      price: 35000,
      status: "approved",
      isVip: true,
      createdAt: "2024-01-16"
    },
  ];

  const getStatusBadgeStyle = (status: CarData['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusText = (status: CarData['status']) => {
    switch (status) {
      case 'pending':
        return 'მოლოდინში';
      case 'approved':
        return 'დადასტურებული';
      case 'rejected':
        return 'უარყოფილი';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">განცხადებები</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="მოძებნე განცხადება..."
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">ყველა სტატუსი</option>
            <option value="pending">მოლოდინში</option>
            <option value="approved">დადასტურებული</option>
            <option value="rejected">უარყოფილი</option>
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
                    განცხადება
                    {sortDirection === 'asc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">გამყიდველი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ფასი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">სტატუსი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">VIP</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">თარიღი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Car size={20} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{car.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{car.seller}</td>
                  <td className="px-6 py-4 text-gray-600">${car.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(car.status)}`}>
                      {getStatusText(car.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {car.isVip ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        VIP
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{car.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {car.status === 'pending' && (
                        <>
                          <button className="p-1 hover:bg-green-50 rounded-lg transition-colors">
                            <Check size={16} className="text-green-600" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={16} className="text-red-600" />
                          </button>
                        </>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={16} className="text-gray-600" />
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

export default CarsPage;