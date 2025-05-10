
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

interface AddFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feeData: FeeData) => void;
  students: Student[];
}

export interface Student {
  id: number;
  name: string;
  class: string;
}

export interface FeeData {
  studentId: number;
  feeType: string;
  amount: number;
  dueDate: string;
}

const AddFeeModal: React.FC<AddFeeModalProps> = ({ isOpen, onClose, onSave, students }) => {
  const [formData, setFormData] = useState<FeeData>({
    studentId: 0,
    feeType: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const feeTypes = [
    "Annual Fee",
    "Transport Fee",
    "Lab Fee",
    "Exam Fee",
    "Sports Fee",
    "Library Fee"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'studentId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.studentId === 0) {
      newErrors.studentId = 'Please select a student';
    }
    
    if (!formData.feeType) {
      newErrors.feeType = 'Fee type is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      
      // Reset form
      setFormData({
        studentId: 0,
        feeType: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Fee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Select Student</Label>
            <select
              id="studentId"
              name="studentId"
              className="w-full p-2 border rounded-md"
              value={formData.studentId}
              onChange={handleChange}
            >
              <option value={0}>Select student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name} - {student.class}</option>
              ))}
            </select>
            {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feeType">Fee Type</Label>
            <select
              id="feeType"
              name="feeType"
              className="w-full p-2 border rounded-md"
              value={formData.feeType}
              onChange={handleChange}
            >
              <option value="">Select fee type</option>
              {feeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.feeType && <p className="text-xs text-red-500">{errors.feeType}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount || ''}
              onChange={handleChange}
              placeholder="Enter amount"
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeModal;
