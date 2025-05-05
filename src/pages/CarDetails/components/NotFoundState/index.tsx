import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui';
import { ArrowLeft } from 'lucide-react';

const NotFoundState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[70vh] py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">მანქანა ვერ მოიძებნა</h2>
            <p className="text-gray-600 text-center mb-8">მითითებული ID-ით მანქანა ვერ მოიძებნა.</p>
            <div className="flex justify-center">
              <Link to="/cars" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                დაბრუნდი მანქანების სიაში
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundState;
