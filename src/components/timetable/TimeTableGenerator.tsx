import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeTableGeneratorProps {
  onGenerate: (settings: any) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

const TimeTableGenerator: React.FC<TimeTableGeneratorProps> = ({ 
  onGenerate, 
  onCancel,
  isGenerating 
}) => {
  const [settings, setSettings] = useState({
    periodDuration: 45,
    periodsPerDay: 8,
    startTime: '08:00',
    avoidConsecutive: true,
    distributeSubjects: true,
    optimizeRooms: true,
    balanceWorkload: true,
    considerPreferences: false,
    allowManualAdjustments: true,
    detectTeacherConflicts: true,
    detectRoomConflicts: true,
    enableSubstitution: true
  });
  
  const classes = ['7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const [selectedTab, setSelectedTab] = useState('basic');
  
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
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
              <Label htmlFor="days">School Days</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Monday - Saturday" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-day">Monday - Friday</SelectItem>
                  <SelectItem value="6-day">Monday - Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-blue-50">
            <p className="text-sm text-blue-800">
              This will generate timetables for all classes considering teacher availability, subjects, and room constraints.
            </p>
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
          onClick={() => onGenerate(settings)} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Timetables"}
        </Button>
      </div>
    </div>
  );
};

export default TimeTableGenerator;
