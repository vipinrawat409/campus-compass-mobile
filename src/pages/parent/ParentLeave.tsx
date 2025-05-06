
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Child {
  id: number;
  name: string;
  class: string;
  rollNo: string;
}

const ParentLeave = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    childId: '',
    fromDate: '',
    toDate: '',
    type: '',
    reason: '',
    document: null
  });

  // Mock children data
  const children: Child[] = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const leaveTypes = [
    { id: 'medical', label: 'Medical Leave' },
    { id: 'family', label: 'Family Event' },
    { id: 'religious', label: 'Religious Function' },
    { id: 'sports', label: 'Sports Event' },
    { id: 'other', label: 'Other' }
  ];

  // Mock leave history
  const [leaveHistory] = useState([
    {
      id: 1,
      childName: 'Sarah Wilson',
      childClass: '10-A',
      type: 'Medical Leave',
      fromDate: '2025-04-10',
      toDate: '2025-04-12',
      days: 3,
      reason: 'Fever and cold',
      status: 'approved',
      appliedOn: '2025-04-05',
      approvedBy: 'Mr. Johnson',
      approvedOn: '2025-04-06'
    },
    {
      id: 2,
      childName: 'John Wilson',
      childClass: '7-B',
      type: 'Family Event',
      fromDate: '2025-05-20',
      toDate: '2025-05-22',
      days: 3,
      reason: 'Family wedding',
      status: 'pending',
      appliedOn: '2025-05-05',
    },
    {
      id: 3,
      childName: 'Sarah Wilson',
      childClass: '10-A',
      type: 'Sports Event',
      fromDate: '2025-03-21',
      toDate: '2025-03-21',
      days: 1,
      reason: 'Inter-school competition',
      status: 'rejected',
      appliedOn: '2025-03-18',
      rejectedBy: 'Mrs. Davis',
      rejectedOn: '2025-03-19',
      rejectionReason: 'Important test on the same day'
    }
  ]);

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!leaveData.childId || !leaveData.fromDate || !leaveData.toDate || !leaveData.type || !leaveData.reason) {
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
      description: "Your child's leave application has been submitted for approval"
    });
    
    // Reset form and close modal
    setLeaveData({
      childId: '',
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
  
  const getSelectedChild = (childId) => {
    return children.find(child => child.id === parseInt(childId, 10));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Leave Management</h1>
        <p className="text-gray-500">Apply for and track your child's leave applications</p>
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
                    <TableHead>Child Name</TableHead>
                    <TableHead>Class</TableHead>
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
                        <TableCell>{leave.childName}</TableCell>
                        <TableCell>{leave.childClass}</TableCell>
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
                      <TableCell colSpan={9} className="text-center py-4">
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
      
      {/* New Leave Application Dialog with fixed max-height and overflow */}
      <Dialog open={showNewLeaveForm} onOpenChange={setShowNewLeaveForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Student Leave</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitLeave} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="childId">Select Child</Label>
              <Select
                value={leaveData.childId}
                onValueChange={(value) => handleInputChange('childId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      {child.name} ({child.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                  placeholder="Please provide details for the leave request"
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
                Upload medical certificate or other relevant files
              </p>
            </div>
            
            {leaveData.childId && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Selected Student: {getSelectedChild(leaveData.childId)?.name} ({getSelectedChild(leaveData.childId)?.class})
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Roll No: {getSelectedChild(leaveData.childId)?.rollNo}
                </p>
              </div>
            )}
            
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

export default ParentLeave;
