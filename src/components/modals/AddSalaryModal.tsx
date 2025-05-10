
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface AddSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salaryData: SalaryFormData) => void;
  staffMembers: StaffMember[];
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
}

export interface SalaryFormData {
  staffId: number;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  month: string;
  year: string;
}

const AddSalaryModal: React.FC<AddSalaryModalProps> = ({ isOpen, onClose, onSave, staffMembers }) => {
  const currentDate = new Date();
  
  const [formData, setFormData] = useState<SalaryFormData>({
    staffId: 0,
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    month: currentDate.toLocaleString('default', { month: 'long' }),
    year: currentDate.getFullYear().toString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (currentDate.getFullYear() - 2 + i).toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'staffId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else if (['basic', 'hra', 'allowances', 'deductions'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.staffId === 0) {
      newErrors.staffId = 'Please select a staff member';
    }
    
    if (formData.basic <= 0) {
      newErrors.basic = 'Basic salary must be greater than 0';
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
        staffId: 0,
        basic: 0,
        hra: 0,
        allowances: 0,
        deductions: 0,
        month: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear().toString()
      });
    }
  };

  const calculateNetSalary = () => {
    return formData.basic + formData.hra + formData.allowances - formData.deductions;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Salary</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffId">Select Staff Member</Label>
            <select
              id="staffId"
              name="staffId"
              className="w-full p-2 border rounded-md"
              value={formData.staffId}
              onChange={handleChange}
            >
              <option value={0}>Select staff member</option>
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name} - {staff.role}</option>
              ))}
            </select>
            {errors.staffId && <p className="text-xs text-red-500">{errors.staffId}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <select
                id="month"
                name="month"
                className="w-full p-2 border rounded-md"
                value={formData.month}
                onChange={handleChange}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <select
                id="year"
                name="year"
                className="w-full p-2 border rounded-md"
                value={formData.year}
                onChange={handleChange}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="basic">Basic Salary</Label>
            <Input
              id="basic"
              name="basic"
              type="number"
              value={formData.basic || ''}
              onChange={handleChange}
              placeholder="Enter basic salary"
              className={errors.basic ? "border-red-500" : ""}
            />
            {errors.basic && <p className="text-xs text-red-500">{errors.basic}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hra">HRA</Label>
            <Input
              id="hra"
              name="hra"
              type="number"
              value={formData.hra || ''}
              onChange={handleChange}
              placeholder="Enter HRA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allowances">Allowances</Label>
            <Input
              id="allowances"
              name="allowances"
              type="number"
              value={formData.allowances || ''}
              onChange={handleChange}
              placeholder="Enter allowances"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deductions">Deductions</Label>
            <Input
              id="deductions"
              name="deductions"
              type="number"
              value={formData.deductions || ''}
              onChange={handleChange}
              placeholder="Enter deductions"
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Net Salary:</span>
              <span className="font-bold">₹{calculateNetSalary().toLocaleString()}</span>
            </div>
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

export default AddSalaryModal;
