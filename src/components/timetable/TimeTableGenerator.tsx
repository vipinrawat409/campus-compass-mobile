
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { mockSubjects } from "@/utils/timetableUtils";

interface TimeTableGeneratorProps {
  onGenerate: (settings: any) => void;
  onCancel: () => void;
  isGenerating: boolean;
  selectedClass?: string;
}

const TimeTableGenerator: React.FC<TimeTableGeneratorProps> = ({ 
  onGenerate, 
  onCancel,
  isGenerating,
  selectedClass = '10-A'
}) => {
  const [settings, setSettings] = useState({
    periodDuration: 45,
    periodsPerDay: 8,
    startTime: '08:00',
    endTime: '16:00',
    avoidConsecutive: true,
    distributeSubjects: true,
    optimizeRooms: true,
    balanceWorkload: true,
    considerPreferences: false,
    allowManualAdjustments: true,
    detectTeacherConflicts: true,
    detectRoomConflicts: true,
    enableSubstitution: true,
    fixedBreak: true,
    breakPosition: 'middle', // 'middle' or custom position
    maintainTeacherAvailability: true,
    autoAdjustNewSubjects: true,
    smartConflictResolution: true,
    selectedClass: selectedClass, // Added selected class
    selectedSubjects: [] // New field for selected subjects
  });
  
  const classes = ['7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const [selectedTab, setSelectedTab] = useState('basic');
  
  // Initialize selected subjects from mock data
  useEffect(() => {
    const initialSubjects = mockSubjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      selected: true,
      periodsPerWeek: subject.periodsPerWeek
    }));
    
    setSettings(prev => ({ ...prev, selectedSubjects: initialSubjects }));
  }, []);
  
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubjectSelection = (subjectId: string, isSelected: boolean) => {
    setSettings(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.map(subject => 
        subject.id === subjectId ? { ...subject, selected: isSelected } : subject
      )
    }));
  };
  
  const handleSubjectPeriodsChange = (subjectId: string, periodsPerWeek: number) => {
    setSettings(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.map(subject => 
        subject.id === subjectId ? { ...subject, periodsPerWeek } : subject
      )
    }));
  };

  // Calculate and validate end time based on start time, period duration, and number of periods
  const calculateEndTime = () => {
    const [hours, minutes] = settings.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + (settings.periodsPerDay * settings.periodDuration);
    
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  // Store settings in local storage when generating
  const handleGenerateClick = () => {
    // Calculate end time based on settings
    const calculatedEndTime = calculateEndTime();
    
    // Update end time in settings
    const finalSettings = {
      ...settings,
      endTime: calculatedEndTime
    };
    
    // Save to local storage
    localStorage.setItem('timetableSettings', JSON.stringify(finalSettings));
    
    // Call the onGenerate callback with settings
    onGenerate(finalSettings);
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {selectedTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="periodDuration">Period Duration (minutes)</Label>
              <Input
                id="periodDuration"
                type="number"
                value={settings.periodDuration}
                onChange={(e) => handleChange('periodDuration', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodsPerDay">Periods Per Day</Label>
              <Input
                id="periodsPerDay"
                type="number"
                value={settings.periodsPerDay}
                onChange={(e) => handleChange('periodsPerDay', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">School Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTimeDisplay">School End Time (calculated)</Label>
              <Input
                id="endTimeDisplay"
                type="time"
                value={calculateEndTime()}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                End time is calculated based on periods and duration
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days">School Days</Label>
              <Select defaultValue="6-day">
                <SelectTrigger>
                  <SelectValue placeholder="Monday - Saturday" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-day">Monday - Friday</SelectItem>
                  <SelectItem value="6-day">Monday - Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="fixedBreak">Fixed break position</Label>
                <Switch
                  id="fixedBreak"
                  checked={settings.fixedBreak}
                  onCheckedChange={(checked) => handleChange('fixedBreak', checked)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Places break at the middle of the day for all classes
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintainTeacherAvailability">Maintain teacher availability</Label>
                <Switch
                  id="maintainTeacherAvailability"
                  checked={settings.maintainTeacherAvailability}
                  onCheckedChange={(checked) => handleChange('maintainTeacherAvailability', checked)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Prevents scheduling conflicts for teachers across classes
              </p>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-blue-50">
            <p className="text-sm text-blue-800">
              This will generate a timetable for <strong>{selectedClass}</strong> considering teacher availability, subjects, and room constraints.
            </p>
          </div>
        </div>
      )}
      
      {selectedTab === 'subjects' && (
        <div className="space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800">
              Select the subjects to include in the timetable for {selectedClass} and set the number of periods per week for each subject.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            {settings.selectedSubjects.map((subject) => (
              <Card key={subject.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`subject-${subject.id}`}
                      checked={subject.selected}
                      onCheckedChange={(checked) => handleSubjectSelection(subject.id, !!checked)}
                    />
                    <Label htmlFor={`subject-${subject.id}`} className="font-medium">
                      {subject.name}
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`periods-${subject.id}`} className="text-sm mr-2">
                      Periods/week:
                    </Label>
                    <Input
                      id={`periods-${subject.id}`}
                      type="number"
                      min="1"
                      max="10"
                      value={subject.periodsPerWeek}
                      onChange={(e) => handleSubjectPeriodsChange(subject.id, parseInt(e.target.value) || 1)}
                      className="w-16 h-8"
                      disabled={!subject.selected}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {selectedTab === 'advanced' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="avoidConsecutive">Avoid consecutive periods for teachers</Label>
              <Switch
                id="avoidConsecutive"
                checked={settings.avoidConsecutive}
                onCheckedChange={(checked) => handleChange('avoidConsecutive', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Prevents teachers from having too many consecutive teaching periods
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="distributeSubjects">Distribute subjects evenly</Label>
              <Switch
                id="distributeSubjects"
                checked={settings.distributeSubjects}
                onCheckedChange={(checked) => handleChange('distributeSubjects', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Prevents subjects from clustering on specific days
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="optimizeRooms">Optimize room allocation</Label>
              <Switch
                id="optimizeRooms"
                checked={settings.optimizeRooms}
                onCheckedChange={(checked) => handleChange('optimizeRooms', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Ensures specialized subjects are assigned to appropriate rooms
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="balanceWorkload">Balance teacher workload</Label>
              <Switch
                id="balanceWorkload"
                checked={settings.balanceWorkload}
                onCheckedChange={(checked) => handleChange('balanceWorkload', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Distributes teaching load evenly among teachers
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="detectTeacherConflicts">Detect teacher conflicts in manual adjustments</Label>
              <Switch
                id="detectTeacherConflicts"
                checked={settings.detectTeacherConflicts}
                onCheckedChange={(checked) => handleChange('detectTeacherConflicts', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Prevents assigning same teacher to multiple classes simultaneously
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoAdjustNewSubjects">Auto-adjust for new subjects</Label>
              <Switch
                id="autoAdjustNewSubjects"
                checked={settings.autoAdjustNewSubjects}
                onCheckedChange={(checked) => handleChange('autoAdjustNewSubjects', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Automatically adjusts timetable when new subjects are added
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableSubstitution">Enable teacher substitution system</Label>
              <Switch
                id="enableSubstitution"
                checked={settings.enableSubstitution}
                onCheckedChange={(checked) => handleChange('enableSubstitution', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Allows managing teacher absences with substitute arrangements
            </p>
          </div>
        </div>
      )}
      
      {selectedTab === 'constraints' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Special requirements</Label>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Teacher preferences</p>
                    <p className="text-sm text-gray-500">Consider teacher timing preferences</p>
                  </div>
                  <Switch
                    checked={settings.considerPreferences}
                    onCheckedChange={(checked) => handleChange('considerPreferences', checked)}
                  />
                </div>
              </Card>
              
              <Card className="p-3">
                <p className="font-medium">Subject distribution</p>
                <p className="text-sm text-gray-500 mb-2">
                  For subjects with multiple periods per week
                </p>
                <Select defaultValue="distribute">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distribute">Distribute evenly across week</SelectItem>
                    <SelectItem value="consecutive">Allow consecutive periods</SelectItem>
                    <SelectItem value="sameday">Allow same-day scheduling</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Smart conflict resolution</p>
                    <p className="text-sm text-gray-500">Automatically resolve scheduling conflicts</p>
                  </div>
                  <Switch
                    checked={settings.smartConflictResolution}
                    onCheckedChange={(checked) => handleChange('smartConflictResolution', checked)}
                  />
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Manual adjustment</p>
                    <p className="text-sm text-gray-500">Allow manual timetable adjustments</p>
                  </div>
                  <Switch
                    checked={settings.allowManualAdjustments}
                    onCheckedChange={(checked) => handleChange('allowManualAdjustments', checked)}
                  />
                </div>
              </Card>
            </div>
          </div>
          
          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Manual adjustments will be checked for teacher conflicts to prevent scheduling the same teacher in multiple classes simultaneously.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
          Cancel
        </Button>
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : `Generate Timetable for ${selectedClass}`}
        </Button>
      </div>
    </div>
  );
};

export default TimeTableGenerator;
