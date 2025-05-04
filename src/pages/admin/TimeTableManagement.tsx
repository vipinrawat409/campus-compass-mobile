
import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TimeTableManagement = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDay, setSelectedDay] = useState('monday');
  
  const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'];
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' }
  ];
  
  // Mock timetable data
  const timetableData = {
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
  };
  
  const currentTimetable = timetableData[selectedDay as keyof typeof timetableData] || [];

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
            <select 
              className="px-3 py-1.5 border rounded-md bg-white"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <Button className="flex gap-2">
            <Plus size={16} />
            Add Schedule
          </Button>
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Teacher</th>
                <th className="py-3 px-4 text-left">Room</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTimetable.length > 0 ? (
                currentTimetable.map((period) => (
                  <tr key={period.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        {period.time}
                      </div>
                    </td>
                    <td className="py-3 px-4">{period.subject}</td>
                    <td className="py-3 px-4">{period.teacher}</td>
                    <td className="py-3 px-4">{period.room}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No schedule found for this day. Click "Add Schedule" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeTableManagement;
