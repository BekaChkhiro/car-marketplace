import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buildApiUrl } from '../../utils/api';

interface Term {
  id: number;
  title: string;
  content: string;
  title_ka: string;
  title_en: string | null;
  title_ru: string | null;
  content_ka: string;
  content_en: string | null;
  content_ru: string | null;
  section_order: number;
  created_at: string;
  updated_at: string;
}

const TermsAndConditions: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current language, default to Georgian
  const currentLanguage = i18n.language === 'en' ? 'en' : i18n.language === 'ru' ? 'ru' : 'ka';

  useEffect(() => {
    fetchTerms();
  }, [currentLanguage]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`api/terms?lang=${currentLanguage}`));
      const data = await response.json();
      
      if (data.success) {
        setTerms(data.data);
      } else {
        setError(t('common:failedToLoadTerms'));
      }
    } catch (err) {
      setError(t('common:errorLoadingTerms'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          {t('common:termsAndConditions')}
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">{t('common:termsAndConditions')}</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        {terms.map((term) => (
          <section key={term.id}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{term.title}</h2>
            {term.content && (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap">{term.content}</div>
              </div>
            )}
          </section>
        ))}

        <section className="border-t pt-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('common:termsAgreementFooter')}
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsAndConditions;