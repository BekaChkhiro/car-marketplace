import React, { useState, useEffect } from 'react';
import { Container, Loading } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import autosalonService from '../../../api/services/autosalonService';
import { Autosalon } from '../../../api/types/autosalon.types';
import { Building, Plus, Edit, Trash2, Search, Calendar, Phone, Globe, MapPin } from 'lucide-react';
import AutosalonForm from './components/AutosalonForm';
import Pagination from '../../../components/ui/Pagination';

const AutosalonsAdmin: React.FC = () => {
  const { t } = useTranslation('admin');
  const [autosalons, setAutosalons] = useState<Autosalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAutosalon, setEditingAutosalon] = useState<Autosalon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { showToast } = useToast();

  const fetchAutosalons = async () => {
    try {
      setLoading(true);
      const response = await autosalonService.getAllAutosalons({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (response.success) {
        setAutosalons(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalCount(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching autosalons:', error);
      showToast(t('autosalons.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutosalons();
  }, [currentPage, searchTerm]);

  const handleCreateAutosalon = () => {
    setEditingAutosalon(null);
    setShowForm(true);
  };

  const handleEditAutosalon = (autosalon: Autosalon) => {
    setEditingAutosalon(autosalon);
    setShowForm(true);
  };

  const handleDeleteAutosalon = async (id: number) => {
    if (!window.confirm(t('users.deleteConfirmation'))) {
      return;
    }

    try {
      await autosalonService.deleteAutosalon(id);
      showToast(t('users.deleteSuccess'), 'success');
      fetchAutosalons();
    } catch (error) {
      console.error('Error deleting autosalon:', error);
      showToast(t('users.deleteError'), 'error');
    }
  };

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      setShowForm(false);
      setEditingAutosalon(null);
      fetchAutosalons();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAutosalons();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('autosalons.title')}</h1>
          <button
            onClick={handleCreateAutosalon}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            {t('common.create')} {t('autosalons.title')}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('autosalons.searchAutosalons')}
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
          {t('common.total')}: {totalCount} {t('autosalons.title')}
        </div>

        {/* Autosalons List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {autosalons.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('autosalons.noAutosalonsFound')}</h3>
              <p className="text-gray-500">{t('autosalons.noAutosalonsFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('autosalons.companyName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('autosalons.contactPerson')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.statistics')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('autosalons.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {autosalons.map((autosalon) => (
                    <tr key={autosalon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {autosalon.logo_url ? (
                              <img
                                className="h-10 w-10 rounded-lg object-contain"
                                src={autosalon.logo_url}
                                alt={autosalon.company_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Building className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {autosalon.company_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              {autosalon.established_year && (
                                <>
                                  <Calendar size={12} />
                                  <span>{autosalon.established_year} {t('common.since')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {autosalon.user?.first_name} {autosalon.user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {autosalon.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {autosalon.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              <span>{autosalon.phone}</span>
                            </div>
                          )}
                          {autosalon.website_url && (
                            <div className="flex items-center gap-1">
                              <Globe size={12} />
                              <a
                                href={autosalon.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-secondary"
                              >
                                {autosalon.website_url}
                              </a>
                            </div>
                          )}
                          {autosalon.address && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span className="truncate max-w-xs">{autosalon.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-sm text-gray-900">
                          {autosalon.car_count || 0} {t('cars.title')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(autosalon.created_at).toLocaleDateString('ka-GE')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAutosalon(autosalon)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAutosalon(autosalon.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
          <AutosalonForm
            autosalon={editingAutosalon}
            onClose={() => {
              setShowForm(false);
              setEditingAutosalon(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </Container>
  );
};

export default AutosalonsAdmin;