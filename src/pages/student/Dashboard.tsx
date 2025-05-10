
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import FeeNotification from '@/components/student/FeeNotification';
import StudentFeeHistoryModal from '@/components/modals/StudentFeeHistoryModal';

const StudentDashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Mock student data
  const studentData = {
    name: "John Doe",
    class: "Grade 10-A"
  };
  
  // Mock fee history
  const feeHistory = [
    {
      id: 1,
      feeType: "Tuition Fee",
      amount: 15000,
      dueDate: "2025-04-15",
      paidDate: "2025-04-10",
      status: "Paid"
    },
    {
      id: 2,
      feeType: "Library Fee",
      amount: 500,
      dueDate: "2025-05-15",
      paidDate: null,
      status: "Pending"
    },
    {
      id: 3,
      feeType: "Transport Fee",
      amount: 2000,
      dueDate: "2025-04-30",
      paidDate: "2025-04-28",
      status: "Paid"
    }
  ];

  const openFeeHistory = () => {
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back to your school dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Fee notification section */}
          <FeeNotification />
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={openFeeHistory}>
              View Complete Fee History
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="dashboard-card bg-soft-blue">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="dashboard-label">Attendance</p>
                  <p className="dashboard-stat">92%</p>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card bg-soft-green">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="dashboard-label">Completed Assignments</p>
                  <p className="dashboard-stat">8/10</p>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card bg-soft-purple">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="dashboard-label">Performance</p>
                  <p className="dashboard-stat">A+</p>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card bg-soft-yellow">
              <div className="flex flex-row justify-between">
                <div>
                  <p className="dashboard-label">Upcoming Tests</p>
                  <p className="dashboard-stat">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">Upcoming Events</h3>
            <div className="space-y-1">
              <p className="text-xs flex justify-between">
                <span className="text-gray-700">Science Exhibition</span>
                <span className="text-gray-500">May 15</span>
              </p>
              <p className="text-xs flex justify-between">
                <span className="text-gray-700">Annual Sports Day</span>
                <span className="text-gray-500">May 22</span>
              </p>
              <p className="text-xs flex justify-between">
                <span className="text-gray-700">Mathematics Quiz</span>
                <span className="text-gray-500">May 29</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fee History Modal */}
      <StudentFeeHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        student={studentData}
        feeHistory={feeHistory}
      />
    </div>
  );
};

export default StudentDashboard;
