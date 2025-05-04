import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, CheckCircle, Search, Clock } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data
const teacherAttendance = [
  { id: 1, name: 'John Smith', role: 'teacher', subject: 'Mathematics', status: 'present', inTime: '8:30 AM', outTime: '4:00 PM' },
  { id: 2, name: 'Emily Johnson', role: 'teacher', subject: 'English', status: 'present', inTime: '8:15 AM', outTime: '3:45 PM' },
  { id: 3, name: 'David Williams', role: 'teacher', subject: 'Science', status: 'absent', inTime: '-', outTime: '-' },
  { id: 4, name: 'Sarah Brown', role: 'teacher', subject: 'History', status: 'leave', inTime: '-', outTime: '-' },
  { id: 5, name: 'Michael Lee', role: 'teacher', subject: 'Geography', status: 'present', inTime: '8:45 AM', outTime: '4:15 PM' },
];

const staffAttendance = [
  { id: 1, name: 'Robert Wilson', role: 'staff', department: 'Administration', status: 'present', inTime: '8:00 AM', outTime: '5:00 PM' },
  { id: 2, name: 'Jennifer Davis', role: 'staff', department: 'Accounts', status: 'present', inTime: '8:30 AM', outTime: '4:30 PM' },
  { id: 3, name: 'Thomas Jones', role: 'staff', department: 'IT', status: 'absent', inTime: '-', outTime: '-' },
  { id: 4, name: 'Patricia Miller', role: 'staff', department: 'Library', status: 'present', inTime: '9:00 AM', outTime: '5:00 PM' },
];

const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("teachers");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleMarkAttendanceClick = () => {
    toast("Camera mode activated", {
      description: "Please ask staff/teachers to scan their face to mark attendance"
    });
  };

  const filteredData = activeTab === "teachers" 
    ? teacherAttendance.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : staffAttendance.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => setDate(selectedDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleMarkAttendanceClick} className="w-full sm:w-auto">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {date ? `Attendance for ${format(date, "MMMM d, yyyy")}` : "Today's attendance"}
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by name..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teachers" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teachers" className="m-0">
              <AttendanceTable data={filteredData} />
            </TabsContent>
            
            <TabsContent value="staff" className="m-0">
              <AttendanceTable data={filteredData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>Overview for {format(date || new Date(), "MMMM yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Present" 
              value={activeTab === "teachers" ? "18" : "12"} 
              description="Teachers present today" 
              icon={<CheckCircle className="h-4 w-4 text-green-600" />}
              className="border-green-100"
            />
            <StatsCard 
              title="Absent" 
              value={activeTab === "teachers" ? "3" : "2"} 
              description="Not marked present" 
              icon={<Clock className="h-4 w-4 text-red-600" />}
              className="border-red-100"
            />
            <StatsCard 
              title="On Leave" 
              value={activeTab === "teachers" ? "2" : "1"} 
              description="Approved leaves" 
              icon={<CalendarDays className="h-4 w-4 text-yellow-600" />} // Updated to CalendarDays
              className="border-yellow-100"
            />
            <StatsCard 
              title="Attendance Rate" 
              value={activeTab === "teachers" ? "85%" : "87%"} 
              description="Monthly average" 
              icon={<CheckCircle className="h-4 w-4 text-blue-600" />}
              className="border-blue-100"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Attendance table component
const AttendanceTable = ({ data }: { data: any[] }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department/Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>In Time</TableHead>
              <TableHead>Out Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.role}</TableCell>
                  <TableCell>{item.subject || item.department}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{item.inTime}</TableCell>
                  <TableCell>{item.outTime}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn("inline-block px-2 py-1 text-xs rounded-full capitalize", getStatusStyles())}>
      {status}
    </span>
  );
};

// Stats card component
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon,
  className
}: { 
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{description}</div>
    </div>
  );
};

export default AttendanceManagement;
