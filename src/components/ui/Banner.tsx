import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { AdModal } from './AdModal';

interface BannerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
}

const sizes = {
  small: {
    width: '300px',
    height: '100px',
    text: '300x100'
  },
  medium: {
    width: '300px',
    height: '250px',
    text: '300x250'
  },
  large: {
    width: '728px',
    height: '90px',
    text: '728x90'
  }
};

const variants = {
  primary: 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200',
  secondary: 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
  accent: 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
};

export const Banner: React.FC<BannerProps> = ({ 
  className,
  size = 'medium',
  variant = 'primary',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sizeConfig = sizes[size];
  const variantStyle = variants[variant];

  const handleClick = () => {
    setIsModalOpen(true);
    onClick?.();
  };

  return (
    <>
      <div 
        className={cn(
          variantStyle,
          'rounded-xl p-4 text-center transition-all duration-300',
          'border border-gray-100',
          'relative overflow-hidden cursor-pointer',
          isHovered && 'shadow-lg scale-[1.02]',
          className
        )}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          margin: '0 auto'
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2 relative z-10">
          <div className="text-gray-600 text-sm uppercase tracking-wider font-medium">
            სარეკლამო ადგილი
          </div>
          <div className="text-gray-500 text-xs">
            {sizeConfig.text}
          </div>
          <div className={cn(
            "text-primary text-xs mt-2 underline-offset-4",
            isHovered ? "underline text-primary-dark" : "no-underline"
          )}>
            დაჯავშნე რეკლამა
          </div>
        </div>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0",
          "transition-opacity duration-1000",
          isHovered && "opacity-20 translate-x-full"
        )} />
      </div>

      <AdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={sizeConfig.text}
      />
    </>
  );
};

export default Banner;