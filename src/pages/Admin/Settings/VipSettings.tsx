import React, { useState, useEffect } from 'react';
import { Save, Award, AlertCircle } from 'lucide-react';
import api from '../../../api/config/api';
import { authHeader } from '../../../utils';
import { VipPrice, VipStatus } from '../../../api/services/vipService';

// Interface for the VIP price form
interface VipPriceForm {
  vip_status: VipStatus;
  price: number;
  duration_days: number;
}

const VipSettings: React.FC = () => {
  const [vipPrices, setVipPrices] = useState<VipPriceForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current VIP prices on component mount
  useEffect(() => {
    fetchVipPrices();
  }, []);

  // Function to fetch VIP prices from the API
  const fetchVipPrices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/vip/pricing', {
        headers: authHeader()
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setVipPrices(response.data.data);
      } else {
        // Fallback to default prices if API doesn't return expected format
        setVipPrices([
          { vip_status: 'vip', price: 10, duration_days: 7 },
          { vip_status: 'vip_plus', price: 30, duration_days: 30 },
          { vip_status: 'super_vip', price: 60, duration_days: 30 }
        ]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching VIP prices:', err);
      setError('ფასების ჩატვირთვა ვერ მოხერხდა');
      
      // Set default prices if API fails
      setVipPrices([
        { vip_status: 'vip', price: 10, duration_days: 7 },
        { vip_status: 'vip_plus', price: 30, duration_days: 30 },
        { vip_status: 'super_vip', price: 60, duration_days: 30 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle price input change
  const handlePriceChange = (index: number, field: keyof VipPriceForm, value: any) => {
    const updatedPrices = [...vipPrices];
    
    // Convert to number if the field is price or duration_days
    if (field === 'price' || field === 'duration_days') {
      updatedPrices[index][field] = Number(value);
    } else {
      updatedPrices[index][field] = value;
    }
    
    setVipPrices(updatedPrices);
  };

  // Save updated VIP prices
  const saveVipPrices = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Validate prices before saving
      const invalidPrices = vipPrices.filter(price => 
        isNaN(price.price) || price.price <= 0 || 
        isNaN(price.duration_days) || price.duration_days <= 0
      );
      
      if (invalidPrices.length > 0) {
        setError('გთხოვთ შეიყვანოთ დადებითი რიცხვები ფასებისა და დღეების ველებში');
        setSaving(false);
        return;
      }
      
      // Send updated prices to the API
      await api.put('/api/admin/vip/pricing', { prices: vipPrices }, {
        headers: authHeader()
      });
      
      setSuccess('VIP ფასები წარმატებით განახლდა');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving VIP prices:', err);
      setError('ფასების შენახვა ვერ მოხერხდა');
    } finally {
      setSaving(false);
    }
  };

  // Get a human-readable name for VIP status
  const getVipStatusName = (status: VipStatus): string => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'vip_plus':
        return 'VIP+';
      case 'super_vip':
        return 'SUPER VIP';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* No title needed here as it's already in the parent component */}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
          <div className="p-0.5 bg-green-100 rounded-full text-green-600 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {vipPrices.map((price, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-md ${
                price.vip_status === 'vip' ? 'bg-blue-100 text-blue-600' :
                price.vip_status === 'vip_plus' ? 'bg-purple-100 text-purple-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                <Award size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">{getVipStatusName(price.vip_status)}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="font-bold text-primary">დღიური ფასი</span> (GEL/დღე)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(price.price / price.duration_days).toFixed(2)}
                  onChange={(e) => {
                    const dailyPrice = parseFloat(e.target.value);
                    if (!isNaN(dailyPrice) && dailyPrice > 0) {
                      // Calculate new total price based on daily price and current duration
                      const newTotalPrice = (dailyPrice * price.duration_days).toFixed(2);
                      handlePriceChange(index, 'price', newTotalPrice);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ხანგრძლივობა (დღე)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price.duration_days}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value);
                    if (!isNaN(newDuration) && newDuration > 0) {
                      // Keep the daily price the same, but update the total price
                      const dailyPrice = price.price / price.duration_days;
                      const newTotalPrice = (dailyPrice * newDuration).toFixed(2);
                      handlePriceChange(index, 'duration_days', e.target.value);
                      handlePriceChange(index, 'price', newTotalPrice);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ჯამური ფასი (GEL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price.price}
                  onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-end">
          <button
            onClick={saveVipPrices}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save size={18} />
            <span>{saving ? 'მიმდინარეობს შენახვა...' : 'შენახვა'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VipSettings;
