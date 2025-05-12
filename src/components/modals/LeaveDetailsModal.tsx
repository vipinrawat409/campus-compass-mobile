
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, FileText } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface LeaveData {
  id: number;
  name: string;
  role: string;
  date: string;
  reason: string;
  status: string;
  document?: string;
  appliedOn?: string;
}

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveData | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const LeaveDetailsModal = ({
  isOpen,
  onClose,
  leave,
  onApprove,
  onReject
}: LeaveDetailsModalProps) => {
  const [status, setStatus] = useState<string | null>(null);

  if (!leave) {
    return null;
  }

  const currentStatus = status || leave.status;

  const handleApprove = () => {
    setStatus('Approved');
    onApprove(leave.id);
    toast("Leave approved", {
      description: "The leave application has been approved"
    });
  };

  const handleReject = () => {
    setStatus('Rejected');
    onReject(leave.id);
    toast("Leave rejected", {
      description: "The leave application has been rejected"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{leave.name}</h2>
              <div className="text-sm text-gray-500">{leave.role}</div>
            </div>
            
            <div className={`px-3 py-1 h-fit rounded-full text-sm font-medium ${
              currentStatus === 'Approved' 
                ? 'bg-green-100 text-green-800' 
                : currentStatus === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentStatus}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Leave Duration</p>
                <p className="text-gray-700">{leave.date}</p>
              </div>
            </div>
            
            {leave.appliedOn && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Applied On</p>
                  <p className="text-gray-700">{leave.appliedOn}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-gray-700">{leave.reason}</p>
              </div>
            </div>
          </div>
          
          {leave.document && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Attached Documents</h3>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-medium">
                    PDF
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{leave.document}</p>
                    <p className="text-xs text-gray-500">Uploaded on {leave.appliedOn || 'today'}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
          {currentStatus === 'Pending' && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="default"
                className="flex-1 sm:flex-none"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 sm:flex-none"
                onClick={handleReject}
              >
                Reject
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailsModal;
