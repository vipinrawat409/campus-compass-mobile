
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import StaffLeave from '../staff/StaffLeave';
import TeacherLeave from '../teacher/TeacherLeave';
import ParentLeave from '../parent/ParentLeave';
import StudentAttendance from '../teacher/StudentAttendance';
import StudentMarks from '../teacher/StudentMarks';

const Leave = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  if (!user) return null;

  // Special handling for teacher routes
  if (user.role === 'teacher') {
    if (path === '/dashboard/student-attendance') {
      return <StudentAttendance />;
    }
    
    if (path === '/dashboard/student-marks') {
      return <StudentMarks />;
    }

    if (path === '/dashboard/leave') {
      return <TeacherLeave />;
    }
  }

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
