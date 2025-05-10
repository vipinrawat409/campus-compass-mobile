
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface StudentFeeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    class: string;
  } | null;
  feeHistory: FeeHistoryItem[];
}

interface FeeHistoryItem {
  id: number;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
}

const StudentFeeHistoryModal: React.FC<StudentFeeHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  student, 
  feeHistory 
}) => {
  if (!student) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fee History - {student.name}</DialogTitle>
          <p className="text-sm text-gray-500">Class: {student.class}</p>
        </DialogHeader>
        
        <div className="mt-4">
          {feeHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.feeType}</TableCell>
                    <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              No fee history available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFeeHistoryModal;
