
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

interface NoticeData {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  target: string;
  important: boolean;
  attachment?: boolean;
}

interface EditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeData | null;
  onSave: (notice: NoticeData) => void;
}

const EditNoticeModal = ({
  isOpen,
  onClose,
  notice,
  onSave
}: EditNoticeModalProps) => {
  const [formData, setFormData] = useState<NoticeData | null>(notice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when notice changes
  useEffect(() => {
    setFormData(notice);
  }, [notice]);

  if (!formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => prev ? { ...prev, important: checked } : null);
  };

  const handleTargetChange = (value: string) => {
    setFormData(prev => prev ? { ...prev, target: value } : null);
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
      
      toast("Notice updated", {
        description: "The notice has been updated successfully"
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              required 
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Audience</Label>
              <Select 
                value={formData.target} 
                onValueChange={handleTargetChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Students">Students</SelectItem>
                  <SelectItem value="Parents">Parents</SelectItem>
                  <SelectItem value="Teachers">Teachers</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="important" 
              checked={formData.important} 
              onCheckedChange={handleSwitchChange} 
            />
            <Label htmlFor="important">Mark as Important</Label>
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

export default EditNoticeModal;
