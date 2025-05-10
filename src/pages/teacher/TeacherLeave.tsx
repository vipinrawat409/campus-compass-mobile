
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, FileText } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface LeaveItem {
  id: number;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: string;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectedReason?: string;
}

const TeacherLeave = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedLeave, setSelectedLeave] = useState<LeaveItem | null>(null);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  
  // Mock leave data
  const [leaveHistory] = useState<LeaveItem[]>([
    {
      id: 1,
      type: 'Sick Leave',
      fromDate: '2025-05-15',
      toDate: '2025-05-18',
      days: 4,
      reason: 'Medical appointment and recovery from fever',
      status: 'approved',
      appliedOn: '2025-05-12',
      approvedBy: 'Principal',
      approvedOn: '2025-05-13'
    },
    {
      id: 2,
      type: 'Personal Leave',
      fromDate: '2025-06-10',
      toDate: '2025-06-10',
      days: 1,
      reason: 'Family function',
      status: 'pending',
      appliedOn: '2025-06-05'
    },
    {
      id: 3,
      type: 'Casual Leave',
      fromDate: '2025-04-25',
      toDate: '2025-04-26',
      days: 2,
      reason: 'Personal work',
      status: 'rejected',
      appliedOn: '2025-04-20',
      rejectedReason: 'Exam duties scheduled'
    }
  ]);
  
  const filteredLeaves = leaveHistory.filter(leave => {
    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewLeaveDetails = (leave: LeaveItem) => {
    setSelectedLeave(leave);
    setShowLeaveDetails(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Teacher Leave Management</h1>
        <p className="text-gray-500">Apply for and track your leave applications</p>
      </div>
      
      <div className="card-wrapper p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Leave Applications</h2>
          <Button className="flex gap-2">
            Apply for Leave
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-soft-blue p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Leaves</p>
            <p className="text-xl font-semibold">{leaveHistory.length}</p>
          </div>
          <div className="bg-soft-yellow p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-semibold">{leaveHistory.filter(l => l.status === 'pending').length}</p>
          </div>
          <div className="bg-soft-green p-4 rounded-lg">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-xl font-semibold">{leaveHistory.filter(l => l.status === 'approved').length}</p>
          </div>
          <div className="bg-soft-red p-4 rounded-lg">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-xl font-semibold">{leaveHistory.filter(l => l.status === 'rejected').length}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'pending' ? "default" : "outline"}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={activeTab === 'approved' ? "default" : "outline"}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </Button>
          <Button 
            variant={activeTab === 'rejected' ? "default" : "outline"}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </Button>
          <Button 
            variant={activeTab === 'all' ? "default" : "outline"}
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{new Date(leave.appliedOn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewLeaveDetails(leave)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No leave applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Leave Details Dialog */}
      <Dialog open={showLeaveDetails} onOpenChange={setShowLeaveDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{selectedLeave.type}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedLeave.status)}`}>
                  {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    {new Date(selectedLeave.fromDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    {new Date(selectedLeave.toDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{selectedLeave.days} day{selectedLeave.days > 1 ? 's' : ''}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <div className="p-3 bg-gray-50 rounded-md mt-1">
                  <p className="text-sm">{selectedLeave.reason}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Applied On</p>
                <p>{new Date(selectedLeave.appliedOn).toLocaleDateString()}</p>
              </div>
              
              {selectedLeave.status === 'approved' && selectedLeave.approvedBy && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p>{selectedLeave.approvedBy} on {selectedLeave.approvedOn && new Date(selectedLeave.approvedOn).toLocaleDateString()}</p>
                </div>
              )}
              
              {selectedLeave.status === 'rejected' && selectedLeave.rejectedReason && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="text-sm text-red-600">{selectedLeave.rejectedReason}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowLeaveDetails(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherLeave;
