import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Container, Loading, Button } from '../../components/ui';
import partService, { Part } from '../../api/services/partService';
import { formatCurrency } from '../../utils/formatters';
import ImageGallery from './components/ImageGallery';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const PartDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadPartDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const partData = await partService.getPartById(id);
        setPart(partData);
      } catch (error) {
        console.error('[PartDetails] Error loading part details:', error);
        showToast('Failed to load part details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadPartDetails();
  }, [id, showToast]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!part || !part.id) return;
    
    setDeleteLoading(true);
    try {
      await partService.deletePart(part.id);
      showToast('Part successfully deleted', 'success');
      navigate('/parts');
    } catch (error) {
      console.error('[PartDetails] Error deleting part:', error);
      showToast('Failed to delete part', 'error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Part Not Found</h1>
          <p className="text-gray-500 mb-6">
            The part you're looking for doesn't exist or may have been removed.
          </p>
          <Link 
            to="/parts"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Browse All Parts
          </Link>
        </div>
      </Container>
    );
  }

  const isOwner = user && user.id === part.seller_id;

  return (
    <Container>
      <div className="mb-6">
        <Link to="/parts" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Parts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="p-4">
            <ImageGallery images={part.images} />
          </div>

          {/* Part Details */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{part.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                part.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {part.condition === 'new' ? 'New' : 'Used'}
              </span>
            </div>

            <div className="mt-4 text-2xl font-bold text-primary">
              {formatCurrency(part.price)}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-500">Brand</h3>
                <p className="font-medium">{part.brand}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Model</h3>
                <p className="font-medium">{part.model}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Category</h3>
                <p className="font-medium">{part.category}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Listed on</h3>
                <p className="font-medium">
                  {new Date(part.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap text-gray-700">
                  {part.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Contact seller button */}
            <div className="mt-8">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => alert('Contact functionality to be implemented')}
              >
                Contact Seller
              </Button>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="mt-4 flex gap-4">
                <Link
                  to={`/profile/edit-part/${part.id}`}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Part"
        message="Are you sure you want to delete this part? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </Container>
  );
};

export default PartDetails;
