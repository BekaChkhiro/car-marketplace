import React, { useState } from 'react';
import { useWishlist } from '../../../../context/WishlistContext';
import { useToast } from '../../../../context/ToastContext';
import { Container } from '../../../../components/ui';
import CarGrid from '../../../CarListing/components/CarGrid';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from '../../../../components/ConfirmationModal';

const WishlistPage: React.FC = () => {
  const { wishlistCars, clearWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      showToast('სასურველების სია გასუფთავდა', 'success');
      setIsConfirmModalOpen(false);
    } catch (err) {
      showToast('ვერ მოხერხდა სასურველების სიის გასუფთავება', 'error');
    }
  };

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">სასურველები</h1>
          {wishlistCars.length > 0 && (
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              <span>სიის გასუფთავება</span>
            </button>
          )}
        </div>

        {wishlistCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">თქვენი სასურველების სია ცარიელია</p>
          </div>
        ) : (
          <CarGrid cars={wishlistCars} categories={[]} />
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
      </div>
    </Container>
  );
};

export default WishlistPage;