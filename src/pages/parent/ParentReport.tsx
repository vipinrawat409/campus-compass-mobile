
import React, { useState } from 'react';
import { FileText, Download, Users } from 'lucide-react';
import ChildSelector, { ChildData } from '@/components/parent/ChildSelector';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/sonner';

interface Report {
  id: number;
  title: string;
  date: string;
  class: string;
  term: string;
  downloadUrl: string;
  size: string;
}

const ParentReport = () => {
  // Mock children data
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const [selectedChild, setSelectedChild] = useState<ChildData>(children[0]);
  
  // Mock report data for each child
  const reportData = {
    1: [
      // For Sarah
      {
        id: 1,
        title: "Mid-Term Report Card",
        date: "2025-02-20",
        class: "10-A",
        term: "Mid-Term",
        downloadUrl: "#",
        size: "1.2 MB"
      },
      {
        id: 2,
        title: "First Term Report Card",
        date: "2024-12-15",
        class: "10-A",
        term: "First Term",
        downloadUrl: "#",
        size: "1.3 MB"
      },
      {
        id: 3,
        title: "Annual Progress Report",
        date: "2024-04-10",
        class: "9-A",
        term: "Final",
        downloadUrl: "#",
        size: "1.5 MB"
      }
    ],
    2: [
      // For John
      {
        id: 1,
        title: "Mid-Term Report Card",
        date: "2025-02-20",
        class: "7-B",
        term: "Mid-Term",
        downloadUrl: "#",
        size: "1.0 MB"
      },
      {
        id: 2,
        title: "First Term Report Card",
        date: "2024-12-15",
        class: "7-B",
        term: "First Term",
        downloadUrl: "#",
        size: "1.1 MB"
      },
      {
        id: 3,
        title: "Annual Progress Report",
        date: "2024-04-10",
        class: "6-B",
        term: "Final",
        downloadUrl: "#",
        size: "1.4 MB"
      }
    ]
  };

  // Get current child's reports
  const currentReports = reportData[selectedChild.id as keyof typeof reportData];

  const handleDownload = (report: Report) => {
    // In a real app, this would initiate a download
    toast(`Downloading ${report.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Report Cards</h1>
      </div>
      
      <ChildSelector 
        children={children} 
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />
      
      <div className="card-wrapper">
        <h2 className="text-lg font-medium mb-4">
          {selectedChild.name}'s Report Cards
        </h2>
        
        <div className="space-y-4">
          {currentReports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-soft-blue rounded">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        Date: {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Class: {report.class}
                      </span>
                      <span className="text-xs text-gray-500">
                        Term: {report.term}
                      </span>
                      <span className="text-xs text-gray-500">
                        Size: {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="flex gap-2"
                  onClick={() => handleDownload(report)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {currentReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No report cards found for {selectedChild.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentReport;
