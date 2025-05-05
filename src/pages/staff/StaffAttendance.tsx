
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StaffAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState('May 2025');
  
  const months = ['May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025', 'December 2024'];
  
  // Mock attendance data
  const attendanceStats = {
    present: 22,
    absent: 2,
    halfDay: 1,
    late: 3,
    percentage: 88
  };
  
  const attendanceHistory = [
    { date: '2025-05-01', day: 'Monday', status: 'present', inTime: '08:55 AM', outTime: '04:05 PM' },
    { date: '2025-05-02', day: 'Tuesday', status: 'present', inTime: '08:50 AM', outTime: '04:00 PM' },
    { date: '2025-05-03', day: 'Wednesday', status: 'present', inTime: '08:45 AM', outTime: '04:00 PM' },
    { date: '2025-05-04', day: 'Thursday', status: 'late', inTime: '09:20 AM', outTime: '04:15 PM' },
    { date: '2025-05-05', day: 'Friday', status: 'absent', inTime: '-', outTime: '-' },
    { date: '2025-05-08', day: 'Monday', status: 'present', inTime: '08:50 AM', outTime: '04:00 PM' },
    { date: '2025-05-09', day: 'Tuesday', status: 'halfDay', inTime: '08:45 AM', outTime: '12:30 PM' },
    { date: '2025-05-10', day: 'Wednesday', status: 'present', inTime: '08:55 AM', outTime: '04:00 PM' },
  ];
  
  // Function to get status badge color based on attendance status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'halfDay':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'Late';
      case 'halfDay':
        return 'Half Day';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Staff Attendance</h1>
        <p className="text-gray-500">View your attendance records and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 md:col-span-2 bg-soft-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-semibold">{attendanceStats.percentage}%</p>
            </div>
            <div className="h-20 w-20 rounded-full border-8 border-green-200 flex items-center justify-center">
              <span className="text-xl font-bold text-green-600">{attendanceStats.percentage}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-soft-blue">
          <p className="text-sm text-gray-600">Present Days</p>
          <p className="text-2xl font-semibold mt-1">{attendanceStats.present}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </Card>
        
        <Card className="p-4 bg-soft-red">
          <p className="text-sm text-gray-600">Absent Days</p>
          <p className="text-2xl font-semibold mt-1">{attendanceStats.absent}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </Card>
        
        <Card className="p-4 bg-soft-yellow">
          <p className="text-sm text-gray-600">Late / Half Days</p>
          <p className="text-2xl font-semibold mt-1">{attendanceStats.late + attendanceStats.halfDay}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </Card>
      </div>
      
      <div className="card-wrapper p-6 border rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">Month:</span>
            <Select 
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
                <TableHead>Working Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceHistory.map((record, index) => {
                // Calculate working hours if both in and out times are available
                const workingHours = record.inTime !== '-' && record.outTime !== '-' ? '7.5' : '-';
                
                return (
                  <TableRow key={index}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.day}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {record.inTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {record.outTime}
                      </div>
                    </TableCell>
                    <TableCell>{workingHours}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Note: School working hours are 09:00 AM to 04:00 PM (Monday to Friday)</p>
          <p>Late arrival: Any check-in after 09:15 AM is considered late</p>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
