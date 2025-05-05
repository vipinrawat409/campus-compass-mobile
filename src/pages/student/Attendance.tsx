
import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Attendance = () => {
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [view, setView] = useState<'monthly' | 'daily'>('monthly');
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025'];
  
  // Mock attendance data
  const attendanceData = {
    monthly: [
      { date: '2025-05-01', status: 'present', day: 'Monday' },
      { date: '2025-05-02', status: 'present', day: 'Tuesday' },
      { date: '2025-05-03', status: 'present', day: 'Wednesday' },
      { date: '2025-05-04', status: 'absent', day: 'Thursday' },
      { date: '2025-05-05', status: 'present', day: 'Friday' },
      { date: '2025-05-06', status: 'present', day: 'Saturday' },
      { date: '2025-05-07', status: 'weekend', day: 'Sunday' },
      { date: '2025-05-08', status: 'present', day: 'Monday' },
      { date: '2025-05-09', status: 'present', day: 'Tuesday' },
      { date: '2025-05-10', status: 'late', day: 'Wednesday' },
      { date: '2025-05-11', status: 'present', day: 'Thursday' },
      { date: '2025-05-12', status: 'present', day: 'Friday' },
      { date: '2025-05-13', status: 'present', day: 'Saturday' },
      { date: '2025-05-14', status: 'weekend', day: 'Sunday' },
      { date: '2025-05-15', status: 'holiday', day: 'Monday' },
      { date: '2025-05-16', status: 'present', day: 'Tuesday' },
      { date: '2025-05-17', status: 'present', day: 'Wednesday' },
      { date: '2025-05-18', status: 'present', day: 'Thursday' },
      { date: '2025-05-19', status: 'absent', day: 'Friday' },
      { date: '2025-05-20', status: 'present', day: 'Saturday' },
      { date: '2025-05-21', status: 'weekend', day: 'Sunday' },
      { date: '2025-05-22', status: 'present', day: 'Monday' },
      { date: '2025-05-23', status: 'present', day: 'Tuesday' },
      { date: '2025-05-24', status: 'present', day: 'Wednesday' },
      { date: '2025-05-25', status: 'present', day: 'Thursday' },
      { date: '2025-05-26', status: 'present', day: 'Friday' },
      { date: '2025-05-27', status: 'present', day: 'Saturday' },
      { date: '2025-05-28', status: 'weekend', day: 'Sunday' },
      { date: '2025-05-29', status: 'present', day: 'Monday' },
      { date: '2025-05-30', status: 'present', day: 'Tuesday' },
      { date: '2025-05-31', status: 'present', day: 'Wednesday' },
    ],
    daily: [
      { period: '1', time: '08:00 - 08:45', subject: 'Mathematics', status: 'present', teacher: 'Mr. Johnson' },
      { period: '2', time: '08:45 - 09:30', subject: 'Science', status: 'present', teacher: 'Mrs. Smith' },
      { period: '3', time: '09:30 - 10:15', subject: 'English', status: 'present', teacher: 'Ms. Davis' },
      { period: '4', time: '10:15 - 11:00', subject: 'Break', status: '-', teacher: '-' },
      { period: '5', time: '11:00 - 11:45', subject: 'History', status: 'late', teacher: 'Mr. Wilson' },
      { period: '6', time: '11:45 - 12:30', subject: 'Geography', status: 'present', teacher: 'Mrs. Taylor' },
      { period: '7', time: '12:30 - 13:15', subject: 'Lunch', status: '-', teacher: '-' },
      { period: '8', time: '13:15 - 14:00', subject: 'Computer Science', status: 'present', teacher: 'Mr. Brown' },
    ]
  };

  // Calculate attendance summary
  const totalDays = attendanceData.monthly.filter(d => d.status !== 'weekend' && d.status !== 'holiday').length;
  const presentDays = attendanceData.monthly.filter(d => d.status === 'present').length;
  const absentDays = attendanceData.monthly.filter(d => d.status === 'absent').length;
  const lateDays = attendanceData.monthly.filter(d => d.status === 'late').length;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Attendance Record</h1>
        <p className="text-gray-500">View and manage your attendance records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Total Days</p>
            <Calendar size={18} className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">{totalDays}</p>
        </div>

        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Present Days</p>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">{presentDays}</p>
        </div>

        <div className="dashboard-card bg-soft-red">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Absent Days</p>
            <XCircle size={18} className="text-red-500" />
          </div>
          <p className="dashboard-stat mt-2">{absentDays}</p>
        </div>

        <div className="dashboard-card bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Attendance</p>
            <Clock size={18} className="text-yellow-600" />
          </div>
          <p className="dashboard-stat mt-2">{attendancePercentage}%</p>
        </div>
      </div>

      <div className="card-wrapper">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="month" className="text-sm font-medium">Month:</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month" className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="year" className="text-sm font-medium">Year:</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year" className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex">
            <Button
              variant={view === 'monthly' ? 'default' : 'outline'}
              className="rounded-r-none"
              onClick={() => setView('monthly')}
            >
              Monthly View
            </Button>
            <Button
              variant={view === 'daily' ? 'default' : 'outline'}
              className="rounded-l-none"
              onClick={() => setView('daily')}
            >
              Daily View
            </Button>
          </div>
        </div>

        {view === 'monthly' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.monthly.map((record, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{record.date.split('-')[2]} {selectedMonth} {selectedYear}</TableCell>
                    <TableCell>{record.day}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs capitalize",
                        record.status === 'present' && "bg-green-100 text-green-800",
                        record.status === 'absent' && "bg-red-100 text-red-800",
                        record.status === 'late' && "bg-yellow-100 text-yellow-800",
                        record.status === 'holiday' && "bg-purple-100 text-purple-800",
                        record.status === 'weekend' && "bg-gray-100 text-gray-800"
                      )}>
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <p className="text-sm text-gray-500 mb-3">Daily attendance for: 05 May, 2025</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.daily.map((record, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{record.period}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.teacher}</TableCell>
                    <TableCell>
                      {record.status !== '-' ? (
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs capitalize",
                          record.status === 'present' && "bg-green-100 text-green-800",
                          record.status === 'absent' && "bg-red-100 text-red-800",
                          record.status === 'late' && "bg-yellow-100 text-yellow-800"
                        )}>
                          {record.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
