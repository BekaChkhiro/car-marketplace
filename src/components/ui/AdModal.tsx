import React from 'react';
import { cn } from '../../lib/utils';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  size: string;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  size
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">დაჯავშნე სარეკლამო ადგილი</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">არჩეული ზომა:</p>
            <p className="font-medium text-gray-800">{size}</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              საკონტაქტო ინფორმაცია
            </label>
            <input
              type="email"
              placeholder="თქვენი ელ-ფოსტა"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="tel"
              placeholder="ტელეფონის ნომერი"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              დამატებითი შენიშვნა
            </label>
            <textarea
              placeholder="დაწერეთ თქვენი მოთხოვნები..."
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            გაუქმება
          </button>
          <button
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            გაგზავნა
          </button>
        </div>
      </div>
    </div>
  );
};