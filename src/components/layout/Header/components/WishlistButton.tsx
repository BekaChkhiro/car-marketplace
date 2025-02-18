import { Heart } from 'lucide-react';

const WishlistButton = () => {
  return (
    <button className="flex items-center space-x-1.5 text-gray-dark 
      hover:text-primary transition-colors group relative">
      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs 
        rounded-full w-4 h-4 flex items-center justify-center">0</span>
    </button>
  );
};

export default WishlistButton;