
import React, { useState } from 'react';
import { Calendar, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

const Attendance = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('May 2025');
  
  // Available months for the dropdown
  const months = ['May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025'];
  
  // Mock attendance data
  const attendanceData = {
    student: 'Alice Johnson',
    class: '10-A',
    summary: {
      present: 92,
      absent: 3,
      leave: 5,
      total: 100,
      percentage: 92
    },
    monthlyData: {
      'May 2025': [
        { date: '2025-05-01', status: 'present', day: 'Monday' },
        { date: '2025-05-02', status: 'present', day: 'Tuesday' },
        { date: '2025-05-03', status: 'holiday', day: 'Wednesday', reason: 'School Holiday' },
        { date: '2025-05-04', status: 'present', day: 'Thursday' },
        { date: '2025-05-05', status: 'present', day: 'Friday' },
        { date: '2025-05-06', status: 'weekend', day: 'Saturday' },
        { date: '2025-05-07', status: 'weekend', day: 'Sunday' },
        { date: '2025-05-08', status: 'present', day: 'Monday' },
        { date: '2025-05-09', status: 'present', day: 'Tuesday' },
        { date: '2025-05-10', status: 'present', day: 'Wednesday' },
        { date: '2025-05-11', status: 'absent', day: 'Thursday' },
        { date: '2025-05-12', status: 'present', day: 'Friday' },
        { date: '2025-05-13', status: 'weekend', day: 'Saturday' },
        { date: '2025-05-14', status: 'weekend', day: 'Sunday' },
        { date: '2025-05-15', status: 'leave', day: 'Monday', reason: 'Medical' }
      ],
      'April 2025': [
        { date: '2025-04-01', status: 'present', day: 'Monday' },
        { date: '2025-04-02', status: 'present', day: 'Tuesday' },
        { date: '2025-04-03', status: 'present', day: 'Wednesday' }
      ]
    }
  };
  
  const currentMonthData = attendanceData.monthlyData[selectedMonth as keyof typeof attendanceData.monthlyData] || [];
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'leave':
        return 'bg-yellow-500';
      case 'holiday':
        return 'bg-purple-500';
      case 'weekend':
        return 'bg-gray-300';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Helper function to get status text
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Helper function to navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = months.indexOf(selectedMonth);
    if (direction === 'prev' && currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1]);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Attendance</h1>
        <p className="text-gray-500">View your attendance records</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="dashboard-card bg-soft-blue">
          <p className="dashboard-label">Total Days</p>
          <p className="dashboard-stat mt-2">{attendanceData.summary.total}</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <p className="dashboard-label">Present</p>
          <p className="dashboard-stat mt-2">{attendanceData.summary.present}</p>
        </div>
        <div className="dashboard-card bg-soft-yellow">
          <p className="dashboard-label">Absent</p>
          <p className="dashboard-stat mt-2">{attendanceData.summary.absent}</p>
        </div>
        <div className="dashboard-card bg-soft-purple">
          <p className="dashboard-label">Leave</p>
          <p className="dashboard-stat mt-2">{attendanceData.summary.leave}</p>
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{width: `${attendanceData.summary.percentage}%`}}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Attendance Rate</span>
            <span className="font-medium">{attendanceData.summary.percentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Monthly Attendance</h3>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('prev')}
              disabled={months.indexOf(selectedMonth) === months.length - 1}
            >
              <ChevronLeft size={18} />
            </Button>
            <select 
              className="px-3 py-1.5 border rounded-md bg-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('next')}
              disabled={months.indexOf(selectedMonth) === 0}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentMonthData.map((record, index) => {
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short'
            });
            
            return (
              <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(record.status)} text-white`}>
                    {record.status === 'present' ? (
                      <Check size={16} />
                    ) : record.status === 'absent' ? (
                      <X size={16} />
                    ) : (
                      <Calendar size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{formattedDate}</div>
                    <div className="text-xs text-gray-500">{record.day}</div>
                  </div>
                </div>
                <div className="text-sm">
                  {record.status === 'leave' || record.status === 'holiday' ? (
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {getStatusText(record.status)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{record.reason}</div>
                    </div>
                  ) : record.status === 'weekend' ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Weekend
                    </span>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(record.status)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
