
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { School, Users, GraduationCap, UserCheck, MapPin, Phone, Mail, User2 } from 'lucide-react';

interface InstituteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institute: {
    id: number;
    name: string;
    location: string;
    students: number;
    address?: string;
    phone?: string;
    email?: string;
    teachers?: number;
    staff?: number;
    foundedYear?: number;
    principal?: string;
  };
}

const InstituteDetailsModal = ({
  isOpen,
  onClose,
  institute
}: InstituteDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Institute Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{institute.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin size={16} />
                <span>{institute.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-full bg-soft-blue h-16 w-16">
              <School className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Institute Information</h3>
              
              <div className="space-y-2">
                {institute.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-gray-600">{institute.address}</p>
                    </div>
                  </div>
                )}
                
                {institute.phone && (
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{institute.phone}</p>
                    </div>
                  </div>
                )}
                
                {institute.email && (
                  <div className="flex items-start gap-2">
                    <Mail size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{institute.email}</p>
                    </div>
                  </div>
                )}
                
                {institute.foundedYear && (
                  <div className="flex items-start gap-2">
                    <School size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Founded Year</p>
                      <p className="text-sm text-gray-600">{institute.foundedYear}</p>
                    </div>
                  </div>
                )}
                
                {institute.principal && (
                  <div className="flex items-start gap-2">
                    <User2 size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Principal</p>
                      <p className="text-sm text-gray-600">{institute.principal}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-soft-blue rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <span className="font-bold">{institute.students}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-soft-green rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCheck size={18} className="text-green-500" />
                    <span className="text-sm font-medium">Teachers</span>
                  </div>
                  <span className="font-bold">{institute.teachers || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-soft-purple rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-purple-500" />
                    <span className="text-sm font-medium">Staff</span>
                  </div>
                  <span className="font-bold">{institute.staff || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstituteDetailsModal;
