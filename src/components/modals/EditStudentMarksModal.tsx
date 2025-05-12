
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

interface StudentMark {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remark?: string;
}

interface EditStudentMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  mark: StudentMark | null;
  onSave: (mark: StudentMark) => void;
}

const EditStudentMarksModal = ({
  isOpen,
  onClose,
  mark,
  onSave
}: EditStudentMarksModalProps) => {
  const [formData, setFormData] = useState<StudentMark | null>(mark);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when mark changes
  useEffect(() => {
    setFormData(mark);
  }, [mark]);

  if (!formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'marks') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) return;
      if (numValue > formData.totalMarks) return;
      
      // Calculate grade based on marks percentage
      const percentage = (numValue / formData.totalMarks) * 100;
      let grade = 'F';
      
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C+';
      else if (percentage >= 40) grade = 'C';
      else if (percentage >= 33) grade = 'D';
      
      setFormData(prev => prev ? { 
        ...prev, 
        marks: numValue,
        grade
      } : null);
    } else {
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
      
      toast("Marks updated", {
        description: `Marks for ${formData.studentName} have been updated successfully`
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student Marks</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500 mb-2">Student Information</div>
            <div className="p-3 bg-gray-50 rounded-lg border space-y-1">
              <p><span className="font-medium">Name:</span> {formData.studentName}</p>
              <p><span className="font-medium">Class:</span> {formData.className}</p>
              <p><span className="font-medium">Subject:</span> {formData.subject}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input 
                id="marks" 
                name="marks" 
                type="number"
                min={0}
                max={formData.totalMarks}
                value={formData.marks} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input 
                id="totalMarks" 
                value={formData.totalMarks} 
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input 
                id="grade" 
                value={formData.grade} 
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea 
              id="remark" 
              name="remark" 
              value={formData.remark || ''} 
              onChange={handleChange} 
              placeholder="Add a comment or remark about the student's performance"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentMarksModal;
