
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, RefreshCw, Bell, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TimeTableGenerator from "@/components/timetable/TimeTableGenerator";
import SubstitutionModal from "@/components/timetable/SubstitutionModal";
import { generateTimetable } from "@/utils/timetableUtils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TimeTableManagement = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [timetableData, setTimetableData] = useState({
    monday: [
      { id: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
      { id: 2, time: '08:45 - 09:30', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1' },
      { id: 3, time: '09:30 - 10:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102' },
      { id: 4, time: '10:15 - 11:00', subject: 'Break', teacher: '-', room: '-' },
      { id: 5, time: '11:00 - 11:45', subject: 'History', teacher: 'Mr. Wilson', room: 'Room 103' },
      { id: 6, time: '11:45 - 12:30', subject: 'Geography', teacher: 'Mrs. Taylor', room: 'Room 104' },
      { id: 7, time: '12:30 - 13:15', subject: 'Lunch', teacher: '-', room: '-' },
      { id: 8, time: '13:15 - 14:00', subject: 'Computer Science', teacher: 'Mr. Brown', room: 'Computer Lab' },
      { id: 9, time: '14:00 - 14:45', subject: 'Physical Education', teacher: 'Mr. Thomas', room: 'Playground' }
    ],
    tuesday: [
      { id: 1, time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102' },
      { id: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
      { id: 3, time: '09:30 - 10:15', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1' },
      { id: 4, time: '10:15 - 11:00', subject: 'Break', teacher: '-', room: '-' },
      { id: 5, time: '11:00 - 11:45', subject: 'Art', teacher: 'Ms. Roberts', room: 'Art Room' },
      { id: 6, time: '11:45 - 12:30', subject: 'Music', teacher: 'Mr. Martin', room: 'Music Room' },
      { id: 7, time: '12:30 - 13:15', subject: 'Lunch', teacher: '-', room: '-' },
      { id: 8, time: '13:15 - 14:00', subject: 'Physics', teacher: 'Dr. Lewis', room: 'Lab 2' },
      { id: 9, time: '14:00 - 14:45', subject: 'Chemistry', teacher: 'Mrs. Clark', room: 'Lab 3' }
    ],
    wednesday: [
      { id: 1, time: '08:00 - 08:45', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1' },
      { id: 2, time: '08:45 - 09:30', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102' },
      { id: 3, time: '09:30 - 10:15', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' }
    ],
    thursday: [],
    friday: [],
    saturday: []
  });
  
  const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'];
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' }
  ];
  
  const currentTimetable = timetableData[selectedDay] || [];

  const handleGenerateTimetable = (settings) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate timetable using our algorithm
        const { timetable, conflicts } = generateTimetable(settings);
        
        // Update state with new timetable
        setTimetableData(timetable);
        
        if (conflicts.length === 0) {
          toast({
            title: "Success",
            description: "Timetable generated successfully without conflicts!",
          });
        } else {
          toast({
            title: "Timetable generated with some adjustments",
            description: `${conflicts.length} conflicts were resolved automatically.`,
            variant: "default"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate timetable. Please try again with different constraints.",
          variant: "destructive"
        });
      }
      setIsGenerating(false);
      setShowGenerator(false);
    }, 2000);
  };
  
  const handleReportAbsence = (periodId) => {
    const period = currentTimetable.find(p => p.id === periodId);
    if (period) {
      setSelectedPeriod(period);
      setShowSubstitution(true);
    }
  };
  
  const handleSubstitution = (substitute) => {
    if (selectedPeriod && substitute) {
      // Clone the current timetable
      const updatedTimetable = { ...timetableData };
      
      // Find the period to update
      const periodIndex = updatedTimetable[selectedDay].findIndex(p => p.id === selectedPeriod.id);
      
      if (periodIndex !== -1) {
        // Create notification for the substitute teacher
        toast({
          title: "Substitution Requested",
          description: `Notification sent to ${substitute} for ${selectedPeriod.subject} class (${selectedPeriod.time})`,
        });
        
        // Update UI to show pending status
        const updatedPeriods = [...updatedTimetable[selectedDay]];
        updatedPeriods[periodIndex] = {
          ...updatedPeriods[periodIndex],
          substituteStatus: 'pending',
          substituteTeacher: substitute
        };
        
        updatedTimetable[selectedDay] = updatedPeriods;
        setTimetableData(updatedTimetable);
      }
      
      setShowSubstitution(false);
      setSelectedPeriod(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Timetable Management</h1>
        <p className="text-gray-500">Create and manage class timetables</p>
      </div>
      
      <div className="card-wrapper">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium">Class:</span>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              className="flex gap-2"
              onClick={() => setShowGenerator(true)}
            >
              <RefreshCw size={16} />
              Auto Generate
            </Button>
            <Button className="flex gap-2">
              <Plus size={16} />
              Add Schedule
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <TabsList className="w-full bg-gray-100">
            {days.map((day) => (
              <TabsTrigger 
                key={day.id} 
                value={day.id}
                className="flex-1"
                onClick={() => setSelectedDay(day.id)}
              >
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTimetable.length > 0 ? (
                currentTimetable.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        {period.time}
                      </div>
                    </TableCell>
                    <TableCell>{period.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {period.substituteStatus === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <span>{period.teacher}</span>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                              Substitute pending
                            </span>
                          </div>
                        ) : (
                          <span>{period.teacher}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{period.room}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReportAbsence(period.id)}
                          title="Report teacher absence"
                        >
                          <User size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                    No schedule found for this day. Click "Auto Generate" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Timetable Generator Dialog */}
      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Automatic Timetable Generator</DialogTitle>
          </DialogHeader>
          <TimeTableGenerator 
            onGenerate={handleGenerateTimetable} 
            isGenerating={isGenerating}
            onCancel={() => setShowGenerator(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Substitution Dialog */}
      {selectedPeriod && (
        <SubstitutionModal
          isOpen={showSubstitution}
          onClose={() => setShowSubstitution(false)}
          period={selectedPeriod}
          onConfirm={handleSubstitution}
        />
      )}
    </div>
  );
};

export default TimeTableManagement;
