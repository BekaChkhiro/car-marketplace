import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { namespaces } from '../../../../i18n';

const SearchButton: React.FC = () => {
  const { t } = useTranslation([namespaces.header]);
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentLang = lang || 'ka';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/${currentLang}/cars?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
        aria-label={t('search')}
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:inline text-sm font-medium">{t('search')}</span>
      </button>

      {isSearchOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-3 z-50 border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">{t('search')}</h3>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={16} 
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-primary text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-dark transition-colors"
            >
              {t('search')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchButton;
