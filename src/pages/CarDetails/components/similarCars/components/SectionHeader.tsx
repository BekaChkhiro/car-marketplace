import React from 'react';

const SectionHeader: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        მსგავსი მანქანები
      </h2>
      <p className="mt-2 text-gray-600">
        აღმოაჩინეთ სხვა მანქანები, რომლებიც შეესაბამება თქვენს მოთხოვნებს
      </p>
    </div>
  );
};

export default SectionHeader;