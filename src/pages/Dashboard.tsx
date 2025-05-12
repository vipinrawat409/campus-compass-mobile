import React, { useState } from 'react';
import { 
  Users, 
  School, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  FileText, 
  DollarSign 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import StudentDashboard from './student/Dashboard';
import InstituteDetailsModal from '@/components/modals/InstituteDetailsModal';
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Different dashboard content based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'superadmin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
      </div>
      
      {renderDashboardContent()}
    </div>
  );
};

// Role-specific dashboard components
const SuperAdminDashboard = () => {
  const [selectedInstitute, setSelectedInstitute] = useState<any>(null);
  const [showInstituteDetails, setShowInstituteDetails] = useState(false);
  
  // Mock institute data with more details
  const institutes = [
    { 
      id: 1, 
      name: "Valley Public School", 
      location: "New York", 
      students: 1250,
      teachers: 48,
      staff: 22,
      address: "123 Education Ave, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "info@valleypublic.edu",
      foundedYear: 1985,
      principal: "Dr. Michael Johnson" 
    },
    { 
      id: 2, 
      name: "Greenwood Academy", 
      location: "Chicago", 
      students: 950,
      teachers: 35,
      staff: 18,
      address: "456 Learning Lane, Chicago, IL 60601",
      phone: "+1 (555) 987-6543",
      email: "contact@greenwoodacademy.org",
      foundedYear: 1998,
      principal: "Mrs. Sarah Williams"
    },
    { 
      id: 3, 
      name: "Sunshine Elementary", 
      location: "San Francisco", 
      students: 680,
      teachers: 28,
      staff: 14,
      address: "789 Knowledge St, San Francisco, CA 94105",
      phone: "+1 (555) 456-7890",
      email: "office@sunshineelementary.edu",
      foundedYear: 2005,
      principal: "Mr. Robert Chen"
    }
  ];

  const handleViewDetails = (institute: any) => {
    setSelectedInstitute(institute);
    setShowInstituteDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Institutes" 
          value="3" 
          icon={<School className="text-blue-500" />} 
          bgColor="bg-soft-blue"
        />
        <DashboardCard 
          title="Total Students" 
          value="2,880" 
          icon={<GraduationCap className="text-green-500" />} 
          bgColor="bg-soft-green"
        />
        <DashboardCard 
          title="Total Teachers" 
          value="156" 
          icon={<UserCheck className="text-purple-500" />} 
          bgColor="bg-soft-purple"
        />
        <DashboardCard 
          title="Total Staff" 
          value="64" 
          icon={<Users className="text-orange-500" />} 
          bgColor="bg-soft-orange"
        />
      </div>
      
      <div className="card-wrapper">
        <h2 className="section-title">Manage Institutes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Institute Name</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Students</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutes.map((institute) => (
                <tr key={institute.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{institute.name}</td>
                  <td className="py-3 px-4">{institute.location}</td>
                  <td className="py-3 px-4">{institute.students}</td>
                  <td className="py-3 px-4">
                    <button 
                      className="text-sm text-primary hover:text-primary/80"
                      onClick={() => handleViewDetails(institute)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Institute Details Modal */}
      {selectedInstitute && (
        <InstituteDetailsModal 
          isOpen={showInstituteDetails}
          onClose={() => setShowInstituteDetails(false)}
          institute={selectedInstitute}
        />
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(null);

  const handleApproveLeave = (id: number) => {
    // In a real app, this would call an API
    toast("Leave approved", {
      description: "The leave application has been approved"
    });
  };
  
  const handleRejectLeave = (id: number) => {
    // In a real app, this would call an API
    toast("Leave rejected", {
      description: "The leave application has been rejected"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Students" 
          value="1,250" 
          icon={<GraduationCap className="text-blue-500" />} 
          bgColor="bg-soft-blue"
        />
        <DashboardCard 
          title="Total Teachers" 
          value="48" 
          icon={<UserCheck className="text-green-500" />} 
          bgColor="bg-soft-green"
        />
        <DashboardCard 
          title="Present Today" 
          value="1,142" 
          icon={<Users className="text-purple-500" />} 
          bgColor="bg-soft-purple"
        />
        <DashboardCard 
          title="Pending Leaves" 
          value="12" 
          icon={<Clock className="text-orange-500" />} 
          bgColor="bg-soft-orange"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-wrapper">
          <h2 className="section-title">Recent Notices</h2>
          <div className="space-y-3">
            <NoticeItem 
              title="Annual Day Celebration" 
              date="22 May 2025" 
              preview="Annual day celebration will be held on 30th May 2025." 
            />
            <NoticeItem 
              title="Staff Meeting" 
              date="18 May 2025" 
              preview="All staff members are requested to attend the meeting." 
            />
            <NoticeItem 
              title="Exam Schedule" 
              date="15 May 2025" 
              preview="Final examination schedule has been released." 
            />
          </div>
        </div>
        
        <div className="card-wrapper">
          <h2 className="section-title">Recent Leave Applications</h2>
          <div className="space-y-3">
            <LeaveItem 
              name="John Doe" 
              role="Teacher" 
              date="22-24 May 2025" 
              reason="Family function"
              onApprove={() => handleApproveLeave(1)}
              onReject={() => handleRejectLeave(1)}
            />
            <LeaveItem 
              name="Sarah Johnson" 
              role="Staff" 
              date="20 May 2025" 
              reason="Medical appointment"
              onApprove={() => handleApproveLeave(2)}
              onReject={() => handleRejectLeave(2)}
            />
            <LeaveItem 
              name="Michael Brown" 
              role="Teacher" 
              date="25-26 May 2025" 
              reason="Personal reasons"
              onApprove={() => handleApproveLeave(3)}
              onReject={() => handleRejectLeave(3)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(null);

  const handleApproveStudentLeave = (id: number) => {
    // In a real app, this would call an API
    toast("Leave approved", {
      description: "The student leave application has been approved"
    });
  };
  
  const handleRejectStudentLeave = (id: number) => {
    // In a real app, this would call an API
    toast("Leave rejected", {
      description: "The student leave application has been rejected"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="My Classes" 
          value="6" 
          icon={<School className="text-blue-500" />} 
          bgColor="bg-soft-blue"
        />
        <DashboardCard 
          title="Class Teacher" 
          value="Class 8-A" 
          icon={<GraduationCap className="text-green-500" />} 
          bgColor="bg-soft-green"
        />
        <DashboardCard 
          title="Student Attendance" 
          value="92%" 
          icon={<UserCheck className="text-purple-500" />} 
          bgColor="bg-soft-purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-wrapper">
          <h2 className="section-title">Today's Timetable</h2>
          <div className="space-y-2">
            <TimetableItem time="8:00 - 8:45" subject="Mathematics" className="Class 7-B" />
            <TimetableItem time="8:45 - 9:30" subject="Mathematics" className="Class 6-A" />
            <TimetableItem time="9:30 - 10:15" subject="Mathematics" className="Class 8-A" />
            <TimetableItem time="10:15 - 11:00" subject="Free Period" className="" />
            <TimetableItem time="11:00 - 11:45" subject="Mathematics" className="Class 9-C" />
          </div>
        </div>
        
        <div className="card-wrapper">
          <h2 className="section-title">Leave Applications</h2>
          <div className="space-y-3">
            <StudentLeaveItem 
              name="Emily Parker"
              className="Class 8-A"
              date="22 May 2025"
              reason="Medical appointment"
              status="pending"
              onApprove={() => handleApproveStudentLeave(1)}
              onReject={() => handleRejectStudentLeave(1)}
            />
            <StudentLeaveItem 
              name="James Wilson"
              className="Class 8-A"
              date="20-21 May 2025"
              reason="Family function"
              status="pending"
              onApprove={() => handleApproveStudentLeave(2)}
              onReject={() => handleRejectStudentLeave(2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard 
          title="My Role" 
          value="Administrator" 
          icon={<UserCheck className="text-blue-500" />} 
          bgColor="bg-soft-blue"
        />
        <DashboardCard 
          title="Attendance" 
          value="100%" 
          icon={<CheckCircle className="text-green-500" />} 
          bgColor="bg-soft-green"
        />
      </div>
      
      <div className="card-wrapper">
        <h2 className="section-title">Recent Notices</h2>
        <div className="space-y-3">
          <NoticeItem 
            title="Staff Meeting" 
            date="18 May 2025" 
            preview="All staff members are requested to attend the meeting." 
          />
          <NoticeItem 
            title="Salary Revision" 
            date="15 May 2025" 
            preview="New salary structure will be effective from next month." 
          />
        </div>
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const [selectedChild, setSelectedChild] = useState(children[0]);

  return (
    <div className="space-y-6">
      {children.length > 1 && (
        <div className="card-wrapper mb-6">
          <h2 className="section-title">Select Child</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedChild.id === child.id 
                    ? "bg-primary text-white" 
                    : "bg-soft-blue hover:bg-soft-blue/80"
                )}
                onClick={() => setSelectedChild(child)}
              >
                {child.name} ({child.class})
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Class" 
          value={selectedChild.class} 
          icon={<GraduationCap className="text-blue-500" />} 
          bgColor="bg-soft-blue"
        />
        <DashboardCard 
          title="Attendance" 
          value="93%" 
          icon={<UserCheck className="text-green-500" />} 
          bgColor="bg-soft-green"
        />
        <DashboardCard 
          title="Fees Status" 
          value="Paid" 
          icon={<DollarSign className="text-purple-500" />} 
          bgColor="bg-soft-purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-wrapper">
          <h2 className="section-title">Recent Performance</h2>
          <div className="space-y-2">
            <PerformanceItem subject="Mathematics" marks="85/100" grade="A" />
            <PerformanceItem subject="Science" marks="78/100" grade="B+" />
            <PerformanceItem subject="English" marks="92/100" grade="A+" />
            <PerformanceItem subject="Social Studies" marks="81/100" grade="A" />
          </div>
        </div>
        
        <div className="card-wrapper">
          <h2 className="section-title">Recent Notices</h2>
          <div className="space-y-3">
            <NoticeItem 
              title="Parent-Teacher Meeting" 
              date="25 May 2025" 
              preview="PTM will be held on 25th May 2025 from 10 AM to 1 PM." 
            />
            <NoticeItem 
              title="Fee Payment Reminder" 
              date="15 May 2025" 
              preview="Last date for fee payment is 31st May 2025." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components for dashboard
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const DashboardCard = ({ title, value, icon, bgColor }: DashboardCardProps) => {
  return (
    <div className={cn("dashboard-card", bgColor)}>
      <div className="flex justify-between items-center">
        <p className="dashboard-label">{title}</p>
        {icon}
      </div>
      <p className="dashboard-stat mt-2">{value}</p>
    </div>
  );
};

interface NoticeItemProps {
  title: string;
  date: string;
  preview: string;
}

const NoticeItem = ({ title, date, preview }: NoticeItemProps) => {
  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{preview}</p>
    </div>
  );
};

interface LeaveItemProps {
  name: string;
  role: string;
  date: string;
  reason: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const LeaveItem = ({ name, role, date, reason, onApprove, onReject }: LeaveItemProps) => {
  const [status, setStatus] = useState('Pending');
  
  const handleApprove = () => {
    setStatus('Approved');
    if (onApprove) onApprove();
  };
  
  const handleReject = () => {
    setStatus('Rejected');
    if (onReject) onReject();
  };
  
  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          <span className="text-xs text-gray-500">{role}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 'Approved' 
            ? 'bg-green-100 text-green-800' 
            : status === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      <div className="mt-2 text-sm">
        <p><span className="text-gray-500">Date:</span> {date}</p>
        <p><span className="text-gray-500">Reason:</span> {reason}</p>
      </div>
      {status === 'Pending' && (
        <div className="mt-3 flex gap-2">
          <button 
            className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button 
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

interface TimetableItemProps {
  time: string;
  subject: string;
  className?: string;
  teacher?: string;
}

const TimetableItem = ({ time, subject, className, teacher }: TimetableItemProps) => {
  return (
    <div className="p-2 border border-gray-100 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-xs font-medium bg-soft-blue px-2 py-1 rounded w-24 text-center">
          {time}
        </div>
        <div>
          <p className="font-medium">{subject}</p>
          {teacher && <p className="text-xs text-gray-500">{teacher}</p>}
          {className && <p className="text-xs text-gray-500">{className}</p>}
        </div>
      </div>
    </div>
  );
};

interface StudentLeaveItemProps {
  name: string;
  className: string;
  date: string;
  reason: string;
  status: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const StudentLeaveItem = ({ name, className, date, reason, status: initialStatus, onApprove, onReject }: StudentLeaveItemProps) => {
  const [status, setStatus] = useState(initialStatus);
  
  const handleApprove = () => {
    setStatus('approved');
    if (onApprove) onApprove();
  };
  
  const handleReject = () => {
    setStatus('rejected');
    if (onReject) onReject();
  };
  
  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          <span className="text-xs text-gray-500">{className}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="mt-2 text-sm">
        <p><span className="text-gray-500">Date:</span> {date}</p>
        <p><span className="text-gray-500">Reason:</span> {reason}</p>
      </div>
      {status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <button 
            className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button 
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

interface PerformanceItemProps {
  subject: string;
  marks: string;
  grade: string;
}

const PerformanceItem = ({ subject, marks, grade }: PerformanceItemProps) => {
  return (
    <div className="p-2 border border-gray-100 rounded-lg flex justify-between items-center">
      <div className="font-medium">{subject}</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">{marks}</div>
        <div className="text-sm font-medium bg-soft-green px-2 py-1 rounded text-green-800">
          {grade}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
