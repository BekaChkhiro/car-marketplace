import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../../../../config/routes';
import AdvertisementForm from '../components/AdvertisementForm';
import { Advertisement } from '../../../../api/services/advertisementService';

const NewAdvertisementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [initialPlacement, setInitialPlacement] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get placement from query params if available
    const queryParams = new URLSearchParams(location.search);
    const placement = queryParams.get('placement');
    setInitialPlacement(placement);
  }, [location.search]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back to the previous page or to the all advertisements page
    if (initialPlacement === 'home_slider') {
      navigate(routes.adminAdvertisementsSlider);
    } else if (initialPlacement === 'home_banner') {
      navigate(routes.adminAdvertisementsBanners);
    } else if (initialPlacement === 'sidebar') {
      navigate(routes.adminAdvertisementsAll);
    } else {
      navigate(routes.adminAdvertisementsAll);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    // Navigate back to the appropriate page after saving
    if (initialPlacement === 'home_slider') {
      navigate(routes.adminAdvertisementsSlider);
    } else if (initialPlacement === 'home_banner') {
      navigate(routes.adminAdvertisementsBanners);
    } else if (initialPlacement === 'sidebar') {
      navigate(routes.adminAdvertisementsAll);
    } else {
      navigate(routes.adminAdvertisementsAll);
    }
  };

  // Create initial advertisement data with pre-selected placement if available
  const getInitialAdvertisement = (): Advertisement => {
    return {
      id: 0,
      title: '',
      image_url: '',
      placement: initialPlacement || '',
      link_url: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      impressions: 0,
      clicks: 0
    };
  };

  return (
    <div>
      {isModalOpen && (
        <AdvertisementForm 
          advertisement={getInitialAdvertisement()} 
          onClose={handleClose} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default NewAdvertisementPage;
