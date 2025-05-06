
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StaffLeave from '../staff/StaffLeave';
import TeacherLeave from '../teacher/TeacherLeave';
import ParentLeave from '../parent/ParentLeave';

const Leave = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Render appropriate leave component based on user role
  const renderLeaveComponent = () => {
    switch (user.role) {
      case 'teacher':
        return <TeacherLeave />;
      case 'staff':
        return <StaffLeave />;
      case 'parent':
        return <ParentLeave />;
      default:
        return <div className="p-6">Leave management is not available for your role.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderLeaveComponent()}
    </div>
  );
};

export default Leave;
