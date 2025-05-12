
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';
import CameraAttendanceModal from './CameraAttendanceModal';
import { toast } from "@/components/ui/sonner";

interface MarkAttendanceButtonProps {
  onAttendanceMarked?: (staffId: number, name: string) => void;
}

const MarkAttendanceButton = ({ onAttendanceMarked }: MarkAttendanceButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleMarkAttendance = (staffId: number, name: string) => {
    toast("Attendance Marked", {
      description: `${name}'s attendance has been marked successfully.`
    });
    
    if (onAttendanceMarked) {
      onAttendanceMarked(staffId, name);
    }
  };
  
  return (
    <>
      <Button 
        variant="default" 
        className="flex gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Camera size={16} />
        Mark Attendance
      </Button>
      
      <CameraAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMarkAttendance={handleMarkAttendance}
      />
    </>
  );
};

export default MarkAttendanceButton;
