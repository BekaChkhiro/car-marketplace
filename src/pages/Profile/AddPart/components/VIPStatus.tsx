import React, { useState, useEffect } from 'react';
import { Star, Check, AlertCircle, Paintbrush, RefreshCw, Crown, Award, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import vipService, { VipStatus } from '../../../../api/services/vipService';
import vipPricingService, { VipServicePricing } from '../../../../api/services/vipPricingService';
import { useToast } from '../../../../context/ToastContext';

interface VIPStatusProps {
  vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vipDays: number;
  colorHighlighting: boolean;
  colorHighlightingDays: number;
  autoRenewal: boolean;
  autoRenewalDays: number;
  userBalance: number;
  onChange: (field: string, value: any) => void;
}

const VIPStatus: React.FC<VIPStatusProps> = ({ vipStatus, vipDays, colorHighlighting, colorHighlightingDays, autoRenewal, autoRenewalDays, userBalance, onChange }) => {
  const { t } = useTranslation('profile');
  const { showToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedVipStatus, setSelectedVipStatus] = useState<VipStatus>('none');
  const [vipPricing, setVipPricing] = useState<VipServicePricing[]>([]);
  const [additionalServicesPricing, setAdditionalServicesPricing] = useState<VipServicePricing[]>([]);
  const [pricingLoaded, setPricingLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetchVipPricing();
  }, []);



  const fetchVipPricing = async () => {
    try {
      // Force refresh user-specific pricing to get latest data
      const pricingData = await vipPricingService.refreshUserPricing();
      setVipPricing(pricingData.packages);
      setAdditionalServicesPricing(pricingData.additionalServices);
      setPricingLoaded(true);
      console.log('User-specific pricing data (refreshed):', pricingData);

    } catch (error) {
      console.error('Error fetching user-specific VIP pricing:', error);
      // Fallback to general pricing
      try {
        const fallbackData = await vipPricingService.getAllPricing();
        setVipPricing(fallbackData.packages);
        setAdditionalServicesPricing(fallbackData.additionalServices);
        console.log('Fallback pricing data:', fallbackData);
      } catch (fallbackError) {
        console.error('Error fetching fallback VIP pricing:', fallbackError);
      }
      setPricingLoaded(true); // Still set to true to show fallback prices
    }
  };

  const handleStatusChange = (status: 'none' | 'vip' | 'vip_plus' | 'super_vip') => {
    onChange('vip_status', status);
    if (status === 'none') {
      onChange('vip_days', 1);
    }
  };

  const handleColorHighlightingChange = (enabled: boolean) => {
    onChange('color_highlighting', enabled);
    if (enabled && colorHighlightingDays === 0) {
      onChange('color_highlighting_days', 1);
    } else if (!enabled) {
      onChange('color_highlighting_days', 1);
    }
  };

  const handleAutoRenewalChange = (enabled: boolean) => {
    onChange('auto_renewal', enabled);
    if (enabled && autoRenewalDays === 0) {
      onChange('auto_renewal_days', 1);
    } else if (!enabled) {
      onChange('auto_renewal_days', 1);
    }
  };

  const getVipPrice = (status: VipStatus): number => {
    if (status === 'none') {
      const freePricing = vipPricing.find(p => p.service_type === 'free');
      return freePricing ? Number(freePricing.price) : 0;
    }

    if (!pricingLoaded || vipPricing.length === 0) {
      // Fallback prices
      switch (status) {
        case 'vip': return 2;
        case 'vip_plus': return 5;
        case 'super_vip': return 7;
        default: return 0;
      }
    }

    const pricing = vipPricing.find(p => p.service_type === status);
    const price = pricing ? Number(pricing.price) : 0;
    return price;
  };

  // Helper function to format price - shows "Free" if price is 0
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : price || 0;
    return numPrice === 0 ? t('addPart.vipStatus.free') : `${numPrice.toFixed(2)} ${t('addPart.vipStatus.currency')}`;
  };

  // VIP პაკეტის ფასის ფორმატირება - ყოველთვის დღიური ფასი
  const getVipPriceDisplay = (status: VipStatus): string => {
    const price = getVipPrice(status);
    const currency = t('addPart.vipStatus.currency');
    return price === 0 ? t('addPart.vipStatus.free') : `${price} ${currency}/${t('profile:cars.vip.modal.day')}`;
  };


  // Get total price for additional services (calculated with their individual days)
  const getAdditionalServicesPrice = (): number => {
    let price = 0;

    if (colorHighlighting) {
      const colorPricing = additionalServicesPricing.find(s => s.service_type === 'color_highlighting');
      const dailyPrice = colorPricing ? colorPricing.price : 0.5;
      price += dailyPrice * colorHighlightingDays;
    }

    if (autoRenewal) {
      const renewalPricing = additionalServicesPricing.find(s => s.service_type === 'auto_renewal');
      const dailyPrice = renewalPricing ? renewalPricing.price : 0.5;
      price += dailyPrice * autoRenewalDays;
    }

    return price;
  };

  // Get daily price for individual service (not multiplied by days)
  const getAdditionalServicePrice = (serviceType: string): number => {
    const pricing = additionalServicesPricing.find(s => s.service_type === serviceType);
    return pricing ? pricing.price : (serviceType === 'color_highlighting' || serviceType === 'auto_renewal' ? 0.5 : 0);
  };

  // Get total price for VIP status with its days
  const getVipStatusTotalPrice = (status: VipStatus, days: number): number => {
    return getVipPrice(status) * days;
  };

  // Get total price for everything (VIP + additional services)
  const getTotalPrice = (status: VipStatus, days: number = vipDays): number => {
    const vipPrice = getVipStatusTotalPrice(status, days);
    const additionalPrice = getAdditionalServicesPrice();
    return vipPrice + additionalPrice;
  };

  const handlePurchaseClick = (status: VipStatus) => {
    setSelectedVipStatus(status);
    setShowConfirmModal(true);
  };

  const confirmPurchase = async () => {
    if (selectedVipStatus === 'none' && getVipPrice('none') === 0) return;

    const totalPrice = getTotalPrice(selectedVipStatus, vipDays);

    if (userBalance < totalPrice) {
      showToast(t('addPart.vipStatus.insufficientBalance'), 'error');
      setShowConfirmModal(false);
      return;
    }

    setIsPurchasing(true);
    try {
      // The part isn't created yet, so we can't use the purchase API
      // Instead we'll just select the status and it will be applied when the part is created
      handleStatusChange(selectedVipStatus);

      // Also save the additional options state
      onChange('color_highlighting', colorHighlighting);
      onChange('auto_renewal', autoRenewal);

      let additionalServices = [];
      if (colorHighlighting) additionalServices.push(t('addPart.vipStatus.colorHighlighting'));
      if (autoRenewal) additionalServices.push(t('addPart.vipStatus.autoRenewal'));

      const additionalServicesText = additionalServices.length > 0
        ? ` ${t('addPart.vipStatus.additionalServices')}: ${additionalServices.join(', ')}`
        : '';

      const statusName = selectedVipStatus === 'none' ? t('addPart.vipStatus.types.none') : selectedVipStatus === 'vip' ? t('addPart.vipStatus.types.vip') : selectedVipStatus === 'vip_plus' ? t('addPart.vipStatus.types.vip_plus') : t('addPart.vipStatus.types.super_vip');
      const totalCost = getTotalPrice(selectedVipStatus, vipDays);
      showToast(`${statusName}${additionalServicesText} selected for ${vipDays} days. After adding the part, ${totalCost} GEL will be deducted from your balance.`, 'success');
    } catch (error) {
      console.error('Error setting VIP status:', error);
      showToast('Failed to select VIP status', 'error');
    } finally {
      setIsPurchasing(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="text-yellow-500 mr-2" size={20} />
          <h3 className="text-lg font-medium">{t('addPart.vipStatus.titleFull')}</h3>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
          {t('addPart.vipStatus.balance')}: {formatPrice(userBalance || 0)}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {t('addPart.vipStatus.description')}
      </p>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t('addPart.vipStatus.confirmTitle')}</h3>
            <p className="mb-2">
              {t('addPart.vipStatus.confirmQuestion', { status: selectedVipStatus === 'vip' ? t('addPart.vipStatus.types.vip') : selectedVipStatus === 'vip_plus' ? t('addPart.vipStatus.types.vip_plus') : t('addPart.vipStatus.types.super_vip') })}
            </p>

            {/* Show selected additional services */}
            {(colorHighlighting || autoRenewal) && (
              <div className="mb-3 text-sm">
                <p className="font-medium">{t('addPart.vipStatus.additionalServices')}:</p>
                <ul className="list-disc list-inside pl-2">
                  {colorHighlighting && <li>{t('addPart.vipStatus.colorHighlighting')} ({t('addPart.vipStatus.pricePerDay', { price: getAdditionalServicePrice('color_highlighting').toString() })})</li>}
                  {autoRenewal && <li>{t('addPart.vipStatus.autoRenewal')} ({t('addPart.vipStatus.pricePerDay', { price: getAdditionalServicePrice('auto_renewal').toString() })})</li>}
                </ul>
              </div>
            )}

            <p className="mb-6 font-medium">{t('addPart.vipStatus.totalPrice', { price: getTotalPrice(selectedVipStatus, vipDays) })}</p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('addPart.vipStatus.cancel')}
              </button>
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing || userBalance < getTotalPrice(selectedVipStatus, vipDays)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPurchasing ? t('addPart.vipStatus.processing') : t('addPart.vipStatus.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Services - Card-based Design */}
      <div className="mb-6">
        <h4 className="font-medium mb-4">{t('addPart.vipStatus.additionalServices')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Color Highlighting Card */}
          <div className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 ${
            colorHighlighting ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
          }`} onClick={() => handleColorHighlightingChange(!colorHighlighting)}>
            {colorHighlighting && (
              <div className="absolute top-3 right-3">
                <Check className="text-blue-600" size={20} />
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <Paintbrush className="text-blue-500" size={24} />
              <h5 className="font-semibold text-lg text-blue-700">{t('addPart.vipStatus.colorHighlighting')}</h5>
            </div>
            <p className="text-sm text-gray-600 mb-3">{t('addPart.vipStatus.colorHighlightingDescription')}</p>
            <div className="flex items-center justify-between text-sm font-medium text-blue-700 mb-3">
              <span>{getAdditionalServicePrice('color_highlighting').toString() === '0.00' ? t('addPart.vipStatus.free') : `${getAdditionalServicePrice('color_highlighting')} ${t("addPart.vipStatus.currency")}/${t('profile:cars.vip.modal.day')}`}</span>
            </div>
            
            {/* Days input for Color Highlighting */}
            {colorHighlighting && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <select
                    value={colorHighlightingDays}
                    onChange={(e) => {
                      const days = parseInt(e.target.value) || 1;
                      onChange('color_highlighting_days', days);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <span className="text-sm text-blue-600">{t('profile:cars.vip.modal.days')}</span>
                  <div className="ml-auto text-sm font-medium text-blue-700">
                    {formatPrice(getAdditionalServicePrice('color_highlighting') * colorHighlightingDays)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auto Renewal Card */}
          <div className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 ${
            autoRenewal ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
          }`} onClick={() => handleAutoRenewalChange(!autoRenewal)}>
            {autoRenewal && (
              <div className="absolute top-3 right-3">
                <Check className="text-green-600" size={20} />
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="text-green-500" size={24} />
              <h5 className="font-semibold text-lg text-green-700">{t('addPart.vipStatus.autoRenewal')}</h5>
            </div>
            <p className="text-sm text-gray-600 mb-3">{t('addPart.vipStatus.autoRenewalDescription')}</p>
            <div className="flex items-center justify-between text-sm font-medium text-green-700 mb-3">
              <span>{getAdditionalServicePrice('auto_renewal').toString() === '0.00' ? t('addPart.vipStatus.free') : `${getAdditionalServicePrice('auto_renewal')} ${t("addPart.vipStatus.currency")}/${t('profile:cars.vip.modal.day')}`}</span>
            </div>
            
            {/* Days input for Auto Renewal */}
            {autoRenewal && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <select
                    value={autoRenewalDays}
                    onChange={(e) => {
                      const days = parseInt(e.target.value) || 1;
                      onChange('auto_renewal_days', days);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <span className="text-sm text-green-600">{t('profile:cars.vip.modal.days')}</span>
                  <div className="ml-auto text-sm font-medium text-green-700">
                    {formatPrice(getAdditionalServicePrice('auto_renewal') * autoRenewalDays)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h4 className="font-medium mb-4">{t('addPart.vipStatus.title')}</h4>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${vipStatus === 'none' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          onClick={() => handleStatusChange('none')}
        >
          {vipStatus === 'none' && (
            <div className="absolute top-3 right-3">
              <Check className="text-blue-600" size={24} />
            </div>
          )}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-gray-500" size={24} />
              <h4 className="font-semibold m-0 text-lg">{t('addPart.vipStatus.types.none')}</h4>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {getVipPrice('none') === 0 ? t('addPart.vipStatus.free') : getVipPriceDisplay('none')}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('addPart.vipStatus.descriptions.none')}</p>

          {/* Days input field for 'none' status if it has a price */}
          {vipStatus === 'none' && getVipPrice('none') > 0 && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <select
                  value={vipDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    onChange('vip_days', days);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 px-2 py-1 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <span className="text-sm text-blue-600">{t('profile:cars.vip.modal.days')}</span>
                <div className="ml-auto text-sm font-medium text-blue-700">
                  {formatPrice(getVipStatusTotalPrice('none', vipDays))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${vipStatus === 'vip' ? 'border-yellow-500 bg-yellow-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          onClick={() => handleStatusChange('vip')}
        >
          {vipStatus === 'vip' && (
            <div className="absolute top-3 right-3">
              <Check className="text-yellow-600" size={24} />
            </div>
          )}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-500" size={24} fill="currentColor" />
                <Award className="text-yellow-500" size={20} />
              </div>
              <Crown className="text-yellow-500" size={28} fill="currentColor" />
              <h4 className="font-semibold m-0 text-lg text-yellow-700">{t('addPart.vipStatus.types.vip')}</h4>
            </div>
            <span className="text-sm font-medium text-yellow-700">
              {getVipPrice("vip") === 0 ? t('addPart.vipStatus.free') : getVipPriceDisplay('vip')}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('addPart.vipStatus.descriptions.vip')}</p>

          {/* Days input field for VIP status */}
          {vipStatus === 'vip' && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <select
                  value={vipDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    onChange('vip_days', days);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 px-2 py-1 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <span className="text-sm text-yellow-600">{t('profile:cars.vip.modal.days')}</span>
                <div className="ml-auto text-sm font-medium text-yellow-700">
                  {formatPrice(getVipStatusTotalPrice('vip', vipDays))}
                </div>
              </div>
            </div>
          )}

          {userBalance < getTotalPrice('vip', vipDays) && (
            <div className="flex items-center mt-3 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addPart.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>

        <div
          className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${vipStatus === 'vip_plus' ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          onClick={() => handleStatusChange('vip_plus')}
        >
          {vipStatus === 'vip_plus' && (
            <div className="absolute top-3 right-3">
              <Check className="text-orange-600" size={24} />
            </div>
          )}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="text-orange-500" size={24} fill="currentColor" />
                <Star className="text-orange-500" size={24} fill="currentColor" />
                <Zap className="text-orange-500" size={20} />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="text-orange-500" size={28} fill="currentColor" />
                <h4 className="font-semibold m-0 text-lg text-orange-700">{t('addPart.vipStatus.types.vip_plus')}</h4>
              </div>

            </div>
            <span className="text-sm font-medium text-orange-700">
              {getVipPrice("vip_plus") === 0 ? t('addPart.vipStatus.free') : getVipPriceDisplay('vip_plus')}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('addPart.vipStatus.descriptions.vip_plus')}</p>

          {/* Days input field for VIP Plus status */}
          {vipStatus === 'vip_plus' && (
            <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <select
                  value={vipDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    onChange('vip_days', days);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 px-2 py-1 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <span className="text-sm text-orange-600">{t('profile:cars.vip.modal.days')}</span>
                <div className="ml-auto text-sm font-medium text-orange-700">
                  {formatPrice(getVipStatusTotalPrice('vip_plus', vipDays))}
                </div>
              </div>
            </div>
          )}

          {userBalance < getTotalPrice('vip_plus', vipDays) && (
            <div className="flex items-center mt-3 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addPart.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>

        <div
          className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${vipStatus === 'super_vip' ? 'border-purple-500 bg-purple-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
            }`}
          onClick={() => handleStatusChange('super_vip')}
        >
          {vipStatus === 'super_vip' && (
            <div className="absolute top-3 right-3">
              <Check className="text-purple-600" size={24} />
            </div>
          )}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Crown className="text-purple-500" size={28} fill="currentColor" />
                <Star className="text-purple-500" size={20} fill="currentColor" />
                <Star className="text-purple-500" size={20} fill="currentColor" />
                <Star className="text-purple-500" size={20} fill="currentColor" />
              </div>
              <Crown className="text-purple-500" size={28} fill="currentColor" />
              <h4 className="font-semibold m-0 text-lg text-purple-700">{t('addPart.vipStatus.types.super_vip')}</h4>
            </div>
            <span className="text-sm font-medium text-purple-700">
              {getVipPrice("super_vip") === 0 ? t('addPart.vipStatus.free') : getVipPriceDisplay('super_vip')}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('addPart.vipStatus.descriptions.super_vip')}</p>

          {/* Days input field for Super VIP status */}
          {vipStatus === 'super_vip' && (
            <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <select
                  value={vipDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    onChange('vip_days', days);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 px-2 py-1 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <span className="text-sm text-purple-600">{t('profile:cars.vip.modal.days')}</span>
                <div className="ml-auto text-sm font-medium text-purple-700">
                  {formatPrice(getVipStatusTotalPrice('super_vip', vipDays))}
                </div>
              </div>
            </div>
          )}

          {userBalance < getTotalPrice('super_vip', vipDays) && (
            <div className="flex items-center mt-3 text-xs text-red-500">
              <AlertCircle size={12} className="mr-1" />
              <span>{t('addPart.vipStatus.insufficientBalance')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Summary */}
      {(vipStatus !== 'none' || getVipPrice('none') > 0 || colorHighlighting || autoRenewal) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3">{t('addCars.vipStatus.priceSummary', { defaultValue: 'Price Summary' })}</h4>
          <div className="space-y-2 text-sm">
            {(vipStatus !== 'none' || getVipPrice('none') > 0) && (
              <div className="flex justify-between">
                <span>
                  {t(`addPart.vipStatus.types.${vipStatus}`)} ({vipDays} {vipDays === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days')})
                </span>
                <span className="font-medium">
                  {formatPrice(getVipStatusTotalPrice(vipStatus, vipDays))}
                </span>
              </div>
            )}
            {colorHighlighting && (
              <div className="flex justify-between">
                <span>
                  {t('addPart.vipStatus.colorHighlighting')} ({colorHighlightingDays} {colorHighlightingDays === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days')})
                </span>
                <span className="font-medium">
                  {formatPrice(getAdditionalServicePrice('color_highlighting') * colorHighlightingDays)}
                </span>
              </div>
            )}
            {autoRenewal && (
              <div className="flex justify-between">
                <span>
                  {t('addPart.vipStatus.autoRenewal')} ({autoRenewalDays} {autoRenewalDays === 1 ? t('profile:cars.vip.modal.day') : t('profile:cars.vip.modal.days')})
                </span>
                <span className="font-medium">
                  {formatPrice(getAdditionalServicePrice('auto_renewal') * autoRenewalDays)}
                </span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>{t('cars.vip.modal.totalPrice')}:</span>
              <span className="text-blue-600">
                {formatPrice(getTotalPrice(vipStatus, vipDays))}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t('cars.vip.modal.yourBalance')}</span>
              <span>{formatPrice(userBalance || 0)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Function to get VIP status features for localization
const getVipStatusFeatures = (status: VipStatus, t: any): string[] => {
  switch (status) {
    case 'vip':
      return t('addPart.vipStatus.features.vip', { returnObjects: true }) || [];
    case 'vip_plus':
      return t('addPart.vipStatus.features.vip_plus', { returnObjects: true }) || [];
    case 'super_vip':
      return t('addPart.vipStatus.features.super_vip', { returnObjects: true }) || [];
    default:
      return [];
  }
};

export default VIPStatus;