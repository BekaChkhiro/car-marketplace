import React from 'react';
import { Shield } from 'lucide-react';

const SafetyNotice = () => {
  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
      <Shield className="w-5 h-5 text-primary flex-shrink-0" />
      <p className="text-sm text-gray-600 leading-relaxed">
        უსაფრთხოებისთვის, გთხოვთ შეხვედრა დანიშნოთ საზოგადოებრივ ადგილას და თანხის გადახდა 
        განახორციელოთ მხოლოდ დათვალიერების შემდეგ.
      </p>
    </div>
  );
};

export default SafetyNotice;