import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ადმინ პანელი</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">მომხმარებლები</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">განცხადებები</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">აქტიური VIP</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;