
import React, { useState } from 'react';
import { FileCheck, Calendar, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const Leave = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-leaves');
  
  if (!user) return null;

  // Different leave sections based on user role
  const renderLeaveContent = () => {
    switch (user.role) {
      case 'teacher':
        return <TeacherLeave />;
      case 'parent':
        return <ParentLeave />;
      default:
        return <div>Leave functionality not available for this role.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Leave Applications</h1>
        <p className="text-gray-500">Manage your leave applications</p>
      </div>
      
      {renderLeaveContent()}
    </div>
  );
};

const TeacherLeave = () => {
  const [activeTab, setActiveTab] = useState('my-leaves');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'casual',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  
  // Mock leave data
  const leaveData = [
    { 
      id: 1,
      leaveType: 'Medical',
      fromDate: '2025-05-15',
      toDate: '2025-05-17',
      days: 3,
      reason: 'Fever and throat infection',
      appliedOn: '2025-05-14',
      status: 'approved'
    },
    { 
      id: 2,
      leaveType: 'Casual',
      fromDate: '2025-04-22',
      toDate: '2025-04-22',
      days: 1,
      reason: 'Personal work',
      appliedOn: '2025-04-20',
      status: 'approved'
    },
    { 
      id: 3,
      leaveType: 'Personal',
      fromDate: '2025-06-05',
      toDate: '2025-06-06',
      days: 2,
      reason: 'Family function',
      appliedOn: '2025-05-28',
      status: 'pending'
    }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLeave(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the form to an API
    toast.success("Leave application submitted successfully");
    setShowApplyForm(false);
    setNewLeave({
      leaveType: 'casual',
      fromDate: '',
      toDate: '',
      reason: ''
    });
  };
  
  // Get status badge color
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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="dashboard-card bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Total Leaves</p>
            <FileCheck className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">15</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Leaves Taken</p>
            <Clock className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">4</p>
        </div>
        <div className="dashboard-card bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Remaining</p>
            <Calendar className="text-yellow-500" />
          </div>
          <p className="dashboard-stat mt-2">11</p>
        </div>
      </div>
      
      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="my-leaves" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
              <TabsTrigger value="leave-policy">Leave Policy</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setShowApplyForm(true)} className="flex gap-2">
            <Plus size={16} />
            Apply for Leave
          </Button>
        </div>
        
        <TabsContent value="my-leaves">
          {showApplyForm && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Apply for Leave</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <select 
                      name="leaveType"
                      value={newLeave.leaveType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="casual">Casual Leave</option>
                      <option value="medical">Medical Leave</option>
                      <option value="personal">Personal Leave</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                      <Input 
                        type="date" 
                        name="fromDate" 
                        value={newLeave.fromDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                      <Input 
                        type="date" 
                        name="toDate" 
                        value={newLeave.toDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea 
                    name="reason"
                    value={newLeave.reason}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    required
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Submit Application</Button>
                  <Button type="button" variant="outline" onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-4">
            {leaveData.map((leave) => (
              <div key={leave.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold">{leave.leaveType} Leave</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}</span>
                        <span className="text-primary font-medium">({leave.days} days)</span>
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {new Date(leave.appliedOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {leave.status === 'pending' && (
                    <Button variant="outline" size="sm">Cancel</Button>
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Reason:</span> {leave.reason}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="leave-policy">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Leave Policy</h3>
              <div className="space-y-3 text-gray-700">
                <p>Each employee is entitled to the following leave types per academic year:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Casual Leave:</span> 8 days</li>
                  <li><span className="font-medium">Medical Leave:</span> 10 days</li>
                  <li><span className="font-medium">Personal Leave:</span> 5 days</li>
                </ul>
                <p className="mt-3">Additional guidelines:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Leave applications should be submitted at least 2 days in advance for casual/personal leave.</li>
                  <li>Medical leave requires submission of medical certificate for leaves exceeding 2 days.</li>
                  <li>Leave cannot be claimed as a matter of right and is subject to approval.</li>
                  <li>Unused leave cannot be carried forward to the next academic year.</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

const ParentLeave = () => {
  const [activeTab, setActiveTab] = useState('leaves');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState('Alice Johnson');
  const [newLeave, setNewLeave] = useState({
    child: 'Alice Johnson',
    leaveType: 'casual',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  
  // Mock children data
  const children = [
    { id: 1, name: 'Alice Johnson', class: '10-A' },
    { id: 2, name: 'James Johnson', class: '7-B' }
  ];
  
  // Mock leave data
  const leaveData = [
    { 
      id: 1,
      child: 'Alice Johnson',
      class: '10-A',
      leaveType: 'Medical',
      fromDate: '2025-05-15',
      toDate: '2025-05-17',
      days: 3,
      reason: 'Fever and throat infection',
      appliedOn: '2025-05-14',
      status: 'approved'
    },
    { 
      id: 2,
      child: 'James Johnson',
      class: '7-B',
      leaveType: 'Casual',
      fromDate: '2025-04-22',
      toDate: '2025-04-22',
      days: 1,
      reason: 'Doctor appointment',
      appliedOn: '2025-04-20',
      status: 'approved'
    },
    { 
      id: 3,
      child: 'Alice Johnson',
      class: '10-A',
      leaveType: 'Personal',
      fromDate: '2025-06-05',
      toDate: '2025-06-06',
      days: 2,
      reason: 'Family function',
      appliedOn: '2025-05-28',
      status: 'pending'
    }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLeave(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the form to an API
    toast.success("Leave application submitted successfully");
    setShowApplyForm(false);
    setNewLeave({
      child: selectedChild,
      leaveType: 'casual',
      fromDate: '',
      toDate: '',
      reason: ''
    });
  };
  
  // Get status badge color
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

  // Filter leaves based on selected child
  const filteredLeaves = selectedChild === 'all' 
    ? leaveData 
    : leaveData.filter(leave => leave.child === selectedChild);

  return (
    <div>
      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-medium">Child:</span>
            <select 
              className="px-3 py-1.5 border rounded-md bg-white"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="all">All Children</option>
              {children.map((child) => (
                <option key={child.id} value={child.name}>{child.name} ({child.class})</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setShowApplyForm(true)} className="flex gap-2">
            <Plus size={16} />
            Apply for Leave
          </Button>
        </div>
        
        {showApplyForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
                  <select 
                    name="child"
                    value={newLeave.child}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    {children.map((child) => (
                      <option key={child.id} value={child.name}>{child.name} ({child.class})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select 
                    name="leaveType"
                    value={newLeave.leaveType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="casual">Casual Leave</option>
                    <option value="medical">Medical Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <Input 
                      type="date" 
                      name="fromDate" 
                      value={newLeave.fromDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <Input 
                      type="date" 
                      name="toDate" 
                      value={newLeave.toDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  name="reason"
                  value={newLeave.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Application</Button>
                <Button type="button" variant="outline" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="space-y-4">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave) => (
              <div key={leave.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold">{leave.child} - {leave.leaveType} Leave</h3>
                      <span className="text-xs text-gray-500">Class {leave.class}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}</span>
                        <span className="text-primary font-medium">({leave.days} days)</span>
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {new Date(leave.appliedOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {leave.status === 'pending' && (
                    <Button variant="outline" size="sm">Cancel</Button>
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Reason:</span> {leave.reason}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No leave applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leave;
