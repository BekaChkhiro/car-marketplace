import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-[280px] bg-white shadow-xl">
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Menu Content */}
          <div className="p-4">
            <nav className="space-y-2">
              {/* Add your menu items here */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;