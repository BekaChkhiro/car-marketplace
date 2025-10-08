import React from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

// Import images directly
import visaLogo from '../../../../assets/images/visa-logo-small.webp';
// Use the simplified SVG for MasterCard to avoid namespace issues
import mastercardLogo from '../../../../assets/images/simple-mastercard.svg';

const PaymentMethods: React.FC = () => {
  const { t } = useTranslation(namespaces.footer);

  return (
    <div className="payment-methods">
      <h3 className="text-lg font-semibold mb-4">{t('paymentMethods.title')}</h3>
      <div className="flex items-center space-x-4">
        <img src={visaLogo} alt={t('paymentMethods.visa')} className="h-8" width="99" height="32" />
        <img src={mastercardLogo} alt={t('paymentMethods.mastercard')} className="h-8" width="50" height="32" />
      </div>
    </div>
  );
};

export default PaymentMethods;
