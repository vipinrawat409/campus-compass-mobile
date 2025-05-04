
import React, { useState } from 'react';
import { Book, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marks = () => {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState('First Term');
  
  // Available exams for the dropdown
  const exams = ['First Term', 'Mid Term', 'Final Term'];
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Marks & Performance</h1>
        <p className="text-gray-500">View your academic results and performance</p>
      </div>
      
      <Tabs defaultValue="exams">
        <TabsList>
          <TabsTrigger value="exams">Exam Results</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="exams" className="space-y-6 mt-6">
          <div className="card-wrapper">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Exam Results</h3>
              <select 
                className="px-3 py-1.5 border rounded-md bg-white"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                {exams.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
            
            <ExamResults examType={selectedExam} />
          </div>
        </TabsContent>
        <TabsContent value="performance" className="space-y-6 mt-6">
          <PerformanceAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ExamResults = ({ examType }: { examType: string }) => {
  // Mock exam results data
  const resultsData = {
    'First Term': {
      subjects: [
        { name: 'Mathematics', marks: 92, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'Science', marks: 88, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'English', marks: 85, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Social Studies', marks: 78, totalMarks: 100, grade: 'B+', remarks: 'Good' },
        { name: 'Hindi', marks: 82, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Computer Science', marks: 90, totalMarks: 100, grade: 'A+', remarks: 'Excellent' }
      ],
      total: { obtained: 515, total: 600, percentage: 85.83, grade: 'A', rank: 3 }
    },
    'Mid Term': {
      subjects: [
        { name: 'Mathematics', marks: 95, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'Science', marks: 90, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'English', marks: 88, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Social Studies', marks: 82, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Hindi', marks: 85, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Computer Science', marks: 93, totalMarks: 100, grade: 'A+', remarks: 'Excellent' }
      ],
      total: { obtained: 533, total: 600, percentage: 88.83, grade: 'A', rank: 2 }
    },
    'Final Term': {
      subjects: [
        { name: 'Mathematics', marks: 97, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'Science', marks: 93, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'English', marks: 91, totalMarks: 100, grade: 'A+', remarks: 'Excellent' },
        { name: 'Social Studies', marks: 85, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Hindi', marks: 88, totalMarks: 100, grade: 'A', remarks: 'Very Good' },
        { name: 'Computer Science', marks: 95, totalMarks: 100, grade: 'A+', remarks: 'Excellent' }
      ],
      total: { obtained: 549, total: 600, percentage: 91.5, grade: 'A+', rank: 1 }
    }
  };
  
  const currentResults = resultsData[examType as keyof typeof resultsData];
  
  // Helper function to get color based on grade
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
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-center">Marks</th>
              <th className="py-3 px-4 text-center">Grade</th>
              <th className="py-3 px-4 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentResults.subjects.map((subject, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{subject.name}</td>
                <td className="py-3 px-4 text-center">{subject.marks}/{subject.totalMarks}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">{subject.remarks}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-medium">
            <tr>
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4 text-center">{currentResults.total.obtained}/{currentResults.total.total}</td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(currentResults.total.grade)}`}>
                    {currentResults.total.grade}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                Percentage: {currentResults.total.percentage.toFixed(2)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-6 p-4 border rounded-lg bg-soft-blue flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-700">Class Rank</p>
            <p className="text-xl font-bold">{currentResults.total.rank}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-700">Overall Grade</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(currentResults.total.grade)}`}>
              {currentResults.total.grade}
            </span>
            <span className="font-bold">{currentResults.total.percentage.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceAnalysis = () => {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  
  // Mock performance data
  const performanceData = {
    examTrend: [
      { exam: 'First Term', percentage: 85.83 },
      { exam: 'Mid Term', percentage: 88.83 },
      { exam: 'Final Term', percentage: 91.50 }
    ],
    subjectPerformance: {
      Mathematics: [92, 95, 97],
      Science: [88, 90, 93],
      English: [85, 88, 91],
      'Social Studies': [78, 82, 85],
      Hindi: [82, 85, 88],
      'Computer Science': [90, 93, 95]
    }
  };
  
  const toggleChart = (chartId: string) => {
    if (expandedChart === chartId) {
      setExpandedChart(null);
    } else {
      setExpandedChart(chartId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="card-wrapper">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">Overall Performance Trend</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => toggleChart('examTrend')}>
            {expandedChart === 'examTrend' ? (
              <>
                <ChevronUp size={16} />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Expand</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-lg p-4">
            <div className="h-[200px] flex items-end justify-around gap-2">
              {performanceData.examTrend.map((exam, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-primary rounded-t-lg" 
                    style={{ 
                      height: `${exam.percentage}%`,
                      maxHeight: '180px',
                      transition: 'height 0.3s ease'
                    }}
                  ></div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium">{exam.exam}</div>
                    <div className="text-sm font-bold">{exam.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {performanceData.examTrend.map((exam, index) => (
            <div 
              key={index} 
              className={`px-3 py-2 rounded-full text-xs ${
                index === 2 ? 'bg-green-100 text-green-800' : 
                index === 1 ? 'bg-blue-100 text-blue-800' : 
                'bg-soft-blue text-primary'
              }`}
            >
              {exam.exam}: {exam.percentage.toFixed(1)}%
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">Subject-wise Performance</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => toggleChart('subjectTrend')}>
            {expandedChart === 'subjectTrend' ? (
              <>
                <ChevronUp size={16} />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Expand</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-3">
          {Object.entries(performanceData.subjectPerformance).map(([subject, marks], index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Book size={16} className="text-primary" />
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-500">Current:</span>
                  <span className="font-medium">{marks[marks.length-1]}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${marks[marks.length-1]}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <div>First Term: {marks[0]}%</div>
                <div>Mid Term: {marks[1]}%</div>
                <div>Final Term: {marks[2]}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-wrapper">
        <h3 className="section-title mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-soft-green">
            <div className="text-sm text-gray-700">Strongest Subject</div>
            <div className="text-lg font-bold">Mathematics (97%)</div>
            <div className="text-sm text-green-700 mt-1">+5% improvement since First Term</div>
          </div>
          <div className="p-4 border rounded-lg bg-soft-yellow">
            <div className="text-sm text-gray-700">Area for Improvement</div>
            <div className="text-lg font-bold">Social Studies (85%)</div>
            <div className="text-sm text-green-700 mt-1">+7% improvement since First Term</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marks;
