import React, { useState, useEffect } from 'react';
import { Car } from '../../../../api/types/car.types';
import vipService, { VipStatus } from '../../../../api/services/vipService';
import { X, Check, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VipStatusModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const VipStatusModal: React.FC<VipStatusModalProps> = ({
  car,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const { t } = useTranslation('admin');
  const [selectedStatus, setSelectedStatus] = useState<VipStatus>('none');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && car.vip_status) {
      setSelectedStatus(car.vip_status as VipStatus);
    } else {
      setSelectedStatus('none');
    }
    
    if (isOpen && car.vip_expiration_date) {
      // Format date as YYYY-MM-DD for input
      const date = new Date(car.vip_expiration_date);
      setExpirationDate(date.toISOString().split('T')[0]);
    } else {
      // Default to 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setExpirationDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [isOpen, car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await vipService.updateVipStatus(
        car.id,
        selectedStatus,
        expirationDate ? new Date(expirationDate).toISOString() : undefined
      );
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onStatusUpdate();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('cars.vipUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadgeStyle = (status: VipStatus) => {
    switch (status) {
      case 'vip':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'vip_plus':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'super_vip':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
    }
  };

  const getStatusLabel = (status: VipStatus) => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'vip_plus':
        return 'VIP+';
      case 'super_vip':
        return 'SUPER VIP';
      default:
        return t('cars.noVip');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('cars.vipManagement')}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="text-green-600" size={28} />
            </div>
            <p className="text-lg font-medium text-gray-900">{t('cars.statusUpdated')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {car.brand} {car.model} - {t('cars.selectVipStatus')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['none', 'vip', 'vip_plus', 'super_vip'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status as VipStatus)}
                    className={`p-3 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? `${getStatusBadgeStyle(status as VipStatus)} ring-2 ring-offset-2 ring-blue-500`
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {getStatusLabel(status as VipStatus)}
                  </button>
                ))}
              </div>
            </div>

            {selectedStatus !== 'none' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {t('cars.expirationDate')}
                  </div>
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VipStatusModal;
