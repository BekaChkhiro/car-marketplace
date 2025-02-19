import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <h3 className="text-xl text-gray-800 font-semibold mb-2">მსგავსი მანქანები ვერ მოიძებნა</h3>
      <p className="text-gray-600">
        ამჟამად მსგავსი მანქანები არ არის ხელმისაწვდომი. გთხოვთ სცადოთ მოგვიანებით.
      </p>
    </div>
  );
};

export default EmptyState;