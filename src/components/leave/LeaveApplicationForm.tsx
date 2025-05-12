
import React, { useState } from 'react';
import { CalendarIcon, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaveApplicationFormProps {
  role: 'teacher' | 'parent' | 'staff';
  onSuccess?: () => void;
}

const LeaveApplicationForm = ({ role, onSuccess }: LeaveApplicationFormProps) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) {
      toast("Please select a start date", { description: "Start date is required" });
      return;
    }
    
    if (!leaveType) {
      toast("Please select leave type", { description: "Leave type is required" });
      return;
    }
    
    if (!reason) {
      toast("Please provide a reason", { description: "Reason is required" });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Leave application submitted", {
        description: "Your leave application has been submitted successfully"
      });
      
      setStartDate(undefined);
      setEndDate(undefined);
      setReason('');
      setLeaveType('');
      setFile(null);
      setLoading(false);
      
      if (onSuccess) onSuccess();
    }, 1000);
  };
  
  // Get appropriate leave types based on role
  const getLeaveTypes = () => {
    switch (role) {
      case 'teacher':
        return [
          { value: 'casual', label: 'Casual Leave' },
          { value: 'sick', label: 'Sick Leave' },
          { value: 'earned', label: 'Earned Leave' },
          { value: 'maternity', label: 'Maternity Leave' },
          { value: 'paternity', label: 'Paternity Leave' },
        ];
      case 'parent':
        return [
          { value: 'sick', label: 'Sick Leave' },
          { value: 'family', label: 'Family Function' },
          { value: 'medical', label: 'Medical Appointment' },
          { value: 'other', label: 'Other' },
        ];
      case 'staff':
        return [
          { value: 'casual', label: 'Casual Leave' },
          { value: 'sick', label: 'Sick Leave' },
          { value: 'earned', label: 'Earned Leave' },
          { value: 'other', label: 'Other' },
        ];
      default:
        return [];
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type</Label>
        <Select value={leaveType} onValueChange={setLeaveType}>
          <SelectTrigger id="leaveType">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {getLeaveTypes().map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="startDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="endDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => 
                  (startDate ? date < startDate : false) || 
                  date < new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Leave</Label>
        <Textarea
          id="reason"
          placeholder="Please provide a detailed reason for your leave request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document">Supporting Document (Optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="document"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative flex-1">
            <Label
              htmlFor="document"
              className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <Upload className="mr-2 h-4 w-4" />
              {file ? file.name : 'Upload document'}
            </Label>
          </div>
          {file && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setFile(null)}
            >
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Accepted file formats: PDF, JPG, PNG (Max size: 5MB)
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Leave Application'}
      </Button>
    </form>
  );
};

export default LeaveApplicationForm;
