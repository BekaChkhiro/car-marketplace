import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Crown } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import partService, { Part } from '../../../../api/services/partService';
import { Button, Loading } from '../../../../components/ui';
import Pagination from '../../../../components/ui/Pagination';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal';
import { formatCurrency } from '../../../../utils/formatters';
import { namespaces } from '../../../../i18n';

const UserParts: React.FC = () => {
  const { t } = useTranslation(namespaces.parts);
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Load user's parts
  useEffect(() => {
    const loadUserParts = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await partService.getPartsByUser(user.id, currentPage);
        setParts(data.parts);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('[UserParts] Error loading parts:', error);
        showToast(t('loadPartsError'), 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserParts();
  }, [user, currentPage, showToast]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle delete click
  const handleDeleteClick = (part: Part) => {
    setPartToDelete(part);
    setDeleteModalOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!partToDelete) return;
    
    setDeleteLoading(true);
    try {
      await partService.deletePart(partToDelete.id);
      showToast(t('partDeleteSuccess'), 'success');
      
      // Remove part from list
      setParts(prev => prev.filter(part => part.id !== partToDelete.id));
      
      // Update count
      setTotalCount(prev => prev - 1);
      
      // Adjust page if needed
      if (parts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('[UserParts] Error deleting part:', error);
      showToast(t('partDeleteError'), 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setPartToDelete(null);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('myParts')}</h2>
        <Link to="/ka/profile/add-part">
          <Button variant="primary">{t('addNewPart')}</Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <>
          {parts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600">{t('noPartsYet')}</h3>
              <p className="text-gray-500 mt-2 mb-4">
                {t('noPartsDescription')}
              </p>
              <Link to="/ka/profile/add-part">
                <Button variant="primary">{t('addFirstPart')}</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Parts List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('partColumn')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('detailsColumn')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('statusColumn')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actionsColumn')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parts.map((part) => (
                      <tr key={part.id}>
                        {/* Part Image and Title */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 relative">
                              <img 
                                className="h-16 w-16 object-cover rounded-md" 
                                src={
                                  part.images && part.images.length > 0
                                    ? (part.images.find(img => img.is_primary)?.thumbnail_url || part.images[0].thumbnail_url)
                                    : '/images/placeholder-part.jpg'
                                }
                                alt={part.title} 
                              />
                              {/* VIP Badge on image */}
                              {part.vip_status && part.vip_status !== 'none' && (
                                <div 
                                  className={`absolute -top-1 -right-1 py-0.5 px-1 rounded text-xs font-bold flex items-center gap-0.5 ${
                                    part.vip_status === 'super_vip' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 
                                    part.vip_status === 'vip_plus' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 
                                    'bg-primary text-white'
                                  } shadow-sm z-10`}
                                >
                                  <Star size={8} fill="currentColor" strokeWidth={0} />
                                  <span className="text-xs">
                                    {part.vip_status === 'super_vip' ? 'SUPER' : 
                                     part.vip_status === 'vip_plus' ? 'VIP+' : 'VIP'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">
                                  <Link to={`/parts/${part.id}`} className="hover:text-primary">
                                    {part.title}
                                  </Link>
                                </div>
                                {/* VIP Badge next to title */}
                                {part.vip_status && part.vip_status !== 'none' && (
                                  <div 
                                    className={`ml-2 py-0.5 px-1.5 rounded text-xs font-bold flex items-center gap-1 ${
                                      part.vip_status === 'super_vip' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 
                                      part.vip_status === 'vip_plus' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 
                                      'bg-primary text-white'
                                    } shadow-sm`}
                                  >
                                    <Star size={10} fill="currentColor" strokeWidth={0} />
                                    <span className="text-xs">
                                      {part.vip_status === 'super_vip' ? t('superVip', 'SUPER VIP') : 
                                       part.vip_status === 'vip_plus' ? t('vipPlus', 'VIP+') : t('vip', 'VIP')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                Added on {new Date(part.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Part Details */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {part.brand} {part.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {part.category} • {part.condition === 'new' ? t('new') : t('used')}
                          </div>
                          <div className="text-sm font-medium text-primary">
                            {formatCurrency(part.price)}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {t('active')}
                          </span>
                        </td>
                        
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {/* VIP Status Button */}
                            {part.vip_status && part.vip_status !== 'none' ? (
                              <button
                                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                                  part.vip_status === 'super_vip' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' :
                                  part.vip_status === 'vip_plus' ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' : 
                                  'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }`}
                                title={`VIP Status: ${part.vip_status === 'super_vip' ? 'SUPER VIP' : part.vip_status === 'vip_plus' ? 'VIP+' : 'VIP'}`}
                              >
                                <Crown size={14} fill="currentColor" />
                                <span className="text-xs font-medium">
                                  {part.vip_status === 'super_vip' ? 'SUPER' : 
                                   part.vip_status === 'vip_plus' ? 'VIP+' : 'VIP'}
                                </span>
                              </button>
                            ) : (
                              <button
                                className="p-1.5 hover:bg-yellow-100 rounded-lg transition-colors"
                                title="Add VIP Status"
                              >
                                <Crown size={14} className="text-gray-600 hover:text-yellow-600" fill="none" />
                              </button>
                            )}
                            <Link 
                              to={`/${localStorage.getItem('i18nextLng') || 'ka'}/profile/parts/edit/${part.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {t('edit')}
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(part)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {t('delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  {totalCount > 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      {t('showing')} {parts.length} {t('of')} {totalCount} {t('parts')}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('deletePart')}
        message={`${t('deleteConfirmation')} <strong>${partToDelete?.title}</strong>. ${t('actionUndone')}`}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default UserParts;
