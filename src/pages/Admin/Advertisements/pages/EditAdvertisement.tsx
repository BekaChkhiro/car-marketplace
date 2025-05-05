import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../../../config/routes';
import AdvertisementForm from '../components/AdvertisementForm';
import advertisementService, { Advertisement } from '../../../../api/services/advertisementService';

const EditAdvertisementPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await advertisementService.getById(parseInt(id, 10));
          setAdvertisement(data);
        }
      } catch (error) {
        console.error('Failed to fetch advertisement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back to the previous page or to the appropriate category page
    if (advertisement?.placement === 'home_slider') {
      navigate(routes.adminAdvertisementsSlider);
    } else if (advertisement?.placement === 'home_banner' || 
              advertisement?.placement === 'car_details_top' || 
              advertisement?.placement === 'car_details_bottom' || 
              advertisement?.placement === 'car_details') {
      navigate(routes.adminAdvertisementsBanners);
    } else if (advertisement?.placement === 'sidebar') {
      navigate(routes.adminAdvertisementsAll);
    } else {
      navigate(routes.adminAdvertisementsAll);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    // Navigate back to the appropriate page after saving
    if (advertisement?.placement === 'home_slider') {
      navigate(routes.adminAdvertisementsSlider);
    } else if (advertisement?.placement === 'home_banner' || 
              advertisement?.placement === 'car_details_top' || 
              advertisement?.placement === 'car_details_bottom' || 
              advertisement?.placement === 'car_details') {
      navigate(routes.adminAdvertisementsBanners);
    } else if (advertisement?.placement === 'sidebar') {
      navigate(routes.adminAdvertisementsAll);
    } else {
      navigate(routes.adminAdvertisementsAll);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">რეკლამა ვერ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div>
      {isModalOpen && (
        <AdvertisementForm 
          advertisement={advertisement} 
          onClose={handleClose} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default EditAdvertisementPage;
