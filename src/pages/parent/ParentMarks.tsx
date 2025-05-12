
import React, { useState } from 'react';
import { Book, Users } from 'lucide-react';
import ChildSelector, { ChildData } from '@/components/parent/ChildSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SubjectMark {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  teacher: string;
}

interface ExamData {
  name: string;
  date: string;
  subjects: SubjectMark[];
}

const ParentMarks = () => {
  // Mock children data
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const [selectedChild, setSelectedChild] = useState<ChildData>(children[0]);
  
  // Mock marks data for each child
  const marksData = {
    1: [
      // For Sarah
      {
        name: "Mid-Term Exam",
        date: "2025-02-15",
        subjects: [
          { subject: "Mathematics", marks: 85, totalMarks: 100, grade: "A", teacher: "Mrs. Johnson" },
          { subject: "Science", marks: 78, totalMarks: 100, grade: "B+", teacher: "Mr. Davis" },
          { subject: "English", marks: 92, totalMarks: 100, grade: "A+", teacher: "Ms. Wilson" },
          { subject: "Social Studies", marks: 81, totalMarks: 100, grade: "A", teacher: "Mr. Thompson" },
          { subject: "Computer Science", marks: 89, totalMarks: 100, grade: "A", teacher: "Ms. Garcia" },
        ]
      },
      {
        name: "First Term Exam",
        date: "2024-12-10",
        subjects: [
          { subject: "Mathematics", marks: 82, totalMarks: 100, grade: "A", teacher: "Mrs. Johnson" },
          { subject: "Science", marks: 75, totalMarks: 100, grade: "B", teacher: "Mr. Davis" },
          { subject: "English", marks: 90, totalMarks: 100, grade: "A+", teacher: "Ms. Wilson" },
          { subject: "Social Studies", marks: 85, totalMarks: 100, grade: "A", teacher: "Mr. Thompson" },
          { subject: "Computer Science", marks: 91, totalMarks: 100, grade: "A+", teacher: "Ms. Garcia" },
        ]
      }
    ],
    2: [
      // For John
      {
        name: "Mid-Term Exam",
        date: "2025-02-15",
        subjects: [
          { subject: "Mathematics", marks: 72, totalMarks: 100, grade: "B", teacher: "Mrs. Johnson" },
          { subject: "Science", marks: 68, totalMarks: 100, grade: "C+", teacher: "Mr. Davis" },
          { subject: "English", marks: 82, totalMarks: 100, grade: "A", teacher: "Ms. Wilson" },
          { subject: "Social Studies", marks: 75, totalMarks: 100, grade: "B", teacher: "Mr. Thompson" },
          { subject: "Computer Science", marks: 79, totalMarks: 100, grade: "B+", teacher: "Ms. Garcia" },
        ]
      },
      {
        name: "First Term Exam",
        date: "2024-12-10",
        subjects: [
          { subject: "Mathematics", marks: 68, totalMarks: 100, grade: "C+", teacher: "Mrs. Johnson" },
          { subject: "Science", marks: 65, totalMarks: 100, grade: "C+", teacher: "Mr. Davis" },
          { subject: "English", marks: 85, totalMarks: 100, grade: "A", teacher: "Ms. Wilson" },
          { subject: "Social Studies", marks: 70, totalMarks: 100, grade: "B", teacher: "Mr. Thompson" },
          { subject: "Computer Science", marks: 75, totalMarks: 100, grade: "B", teacher: "Ms. Garcia" },
        ]
      }
    ]
  };

  // Get current child's marks
  const currentMarks = marksData[selectedChild.id as keyof typeof marksData];

  // Calculate average for each exam
  const calculateAverage = (exam: ExamData) => {
    const totalMarks = exam.subjects.reduce((acc, subject) => acc + subject.marks, 0);
    const totalPossible = exam.subjects.reduce((acc, subject) => acc + subject.totalMarks, 0);
    return Math.round((totalMarks / totalPossible) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Academic Performance</h1>
      </div>
      
      <ChildSelector 
        children={children} 
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />
      
      <div className="card-wrapper">
        <h2 className="text-lg font-medium mb-6">
          {selectedChild.name}'s Marks
        </h2>
        
        <Tabs defaultValue={currentMarks[0].name.replace(/\s+/g, '-').toLowerCase()}>
          <TabsList className="w-full">
            {currentMarks.map((exam, index) => (
              <TabsTrigger 
                key={index} 
                value={exam.name.replace(/\s+/g, '-').toLowerCase()}
              >
                {exam.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {currentMarks.map((exam, examIndex) => (
            <TabsContent 
              key={examIndex} 
              value={exam.name.replace(/\s+/g, '-').toLowerCase()} 
              className="mt-6"
            >
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{exam.name}</h3>
                    <p className="text-sm text-gray-500">Date: {new Date(exam.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-soft-blue rounded-md">
                    <span className="text-sm text-gray-700">Average:</span>
                    <span className="font-medium text-primary">{calculateAverage(exam)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Subject</th>
                      <th className="py-3 px-4 text-left">Teacher</th>
                      <th className="py-3 px-4 text-left">Marks</th>
                      <th className="py-3 px-4 text-left">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {exam.subjects.map((subject, subjectIndex) => (
                      <tr key={subjectIndex} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{subject.subject}</td>
                        <td className="py-3 px-4">{subject.teacher}</td>
                        <td className="py-3 px-4">{subject.marks}/{subject.totalMarks}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                            subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            subject.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ParentMarks;
