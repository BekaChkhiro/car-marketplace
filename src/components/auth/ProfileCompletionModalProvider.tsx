import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import ProfileCompletionModal from './ProfileCompletionModal';
import { userProfileService } from '../../api/services/userProfileService';

interface ProfileCompletionModalProviderProps {
  children: React.ReactNode;
}

const ProfileCompletionModalProvider: React.FC<ProfileCompletionModalProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (isAuthenticated && user) {
        // If we have profile_completed field on the user object, use it
        if (user.profile_completed !== undefined) {
          setShowModal(!user.profile_completed);
          setCheckingStatus(false);
          return;
        }

        // Otherwise check with the server
        try {
          setCheckingStatus(true);
          const isCompleted = await userProfileService.getProfileStatus();
          setShowModal(!isCompleted);
        } catch (error) {
          console.error('Error checking profile status:', error);
          // Default to not showing to avoid blocking the UI in case of error
          setShowModal(false);
        } finally {
          setCheckingStatus(false);
        }
      } else {
        setShowModal(false);
        setCheckingStatus(false);
      }
    };

    checkProfileStatus();
  }, [isAuthenticated, user]);

  const handleProfileComplete = () => {
    setShowModal(false);
  };

  if (checkingStatus) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showModal && <ProfileCompletionModal onComplete={handleProfileComplete} />}
    </>
  );
};

export default ProfileCompletionModalProvider;
