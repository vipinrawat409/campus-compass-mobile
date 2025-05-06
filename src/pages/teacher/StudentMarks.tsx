
import React, { useState } from 'react';
import { Book, Edit, Check, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Student {
  id: number;
  name: string;
  rollNo: string;
  marks?: number;
  grade?: string;
  editable?: boolean;
}

interface ClassData {
  className: string;
  subjects: string[];
}

const StudentMarks = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('8-A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExam, setSelectedExam] = useState('First Term');
  const [activeTab, setActiveTab] = useState('marks-entry');
  
  // Mock data for classes and subjects this teacher teaches
  const teacherClasses: ClassData[] = [
    { className: '8-A', subjects: ['Mathematics', 'Science'] },
    { className: '9-B', subjects: ['Mathematics'] },
    { className: '10-A', subjects: ['Mathematics', 'Computer Science'] }
  ];
  
  // Available subjects based on selected class
  const availableSubjects = teacherClasses.find(c => c.className === selectedClass)?.subjects || [];
  
  // Exams list
  const exams = ['First Term', 'Mid Term', 'Final Term'];
  
  // Mock students data
  const initialStudents: Student[] = [
    { id: 1, name: 'Emma Thompson', rollNo: '8A01', marks: 92, grade: 'A+' },
    { id: 2, name: 'James Wilson', rollNo: '8A02', marks: 78, grade: 'B+' },
    { id: 3, name: 'Oliver Brown', rollNo: '8A03', marks: 85, grade: 'A' },
    { id: 4, name: 'Sophia Martinez', rollNo: '8A04', marks: 95, grade: 'A+' },
    { id: 5, name: 'Benjamin Anderson', rollNo: '8A05', marks: 65, grade: 'C+' },
    { id: 6, name: 'Mia Johnson', rollNo: '8A06', marks: 88, grade: 'A' },
    { id: 7, name: 'William Davis', rollNo: '8A07', marks: 75, grade: 'B' },
    { id: 8, name: 'Isabella Miller', rollNo: '8A08', marks: 82, grade: 'A' },
    { id: 9, name: 'Henry Taylor', rollNo: '8A09', marks: 90, grade: 'A+' },
    { id: 10, name: 'Charlotte Wilson', rollNo: '8A10', marks: 76, grade: 'B+' },
  ];
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  
  // Mock performance data
  const classPerformance = {
    averageMark: 82.6,
    highestMark: 95,
    lowestMark: 65,
    studentsAbove90: 3,
    studentsBelow70: 1
  };
  
  // Handle marking editable
  const toggleEditable = (studentId: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, editable: !student.editable };
      }
      return student;
    }));
  };
  
  // Handle marks change
  const handleMarksChange = (studentId: number, value: string) => {
    const marks = parseInt(value);
    if (isNaN(marks) || marks < 0 || marks > 100) return;
    
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, marks };
      }
      return student;
    }));
  };
  
  // Calculate grade based on marks
  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'C+';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };
  
  // Save marks for a student
  const saveMarks = (studentId: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const grade = calculateGrade(student.marks || 0);
        return { ...student, editable: false, grade };
      }
      return student;
    }));
    
    toast({
      title: "Marks Updated",
      description: "Student marks have been updated successfully."
    });
  };
  
  // Function to get color based on grade
  const getGradeColor = (grade: string) => {
    switch (grade[0]) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Submit all marks
  const submitAllMarks = () => {
    toast({
      title: "Marks Submitted",
      description: `All marks for ${selectedClass} - ${selectedSubject} (${selectedExam}) have been submitted successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Marks</h1>
        <p className="text-gray-500">Manage and record student marks for your subjects</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Card className="p-4 flex-1 bg-soft-blue">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Class Performance Summary</h3>
          <div className="text-2xl font-bold">{classPerformance.averageMark.toFixed(1)}%</div>
          <p className="text-xs text-gray-500">Class Average</p>
        </Card>
        
        <Card className="p-4 flex-1 bg-soft-green">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Top Performance</h3>
          <div className="text-2xl font-bold">{classPerformance.highestMark}%</div>
          <p className="text-xs text-gray-500">Highest Mark</p>
        </Card>
        
        <Card className="p-4 flex-1 bg-soft-red">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Students > 90%</h3>
          <div className="text-2xl font-bold">{classPerformance.studentsAbove90}</div>
          <p className="text-xs text-gray-500">Out of {students.length}</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="marks-entry">Marks Entry</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marks-entry" className="space-y-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="class" className="text-sm font-medium">Class:</label>
                <Select value={selectedClass} onValueChange={(value) => {
                  setSelectedClass(value);
                  // Reset subject if not available in the new class
                  const newClassSubjects = teacherClasses.find(c => c.className === value)?.subjects || [];
                  if (!newClassSubjects.includes(selectedSubject)) {
                    setSelectedSubject(newClassSubjects[0] || '');
                  }
                }}>
                  <SelectTrigger id="class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map((cls) => (
                      <SelectItem key={cls.className} value={cls.className}>{cls.className}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="subject" className="text-sm font-medium">Subject:</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="exam" className="text-sm font-medium">Exam:</label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger id="exam">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={submitAllMarks} className="self-start md:self-end">
              <Save className="mr-2 h-4 w-4" />
              Submit All Marks
            </Button>
          </div>
          
          <div className="card-wrapper">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Marks (out of 100)</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        {student.editable ? (
                          <Input
                            value={student.marks || ''}
                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                            className="w-20"
                            type="number"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <span>{student.marks}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.grade && (
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getGradeColor(student.grade)
                          )}>
                            {student.grade}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.editable ? (
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => saveMarks(student.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleEditable(student.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleEditable(student.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Performance Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
              <Card className="p-4 bg-green-50">
                <div className="text-sm font-medium text-gray-700">A+ (90-100%)</div>
                <div className="text-2xl font-bold">{students.filter(s => s.grade === 'A+').length}</div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${(students.filter(s => s.grade === 'A+').length / students.length) * 100}%` }}
                  ></div>
                </div>
              </Card>
              <Card className="p-4 bg-green-50/80">
                <div className="text-sm font-medium text-gray-700">A (80-89%)</div>
                <div className="text-2xl font-bold">{students.filter(s => s.grade === 'A').length}</div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${(students.filter(s => s.grade === 'A').length / students.length) * 100}%` }}
                  ></div>
                </div>
              </Card>
              <Card className="p-4 bg-blue-50">
                <div className="text-sm font-medium text-gray-700">B+ / B (70-79%)</div>
                <div className="text-2xl font-bold">{students.filter(s => s.grade === 'B+' || s.grade === 'B').length}</div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: `${(students.filter(s => s.grade === 'B+' || s.grade === 'B').length / students.length) * 100}%` }}
                  ></div>
                </div>
              </Card>
              <Card className="p-4 bg-yellow-50">
                <div className="text-sm font-medium text-gray-700">C+ / C (60-69%)</div>
                <div className="text-2xl font-bold">{students.filter(s => s.grade === 'C+' || s.grade === 'C').length}</div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full" 
                    style={{ width: `${(students.filter(s => s.grade === 'C+' || s.grade === 'C').length / students.length) * 100}%` }}
                  ></div>
                </div>
              </Card>
              <Card className="p-4 bg-red-50">
                <div className="text-sm font-medium text-gray-700">D / F (< 60%)</div>
                <div className="text-2xl font-bold">{students.filter(s => s.grade === 'D' || s.grade === 'F').length}</div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-red-500 rounded-full" 
                    style={{ width: `${(students.filter(s => s.grade === 'D' || s.grade === 'F').length / students.length) * 100}%` }}
                  ></div>
                </div>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Subject Performance Comparison</h3>
              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematics</span>
                      <span>82.6%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '82.6%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Science</span>
                      <span>78.4%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '78.4%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>English</span>
                      <span>85.2%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '85.2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMarks;
