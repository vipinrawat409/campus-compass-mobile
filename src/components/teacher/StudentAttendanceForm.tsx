
import React, { useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample students data
const sampleStudents = [
  { id: 1, name: 'Alice Johnson', rollNo: 'SD101', gender: 'Female', present: true },
  { id: 2, name: 'Bob Smith', rollNo: 'SD102', gender: 'Male', present: true },
  { id: 3, name: 'Charlie Brown', rollNo: 'SD103', gender: 'Male', present: false },
  { id: 4, name: 'Diana Wilson', rollNo: 'SD104', gender: 'Female', present: true },
  { id: 5, name: 'Ethan Davis', rollNo: 'SD105', gender: 'Male', present: true },
  { id: 6, name: 'Fiona Miller', rollNo: 'SD106', gender: 'Female', present: false },
  { id: 7, name: 'George Wilson', rollNo: 'SD107', gender: 'Male', present: true },
  { id: 8, name: 'Hannah Clark', rollNo: 'SD108', gender: 'Female', present: true }
];

interface StudentAttendanceFormProps {
  className?: string;
  date?: Date;
}

const StudentAttendanceForm = ({ className, date = new Date() }: StudentAttendanceFormProps) => {
  const [selectedClass, setSelectedClass] = useState(className || '8A');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(sampleStudents);
  const [loading, setLoading] = useState(false);
  
  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleAttendance = (id: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };
  
  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, present: true })));
  };
  
  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, present: false })));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Attendance saved", {
        description: `Attendance for Class ${selectedClass} has been saved successfully`
      });
      setLoading(false);
    }, 1000);
  };
  
  // Calculate attendance statistics
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.present).length;
  const absentStudents = totalStudents - presentStudents;
  const attendancePercentage = Math.round((presentStudents / totalStudents) * 100);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 sm:max-w-xs">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8A">Class 8A</SelectItem>
              <SelectItem value="8B">Class 8B</SelectItem>
              <SelectItem value="9A">Class 9A</SelectItem>
              <SelectItem value="9B">Class 9B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllPresent}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Mark All Present
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAbsent}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Mark All Absent
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search students..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-wrapper p-4 bg-soft-green/50">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold">{presentStudents}</p>
        </div>
        
        <div className="card-wrapper p-4 bg-soft-red/50">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold">{absentStudents}</p>
        </div>
        
        <div className="card-wrapper p-4 bg-soft-blue/50">
          <p className="text-sm text-gray-600">Attendance</p>
          <p className="text-2xl font-bold">{attendancePercentage}%</p>
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="rounded-md border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button
                      size="sm"
                      variant={student.present ? "default" : "destructive"}
                      className="w-24"
                      onClick={() => toggleAttendance(student.id)}
                    >
                      {student.present ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Present
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="h-4 w-4" />
                          Absent
                        </span>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    </div>
  );
};

export default StudentAttendanceForm;
