import React from 'react';

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};
