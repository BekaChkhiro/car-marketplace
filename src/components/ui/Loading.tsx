import React from 'react';

type LoadingProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export const Loading: React.FC<LoadingProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  };

  const containerClasses = {
    small: 'min-h-[100px]',
    medium: 'min-h-[200px]',
    large: 'min-h-[300px]'
  };

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary border-t-transparent`}></div>
    </div>
  );
};
