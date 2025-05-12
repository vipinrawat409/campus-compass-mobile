
import React, { useState } from 'react';
import { Search, Edit, Check } from 'lucide-react';
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

// Sample students data with marks
const sampleStudents = [
  { id: 1, name: 'Alice Johnson', rollNo: 'SD101', marks: 87, grade: 'A', subject: 'Mathematics' },
  { id: 2, name: 'Bob Smith', rollNo: 'SD102', marks: 75, grade: 'B+', subject: 'Mathematics' },
  { id: 3, name: 'Charlie Brown', rollNo: 'SD103', marks: 92, grade: 'A+', subject: 'Mathematics' },
  { id: 4, name: 'Diana Wilson', rollNo: 'SD104', marks: 68, grade: 'B', subject: 'Mathematics' },
  { id: 5, name: 'Ethan Davis', rollNo: 'SD105', marks: 73, grade: 'B', subject: 'Mathematics' },
  { id: 6, name: 'Fiona Miller', rollNo: 'SD106', marks: 89, grade: 'A', subject: 'Mathematics' },
  { id: 7, name: 'George Wilson', rollNo: 'SD107', marks: 82, grade: 'A', subject: 'Mathematics' },
  { id: 8, name: 'Hannah Clark', rollNo: 'SD108', marks: 65, grade: 'C+', subject: 'Mathematics' }
];

interface StudentMarksFormProps {
  className?: string;
  subject?: string;
}

const StudentMarksForm = ({ className, subject = 'Mathematics' }: StudentMarksFormProps) => {
  const [selectedClass, setSelectedClass] = useState(className || '8A');
  const [selectedSubject, setSelectedSubject] = useState(subject);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(sampleStudents);
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editedMarks, setEditedMarks] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const startEditing = (student: any) => {
    setEditingStudent(student.id);
    setEditedMarks(student.marks);
  };
  
  const saveMarks = (id: number) => {
    // Calculate grade based on marks
    let grade = 'F';
    if (editedMarks >= 90) grade = 'A+';
    else if (editedMarks >= 80) grade = 'A';
    else if (editedMarks >= 75) grade = 'B+';
    else if (editedMarks >= 70) grade = 'B';
    else if (editedMarks >= 65) grade = 'C+';
    else if (editedMarks >= 60) grade = 'C';
    else if (editedMarks >= 50) grade = 'D';
    
    setStudents(students.map(student => 
      student.id === id ? { ...student, marks: editedMarks, grade } : student
    ));
    
    setEditingStudent(null);
    
    toast("Marks updated", {
      description: "Student marks have been updated successfully"
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Marks saved", {
        description: `Marks for Class ${selectedClass} in ${selectedSubject} have been saved successfully`
      });
      setLoading(false);
    }, 1000);
  };
  
  // Calculate statistics
  const totalStudents = students.length;
  const averageMarks = Math.round(students.reduce((sum, student) => sum + student.marks, 0) / totalStudents);
  const highestMarks = Math.max(...students.map(student => student.marks));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="w-full sm:w-auto">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
          
          <div className="w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Social Studies">Social Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        <div className="card-wrapper p-4 bg-soft-blue/50">
          <p className="text-sm text-gray-600">Average Marks</p>
          <p className="text-2xl font-bold">{averageMarks}/100</p>
        </div>
        
        <div className="card-wrapper p-4 bg-soft-green/50">
          <p className="text-sm text-gray-600">Highest Marks</p>
          <p className="text-2xl font-bold">{highestMarks}/100</p>
        </div>
        
        <div className="card-wrapper p-4 bg-soft-purple/50">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks (100)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingStudent === student.id ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editedMarks}
                        onChange={(e) => setEditedMarks(Number(e.target.value))}
                        className="w-20 text-center mx-auto"
                      />
                    ) : (
                      <span className="text-sm font-medium">{student.marks}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full
                      ${student.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                        student.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        student.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                        student.grade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }
                    `}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {editingStudent === student.id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-24"
                        onClick={() => saveMarks(student.id)}
                      >
                        <span className="flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Save
                        </span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-24"
                        onClick={() => startEditing(student)}
                      >
                        <span className="flex items-center gap-1">
                          <Edit className="h-4 w-4" />
                          Edit
                        </span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || editingStudent !== null}>
          {loading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};

export default StudentMarksForm;
