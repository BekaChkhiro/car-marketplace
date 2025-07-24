import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Part } from '../../../../api/services/partService';
import EmptyState from './EmptyState';

interface PartsListProps {
  parts: Part[];
  onDeletePart: (id: string) => void;
  isLoading?: boolean;
}

const PartsList: React.FC<PartsListProps> = ({ 
  parts,
  onDeletePart,
  isLoading = false
}) => {
  const { t } = useTranslation('admin');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  
  const partsPerPage = 10;
  
  // Set filtered parts to all parts
  useEffect(() => {
    setFilteredParts(parts);
  }, [parts]);
  
  // Pagination calculations
  const indexOfLastItem = currentPage * partsPerPage;
  const indexOfFirstItem = indexOfLastItem - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParts.length / partsPerPage);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('ka-GE', options);
  };
  
  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{t('available')}</span>;
      case 'sold':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">{t('sold')}</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">{t('pending')}</span>;
      default:
        return null;
    }
  };

  // Handle empty state
  if (!isLoading && filteredParts.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('parts.title')}</h1>
          <p className="text-gray-500 mt-1">{t('parts.title')}</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const handleDeleteClick = (part: Part) => {
    setPartToDelete(part);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (partToDelete) {
      onDeletePart(partToDelete.id.toString());
      setShowDeleteConfirm(false);
      setPartToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setPartToDelete(null);
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('parts.title')}</h1>
        <p className="text-gray-500 mt-1">{t('parts.title')}</p>
      </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.name')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.category')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.seller')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.price')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.condition')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('parts.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 mr-4">
                        <img 
                          src={part.images[0]?.url || '/images/parts-placeholder.jpg'} 
                          alt={part.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{part.title}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {part.brand} {part.model && `- ${part.model}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t('parts.condition')}: {part.condition}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {part.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {part.username || part.first_name || part.last_name || t('common.unknown')}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {part.seller_id || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{part.price.toLocaleString()} ₾</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(part.condition)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/${lang || 'ka'}/parts/${part.id}`)}
                        className="px-3 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center transition-colors"
                      >
                        <Eye size={16} className="mr-1.5" /> {t('parts.view')}
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(part)}
                        className="px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded flex items-center transition-colors"
                      >
                        <Trash2 size={16} className="mr-1.5" /> {t('parts.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View (shown only on mobile) */}
        <div className="md:hidden">
          <div className="grid gap-4 p-4">
            {currentParts.map((part) => {
              return (
                <div 
                  key={part.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="flex items-center p-4 border-b border-gray-100">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 mr-4">
                      <img 
                        src={part.images[0]?.url || '/images/parts-placeholder.jpg'} 
                        alt={part.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-md">{part.title}</p>
                      <p className="text-sm text-gray-500">
                        {part.brand} {part.model && `- ${part.model}`}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="font-semibold text-md text-gray-900">{part.price.toLocaleString()} ₾</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Part Info */}
                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg">
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xs text-gray-500">{t('parts.category')}</span>
                        <span className="text-sm font-medium text-gray-800">{part.category}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xs text-gray-500">{t('parts.condition')}</span>
                        <span className="text-sm font-medium text-gray-800">{part.condition}</span>
                      </div>
                    </div>
                    
                    {/* Seller Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">{t('parts.seller')}</div>
                      <div className="text-sm font-medium text-gray-900">
                        {part.username || part.first_name || part.last_name || t('common.unknown')}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {part.seller_id || 'N/A'}
                      </div>
                    </div>
                    
                    {/* Status Section */}
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      {getStatusBadge(part.condition)}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {t('parts.createdAt')}: {formatDate(part.created_at)}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50">
                    <div className="text-xs text-gray-500">
                      ID: {part.id}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/${lang || 'ka'}/parts/${part.id}`)}
                        className="p-2 text-blue-700 bg-blue-50 rounded-lg flex items-center"
                      >
                        <Eye size={16} className="mr-1" /> 
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(part)}
                        className="p-2 text-red-700 bg-red-50 rounded-lg flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" /> 
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {t('common.showing')} <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredParts.length)}</span> {t('common.of')} <span className="font-medium">{filteredParts.length}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">{t('common.previous')}</span>
            </button>
            <span className="px-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg min-w-[70px] text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              className={`px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-sm ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="hidden sm:inline">{t('common.next')}</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-right">
        <button 
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} /> {t('common.refresh')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('parts.delete')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('users.deleteConfirmation')} "{partToDelete?.title}"?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsList;
