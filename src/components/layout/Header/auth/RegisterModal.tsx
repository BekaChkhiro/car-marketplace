import { useState } from 'react';
import Modal from './Modal';
import { Check } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
      </div>
      <div className={`w-16 h-1 ${currentStep === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        2
      </div>
    </div>
  </div>
);

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      console.log('Registration attempt:', formData);
    }
  };

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          სახელი
        </label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="შეიყვანეთ სახელი"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          გვარი
        </label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="შეიყვანეთ გვარი"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ტელეფონი
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="+995"
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ელ-ფოსტა
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="შეიყვანეთ ელ-ფოსტა"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          პაროლი
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="შეიყვანეთ პაროლი"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          გაიმეორეთ პაროლი
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
          required
          placeholder="გაიმეორეთ პაროლი"
        />
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="რეგისტრაცია">
      <StepIndicator currentStep={step} />
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? renderStep1() : renderStep2()}

        <div className="flex items-center justify-between gap-4">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors"
            >
              უკან
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium text-base"
          >
            {step === 1 ? 'შემდეგი' : 'რეგისტრაცია'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          უკვე გაქვთ ანგარიში?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-secondary font-medium transition-colors hover:underline"
          >
            შესვლა
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default RegisterModal;