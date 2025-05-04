
import React, { useState } from 'react';
import { FileText, Download, Calendar, ChevronLeft, ChevronRight, Award, Book, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Report = () => {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('Final Term');
  
  // Available terms for the dropdown
  const terms = ['First Term', 'Mid Term', 'Final Term'];
  
  const handleDownload = () => {
    // In a real app, this would download the selected report
    toast.success(`${selectedTerm} report card downloaded successfully`);
  };
  
  // Navigate between terms
  const navigateTerm = (direction: 'prev' | 'next') => {
    const currentIndex = terms.indexOf(selectedTerm);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedTerm(terms[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < terms.length - 1) {
      setSelectedTerm(terms[currentIndex + 1]);
    }
  };
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Report Cards</h1>
        <p className="text-gray-500">View and download your academic reports</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {terms.map((term, index) => (
          <div 
            key={term}
            className={`dashboard-card ${
              term === 'Final Term' ? 'bg-soft-green' :
              term === 'Mid Term' ? 'bg-soft-blue' : 'bg-soft-yellow'
            } cursor-pointer hover:shadow-md transition-shadow ${
              selectedTerm === term ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTerm(term)}
          >
            <div className="flex justify-between items-center">
              <p className="dashboard-label">{term}</p>
              <FileText className={
                term === 'Final Term' ? 'text-green-500' :
                term === 'Mid Term' ? 'text-blue-500' : 'text-yellow-500'
              } />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="dashboard-stat">
                {term === 'Final Term' ? 'A+' :
                 term === 'Mid Term' ? 'A' : 'A'}
              </p>
              <div className="text-sm font-medium">
                {term === 'Final Term' ? '91.5%' :
                 term === 'Mid Term' ? '88.8%' : '85.8%'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card-wrapper">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateTerm('prev')}
              disabled={terms.indexOf(selectedTerm) === 0}
            >
              <ChevronLeft size={18} />
            </Button>
            <h2 className="text-xl font-bold">{selectedTerm} Report Card</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateTerm('next')}
              disabled={terms.indexOf(selectedTerm) === terms.length - 1}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          <Button onClick={handleDownload} className="flex gap-2">
            <Download size={16} />
            Download Report
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-4 text-center">
            <h3 className="text-xl font-bold">Valley Public School</h3>
            <p className="text-sm">Academic Year 2024-25</p>
            <p className="mt-2 text-lg font-medium">{selectedTerm} Examination Report</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-500">Student Name</label>
                <p className="font-medium">Alice Johnson</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Class</label>
                <p className="font-medium">10-A</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Roll No</label>
                <p className="font-medium">10A-01</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Admission No</label>
                <p className="font-medium">SD-2023-001</p>
              </div>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-center">Max Marks</th>
                    <th className="py-3 px-4 text-center">Marks Obtained</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <ReportRow subject="Mathematics" maxMarks={100} obtained={97} grade="A+" remarks="Excellent" />
                  <ReportRow subject="Science" maxMarks={100} obtained={93} grade="A+" remarks="Excellent" />
                  <ReportRow subject="English" maxMarks={100} obtained={91} grade="A+" remarks="Excellent" />
                  <ReportRow subject="Social Studies" maxMarks={100} obtained={85} grade="A" remarks="Very Good" />
                  <ReportRow subject="Hindi" maxMarks={100} obtained={88} grade="A" remarks="Very Good" />
                  <ReportRow subject="Computer Science" maxMarks={100} obtained={95} grade="A+" remarks="Excellent" />
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 text-center">600</td>
                    <td className="py-3 px-4 text-center">549</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        A+
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      Percentage: 91.5%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 border rounded-lg flex items-center gap-3">
                <Award size={24} className="text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-700">Class Rank</div>
                  <div className="text-xl font-bold">1</div>
                </div>
              </div>
              <div className="p-3 border rounded-lg flex items-center gap-3">
                <Book size={24} className="text-blue-500" />
                <div>
                  <div className="text-sm text-gray-700">Attendance</div>
                  <div className="text-xl font-bold">95%</div>
                </div>
              </div>
              <div className="p-3 border rounded-lg flex items-center gap-3">
                <TrendingUp size={24} className="text-green-500" />
                <div>
                  <div className="text-sm text-gray-700">Progress</div>
                  <div className="text-xl font-bold">+2.7%</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="text-lg font-medium mb-2">Teacher's Remarks</h4>
                <p className="text-gray-700">
                  Alice is an exceptional student who consistently demonstrates outstanding academic performance. 
                  She shows remarkable problem-solving abilities in Mathematics and strong analytical skills in Science. 
                  Her communication skills in English are excellent, and she actively participates in class discussions. 
                  She should continue to maintain her exemplary performance.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="text-lg font-medium mb-2">Principal's Remarks</h4>
                <p className="text-gray-700">
                  Alice has shown remarkable progress throughout the academic year. 
                  Her dedication and hard work are reflected in her excellent academic results. 
                  She is encouraged to maintain this performance and continue to participate in 
                  co-curricular activities for all-round development.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <div>Date of Issue: 20 May 2025</div>
                  <div>Next Term Begins: 15 June 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportRow = ({ subject, maxMarks, obtained, grade, remarks }: { 
  subject: string, 
  maxMarks: number, 
  obtained: number,
  grade: string,
  remarks: string
}) => {
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
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4 font-medium">{subject}</td>
      <td className="py-3 px-4 text-center">{maxMarks}</td>
      <td className="py-3 px-4 text-center">{obtained}</td>
      <td className="py-3 px-4">
        <div className="flex justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
            {grade}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-700">{remarks}</td>
    </tr>
  );
};

export default Report;
