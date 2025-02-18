import { Globe, ChevronDown } from 'lucide-react';

interface Language {
  id: string;
  name: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  languages: Language[];
  onLanguageChange: (langName: string) => void;
}

const LanguageSelector = ({ currentLanguage, languages, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-1.5 text-gray-dark 
          hover:text-primary transition-colors group py-2"
      >
        <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-sm">{currentLanguage}</span>
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
      </button>
      
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 
        absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg 
        border border-gray-100 py-2 w-40 transition-all duration-300
        transform translate-y-2 group-hover:translate-y-0">
        {languages.filter(lang => lang.name !== currentLanguage).map(lang => (
          <button 
            key={lang.id}
            onClick={() => onLanguageChange(lang.name)}
            className="w-full text-left px-4 py-2 text-sm text-gray-dark 
              hover:bg-gray-50 hover:text-primary transition-colors
              hover:pl-6 duration-200"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;