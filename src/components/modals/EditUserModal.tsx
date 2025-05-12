
import React, { useState } from 'react';
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
import { toast } from "@/components/ui/sonner";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  username: string;
  subject?: string;
  class?: string;
  department?: string;
  phone?: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (user: UserData) => void;
}

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSave
}: EditUserModalProps) => {
  const [formData, setFormData] = useState<UserData | null>(user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when user changes
  React.useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
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
      
      toast("User updated", {
        description: "User information has been updated successfully"
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          {formData.role === 'teacher' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                value={formData.subject || ''} 
                onChange={handleChange} 
              />
            </div>
          )}
          
          {formData.role === 'student' && (
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input 
                id="class" 
                name="class" 
                value={formData.class || ''} 
                onChange={handleChange} 
              />
            </div>
          )}
          
          {formData.role === 'staff' && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department || ''} 
                onChange={handleChange} 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password (leave empty to keep current)</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              placeholder="••••••••" 
              onChange={handleChange} 
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

export default EditUserModal;
