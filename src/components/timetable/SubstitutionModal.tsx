import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { findSubstituteTeachers } from "@/utils/timetableUtils";

interface Period {
  id: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  class?: string;
}

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: Period;
  onConfirm: (substituteTeacher: string) => void;
}

const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  period,
  onConfirm,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (period) {
      setLoading(true);
      // Fetch potential substitutes from our utility
      const day = new Date().toLocaleString('en-US', { weekday: 'short' }).toLowerCase(); // Fixed: Convert date to day name correctly
      const substitutes = findSubstituteTeachers(
        period.teacher, 
        period.subject,
        period.time,
        day
      );
      
      setAvailableTeachers(substitutes.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        subject: period?.subject,
        availability: 'Available'
      })));
      setLoading(false);
    }
  }, [period]);
  
  const handleConfirm = () => {
    if (selectedTeacher) {
      onConfirm(selectedTeacher);
    }
  };
  
  if (!period) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Teacher Substitution</DialogTitle>
          <DialogDescription>
            Find a substitute teacher for this class period
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 border-blue-100 border rounded-md p-4 mb-4">
            <h3 className="font-medium text-blue-900">{period.subject}</h3>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{period.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} />
                <span className="font-medium">Teacher:</span>
                <span>{period.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Room:</span>
                <span>{period.room}</span>
              </div>
              {period.class && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Class:</span>
                  <span>{period.class}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Substitute Teacher
              </label>
              {loading ? (
                <div className="text-sm text-gray-500">Loading available teachers...</div>
              ) : availableTeachers.length > 0 ? (
                <Select
                  value={selectedTeacher}
                  onValueChange={setSelectedTeacher}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a substitute teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{teacher.name} ({teacher.subject})</span>
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            {teacher.availability}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert variant="destructive" className="mt-2 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-800">
                    No qualified substitute teachers are available at this time.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="bg-yellow-50 border-yellow-100 border rounded-md p-3 text-sm text-yellow-800">
              <p>
                A notification will be sent to the selected teacher. They can accept or decline the substitution request.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedTeacher}
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubstitutionModal;
