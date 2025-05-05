
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StaffLeave from '../staff/StaffLeave';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Leave = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Render appropriate leave component based on user role
  const renderLeaveComponent = () => {
    switch (user.role) {
      case 'student':
        return <StudentLeave />;
      case 'teacher':
        return <TeacherLeave />;
      case 'staff':
        return <StaffLeave />;
      default:
        return <div className="p-6">Leave management is not available for your role.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderLeaveComponent()}
    </div>
  );
};

// Let's create placeholder components for missing leave types
const StudentLeave = () => (
  <div className="space-y-6">
    <h1 className="page-title">Student Leave Management</h1>
    <p className="text-gray-500">Manage your leave applications</p>
    {/* Student-specific leave content here */}
  </div>
);

const TeacherLeave = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    fromDate: '',
    toDate: '',
    type: '',
    reason: '',
    document: null
  });

  const leaveTypes = [
    { id: 'sick', label: 'Sick Leave' },
    { id: 'casual', label: 'Casual Leave' },
    { id: 'personal', label: 'Personal Leave' },
    { id: 'academic', label: 'Academic Leave' },
    { id: 'bereavement', label: 'Bereavement Leave' },
    { id: 'maternity', label: 'Maternity/Paternity Leave' },
    { id: 'unpaid', label: 'Unpaid Leave' }
  ];

  // Mock leave history
  const [leaveHistory] = useState([
    {
      id: 1,
      type: 'Sick Leave',
      fromDate: '2025-04-10',
      toDate: '2025-04-12',
      days: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      appliedOn: '2025-04-05',
      approvedBy: 'Principal',
      approvedOn: '2025-04-06'
    },
    {
      id: 2,
      type: 'Academic Leave',
      fromDate: '2025-05-20',
      toDate: '2025-05-22',
      days: 3,
      reason: 'Conference attendance',
      status: 'pending',
      appliedOn: '2025-05-05',
    },
    {
      id: 3,
      type: 'Personal Leave',
      fromDate: '2025-03-21',
      toDate: '2025-03-21',
      days: 1,
      reason: 'Family event',
      status: 'rejected',
      appliedOn: '2025-03-18',
      rejectedBy: 'Vice Principal',
      rejectedOn: '2025-03-19',
      rejectionReason: 'Staff shortage on the requested date'
    }
  ]);
  
  // Calculate leave balance
  const leaveBalance = {
    sick: 10,
    casual: 7,
    personal: 5,
    academic: 10,
    remaining: 32
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!leaveData.fromDate || !leaveData.toDate || !leaveData.type || !leaveData.reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Calculate number of days
    const from = new Date(leaveData.fromDate);
    const to = new Date(leaveData.toDate);
    if (from > to) {
      toast({
        title: "Error",
        description: "From date cannot be after to date",
        variant: "destructive" 
      });
      return;
    }
    
    // Mock API call to submit leave
    toast({
      title: "Leave application submitted",
      description: "Your leave application has been submitted for approval"
    });
    
    // Reset form and close modal
    setLeaveData({
      fromDate: '',
      toDate: '',
      type: '',
      reason: '',
      document: null
    });
    setShowNewLeaveForm(false);
  };
  
  const handleInputChange = (field, value) => {
    setLeaveData(prev => ({ ...prev, [field]: value }));
  };

  // Filter leaves by status
  const filteredLeaves = leaveHistory.filter(leave => {
    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Teacher Leave Management</h1>
        <p className="text-gray-500">Apply for and track your leave applications</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg bg-soft-green">
          <p className="text-sm text-gray-600">Total Leave Balance</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.remaining} days</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-soft-blue">
          <p className="text-sm text-gray-600">Sick Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.sick} days</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-soft-purple">
          <p className="text-sm text-gray-600">Casual Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.casual} days</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-soft-yellow">
          <p className="text-sm text-gray-600">Academic Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.academic} days</p>
        </div>
      </div>
      
      <div className="card-wrapper p-6 border rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold">Leave Applications</h2>
          <Button className="flex gap-2" onClick={() => setShowNewLeaveForm(true)}>
            Apply for Leave
          </Button>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.type}</TableCell>
                        <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>{new Date(leave.appliedOn).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No leave applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Leave Application Dialog */}
      <Dialog open={showNewLeaveForm} onOpenChange={setShowNewLeaveForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitLeave} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="fromDate"
                    type="date"
                    value={leaveData.fromDate}
                    onChange={(e) => handleInputChange('fromDate', e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="toDate"
                    type="date"
                    value={leaveData.toDate}
                    onChange={(e) => handleInputChange('toDate', e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select
                value={leaveData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
                <Textarea
                  id="reason"
                  value={leaveData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide details for your leave request"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document (Optional)</Label>
              <Input
                id="document"
                type="file"
                onChange={(e) => handleInputChange('document', e.target.files[0])}
              />
              <p className="text-xs text-gray-500">
                Upload medical certificate, conference invite, or other relevant files
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="substituteRequirement">Substitute Requirements</Label>
              <Textarea
                id="substituteRequirement" 
                placeholder="Mention any specific requirements for substitute teacher"
                className="min-h-20"
              />
            </div>
            
            <div className="space-y-2 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800 font-medium">Classes to be covered during absence</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div className="p-2 bg-white rounded border">
                  <p className="font-medium">Class 9A</p>
                  <p className="text-gray-500">Mathematics</p>
                  <p className="text-gray-500">Mon, Wed, Fri</p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-medium">Class 10B</p>
                  <p className="text-gray-500">Mathematics</p>
                  <p className="text-gray-500">Tue, Thu</p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-medium">Class 12A</p>
                  <p className="text-gray-500">Mathematics</p>
                  <p className="text-gray-500">Mon, Wed</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setShowNewLeaveForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Leave Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
