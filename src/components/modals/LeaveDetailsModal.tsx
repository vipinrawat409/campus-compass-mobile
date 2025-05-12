
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, Check, X } from 'lucide-react';

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: any;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const LeaveDetailsModal = ({ isOpen, onClose, leave, onApprove, onReject }: LeaveDetailsModalProps) => {
  if (!leave) return null;
  
  // Helper functions to check object types
  const isStudentLeave = (leave: any): boolean => {
    return 'class' in leave && 'rollNo' in leave;
  };

  const isStaffTeacherLeave = (leave: any): boolean => {
    return ('subject' in leave || 'department' in leave) && !('class' in leave);
  };
  
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{leave.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
            </span>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{leave.role}</p>
              </div>
              
              {isStaffTeacherLeave(leave) && leave.subject && (
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{leave.subject}</p>
                </div>
              )}
              
              {isStaffTeacherLeave(leave) && leave.department && (
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{leave.department}</p>
                </div>
              )}
              
              {isStudentLeave(leave) && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">{leave.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Roll No</p>
                    <p className="font-medium">{leave.rollNo}</p>
                  </div>
                </>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="font-medium">{leave.leaveType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{leave.days} days</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Period</p>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  <p className="font-medium">
                    {new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Applied On</p>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  <p className="font-medium">{new Date(leave.appliedOn).toLocaleDateString()}</p>
                </div>
              </div>
              
              {isStudentLeave(leave) && leave.appliedBy && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Applied By</p>
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-gray-500" />
                    <p className="font-medium">{leave.appliedBy}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-3 mt-3">
              <p className="text-sm text-gray-500">Reason</p>
              <p className="font-medium">{leave.reason}</p>
            </div>
            
            {leave.status === 'rejected' && leave.rejectionReason && (
              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-gray-500">Rejection Reason</p>
                <p className="font-medium text-red-600">{leave.rejectionReason}</p>
              </div>
            )}
          </div>
          
          {leave.status === 'pending' && (
            <div className="flex gap-4 justify-end">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 flex gap-1"
                onClick={() => onApprove(leave.id)}
              >
                <Check size={16} />
                Approve
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 flex gap-1"
                onClick={() => onReject(leave.id)}
              >
                <X size={16} />
                Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailsModal;
