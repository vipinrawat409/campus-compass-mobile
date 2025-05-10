
import React, { useState } from 'react';
import { Calendar, FileText, Clock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaveItem {
  id: number;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: string;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectedReason?: string;
}

const leaveTypes = [
  { id: 'sick', label: 'Sick Leave' },
  { id: 'casual', label: 'Casual Leave' },
  { id: 'personal', label: 'Personal Leave' },
  { id: 'family', label: 'Family Care' },
  { id: 'bereavement', label: 'Bereavement Leave' },
  { id: 'vacation', label: 'Vacation' },
  { id: 'unpaid', label: 'Unpaid Leave' }
];

const StaffLeave = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveItem | null>(null);
  
  const [leaveData, setLeaveData] = useState({
    fromDate: '',
    toDate: '',
    type: '',
    reason: '',
    document: null
  });
  
  const [leaveHistory] = useState<LeaveItem[]>([
    {
      id: 1,
      type: 'Sick Leave',
      fromDate: '2025-04-10',
      toDate: '2025-04-12',
      days: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      appliedOn: '2025-04-05',
      approvedBy: 'John Wilson',
      approvedOn: '2025-04-06'
    },
    {
      id: 2,
      type: 'Personal Leave',
      fromDate: '2025-03-21',
      toDate: '2025-03-21',
      days: 1,
      reason: 'Family event',
      status: 'approved',
      appliedOn: '2025-03-18',
      approvedBy: 'John Wilson',
      approvedOn: '2025-03-19'
    },
    {
      id: 3,
      type: 'Casual Leave',
      fromDate: '2025-05-15',
      toDate: '2025-05-16',
      days: 2,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2025-05-05'
    }
  ]);
  
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
  
  // Calculate leave balance
  const leaveBalance = {
    sick: 10,
    casual: 7,
    personal: 5,
    remaining: 22
  };
  
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
  
  const handleViewLeaveDetails = (leave: LeaveItem) => {
    setSelectedLeave(leave);
    setShowLeaveDetails(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Staff Leave Management</h1>
        <p className="text-gray-500">Apply for and track your leave applications</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-soft-green">
          <p className="text-sm text-gray-600">Total Leave Balance</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.remaining} days</p>
        </Card>
        
        <Card className="p-4 bg-soft-blue">
          <p className="text-sm text-gray-600">Sick Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.sick} days</p>
        </Card>
        
        <Card className="p-4 bg-soft-purple">
          <p className="text-sm text-gray-600">Casual Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.casual} days</p>
        </Card>
        
        <Card className="p-4 bg-soft-yellow">
          <p className="text-sm text-gray-600">Personal Leave</p>
          <p className="text-2xl font-semibold mt-1">{leaveBalance.personal} days</p>
        </Card>
      </div>
      
      <div className="card-wrapper p-6 border rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold">Leave Applications</h2>
          <Button className="flex gap-2" onClick={() => setShowNewLeaveForm(true)}>
            <Plus size={16} />
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewLeaveDetails(leave)}
                          >
                            View Details
                          </Button>
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                Upload medical certificate, travel documents, or other relevant files
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workHandover">Work Handover Details</Label>
              <Textarea
                id="workHandover" 
                placeholder="Mention any pending work or responsibilities that need attention during your absence"
                className="min-h-20"
              />
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

      {/* Leave Details Dialog */}
      <Dialog open={showLeaveDetails} onOpenChange={setShowLeaveDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{selectedLeave.type}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedLeave.status)}`}>
                  {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    {new Date(selectedLeave.fromDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    {new Date(selectedLeave.toDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{selectedLeave.days} day{selectedLeave.days > 1 ? 's' : ''}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <div className="p-3 bg-gray-50 rounded-md mt-1">
                  <p className="text-sm">{selectedLeave.reason}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Applied On</p>
                <p>{new Date(selectedLeave.appliedOn).toLocaleDateString()}</p>
              </div>
              
              {selectedLeave.status === 'approved' && selectedLeave.approvedBy && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p>{selectedLeave.approvedBy} on {selectedLeave.approvedOn && new Date(selectedLeave.approvedOn).toLocaleDateString()}</p>
                </div>
              )}
              
              {selectedLeave.status === 'rejected' && selectedLeave.rejectedReason && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="text-sm text-red-600">{selectedLeave.rejectedReason}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowLeaveDetails(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffLeave;
