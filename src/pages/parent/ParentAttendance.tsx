
import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import ChildSelector, { ChildData } from '@/components/parent/ChildSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParentAttendance = () => {
  // Mock children data
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const [selectedChild, setSelectedChild] = useState<ChildData>(children[0]);
  const [activeTab, setActiveTab] = useState("monthly");
  
  // Mock attendance data for each child and month
  const attendanceData = {
    1: {
      // For Sarah
      monthly: {
        totalDays: 22,
        present: 20,
        absent: 2,
        percentage: 90.9,
      },
      daily: [
        { date: "2025-05-01", status: "present", comment: null },
        { date: "2025-05-02", status: "present", comment: null },
        { date: "2025-05-03", status: "weekend", comment: null },
        { date: "2025-05-04", status: "weekend", comment: null },
        { date: "2025-05-05", status: "present", comment: null },
        { date: "2025-05-06", status: "present", comment: null },
        { date: "2025-05-07", status: "present", comment: null },
        { date: "2025-05-08", status: "present", comment: null },
        { date: "2025-05-09", status: "absent", comment: "Medical" },
        { date: "2025-05-10", status: "weekend", comment: null },
        { date: "2025-05-11", status: "weekend", comment: null },
        { date: "2025-05-12", status: "present", comment: null },
      ]
    },
    2: {
      // For John
      monthly: {
        totalDays: 22,
        present: 18,
        absent: 4,
        percentage: 81.8,
      },
      daily: [
        { date: "2025-05-01", status: "absent", comment: "Sick leave" },
        { date: "2025-05-02", status: "absent", comment: "Sick leave" },
        { date: "2025-05-03", status: "weekend", comment: null },
        { date: "2025-05-04", status: "weekend", comment: null },
        { date: "2025-05-05", status: "present", comment: null },
        { date: "2025-05-06", status: "present", comment: null },
        { date: "2025-05-07", status: "present", comment: null },
        { date: "2025-05-08", status: "present", comment: null },
        { date: "2025-05-09", status: "present", comment: null },
        { date: "2025-05-10", status: "weekend", comment: null },
        { date: "2025-05-11", status: "weekend", comment: null },
        { date: "2025-05-12", status: "present", comment: null },
      ]
    }
  };

  // Get current child's attendance
  const currentAttendance = attendanceData[selectedChild.id as keyof typeof attendanceData];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
      </div>
      
      <ChildSelector 
        children={children} 
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />

      <div className="card-wrapper">
        <h2 className="text-lg font-medium mb-4">
          {selectedChild.name}'s Attendance
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="dashboard-card bg-soft-blue">
            <p className="dashboard-label">Total Days</p>
            <p className="dashboard-stat mt-2">{currentAttendance.monthly.totalDays}</p>
          </div>
          <div className="dashboard-card bg-soft-green">
            <p className="dashboard-label">Present</p>
            <p className="dashboard-stat mt-2">{currentAttendance.monthly.present}</p>
          </div>
          <div className="dashboard-card bg-soft-yellow">
            <p className="dashboard-label">Absent</p>
            <p className="dashboard-stat mt-2">{currentAttendance.monthly.absent}</p>
          </div>
          <div className="dashboard-card bg-soft-purple">
            <p className="dashboard-label">Percentage</p>
            <p className="dashboard-stat mt-2">{currentAttendance.monthly.percentage}%</p>
          </div>
        </div>
        
        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-4">
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{width: `${currentAttendance.monthly.percentage}%`}}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Attendance Rate</span>
                <span className="font-medium">{currentAttendance.monthly.percentage}%</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentAttendance.daily.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1 ${
                          record.status === 'present' ? 'text-green-600' :
                          record.status === 'absent' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {record.status === 'present' ? (
                            <><CheckCircle className="h-4 w-4" /> Present</>
                          ) : record.status === 'absent' ? (
                            <><XCircle className="h-4 w-4" /> Absent</>
                          ) : (
                            <><Calendar className="h-4 w-4" /> Weekend</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.comment || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentAttendance;
