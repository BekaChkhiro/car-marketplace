import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, AlertTriangle } from 'lucide-react';
import { Part } from '../../../../api/services/partService';

interface RecentPartsProps {
  parts: Part[];
}

const RecentParts: React.FC<RecentPartsProps> = ({ parts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">ბოლოს დამატებული ნაწილები</h3>
        <Link to="/admin/parts" className="text-primary text-sm flex items-center hover:underline">
          ყველა ნაწილი <ChevronRight size={16} />
        </Link>
      </div>
      
      {parts.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
            <AlertTriangle size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500">ნაწილები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6 sm:mt-0">
          {parts.slice(0, 5).map(part => (
            <div key={part.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 overflow-hidden rounded-lg mr-3 border border-gray-100">
                  <img 
                    src={part.images[0]?.url || '/images/part-placeholder.jpg'} 
                    alt={part.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{part.title}</p>
                  <p className="text-sm text-gray-500">{part.price.toLocaleString()} {part.currency || 'GEL'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  part.condition === 'new' ? 'bg-green-100 text-green-800' : 
                  part.condition === 'used' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {part.condition === 'new' ? 'ახალი' : 
                   part.condition === 'used' ? 'გამოყენებული' : part.condition}
                </span>
                {part.vip_status && part.vip_status !== 'none' && (
                  <span className="px-2 py-1 ml-2 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    VIP
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentParts;