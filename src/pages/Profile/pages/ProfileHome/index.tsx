import React from 'react';
import ProfileInfo from '../../components/ProfileInfo';
import { useAuth } from '../../../../context/AuthContext';

const ProfileHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <ProfileInfo user={user} />
    </div>
  );
};

export default ProfileHome;