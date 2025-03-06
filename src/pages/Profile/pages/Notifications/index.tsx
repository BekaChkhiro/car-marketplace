import React from 'react';
import { Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  // TODO: Implement notifications fetching logic
  const notifications: any[] = [];

  if (notifications.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            შეტყობინებები არ არის
          </h3>
          <p className="text-gray-500">
            თქვენ არ გაქვთ ახალი შეტყობინებები
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            {/* Notification item content */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;