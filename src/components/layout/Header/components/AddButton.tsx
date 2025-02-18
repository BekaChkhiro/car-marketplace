import { Plus } from 'lucide-react';

const AddButton = () => {
  return (
    <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 
      rounded-xl hover:bg-secondary transition-all duration-200 
      transform hover:scale-105 shadow-sm hover:shadow-md">
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">დამატება</span>
    </button>
  );
};

export default AddButton;