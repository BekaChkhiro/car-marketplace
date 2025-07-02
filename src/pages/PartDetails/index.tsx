import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Container, Loading, Button } from '../../components/ui';
import partService, { Part } from '../../api/services/partService';
import userService from '../../api/services/userService';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import ImageGallery from './components/ImageGallery';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { Phone, Mail, MapPin, Calendar, Tag, Info, User, DollarSign } from 'lucide-react';
import { namespaces } from '../../i18n';

const PartDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { currency, setCurrency, convertPrice, formatPrice } = useCurrency();
  const { t } = useTranslation([namespaces.parts, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [relatedParts, setRelatedParts] = useState<Part[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    const loadPartDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const partData = await partService.getPartById(id);
        setPart(partData);
        
        // Load related parts (same category or brand)
        setRelatedLoading(true);
        try {
          const filters = {
            category_id: partData.category_id,
            limit: 4,
            excludeId: partData.id
          };
          const relatedData = await partService.getParts(filters);
          setRelatedParts(relatedData.parts || []);
        } catch (error) {
          console.error('[PartDetails] Error loading related parts:', error);
        } finally {
          setRelatedLoading(false);
        }
      } catch (error) {
        console.error('[PartDetails] Error loading part details:', error);
        showToast(t('failedToLoadPartDetails'), 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadPartDetails();
  }, [id, showToast, t]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!part || !part.id) return;
    
    setDeleteLoading(true);
    try {
      await partService.deletePart(part.id);
      showToast(t('partSuccessfullyDeleted'), 'success');
      navigate('/parts');
    } catch (error) {
      console.error('[PartDetails] Error deleting part:', error);
      showToast(t('failedToDeletePart'), 'error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  const handleContactSellerClick = () => {
    setShowContactInfo(true);
  };
  
  // Format the part condition for display
  const getConditionLabel = (condition: string) => {
    return condition === 'new' ? t('new') : t('used');
  };
  
  // Get condition badge color
  const getConditionBadgeClass = (condition: string) => {
    return condition === 'new' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };
  
  // Render a related part card
  const renderRelatedPartCard = (relatedPart: Part) => {
    const primaryImage = relatedPart.images?.find(img => img.is_primary) || relatedPart.images?.[0];
    
    return (
      <Link 
        to={`/${i18n.language || 'ka'}/parts/${relatedPart.id}`} 
        key={relatedPart.id}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="h-40 bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img 
              src={primaryImage.medium_url || primaryImage.url} 
              alt={relatedPart.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Info size={32} />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-800 line-clamp-2">{relatedPart.title}</h3>
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-primary">{formatPrice(convertPrice(relatedPart.price, 'GEL'))}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getConditionBadgeClass(relatedPart.condition)}`}>
              {getConditionLabel(relatedPart.condition)}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading />
        </div>
      </Container>
    );
  }

  if (!part) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">{t('partNotFound')}</h1>
          <p className="text-gray-500 mb-6">
            {t('partNotFoundDescription')}
          </p>
          <Link 
            to={`/${lang}/parts`}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            {t('browseAllParts')}
          </Link>
        </div>
      </Container>
    );
  }

  const isOwner = user && user.id === part.seller_id;

  return (
    <Container>
      <div className="mb-6">
        <Link to={`/${lang}/parts`} className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('backToParts')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="p-4">
            <ImageGallery images={part.images} />
          </div>

          {/* Part Details */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{part.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionBadgeClass(part.condition)}`}>
                {getConditionLabel(part.condition)}
              </span>
            </div>

            <div className="mt-4 text-2xl font-bold text-primary flex items-center gap-2">
              {/* Original prices are in GEL, need to convert and then format */}
              {formatPrice(convertPrice(part.price, 'GEL'))} 
              <button 
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => {
                  const nextCurrency = currency === 'GEL' ? 'USD' : currency === 'USD' ? 'EUR' : 'GEL';
                  setCurrency(nextCurrency);
                }}
                title={t('changeCurrency')}
              >
                <DollarSign size={16} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-500">{t('brand')}</h3>
                <p className="font-medium">{part.brand}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{t('model')}</h3>
                <p className="font-medium">{part.model}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{t('category')}</h3>
                <p className="font-medium">{part.category}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{t('listedOn')}</h3>
                <p className="font-medium">
                  {formatDate(part.created_at)}
                </p>
              </div>
              {part.year && (
                <div>
                  <h3 className="text-sm text-gray-500">{t('year')}</h3>
                  <p className="font-medium">{part.year}</p>
                </div>
              )}
              {part.quantity && (
                <div>
                  <h3 className="text-sm text-gray-500">{t('quantity')}</h3>
                  <p className="font-medium">{part.quantity}</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-2">{t('description')}</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap text-gray-700">
                  {part.description || t('noDescriptionProvided')}
                </p>
              </div>
            </div>

            {/* Seller info */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">{t('sellerInformation')}</h3>
              
              {part ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-500 font-medium text-lg">
                        {part.first_name ? part.first_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {part.first_name && part.last_name ? `${part.first_name} ${part.last_name}` : t('unknownUser')}
                      </h4>
                      <p className="text-sm text-gray-500">{t('memberSince')} {formatDate(part.created_at || '')}</p>
                    </div>
                  </div>
                  
                  {showContactInfo ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {part.phone && (
                        <div className="flex items-center mb-2">
                          <Phone size={16} className="text-gray-500 mr-2" />
                          <a href={`tel:${part.phone}`} className="text-primary hover:underline">
                            {part.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleContactSellerClick}
                    >
                      {t('contactSeller')}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">{t('sellerInfoUnavailable')}</p>
              )}
            </div>
            
            {/* Author info */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">{t('authorInformation') || 'Author Information'}</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-800">
                    {part.author_name || t('unknownUser')}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-500 mr-2" />
                  {part.author_phone ? (
                    <a href={`tel:${part.author_phone}`} className="text-primary hover:underline">
                      {part.author_phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">{t('phoneNumberUnavailable') || 'Phone number unavailable'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/${lang || 'ka'}/profile/parts/edit/${part.id}`}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-center"
                >
                  {t('edit')}
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  {t('delete')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Parts Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('relatedParts')}</h2>
        
        {relatedLoading ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : relatedParts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedParts.map(relatedPart => renderRelatedPartCard(relatedPart))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">{t('noRelatedPartsFound')}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('deletePart')}
        message={t('deletePartConfirmation')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        isLoading={deleteLoading}
      />
    </Container>
  );
};

export default PartDetails;
