import React, { useEffect, useState } from 'react';

// Import components
import PartsList from './components/PartsList';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// Import service and types
import partService from '../../../api/services/partService';
import { Part } from '../../../api/services/partService';

const AdminParts: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await partService.getParts();
      setParts(response.parts);
    } catch (error) {
      console.error('Error fetching parts:', error);
      setError('ნაწილების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleDeletePart = async (partId: string) => {
    try {
      await partService.deletePart(Number(partId));
      setParts(prevParts => prevParts.filter(part => part.id.toString() !== partId));
    } catch (error) {
      console.error('Error deleting part:', error);
      setError('ნაწილის წაშლა ვერ მოხერხდა');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchParts} />;
  }

  return <PartsList parts={parts} onDeletePart={handleDeletePart} />;
};

export default AdminParts;
