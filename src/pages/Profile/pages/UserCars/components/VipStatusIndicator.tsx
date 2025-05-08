import React from 'react';
import { Star } from 'lucide-react';
import { Car } from '../../../../../api/types/car.types';

interface VipStatusIndicatorProps {
  cars: Car[];
}

const VipStatusIndicator: React.FC<VipStatusIndicatorProps> = ({ cars }) => {
  // ჩვენება მხოლოდ იმ შემთხვევაში, როცა მანქანები არსებობს
  if (!cars || cars.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg mb-4">
        <p className="text-center text-gray-500">მანქანები არ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
      <h3 className="text-lg font-bold mb-2">VIP სტატუსების ცხრილი</h3>
      <p className="text-sm text-gray-500 mb-4">ეს ცხრილი უჩვენებს ყველა თქვენი მანქანის VIP სტატუსს</p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">მანქანა</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">VIP სტატუსი</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">VIP-ის ვადა</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => {
              const vipStatus = car.vip_status || 'none';
              const hasVip = vipStatus !== 'none';
              
              return (
                <tr key={car.id} className={hasVip ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {car.title || `${car.brand} ${car.model}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hasVip ? (
                      <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        vipStatus === 'vip' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : vipStatus === 'vip_plus' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        <Star className="w-3.5 h-3.5 mr-1" fill="currentColor" />
                        {vipStatus === 'vip' ? 'VIP' : vipStatus === 'vip_plus' ? 'VIP+' : 'SUPER VIP'}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">არ არის</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {car.vip_expiration_date ? (
                      new Date(car.vip_expiration_date).toLocaleDateString('ka-GE')
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VipStatusIndicator;
