
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  User,
  Book
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditStudentMarksModal from '@/components/modals/EditStudentMarksModal';
import { toast } from "@/components/ui/sonner";

interface StudentMark {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remark?: string;
}

const StudentMarks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMark, setSelectedMark] = useState<StudentMark | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Mock classes data
  const classes = ['8-A', '9-B', '10-A'];
  
  // Mock subjects data
  const subjects = ['Mathematics', 'Science', 'English', 'History'];
  
  // Mock student marks data
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Alice Johnson',
      className: '10-A',
      subject: 'Mathematics',
      marks: 85,
      totalMarks: 100,
      grade: 'A',
      remark: 'Good understanding of complex concepts'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Bob Smith',
      className: '10-A',
      subject: 'Mathematics',
      marks: 75,
      totalMarks: 100,
      grade: 'B+'
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Charlie Brown',
      className: '9-B',
      subject: 'Science',
      marks: 92,
      totalMarks: 100,
      grade: 'A+',
      remark: 'Excellent performance in all experiments'
    },
    {
      id: 4,
      studentId: 4,
      studentName: 'David Wilson',
      className: '9-B',
      subject: 'Science',
      marks: 68,
      totalMarks: 100,
      grade: 'B'
    },
    {
      id: 5,
      studentId: 5,
      studentName: 'Emma Davis',
      className: '8-A',
      subject: 'English',
      marks: 88,
      totalMarks: 100,
      grade: 'A'
    }
  ]);
  
  // Filter marks based on search term, class, and subject
  const filteredMarks = studentMarks.filter(mark => 
    (selectedClass === 'all' || mark.className === selectedClass) &&
    (selectedSubject === 'all' || mark.subject === selectedSubject) &&
    (
      mark.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.grade.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const handleEditMark = (mark: StudentMark) => {
    setSelectedMark(mark);
    setIsEditModalOpen(true);
  };
  
  const handleSaveMark = (updatedMark: StudentMark) => {
    setStudentMarks(studentMarks.map(mark => 
      mark.id === updatedMark.id ? updatedMark : mark
    ));
  };
  
  // Get grade badge color
  const getGradeBadge = (grade: string) => {
    switch (grade.charAt(0)) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Marks</h1>
        <p className="text-gray-500">Manage and view student marks</p>
      </div>
      
      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by student name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select 
              value={selectedClass} 
              onValueChange={setSelectedClass}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex gap-2 w-full sm:w-auto">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Student</th>
                <th className="py-3 px-4 text-left">Class</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-right">Marks</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-left">Remark</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMarks.map((mark) => (
                <tr key={mark.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{mark.studentName}</td>
                  <td className="py-3 px-4">{mark.className}</td>
                  <td className="py-3 px-4">{mark.subject}</td>
                  <td className="py-3 px-4 text-right">{mark.marks}/{mark.totalMarks}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeBadge(mark.grade)}`}>
                      {mark.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate">{mark.remark || '-'}</td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleEditMark(mark)}
                    >
                      <Edit size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMarks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Book className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No marks found for the selected criteria.</p>
          </div>
        )}
      </div>
      
      <EditStudentMarksModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mark={selectedMark}
        onSave={handleSaveMark}
      />
    </div>
  );
};

export default StudentMarks;
