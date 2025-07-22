import React, { useState, useEffect } from 'react';
import { Container, Loading } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import dealerService from '../../../api/services/dealerService';
import { Dealer } from '../../../api/types/dealer.types';
import { Building, Plus, Edit, Trash2, Search, Calendar, Phone, Globe, MapPin } from 'lucide-react';
import DealerForm from './components/DealerForm';
import Pagination from '../../../components/ui/Pagination';

const DealersAdmin: React.FC = () => {
  const { t } = useTranslation('admin');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { showToast } = useToast();

  const fetchDealers = async () => {
    try {
      setLoading(true);
      console.log('Fetching dealers with params:', {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
      
      const response = await dealerService.getAllDealers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      console.log('Dealers API response:', response);
      console.log('Type of response.data:', typeof response.data);
      console.log('Is response.data an array?', Array.isArray(response.data));

      if (response.success) {
        console.log('Setting dealers:', response.data);
        console.log('Is dealers array?', Array.isArray(response.data));
        setDealers(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalCount(response.meta?.total || 0);
      } else {
        console.log('API call failed:', response);
        showToast(t('dealers.error'), 'error');
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
      showToast('დილერების ჩამოტვირთვა ვერ მოხერხდა', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [currentPage, searchTerm]);

  const handleCreateDealer = () => {
    setEditingDealer(null);
    setShowForm(true);
  };

  const handleEditDealer = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setShowForm(true);
  };

  const handleDeleteDealer = async (id: number) => {
    if (!window.confirm(t('users.deleteConfirmation'))) {
      return;
    }

    try {
      await dealerService.deleteDealer(id);
      showToast(t('users.deleteSuccess'), 'success');
      fetchDealers();
    } catch (error) {
      console.error('Error deleting dealer:', error);
      showToast(t('users.deleteError'), 'error');
    }
  };

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      setShowForm(false);
      setEditingDealer(null);
      fetchDealers();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDealers();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('dealers.title')}</h1>
          <button
            onClick={handleCreateDealer}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            {t('common.create')} {t('dealers.title')}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('dealers.searchDealers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.search')}
            </button>
          </form>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          {t('common.total')}: {totalCount} {t('dealers.title')}
        </div>

        {/* Dealers List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {dealers.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dealers.noDealersFound')}</h3>
              <p className="text-gray-500">{t('dealers.noDealersFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dealers.companyName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dealers.contactPerson')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.statistics')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dealers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(dealers) ? dealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {dealer.logo_url ? (
                              <img
                                className="h-10 w-10 rounded-lg object-contain"
                                src={dealer.logo_url}
                                alt={dealer.company_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Building className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dealer.company_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              {dealer.established_year && (
                                <>
                                  <Calendar size={12} />
                                  <span>{dealer.established_year} {t('common.since')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {dealer.user?.first_name} {dealer.user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dealer.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {dealer.user?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              <span>{dealer.user.phone}</span>
                            </div>
                          )}
                          {dealer.website_url && (
                            <div className="flex items-center gap-1">
                              <Globe size={12} />
                              <a
                                href={dealer.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-secondary"
                              >
                                {t('common.website')}
                              </a>
                            </div>
                          )}
                          {dealer.address && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span className="truncate max-w-xs">{dealer.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-sm text-gray-900">
                          {dealer.car_count || 0} {t('cars.title')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(dealer.created_at).toLocaleDateString('ka-GE')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditDealer(dealer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDealer(dealer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5} className="text-center py-4">{t('common.noData')}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <DealerForm
            dealer={editingDealer}
            onClose={() => {
              setShowForm(false);
              setEditingDealer(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </Container>
  );
};

export default DealersAdmin;