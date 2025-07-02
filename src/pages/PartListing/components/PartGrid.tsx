import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Part } from '../../../api/services/partService';
import { useCurrency } from '../../../context/CurrencyContext';
import { namespaces } from '../../../i18n';

interface PartGridProps {
  parts: Part[];
}

const PartGrid: React.FC<PartGridProps> = ({ parts }) => {
  const { t } = useTranslation(namespaces.parts);
  const { convertPrice, formatPrice } = useCurrency();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {parts.map((part) => (
        <Link 
          to={`/${i18n.language || 'ka'}/parts/${part.id}`} 
          key={part.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative">
            {/* Part Image */}
            <img
              src={
                part.images && part.images.length > 0
                  ? part.images.find(img => img.is_primary)?.medium_url || part.images[0].medium_url
                  : '/images/placeholder-part.jpg'
              }
              alt={part.title}
              className="w-full h-48 object-cover"
            />
            
            {/* Condition Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium text-white ${
              part.condition === 'new' ? 'bg-green-600' : 'bg-yellow-600'
            }`}>
              {part.condition === 'new' ? t('new') : t('used')}
            </div>
          </div>
          
          {/* Part Details */}
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{part.title}</h3>
            
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <span className="truncate">{part.brand}</span>
              <span className="mx-1">•</span>
              <span className="truncate">{part.model}</span>
            </div>
            
            {/* Only show category if it's a valid part category (not a vehicle type like 'sedan') */}
            {part.category && !['sedan', 'hatchback', 'suv', 'coupe', 'wagon', 'van', 'convertible', 'pickup'].includes(part.category.toLowerCase()) && (
              <div className="mt-1 text-sm text-gray-600">
                {part.category}
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatPrice(convertPrice(part.price, 'GEL'))}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(part.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PartGrid;
