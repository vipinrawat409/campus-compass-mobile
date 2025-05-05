
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from 'lucide-react';

interface Period {
  id: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
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
  
  // Mock available teachers for this subject
  const availableTeachers = [
    { id: 1, name: 'Mr. Adams', subject: period?.subject },
    { id: 2, name: 'Mrs. Wilson', subject: period?.subject },
    { id: 3, name: 'Ms. Peterson', subject: period?.subject },
    { id: 4, name: 'Mr. Rodriguez', subject: period?.subject },
  ];
  
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
                <span className="font-medium">Teacher:</span>
                <span>{period.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Room:</span>
                <span>{period.room}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Substitute Teacher
              </label>
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
                      {teacher.name} ({teacher.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
