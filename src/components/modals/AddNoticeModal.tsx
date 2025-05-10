
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Star } from 'lucide-react';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noticeData: NoticeData) => void;
}

export interface NoticeData {
  id?: number;
  title: string;
  content: string;
  date: string;
  author: string;
  target: string;
  important: boolean;
}

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NoticeData>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    author: '',
    target: 'All',
    important: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const targets = ['All', 'Parents', 'Teachers', 'Students', 'Staff'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        target: 'All',
        important: false
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Notice</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notice Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notice title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter notice content"
              rows={5}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Audience</Label>
              <select
                id="target"
                name="target"
                className="w-full p-2 border rounded-md"
                value={formData.target}
                onChange={handleChange}
              >
                {targets.map(target => (
                  <option key={target} value={target}>{target}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="important"
                name="important"
                checked={formData.important}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="important" className="cursor-pointer flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                Mark as Important
              </Label>
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

export default AddNoticeModal;
