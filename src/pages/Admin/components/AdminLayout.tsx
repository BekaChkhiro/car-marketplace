import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 rounded-lg">
      <AdminNavigation />
      <main className="flex-1 rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;