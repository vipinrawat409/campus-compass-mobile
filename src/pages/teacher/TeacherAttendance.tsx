
import React, { useState } from 'react';
import { CheckCircle, Calendar, Search, Filter, User, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: number;
  name: string;
  rollNo: string;
  attendanceStatus: 'present' | 'absent' | 'late' | null;
}

const TeacherAttendance = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [className, setClassName] = useState('8-A'); // Default class for the teacher
  
  // Mock data - assuming this teacher is the class teacher of 8-A
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Emma Thompson', rollNo: '8A01', attendanceStatus: null },
    { id: 2, name: 'James Wilson', rollNo: '8A02', attendanceStatus: null },
    { id: 3, name: 'Olivia Johnson', rollNo: '8A03', attendanceStatus: null },
    { id: 4, name: 'William Davis', rollNo: '8A04', attendanceStatus: null },
    { id: 5, name: 'Sophia Martinez', rollNo: '8A05', attendanceStatus: null },
    { id: 6, name: 'Benjamin Anderson', rollNo: '8A06', attendanceStatus: null },
    { id: 7, name: 'Isabella Thomas', rollNo: '8A07', attendanceStatus: null },
    { id: 8, name: 'Lucas Taylor', rollNo: '8A08', attendanceStatus: null },
    { id: 9, name: 'Mia Hernandez', rollNo: '8A09', attendanceStatus: null },
    { id: 10, name: 'Ethan Moore', rollNo: '8A10', attendanceStatus: null },
  ]);
  
  // Mock classes for the teacher
  const teacherClasses = [
    { id: 1, name: '8-A', section: 'A', subject: 'Class Teacher' },
    { id: 2, name: '9-B', section: 'B', subject: 'Mathematics' },
    { id: 3, name: '10-C', section: 'C', subject: 'Mathematics' },
  ];
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mark attendance for a student
  const markAttendance = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, attendanceStatus: status } 
          : student
      )
    );
  };
  
  // Submit attendance for all students
  const submitAttendance = () => {
    // Check if any student's attendance is not marked
    const unmarkedStudents = students.filter(student => student.attendanceStatus === null);
    
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: `Please mark attendance for all students (${unmarkedStudents.length} remaining)`,
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically send the attendance data to a backend
    // Mock API call
    toast({
      title: "Attendance Submitted",
      description: `Attendance for Class ${className} on ${selectedDate} has been saved successfully`
    });
  };
  
  // Mark all students as present
  const markAllPresent = () => {
    setStudents(prevStudents => 
      prevStudents.map(student => ({ ...student, attendanceStatus: 'present' }))
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Attendance</h1>
        <p className="text-gray-500">Mark attendance for your class students</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dashboard-card bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Class Teacher</p>
            <User className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">{className}</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Present Today</p>
            <CheckCircle className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">
            {students.filter(s => s.attendanceStatus === 'present').length}/{students.length}
          </p>
        </div>
        <div className="dashboard-card bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Date</p>
            <Calendar className="text-yellow-500" />
          </div>
          <p className="dashboard-stat mt-2">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name} {cls.subject !== 'Class Teacher' ? `(${cls.subject})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllPresent}>Mark All Present</Button>
            <Button onClick={submitAttendance}>Save Attendance</Button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-xs"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={student.attendanceStatus === 'present' ? 'default' : 'outline'}
                        className={student.attendanceStatus === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                        onClick={() => markAttendance(student.id, 'present')}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={student.attendanceStatus === 'absent' ? 'default' : 'outline'}
                        className={student.attendanceStatus === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                        onClick={() => markAttendance(student.id, 'absent')}
                      >
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={student.attendanceStatus === 'late' ? 'default' : 'outline'}
                        className={student.attendanceStatus === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                        onClick={() => markAttendance(student.id, 'late')}
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

export default TeacherAttendance;
