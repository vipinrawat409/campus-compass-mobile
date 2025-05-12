
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Calendar, User, Bell } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface FeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeData: {
    id: number;
    studentId: number;
    student: string;
    class: string;
    feeType: string;
    amount: number;
    dueDate: string;
    status: string;
    paidDate?: string;
    paidAmount?: number;
  } | null;
  onStatusChange: (id: number, newStatus: string) => void;
  onSendNotification: (studentId: number, student: string, feeType: string) => void;
}

const FeeDetailsModal = ({
  isOpen,
  onClose,
  feeData,
  onStatusChange,
  onSendNotification
}: FeeDetailsModalProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (status: string) => {
    if (feeData) {
      onStatusChange(feeData.id, status);
    }
  };

  const handleSendNotification = () => {
    if (feeData) {
      onSendNotification(feeData.studentId, feeData.student, feeData.feeType);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fee Details</DialogTitle>
        </DialogHeader>
        
        {feeData && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{feeData.student}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(feeData.status)}`}>
                {feeData.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{feeData.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee Type</p>
                <p className="font-medium">{feeData.feeType}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-bold text-lg">₹{feeData.amount.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <p>{new Date(feeData.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {feeData.paidAmount && (
                  <div>
                    <p className="text-sm text-gray-500">Paid Amount</p>
                    <p className="font-medium">₹{feeData.paidAmount.toLocaleString()}</p>
                  </div>
                )}
                
                {feeData.paidDate && (
                  <div>
                    <p className="text-sm text-gray-500">Paid Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <p>{new Date(feeData.paidDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <div>
                {feeData.status === 'Pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-1 items-center"
                    onClick={handleSendNotification}
                  >
                    <Bell size={16} />
                    Send Reminder
                  </Button>
                )}
              </div>
              
              <div className="space-x-2">
                {feeData.status !== 'Paid' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex gap-1 items-center"
                    onClick={() => handleStatusChange('Paid')}
                  >
                    <Check size={16} />
                    Mark as Paid
                  </Button>
                )}
                
                {feeData.status !== 'Partially Paid' && feeData.status !== 'Paid' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600"
                    onClick={() => handleStatusChange('Partially Paid')}
                  >
                    Partially Paid
                  </Button>
                )}
                
                {feeData.status !== 'Pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-yellow-600"
                    onClick={() => handleStatusChange('Pending')}
                  >
                    Mark as Pending
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeeDetailsModal;
