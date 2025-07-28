import React, { useState, useEffect } from 'react';
import { Save, Award, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../../api/config/api';
import { authHeader } from '../../../utils';
import { VipPrice, VipStatus } from '../../../api/services/vipService';
import vipPricingService from '../../../api/services/vipPricingService';

// Interface for the VIP price form
interface VipPriceForm {
  service_type: string;
  price: number;
  duration_days: number;
  user_role: string;
  category?: string;
}

// Available user roles
type UserRole = 'user' | 'dealer' | 'autosalon';

// Available categories
type Category = 'cars' | 'parts';

const USER_ROLES: UserRole[] = ['user', 'dealer', 'autosalon'];
const CATEGORIES: Category[] = ['cars', 'parts'];

const VipSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [vipPrices, setVipPrices] = useState<Record<UserRole, VipPriceForm[]>>({} as Record<UserRole, VipPriceForm[]>);
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [activeCategory, setActiveCategory] = useState<Category>('cars');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current VIP prices on component mount and when category changes
  useEffect(() => {
    fetchVipPrices();
  }, [activeCategory]);

  // Function to fetch VIP prices from the API
  const fetchVipPrices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/vip/pricing?grouped=true&category=${activeCategory}`, {
        headers: authHeader()
      });
      
      if (response.data && response.data.data) {
        const groupedData = response.data.data;
        const organizedPrices: Record<UserRole, VipPriceForm[]> = {} as Record<UserRole, VipPriceForm[]>;
        
        // Organize data by role
        USER_ROLES.forEach(role => {
          if (groupedData[role]) {
            organizedPrices[role] = groupedData[role];
          } else {
            // Fallback to default prices if role data doesn't exist
            organizedPrices[role] = [
              { service_type: 'free', price: 0, duration_days: 30, user_role: role },
              { service_type: 'vip', price: 2, duration_days: 1, user_role: role },
              { service_type: 'vip_plus', price: 5, duration_days: 1, user_role: role },
              { service_type: 'super_vip', price: 7, duration_days: 1, user_role: role },
              { service_type: 'color_highlighting', price: 0.5, duration_days: 1, user_role: role },
              { service_type: 'auto_renewal', price: 0.5, duration_days: 1, user_role: role }
            ];
          }
        });
        
        setVipPrices(organizedPrices);
      } else {
        // Fallback to default prices for all roles
        const fallbackPrices: Record<UserRole, VipPriceForm[]> = {} as Record<UserRole, VipPriceForm[]>;
        USER_ROLES.forEach(role => {
          fallbackPrices[role] = [
            { service_type: 'free', price: 0, duration_days: 30, user_role: role },
            { service_type: 'vip', price: 2, duration_days: 1, user_role: role },
            { service_type: 'vip_plus', price: 5, duration_days: 1, user_role: role },
            { service_type: 'super_vip', price: 7, duration_days: 1, user_role: role },
            { service_type: 'color_highlighting', price: 0.5, duration_days: 1, user_role: role },
            { service_type: 'auto_renewal', price: 0.5, duration_days: 1, user_role: role }
          ];
        });
        setVipPrices(fallbackPrices);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching VIP prices:', err);
      setError(t('vipSettings.errorLoadingPrices'));
      
      // Set default prices for all roles if API fails
      const fallbackPrices: Record<UserRole, VipPriceForm[]> = {} as Record<UserRole, VipPriceForm[]>;
      USER_ROLES.forEach(role => {
        fallbackPrices[role] = [
          { service_type: 'free', price: 0, duration_days: 30, user_role: role },
          { service_type: 'vip', price: 2, duration_days: 1, user_role: role },
          { service_type: 'vip_plus', price: 5, duration_days: 1, user_role: role },
          { service_type: 'super_vip', price: 7, duration_days: 1, user_role: role },
          { service_type: 'color_highlighting', price: 0.5, duration_days: 1, user_role: role },
          { service_type: 'auto_renewal', price: 0.5, duration_days: 1, user_role: role }
        ];
      });
      setVipPrices(fallbackPrices);
    } finally {
      setLoading(false);
    }
  };

  // Handle price input change
  const handlePriceChange = (index: number, field: keyof VipPriceForm, value: any) => {
    const updatedPrices = { ...vipPrices };
    const rolePrices = [...updatedPrices[activeRole]];
    
    // Convert to number if the field is price or duration_days
    if (field === 'price' || field === 'duration_days') {
      rolePrices[index][field] = Number(value);
    } else {
      rolePrices[index][field] = value;
    }
    
    updatedPrices[activeRole] = rolePrices;
    setVipPrices(updatedPrices);
  };

  // Save updated VIP prices
  const saveVipPrices = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Flatten all role prices for validation and saving
      const allPrices = Object.values(vipPrices).flat();
      
      // Validate prices before saving
      const invalidPrices = allPrices.filter(price => 
        isNaN(price.price) || price.price < 0 || 
        isNaN(price.duration_days) || price.duration_days <= 0
      );
      
      if (invalidPrices.length > 0) {
        setError(t('vipSettings.positiveNumbersRequired'));
        setSaving(false);
        return;
      }
      
      // Send updated prices to the API with is_daily_price set to true for all services and include category
      const pricesToSave = allPrices.map(price => ({
        ...price,
        is_daily_price: true,
        category: activeCategory
      }));
      
      await api.put('/api/admin/vip/pricing', { prices: pricesToSave }, {
        headers: authHeader()
      });
      
      setSuccess(t('vipSettings.pricesUpdatedSuccess'));
      
      // Clear the VIP pricing cache so changes reflect immediately
      vipPricingService.clearCache();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving VIP prices:', err);
      setError(t('vipSettings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  // Get a human-readable name for service type
  const getServiceTypeName = (serviceType: string): string => {
    return t(`vipSettings.serviceTypes.${serviceType}`, serviceType);
  };

  // Get a human-readable name for user role
  const getRoleName = (role: UserRole): string => {
    const roleNames = {
      user: t('vipSettings.roles.user', 'Regular User'),
      dealer: t('vipSettings.roles.dealer', 'Dealer'),
      autosalon: t('vipSettings.roles.autosalon', 'Autosalon')
    };
    return roleNames[role];
  };

  // Get a human-readable name for category
  const getCategoryName = (category: Category): string => {
    const categoryNames = {
      cars: t('vipSettings.categories.cars', 'Cars'),
      parts: t('vipSettings.categories.parts', 'Parts')
    };
    return categoryNames[category];
  };

  // Get icon color for service type
  const getServiceTypeColor = (serviceType: string): string => {
    switch (serviceType) {
      case 'free':
        return 'bg-gray-100 text-gray-600';
      case 'vip':
        return 'bg-blue-100 text-blue-600';
      case 'vip_plus':
        return 'bg-purple-100 text-purple-600';
      case 'super_vip':
        return 'bg-amber-100 text-amber-600';
      case 'color_highlighting':
        return 'bg-green-100 text-green-600';
      case 'auto_renewal':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const currentRolePrices = vipPrices[activeRole] || [];

  return (
    <div>
      {/* Category Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === category
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {USER_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeRole === role
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getRoleName(role)}
              </button>
            ))}
          </nav>
        </div>
      </div>

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

      {/* Current Category and Role Indicator */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-700 text-sm font-medium">
          {t('vipSettings.currentlyEditing', 'Currently editing prices for:')} <span className="font-bold">{getCategoryName(activeCategory)} - {getRoleName(activeRole)}</span>
        </p>
      </div>

      <div className="space-y-6">
        {currentRolePrices.map((price, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-md ${getServiceTypeColor(price.service_type)}`}>
                <Award size={20} />
              </div>
              <h3 className="font-semibold text-gray-800">{getServiceTypeName(price.service_type)}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="font-bold text-primary">{t('vipSettings.fields.price')}</span> ({t('vipSettings.fields.currency')})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price.price}
                  onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vipSettings.fields.effectiveCost')}
                </label>
                <div className="p-2 bg-gray-100 rounded-md text-sm text-gray-700">
                  {`${price.price} ${t('vipSettings.fields.perDay')}`}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {t('vipSettings.saveAllRoles', 'Saving will update prices for all user roles.')}
          </p>
          <button
            onClick={saveVipPrices}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save size={18} />
            <span>{saving ? t('vipSettings.actions.saving') : t('vipSettings.actions.save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VipSettings;
