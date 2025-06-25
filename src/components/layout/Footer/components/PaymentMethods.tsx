import React from 'react';

// Import the logo files
import visaLogo from '../../../../assets/images/visa-logo.webp';
import mastercardLogo from '../../../../assets/images/mastercard-logo.svg';

const PaymentMethods: React.FC = () => {
  return (
    <div className="payment-methods">
      <h3 className="text-lg font-semibold mb-4">გადახდის მეთოდები</h3>
      <div className="flex items-center space-x-4">
        <img src={visaLogo} alt="Visa" className="h-8" />
        <img src={mastercardLogo} alt="Mastercard" className="h-8" />
      </div>
    </div>
  );
};

export default PaymentMethods;
