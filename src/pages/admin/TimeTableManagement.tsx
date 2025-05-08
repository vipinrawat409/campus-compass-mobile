
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, RefreshCw, Bell, User, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TimeTableGenerator from "@/components/timetable/TimeTableGenerator";
import SubstitutionModal from "@/components/timetable/SubstitutionModal";
import { 
  generateTimetable, 
  checkForConflict, 
  addNewSubjectToTimetable,
  mockSubjects 
} from "@/utils/timetableUtils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the timetable entry type for type safety
interface TimetableEntry {
  id: number | string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  substituteStatus?: string;
  substituteTeacher?: string;
}

// Define the timetable data structure with index signature
interface TimetableData {
  [key: string]: TimetableEntry[]; // Add index signature to allow string indexing
  monday: TimetableEntry[];
  tuesday: TimetableEntry[];
  wednesday: TimetableEntry[];
  thursday: TimetableEntry[];
  friday: TimetableEntry[];
  saturday: TimetableEntry[];
}

const TimeTableManagement = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimetableEntry | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    periodsPerWeek: 2,
    requiresSpecialRoom: false
  });
  
  // Initialize timetable data with proper typing
  const [timetableData, setTimetableData] = useState<TimetableData>({
    monday: [
      { id: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', class: '10-A' },
      { id: 2, time: '08:45 - 09:30', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1', class: '10-A' },
      { id: 3, time: '09:30 - 10:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102', class: '10-A' },
      { id: 4, time: '10:15 - 11:00', subject: 'Break', teacher: '-', room: '-', class: '10-A' },
      { id: 5, time: '11:00 - 11:45', subject: 'History', teacher: 'Mr. Wilson', room: 'Room 103', class: '10-A' },
      { id: 6, time: '11:45 - 12:30', subject: 'Geography', teacher: 'Mrs. Taylor', room: 'Room 104', class: '10-A' },
      { id: 7, time: '12:30 - 13:15', subject: 'Break', teacher: '-', room: '-', class: '10-A' },
      { id: 8, time: '13:15 - 14:00', subject: 'Computer Science', teacher: 'Mr. Brown', room: 'Computer Lab', class: '10-A' },
      { id: 9, time: '14:00 - 14:45', subject: 'Physical Education', teacher: 'Mr. Thomas', room: 'Playground', class: '10-A' }
    ],
    tuesday: [
      { id: 1, time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102', class: '10-A' },
      { id: 2, time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', class: '10-A' },
      { id: 3, time: '09:30 - 10:15', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1', class: '10-A' },
      { id: 4, time: '10:15 - 11:00', subject: 'Break', teacher: '-', room: '-', class: '10-A' },
      { id: 5, time: '11:00 - 11:45', subject: 'Art', teacher: 'Ms. Roberts', room: 'Art Room', class: '10-A' },
      { id: 6, time: '11:45 - 12:30', subject: 'Music', teacher: 'Mr. Martin', room: 'Music Room', class: '10-A' },
      { id: 7, time: '12:30 - 13:15', subject: 'Break', teacher: '-', room: '-', class: '10-A' },
      { id: 8, time: '13:15 - 14:00', subject: 'Physics', teacher: 'Dr. Lewis', room: 'Lab 2', class: '10-A' },
      { id: 9, time: '14:00 - 14:45', subject: 'Chemistry', teacher: 'Mrs. Clark', room: 'Lab 3', class: '10-A' }
    ],
    wednesday: [
      { id: 1, time: '08:00 - 08:45', subject: 'Science', teacher: 'Mrs. Smith', room: 'Lab 1', class: '10-A' },
      { id: 2, time: '08:45 - 09:30', subject: 'English', teacher: 'Ms. Davis', room: 'Room 102', class: '10-A' },
      { id: 3, time: '09:30 - 10:15', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', class: '10-A' }
    ],
    thursday: [],
    friday: [],
    saturday: []
  });
  
  const classes = ['7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' }
  ];
  
  const currentTimetable = timetableData[selectedDay] || [];
  const filteredTimetable = currentTimetable.filter(period => 
    period.class === selectedClass || period.subject === 'Break'
  );

  const handleGenerateTimetable = (settings) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Filter selected subjects
        const selectedSubjects = settings.selectedSubjects
          ? settings.selectedSubjects.filter(s => s.selected)
          : [];
          
        // Generate timetable using our algorithm for the selected class only
        const { timetable, conflicts } = generateTimetable({
          ...settings,
          selectedClass: selectedClass,
          selectedSubjects: selectedSubjects // Pass selected subjects to the generator
        });
        
        // Update state with new timetable
        setTimetableData(timetable as TimetableData);
        setConflicts(conflicts);
        
        if (conflicts.length === 0) {
          toast({
            title: "Success",
            description: `Timetable for ${selectedClass} generated successfully without conflicts!`,
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

  const handleManualAdjustment = (period = null) => {
    setSelectedPeriod(period);
    setShowManualAdjustment(true);
  };

  const handleSaveAdjustment = (adjustmentData) => {
    // Check for conflicts
    const { hasConflict, message } = checkForConflict(
      selectedDay,
      adjustmentData.period,
      adjustmentData.teacherId,
      adjustmentData.roomId,
      selectedClass,
      timetableData
    );

    if (hasConflict) {
      toast({
        title: "Conflict Detected",
        description: message,
        variant: "destructive"
      });
      return;
    }

    // If no conflict, proceed with update
    const updatedTimetable = { ...timetableData };
    let updatedPeriods = [...updatedTimetable[selectedDay]];

    if (selectedPeriod) {
      // Update existing period
      const periodIndex = updatedPeriods.findIndex(p => p.id === selectedPeriod.id);
      if (periodIndex !== -1) {
        updatedPeriods[periodIndex] = {
          ...updatedPeriods[periodIndex],
          subject: adjustmentData.subject,
          teacher: adjustmentData.teacher,
          room: adjustmentData.room,
          time: adjustmentData.time
        };
      }
    } else {
      // Add new period
      const newId = Math.max(...updatedPeriods.map(p => typeof p.id === 'number' ? p.id : 0)) + 1;
      updatedPeriods.push({
        id: newId,
        subject: adjustmentData.subject,
        teacher: adjustmentData.teacher,
        room: adjustmentData.room,
        time: adjustmentData.time,
        class: selectedClass
      });

      // Sort periods by time
      updatedPeriods.sort((a, b) => {
        if (a.subject === 'Break') return 0;
        if (b.subject === 'Break') return 0;
        return a.time.localeCompare(b.time);
      });
    }

    updatedTimetable[selectedDay] = updatedPeriods;
    setTimetableData(updatedTimetable);
    setShowManualAdjustment(false);
    setSelectedPeriod(null);

    toast({
      title: "Timetable Updated",
      description: "The timetable has been adjusted successfully.",
    });
  };
  
  const handleAddSubject = () => {
    setShowAddSubject(true);
  };
  
  const handleSaveNewSubject = () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject name.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the generator settings from local storage or use defaults
    const settings = JSON.parse(localStorage.getItem('timetableSettings')) || {
      periodDuration: 45,
      periodsPerDay: 8,
      startTime: '08:00',
      endTime: '16:00', // Added end time
      fixedBreak: true,
      breakPosition: 'middle',
      maintainTeacherAvailability: true,
      autoAdjustNewSubjects: true,
      selectedClass: selectedClass // Add selected class
    };
    
    // Add new subject to timetable
    try {
      const { timetable, conflicts } = addNewSubjectToTimetable(
        selectedClass,
        newSubject.name,
        newSubject.periodsPerWeek,
        newSubject.requiresSpecialRoom,
        timetableData,
        settings
      );
      
      setTimetableData(timetable as TimetableData);
      
      if (conflicts.length === 0) {
        toast({
          title: "Subject Added",
          description: `Successfully added ${newSubject.name} to the timetable for ${selectedClass}.`,
        });
      } else {
        setConflicts(conflicts);
        toast({
          title: "Subject Added with Adjustments",
          description: `Added ${newSubject.name} with ${conflicts.length} scheduling conflicts resolved.`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the subject. Please try again or adjust manually.",
        variant: "destructive"
      });
    }
    
    setShowAddSubject(false);
    setNewSubject({
      name: '',
      periodsPerWeek: 2,
      requiresSpecialRoom: false
    });
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
              onClick={handleAddSubject}
            >
              <BookOpen size={16} />
              Add Subject
            </Button>
            <Button 
              variant="outline"
              className="flex gap-2"
              onClick={() => handleManualAdjustment()}
            >
              <Plus size={16} />
              Add Period
            </Button>
            <Button 
              variant="outline"
              className="flex gap-2"
              onClick={() => setShowGenerator(true)}
            >
              <RefreshCw size={16} />
              Auto Generate
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="w-full bg-gray-100">
              {days.map((day) => (
                <TabsTrigger 
                  key={day.id} 
                  value={day.id}
                  className="flex-1"
                >
                  {day.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {conflicts.length > 0 && (
          <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              {conflicts.length} conflicts were resolved automatically. Some subjects may need manual scheduling.
            </AlertDescription>
          </Alert>
        )}

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
              {filteredTimetable.length > 0 ? (
                filteredTimetable.map((period) => (
                  <TableRow key={period.id} className={period.subject === 'Break' ? 'bg-gray-50' : ''}>
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
                      {period.subject !== 'Break' && (
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
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleManualAdjustment(period)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                    No schedule found for this day. Click "Auto Generate" or "Add Period" to create one.
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
            <DialogDescription>
              Generate a timetable for {selectedClass} based on teacher availability and scheduling constraints.
            </DialogDescription>
          </DialogHeader>
          <TimeTableGenerator 
            onGenerate={handleGenerateTimetable} 
            isGenerating={isGenerating}
            onCancel={() => setShowGenerator(false)}
            selectedClass={selectedClass}
          />
        </DialogContent>
      </Dialog>
      
      {/* Substitution Dialog */}
      {selectedPeriod && (
        <SubstitutionModal
          isOpen={showSubstitution}
          onClose={() => setShowSubstitution(false)}
          period={selectedPeriod as any}
          onConfirm={handleSubstitution}
        />
      )}
      
      {/* Manual Adjustment Dialog */}
      <Dialog open={showManualAdjustment} onOpenChange={setShowManualAdjustment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPeriod ? "Edit Period" : "Add New Period"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select defaultValue={selectedPeriod?.time || "08:00 - 08:45"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00 - 08:45">08:00 - 08:45</SelectItem>
                  <SelectItem value="08:45 - 09:30">08:45 - 09:30</SelectItem>
                  <SelectItem value="09:30 - 10:15">09:30 - 10:15</SelectItem>
                  <SelectItem value="11:00 - 11:45">11:00 - 11:45</SelectItem>
                  <SelectItem value="11:45 - 12:30">11:45 - 12:30</SelectItem>
                  <SelectItem value="13:15 - 14:00">13:15 - 14:00</SelectItem>
                  <SelectItem value="14:00 - 14:45">14:00 - 14:45</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select defaultValue={selectedPeriod?.subject || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Select defaultValue={selectedPeriod?.teacher || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr. Johnson">Mr. Johnson (Mathematics)</SelectItem>
                  <SelectItem value="Mrs. Smith">Mrs. Smith (Science)</SelectItem>
                  <SelectItem value="Ms. Davis">Ms. Davis (English)</SelectItem>
                  <SelectItem value="Mr. Wilson">Mr. Wilson (History)</SelectItem>
                  <SelectItem value="Mrs. Taylor">Mrs. Taylor (Geography)</SelectItem>
                  <SelectItem value="Mr. Brown">Mr. Brown (Computer Science)</SelectItem>
                  <SelectItem value="Mr. Thomas">Mr. Thomas (Physical Education)</SelectItem>
                  <SelectItem value="Ms. Roberts">Ms. Roberts (Art)</SelectItem>
                  <SelectItem value="Mr. Martin">Mr. Martin (Music)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select defaultValue={selectedPeriod?.room || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Room 101">Room 101</SelectItem>
                  <SelectItem value="Room 102">Room 102</SelectItem>
                  <SelectItem value="Room 103">Room 103</SelectItem>
                  <SelectItem value="Room 104">Room 104</SelectItem>
                  <SelectItem value="Lab 1">Lab 1</SelectItem>
                  <SelectItem value="Lab 2">Lab 2</SelectItem>
                  <SelectItem value="Lab 3">Lab 3</SelectItem>
                  <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                  <SelectItem value="Art Room">Art Room</SelectItem>
                  <SelectItem value="Music Room">Music Room</SelectItem>
                  <SelectItem value="Playground">Playground</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800 text-sm">
                The system will check for conflicts to prevent scheduling the same teacher or room at the same time.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualAdjustment(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveAdjustment({
              subject: "Mathematics",
              teacher: "Mr. Johnson",
              room: "Room 101",
              time: "08:00 - 08:45",
              period: 0
            })}>
              {selectedPeriod ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add New Subject Dialog */}
      <Dialog open={showAddSubject} onOpenChange={setShowAddSubject}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Subject to Timetable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="e.g. Physics, Algebra, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodsPerWeek">Periods Per Week</Label>
              <Input
                id="periodsPerWeek"
                type="number"
                min="1"
                max="10"
                value={newSubject.periodsPerWeek}
                onChange={(e) => setNewSubject({...newSubject, periodsPerWeek: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialRoom">Requires Special Room</Label>
              <Select
                value={newSubject.requiresSpecialRoom ? "yes" : "no"}
                onValueChange={(val) => setNewSubject({...newSubject, requiresSpecialRoom: val === "yes"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Examples: Science needs labs, Computer Science needs computer labs, etc.
              </p>
            </div>
            
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800 text-sm">
                The system will automatically adjust the timetable to include this new subject for {selectedClass}, respecting teacher availability and avoiding conflicts.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubject(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewSubject}>
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add the Label component since we're using it in this file
const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
    {children}
  </label>
);

export default TimeTableManagement;
