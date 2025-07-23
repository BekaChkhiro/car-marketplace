import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface DaysSelectorProps {
  daysCount: number;
  onChange: (days: number) => void;
  options?: number[];
  minDays?: number;
  maxDays?: number;
  disabled?: boolean;
  fixedDuration?: boolean;
}

const DaysSelector: React.FC<DaysSelectorProps> = ({
  daysCount,
  onChange,
  options = [1, 3, 7, 14, 30],
  minDays = 1,
  maxDays = 30,
  disabled = false,
  fixedDuration = false
}) => {
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDays, setCustomDays] = useState<string>(daysCount.toString());

  // დღეების რაოდენობის ცვლილების დამუშავება
  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // მხოლოდ ციფრების დაშვება
    if (/^\d*$/.test(value)) {
      setCustomDays(value);
    }
  };

  // ღილაკზე დაჭერისას ან ინფუთის დასრულებისას დღეების განახლება
  const handleCustomDaysSubmit = () => {
    const days = parseInt(customDays, 10);
    console.log(`Custom days input: ${customDays}, parsed: ${days}`);

    if (!isNaN(days) && days >= minDays && days <= maxDays) {
      // დავრწმუნდეთ, რომ გადავცემთ რიცხვს და არა სტრიქონს
      onChange(Number(days));
      setShowCustomInput(false);
    } else {
      // თუ არასწორი მნიშვნელობაა, დავაბრუნოთ მიმდინარე დღეების რაოდენობა
      setCustomDays(daysCount.toString());
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">{t('profile:cars.vip.modal.daysCount')}</label>

      {/* ფიქსირებული ვადის შეტყობინება */}
      {fixedDuration && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            {t('profile:cars.vip.modal.fixedDurationMessage') + daysCount + " " + t('profile:cars.vip.modal.day')}
          </p>
        </div>
      )}

      {/* სწრაფი არჩევის ღილაკები */}
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map(days => (
          <button
            key={days}
            type="button"
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-sm ${daysCount === days && !showCustomInput
                ? 'bg-primary text-white'
                : disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => {
              if (!disabled) {
                onChange(Number(days)); // გადავცეთ რიცხვით ტიპად
                setShowCustomInput(false);
                setCustomDays(days.toString());
              }
            }}
          >
            {days} {t('common:days')}
          </button>
        ))}

        {/* მორგებული არჩევის ღილაკი */}
        <button
          type="button"
          disabled={disabled}
          className={`px-3 py-1.5 rounded-lg text-sm ${showCustomInput
              ? 'bg-primary text-white'
              : disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          onClick={() => {
            if (!disabled) {
              setShowCustomInput(true);
              setCustomDays(daysCount.toString());
            }
          }}
        >
          {t('common:other')}
        </button>
      </div>

      {/* მორგებული დღეების შეყვანის ველი */}
      {showCustomInput && !disabled && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-24"
            value={customDays}
            onChange={handleCustomDaysChange}
            onBlur={handleCustomDaysSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomDaysSubmit()}
            autoFocus
            disabled={disabled}
          />
          <span className="text-gray-600">{t('common:days')} ({minDays}-{maxDays})</span>
          <button
            type="button"
            className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleCustomDaysSubmit}
            disabled={disabled}
          >
            {t('common:select')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DaysSelector;
