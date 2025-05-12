
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Camera, Check, X, User } from 'lucide-react';

interface CameraAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAttendance: (staffId: number, name: string) => void;
}

const CameraAttendanceModal = ({ isOpen, onClose, onMarkAttendance }: CameraAttendanceModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognizedPerson, setRecognizedPerson] = useState<{id: number, name: string, role: string} | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Mock staff data for demonstration
  const staffData = [
    { id: 1, name: 'John Miller', role: 'Senior Teacher' },
    { id: 2, name: 'Sarah Johnson', role: 'Teacher' },
    { id: 3, name: 'Michael Brown', role: 'Teacher' },
    { id: 4, name: 'Robert Wilson', role: 'Administrative Staff' },
  ];
  
  // Start camera when the modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen]);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setCameraError(null);
      
      // Simulate face recognition after 3 seconds (for demo purposes)
      const timer = setTimeout(() => {
        // Randomly select a staff member
        const randomStaff = staffData[Math.floor(Math.random() * staffData.length)];
        setRecognizedPerson(randomStaff);
      }, 3000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Could not access camera. Please make sure your camera is connected and you have granted permission.');
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setRecognizedPerson(null);
  };
  
  const handleConfirmAttendance = () => {
    if (recognizedPerson) {
      onMarkAttendance(recognizedPerson.id, recognizedPerson.name);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance with Camera</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative bg-black rounded-md overflow-hidden">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-100 rounded-md">
                <Camera className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-red-500">{cameraError}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={startCamera}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[300px] object-cover"
              />
            )}
            
            {recognizedPerson && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-medium">{recognizedPerson.name}</p>
                    <p className="text-sm opacity-80">{recognizedPerson.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {recognizedPerson 
                ? "Person recognized. Confirm to mark attendance." 
                : "Scanning for face recognition..."}
            </p>
            
            {recognizedPerson && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 flex gap-1"
                  onClick={onClose}
                >
                  <X size={16} />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 flex gap-1"
                  onClick={handleConfirmAttendance}
                >
                  <Check size={16} />
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraAttendanceModal;
