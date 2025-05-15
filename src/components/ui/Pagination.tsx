import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      // If current page is close to the start
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, '...', totalPages - 1);
      } 
      // If current page is close to the end
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1);
      } 
      // If current page is in the middle
      else {
        pageNumbers.push(
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...'
        );
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-1 ${className}`}>
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md flex items-center justify-center ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <button
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center text-gray-500">
              {page}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md flex items-center justify-center ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
