import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { userProfileService } from '../../api/services/userProfileService';
import { useAuthContext } from '../../context/AuthContext';

interface ProfileCompletionModalProps {
  onComplete: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { refreshUserData } = useAuthContext();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    age: 18,
    gender: 'male',
    phone: ''
  });

  useEffect(() => {
    // Check if profile needs completion
    const checkProfileStatus = async () => {
      try {
        const isCompleted = await userProfileService.getProfileStatus();
        setShow(!isCompleted);
      } catch (error) {
        console.error('Error checking profile status:', error);
        // Default to not showing to avoid blocking the UI in case of error
        setShow(false);
      }
    };

    checkProfileStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone) {
      toast.error(t('Please enter your phone number'));
      return;
    }

    if (formData.age < 18) {
      toast.error(t('You must be at least 18 years old'));
      return;
    }

    setLoading(true);
    try {
      await userProfileService.completeProfile(formData);
      toast.success(t('Profile completed successfully'));
      setShow(false);
      await refreshUserData(); // Refresh user data in auth context
      onComplete();
    } catch (error) {
      console.error('Error completing profile:', error);
      toast.error(t('Failed to complete profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Modal cannot be closed until profile is completed
  const handleClose = () => {
    toast.info(t('Please complete your profile to continue'));
  };

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>{t('Complete Your Profile')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('Please provide a few more details to complete your profile.')}
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('Age')}</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('Gender')}</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="male">{t('Male')}</option>
              <option value="female">{t('Female')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('Phone Number')}</Form.Label>
            <InputGroup>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+995..."
                required
              />
            </InputGroup>
          </Form.Group>

          <div className="d-grid mt-4">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? t('Saving...') : t('Complete Profile')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p className="text-muted small">
          {t('You need to complete your profile before continuing.')}
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileCompletionModal;
