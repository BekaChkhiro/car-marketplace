import { CircleDollarSign, ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
  currentCurrency: string;
  setCurrentCurrency: (currency: string) => void;
}

const CurrencySelector = ({ currentCurrency, setCurrentCurrency }: CurrencySelectorProps) => {
  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-1.5 text-gray-dark 
          hover:text-primary transition-colors group py-2 px-2
          rounded-lg hover:bg-gray-50"
      >
        <CircleDollarSign className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-sm font-medium min-w-[40px]">{currentCurrency}</span>
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
      </button>
      
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 
        absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg 
        border border-gray-100 py-3 w-48 transition-all duration-300
        transform translate-y-2 group-hover:translate-y-0 z-50">
        <div className="px-4 pb-2 mb-2 border-b border-gray-100">
          <p className="text-sm text-gray-600">მიმდინარე კურსი</p>
          <p className="text-sm font-medium flex items-center space-x-1">
            <span>1 USD</span>
            <span className="text-gray-400">=</span>
            <span className="text-primary">2.65 GEL</span>
          </p>
        </div>
        <button 
          onClick={() => setCurrentCurrency('GEL')}
          className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2
            hover:bg-gray-50 hover:text-primary transition-all duration-200
            ${currentCurrency === 'GEL' ? 'text-primary font-medium bg-gray-50' : 'text-gray-dark'}`}
        >
          <span className="text-lg">🇬🇪</span>
          <span>ლარი (GEL)</span>
        </button>
        <button 
          onClick={() => setCurrentCurrency('USD')}
          className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2
            hover:bg-gray-50 hover:text-primary transition-all duration-200
            ${currentCurrency === 'USD' ? 'text-primary font-medium bg-gray-50' : 'text-gray-dark'}`}
        >
          <span className="text-lg">🇺🇸</span>
          <span>დოლარი (USD)</span>
        </button>
      </div>
    </div>
  );
};

export default CurrencySelector;