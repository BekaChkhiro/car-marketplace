import React, { useState } from 'react';
import { useWishlist } from '../../../../context/WishlistContext';
import { useToast } from '../../../../context/ToastContext';
import { Container } from '../../../../components/ui';
import CarGrid from '../../../CarListing/components/CarGrid';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { Car } from '../../../../api/types/car.types';

const WishlistPage: React.FC = () => {
  const { wishlistCars, clearWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      showToast('სასურველების სია გასუფთავდა', 'success');
      setIsConfirmModalOpen(false);
    } catch (err) {
      showToast('ვერ მოხერხდა სასურველების სიის გასუფთავება', 'error');
    }
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCar = async () => {
    if (!carToDelete) return;
    
    try {
      await removeFromWishlist(carToDelete.id);
      showToast('მანქანა წაიშალა სასურველებიდან', 'success');
      setIsDeleteModalOpen(false);
      setCarToDelete(null);
    } catch (err) {
      showToast('ვერ მოხერხდა მანქანის წაშლა სასურველებიდან', 'error');
    }
  };

  return (
    <Container>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0 px-2 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900">სასურველები</h1>
          {wishlistCars.length > 0 && (
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 sm:border-transparent"
            >
              <Trash2 size={18} />
              <span>სიის გასუფთავება</span>
            </button>
          )}
        </div>

        {wishlistCars.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93zM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 013.75 21z" />
              </svg>
            </div>
            <p className="text-gray-500 max-w-xs mx-auto">თქვენი სასურველების სია ცარიელია</p>
          </div>
        ) : (
          <div className="px-1 sm:px-0">
            <CarGrid 
              cars={wishlistCars} 
              categories={[]} 
              inWishlistPage={true}
              onRemoveFromWishlist={handleDeleteCar}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onConfirm={handleClearWishlist}
          onCancel={() => setIsConfirmModalOpen(false)}
          title="სასურველების სიის გასუფთავება"
          message="დარწმუნებული ხართ, რომ გსურთ სასურველების სიის გასუფთავება?"
          confirmText="გასუფთავება"
          cancelText="გაუქმება"
        />
        
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={confirmDeleteCar}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setCarToDelete(null);
          }}
          title="ფავორიტიდან წაშლა"
          message={`დარწმუნებული ხართ, რომ გსურთ წაშალოთ ${carToDelete?.brand} ${carToDelete?.model} სასურველებიდან?`}
          confirmText="წაშლა"
          cancelText="გაუქმება"
        />
      </div>
    </Container>
  );
};

export default WishlistPage;