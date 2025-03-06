import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={`flex space-x-4 border-b border-gray-200 mb-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = value === selectedValue;
  
  return (
    <button
      className={`px-4 py-2 font-medium text-base transition-all duration-200 border-b-2 -mb-[1px] ${
        isSelected 
          ? 'text-primary border-primary' 
          : 'text-gray-600 border-transparent hover:text-gray-800'
      } ${className || ''}`}
      onClick={() => onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  if (value !== context.value) return null;
  
  return (
    <div className={`py-4 ${className || ''}`}>
      {children}
    </div>
  );
};