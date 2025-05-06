
import React, { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, Clock, User } from 'lucide-react';
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
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

const StudentAttendance = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('8-A');
  const [selectedDate, setSelectedDate] = useState('2025-05-06');
  const [attendanceUpdated, setAttendanceUpdated] = useState(false);
  
  // Mock data for classes this teacher teaches
  const teacherClasses = ['8-A', '9-B', '10-A'];
  
  // Mock student data with leave information
  const studentsData = [
    { id: 1, name: 'Emma Thompson', rollNo: '8A01', status: 'present', leaveApplied: false },
    { id: 2, name: 'James Wilson', rollNo: '8A02', status: 'absent', leaveApplied: true, leaveReason: 'Family wedding', leaveDates: '2025-05-06 to 2025-05-08' },
    { id: 3, name: 'Oliver Brown', rollNo: '8A03', status: 'present', leaveApplied: false },
    { id: 4, name: 'Sophia Martinez', rollNo: '8A04', status: 'present', leaveApplied: false },
    { id: 5, name: 'Benjamin Anderson', rollNo: '8A05', status: 'late', leaveApplied: false },
    { id: 6, name: 'Mia Johnson', rollNo: '8A06', status: 'absent', leaveApplied: true, leaveReason: 'Medical appointment', leaveDates: '2025-05-06' },
    { id: 7, name: 'William Davis', rollNo: '8A07', status: 'present', leaveApplied: false },
    { id: 8, name: 'Isabella Miller', rollNo: '8A08', status: 'present', leaveApplied: false },
    { id: 9, name: 'Henry Taylor', rollNo: '8A09', status: 'present', leaveApplied: false },
    { id: 10, name: 'Charlotte Wilson', rollNo: '8A10', status: 'absent', leaveApplied: false },
  ];
  
  const [students, setStudents] = useState(studentsData);
  
  // Attendance statistics
  const presentCount = students.filter(student => student.status === 'present').length;
  const absentCount = students.filter(student => student.status === 'absent').length;
  const lateCount = students.filter(student => student.status === 'late').length;
  const leaveCount = students.filter(student => student.leaveApplied).length;
  const attendancePercentage = Math.round((presentCount / students.length) * 100);
  
  // Handle status change
  const handleStatusChange = (studentId: number, newStatus: string) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return { ...student, status: newStatus };
      }
      return student;
    });
    setStudents(updatedStudents);
    setAttendanceUpdated(true);
  };
  
  // Submit attendance
  const handleSubmitAttendance = () => {
    toast({
      title: "Attendance Submitted",
      description: `Attendance for Class ${selectedClass} on ${new Date(selectedDate).toLocaleDateString()} has been recorded.`
    });
    setAttendanceUpdated(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Attendance</h1>
        <p className="text-gray-500">Mark and manage attendance for your class</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Present</p>
            <CheckCircle size={18} className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">{presentCount}</p>
          <p className="text-xs text-gray-500 mt-1">{attendancePercentage}% of class</p>
        </Card>
        
        <Card className="p-4 bg-soft-red">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Absent</p>
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <p className="dashboard-stat mt-2">{absentCount}</p>
          <p className="text-xs text-gray-500 mt-1">{Math.round((absentCount / students.length) * 100)}% of class</p>
        </Card>
        
        <Card className="p-4 bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Late</p>
            <Clock size={18} className="text-yellow-600" />
          </div>
          <p className="dashboard-stat mt-2">{lateCount}</p>
          <p className="text-xs text-gray-500 mt-1">{Math.round((lateCount / students.length) * 100)}% of class</p>
        </Card>
        
        <Card className="p-4 bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">On Leave</p>
            <User size={18} className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">{leaveCount}</p>
          <p className="text-xs text-gray-500 mt-1">{Math.round((leaveCount / students.length) * 100)}% of class</p>
        </Card>
      </div>

      <div className="card-wrapper">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="class" className="text-sm font-medium">Class:</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class" className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="date" className="text-sm font-medium">Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmitAttendance}
            disabled={!attendanceUpdated}
            className="self-start sm:self-auto"
          >
            Submit Attendance
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leave Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className={student.leaveApplied ? "bg-soft-yellow/30" : ""}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs capitalize",
                      student.status === 'present' && "bg-green-100 text-green-800",
                      student.status === 'absent' && "bg-red-100 text-red-800",
                      student.status === 'late' && "bg-yellow-100 text-yellow-800",
                    )}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {student.leaveApplied ? (
                      <div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">Leave Applied</span>
                        <p className="text-xs mt-1">{student.leaveReason}</p>
                        <p className="text-xs text-gray-500">{student.leaveDates}</p>
                      </div>
                    ) : "No leave applied"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant={student.status === 'present' ? 'default' : 'outline'} 
                        className="h-8 px-2"
                        onClick={() => handleStatusChange(student.id, 'present')}
                      >
                        Present
                      </Button>
                      <Button 
                        size="sm" 
                        variant={student.status === 'absent' ? 'default' : 'outline'} 
                        className="h-8 px-2"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                      >
                        Absent
                      </Button>
                      <Button 
                        size="sm" 
                        variant={student.status === 'late' ? 'default' : 'outline'} 
                        className="h-8 px-2"
                        onClick={() => handleStatusChange(student.id, 'late')}
                      >
                        Late
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
