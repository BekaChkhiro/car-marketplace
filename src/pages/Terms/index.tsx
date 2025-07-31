import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buildApiUrl } from '../../utils/api';

interface Term {
  id: number;
  title: string;
  content: string;
  section_order: number;
  created_at: string;
  updated_at: string;
}

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('api/terms'));
      const data = await response.json();
      
      if (data.success) {
        setTerms(data.data);
      } else {
        setError('Failed to load terms and conditions');
      }
    } catch (err) {
      setError('Error loading terms and conditions');
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
        <h1 className="text-3xl font-bold mb-8 text-primary">წესები და პირობები</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">წესები და პირობები</h1>

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
            წესებსა და პირობებზე თანხმობით თქვენ ადასტურებთ, რომ ხართ ქმედუნარიანი, 18
            წელს მიღწეული ფიზიკური პირი ან საქართველოს კანონმდებლობის შესაბამისად
            შექმნილი იურიდიული პირი და ეთანხმებით წინამდებარე წესებს და პირობებს.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsAndConditions;