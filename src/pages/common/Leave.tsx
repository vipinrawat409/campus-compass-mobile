import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StaffLeave from '../staff/StaffLeave';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Leave = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Render appropriate leave component based on user role
  const renderLeaveComponent = () => {
    switch (user.role) {
      case 'student':
        return <StudentLeave />;
      case 'teacher':
        return <TeacherLeave />;
      case 'staff':
        return <StaffLeave />;
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

// Let's create placeholder components for missing leave types
const StudentLeave = () => (
  <div className="space-y-6">
    <h1 className="page-title">Student Leave Management</h1>
    <p className="text-gray-500">Manage your leave applications</p>
    {/* Student-specific leave content here */}
  </div>
);

const TeacherLeave = () => {
  // This component needs proper Tabs structure
  const [activeTab, setActiveTab] = React.useState('pending');

  return (
    <div className="space-y-6">
      <h1 className="page-title">Teacher Leave Management</h1>
      <p className="text-gray-500">Apply for and track your leave applications</p>
      
      <div className="card-wrapper">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Leave Applications</h2>
          <button className="btn-primary">Apply for Leave</button>
        </div>
        
        {/* Fix: Wrapping TabsContent in Tabs component */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {/* Content for the active tab */}
            <div>
              <p>Leave data for {activeTab} tab will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leave;
