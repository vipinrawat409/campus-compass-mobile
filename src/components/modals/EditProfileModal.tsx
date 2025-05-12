
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  role: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onSave: (profile: ProfileData) => void;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  profile,
  onSave
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState<ProfileData | null>(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when profile changes
  useEffect(() => {
    setFormData(profile);
    setAvatarPreview(profile?.avatar || null);
  }, [profile]);

  if (!formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    
    // Create updated profile data
    const updatedProfile = {
      ...formData,
      avatar: avatarPreview || formData.avatar
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(updatedProfile);
      setIsSubmitting(false);
      onClose();
      
      toast("Profile updated", {
        description: "Your profile has been updated successfully"
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-lg">
                    {formData.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="mt-2 text-center">
                <Label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  Change Photo
                </Label>
                <Input 
                  id="avatar" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          
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
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio || ''} 
              onChange={handleChange} 
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password (leave empty to keep current)</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              placeholder="••••••••" 
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

export default EditProfileModal;
