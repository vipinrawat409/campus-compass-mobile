
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText } from 'lucide-react';
import ApplyLeaveModal from '@/components/modals/ApplyLeaveModal';
import { toast } from "@/components/ui/sonner";
import ChildSelector, { ChildData } from '@/components/parent/ChildSelector';

const ParentLeave = () => {
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  
  // Mock children data
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];
  
  const [selectedChild, setSelectedChild] = useState<ChildData>(children[0]);
  
  // Mock leave data
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      childId: 1,
      startDate: '2025-05-15',
      endDate: '2025-05-15',
      reason: 'Medical appointment',
      status: 'Approved',
      appliedOn: '2025-05-10'
    },
    {
      id: 2,
      childId: 2,
      startDate: '2025-06-05',
      endDate: '2025-06-06',
      reason: 'Family function',
      status: 'Pending',
      appliedOn: '2025-05-12'
    }
  ]);
  
  const handleApplyLeave = (formData: any) => {
    const newLeave = {
      id: leaves.length + 1,
      childId: selectedChild.id,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate ? formData.endDate.toISOString().split('T')[0] : formData.startDate.toISOString().split('T')[0],
      reason: formData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    
    setLeaves([...leaves, newLeave]);
    toast("Leave application submitted successfully");
  };
  
  // Filter leaves for the selected child
  const filteredLeaves = leaves.filter(leave => leave.childId === selectedChild.id);
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <Button 
          onClick={() => setIsApplyLeaveModalOpen(true)}
          className="flex gap-2"
        >
          <Plus size={16} />
          Apply for Leave
        </Button>
      </div>
      
      <ChildSelector 
        children={children} 
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />
      
      <div className="card-wrapper">
        <h2 className="text-lg font-medium mb-4">
          Leave Applications for {selectedChild.name}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Applied On</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {leave.startDate === leave.endDate ? 
                      leave.startDate : 
                      `${leave.startDate} to ${leave.endDate}`
                    }
                  </td>
                  <td className="py-3 px-4">{leave.appliedOn}</td>
                  <td className="py-3 px-4">{leave.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLeaves.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No leave applications found for {selectedChild.name}.</p>
            <Button 
              onClick={() => setIsApplyLeaveModalOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              Apply for Leave
            </Button>
          </div>
        )}
      </div>
      
      <ApplyLeaveModal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
        onSubmit={handleApplyLeave}
        childName={selectedChild.name}
      />
    </div>
  );
};

export default ParentLeave;
