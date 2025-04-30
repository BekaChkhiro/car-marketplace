import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import advertisementService, { Advertisement } from '../../../../api/services/advertisementService';
import { routes } from '../../../../config/routes';
import AdvertisementsList from '../components/AdvertisementsList';
import AdvertisementForm from '../components/AdvertisementForm';

const AllAdvertisementsPage: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdvertisement, setCurrentAdvertisement] = useState<Advertisement | null>(null);
  const navigate = useNavigate();

  const fetchAdvertisements = async () => {
    setIsLoading(true);
    try {
      const data = await advertisementService.getAll();
      setAdvertisements(data);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const handleEdit = (advertisement: Advertisement) => {
    setCurrentAdvertisement(advertisement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('ნამდვილად გსურთ რეკლამის წაშლა?')) {
      try {
        await advertisementService.delete(id);
        setAdvertisements(advertisements.filter(ad => ad.id !== id));
      } catch (error) {
        console.error('Failed to delete advertisement:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setCurrentAdvertisement(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    fetchAdvertisements();
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ყველა რეკლამა</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          რეკლამის დამატება
        </button>
      </div>

      <AdvertisementsList 
        advertisements={advertisements} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isModalOpen && (
        <AdvertisementForm
          advertisement={currentAdvertisement}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AllAdvertisementsPage;
