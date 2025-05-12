
import React, { useState } from 'react';
import { FileCheck, Search, Filter, Calendar, User, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/sonner";
import LeaveDetailsModal from '@/components/modals/LeaveDetailsModal';

// Define proper types for our leave applications
interface BaseLeave {
  id: number;
  name: string;
  role: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: string;
  appliedOn: string;
}

interface StaffTeacherLeave extends BaseLeave {
  subject?: string;
  department?: string;
}

interface StudentLeave extends BaseLeave {
  class: string;
  rollNo: string;
  appliedBy: string;
  approvedOn?: string;
  rejectedOn?: string;
  rejectionReason?: string;
}

type LeaveApplication = StaffTeacherLeave | StudentLeave;

const LeaveApproval = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [leaveData, setLeaveData] = useState<LeaveApplication[]>([]);
  const [isLeaveDetailsModalOpen, setIsLeaveDetailsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  
  // Different mock data based on user role
  const isTeacher = user?.role === 'teacher';
  
  // Mock leave applications data for admin
  const adminLeaveData: LeaveApplication[] = [
    { 
      id: 1, 
      name: 'John Miller', 
      role: 'Teacher',
      subject: 'Mathematics',
      leaveType: 'Medical',
      fromDate: '2025-05-22',
      toDate: '2025-05-24',
      days: 3,
      reason: 'Medical appointment and recovery',
      status: 'pending',
      appliedOn: '2025-05-18'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      role: 'Staff',
      department: 'Administration',
      leaveType: 'Casual',
      fromDate: '2025-05-20',
      toDate: '2025-05-20',
      days: 1,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2025-05-17'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      role: 'Teacher',
      subject: 'Science',
      leaveType: 'Personal',
      fromDate: '2025-05-25',
      toDate: '2025-05-26',
      days: 2,
      reason: 'Family function',
      status: 'pending',
      appliedOn: '2025-05-16'
    },
    { 
      id: 4, 
      name: 'Emily Parker', 
      role: 'Teacher',
      subject: 'English',
      leaveType: 'Medical',
      fromDate: '2025-05-15',
      toDate: '2025-05-17',
      days: 3,
      reason: 'Fever and throat infection',
      status: 'approved',
      appliedOn: '2025-05-14'
    },
    { 
      id: 5, 
      name: 'Robert Wilson', 
      role: 'Staff',
      department: 'Accounts',
      leaveType: 'Casual',
      fromDate: '2025-05-18',
      toDate: '2025-05-19',
      days: 2,
      reason: 'Personal work',
      status: 'rejected',
      appliedOn: '2025-05-13'
    }
  ];
  
  // Mock leave applications data for teacher (only student leaves)
  const teacherLeaveData: StudentLeave[] = [
    { 
      id: 1, 
      name: 'Emma Thompson', 
      role: 'Student',
      class: '8-A',
      rollNo: '8A01',
      leaveType: 'Medical',
      fromDate: '2025-05-22',
      toDate: '2025-05-24',
      days: 3,
      reason: 'Fever and cold',
      status: 'pending',
      appliedOn: '2025-05-18',
      appliedBy: 'Parent'
    },
    { 
      id: 2, 
      name: 'James Wilson', 
      role: 'Student',
      class: '8-A',
      rollNo: '8A02',
      leaveType: 'Family Event',
      fromDate: '2025-05-20',
      toDate: '2025-05-22',
      days: 3,
      reason: 'Family wedding',
      status: 'pending',
      appliedOn: '2025-05-17',
      appliedBy: 'Parent'
    },
    { 
      id: 3, 
      name: 'Benjamin Anderson', 
      role: 'Student',
      class: '8-A',
      rollNo: '8A06',
      leaveType: 'Sports Event',
      fromDate: '2025-05-25',
      toDate: '2025-05-25',
      days: 1,
      reason: 'Inter-school competition',
      status: 'approved',
      appliedOn: '2025-05-16',
      appliedBy: 'Parent',
      approvedOn: '2025-05-16'
    },
    { 
      id: 4, 
      name: 'Sophia Martinez', 
      role: 'Student',
      class: '8-A',
      rollNo: '8A05',
      leaveType: 'Medical',
      fromDate: '2025-05-15',
      toDate: '2025-05-17',
      days: 3,
      reason: 'Doctor appointment and recovery',
      status: 'rejected',
      appliedOn: '2025-05-14',
      appliedBy: 'Parent',
      rejectedOn: '2025-05-15',
      rejectionReason: 'Important test scheduled'
    }
  ];
  
  // Initialize leave data based on user role
  React.useEffect(() => {
    setLeaveData(isTeacher ? teacherLeaveData : adminLeaveData);
  }, [isTeacher]);

  // Helper functions to check object types
  const isStudentLeave = (leave: LeaveApplication): leave is StudentLeave => {
    return 'class' in leave && 'rollNo' in leave;
  };

  const isStaffTeacherLeave = (leave: LeaveApplication): leave is StaffTeacherLeave => {
    return ('subject' in leave || 'department' in leave) && !('class' in leave);
  };

  // Filter leave applications based on search term and active tab
  const filteredLeaves = leaveData.filter(leave => 
    (activeTab === 'all' || leave.status === activeTab) &&
    (
      leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isStaffTeacherLeave(leave) && leave.subject && leave.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (isStaffTeacherLeave(leave) && leave.department && leave.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (isStudentLeave(leave) && leave.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Stats calculation
  const pendingCount = leaveData.filter(leave => leave.status === 'pending').length;
  const approvedCount = leaveData.filter(leave => leave.status === 'approved').length;
  const rejectedCount = leaveData.filter(leave => leave.status === 'rejected').length;

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
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
  
  // Handle leave approval/rejection
  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    // Update the leave status
    const updatedLeaves = leaveData.map(leave => {
      if (leave.id === leaveId) {
        const now = new Date().toISOString();
        if (action === 'approve') {
          if (isStudentLeave(leave)) {
            return { ...leave, status: 'approved', approvedOn: now };
          }
          return { ...leave, status: 'approved' };
        } else {
          if (isStudentLeave(leave)) {
            return { 
              ...leave, 
              status: 'rejected', 
              rejectedOn: now,
              rejectionReason: 'Rejected by teacher/admin'
            };
          }
          return { ...leave, status: 'rejected' };
        }
      }
      return leave;
    });
    
    setLeaveData(updatedLeaves);
    
    // Show toast notification
    toast({
      title: action === 'approve' ? "Leave Approved" : "Leave Rejected",
      description: `The leave application has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
    });
    
    // Close the modal if it's open
    setIsLeaveDetailsModalOpen(false);
  };

  const viewLeaveDetails = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setIsLeaveDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Leave Approval</h1>
        <p className="text-gray-500">
          {isTeacher 
            ? "Manage leave applications from students" 
            : "Manage leave applications from staff and teachers"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dashboard-card bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Pending Leaves</p>
            <FileCheck className="text-yellow-500" />
          </div>
          <p className="dashboard-stat mt-2">{pendingCount}</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Approved Leaves</p>
            <FileCheck className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">{approvedCount}</p>
        </div>
        <div className="dashboard-card bg-soft-red">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Rejected Leaves</p>
            <FileCheck className="text-red-500" />
          </div>
          <p className="dashboard-stat mt-2">{rejectedCount}</p>
        </div>
      </div>

      <div className="card-wrapper">
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <div className="w-full sm:w-auto flex-1 max-w-xs relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leaves..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <div key={leave.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-lg">{leave.name}</h3>
                        <span className="bg-soft-blue px-2 py-1 text-xs rounded-md">
                          {leave.role}
                        </span>
                        {isStaffTeacherLeave(leave) && leave.subject && (
                          <span className="text-sm text-gray-500">
                            {leave.subject}
                          </span>
                        )}
                        {isStaffTeacherLeave(leave) && leave.department && (
                          <span className="text-sm text-gray-500">
                            {leave.department}
                          </span>
                        )}
                        {isStudentLeave(leave) && (
                          <span className="text-sm text-gray-500">
                            Class: {leave.class}, Roll No: {leave.rollNo}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}</span>
                          <span className="text-primary font-medium">({leave.days} days)</span>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {leave.leaveType}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span> {new Date(leave.appliedOn).toLocaleDateString()}
                        </div>
                        {isStudentLeave(leave) && leave.appliedBy && (
                          <div>
                            <span className="font-medium">Applied By:</span> {leave.appliedBy}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewLeaveDetails(leave)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm mb-2"><span className="font-medium">Reason:</span> {leave.reason}</p>
                    
                    {leave.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="flex gap-1"
                          onClick={() => handleLeaveAction(leave.id, 'approve')}
                        >
                          <Check size={16} />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex gap-1 text-red-500"
                          onClick={() => handleLeaveAction(leave.id, 'reject')}
                        >
                          <X size={16} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No leave applications found.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <LeaveDetailsModal
        isOpen={isLeaveDetailsModalOpen}
        onClose={() => setIsLeaveDetailsModalOpen(false)}
        leave={selectedLeave}
        onApprove={(id) => handleLeaveAction(id, 'approve')}
        onReject={(id) => handleLeaveAction(id, 'reject')}
      />
    </div>
  );
};

export default LeaveApproval;
