import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Container, Button, Loading } from '../../../components/ui';
import partService from '../../../api/services/partService';
import { namespaces } from '../../../i18n';

const EditPart: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(namespaces.parts);
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [part, setPart] = useState<any>(null);
  
  useEffect(() => {
    const loadPart = async () => {
      if (!id) return;
      
      try {
        const partData = await partService.getPartById(parseInt(id));
        setPart(partData);
      } catch (error) {
        console.error('[EditPart] Error loading part:', error);
        showToast(t('loadPartError'), 'error');
        navigate('/profile/parts');
      } finally {
        setLoading(false);
      }
    };
    
    loadPart();
  }, [id, navigate, showToast]);
  
  // Check if user is authorized to edit this part
  useEffect(() => {
    if (part && user && part.user_id !== user.id) {
      showToast(t('noPermissionToEdit'), 'error');
      navigate('/profile/parts');
    }
  }, [part, user, navigate, showToast]);
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t('editPart')}</h1>
        
        <div className="text-center py-8">
          <p>{t('editPartComingSoon')}</p>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/profile/parts')}
            className="mt-4"
          >
            {t('backToMyParts')}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default EditPart;
