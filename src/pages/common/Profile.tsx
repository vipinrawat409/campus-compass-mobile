
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, School, Book, GraduationCap, Clock, Shield, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!user) return null;

  // Different profile sections based on user role
  const renderProfileContent = () => {
    switch (user.role) {
      case 'teacher':
        return <TeacherProfile />;
      case 'student':
        return <StudentProfile />;
      case 'parent':
        return <ParentProfile />;
      case 'staff':
        return <StaffProfile />;
      default:
        return <div>Profile not available for this role.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="text-gray-500">Manage your profile and information</p>
      </div>
      
      {renderProfileContent()}
    </div>
  );
};

const TeacherProfile = () => {
  // Mock teacher data
  const teacherData = {
    name: 'John Miller',
    photo: null,
    employeeId: 'TCH-2023-001',
    email: 'john.miller@schoolemail.com',
    phone: '9876543210',
    dateOfBirth: '1985-05-15',
    address: '123 Teacher Lane, Education City, 560001',
    joiningDate: '2020-06-10',
    qualification: 'M.Sc., B.Ed.',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    experience: '8 years',
    subjects: ['Mathematics', 'Statistics'],
    classes: ['Class 9-A', 'Class 10-A', 'Class 10-B'],
    bankDetails: {
      accountNumber: 'XXXX XXXX 1234',
      bankName: 'State Bank',
      ifscCode: 'SBIN0012345',
      branch: 'Education City'
    },
    attendance: {
      present: 92,
      absent: 3,
      leave: 5,
      total: 100
    },
    timetable: [
      { day: 'Monday', periods: [
        { time: '08:00 - 08:45', class: 'Class 10-A', subject: 'Mathematics' },
        { time: '08:45 - 09:30', class: 'Class 9-A', subject: 'Mathematics' },
        { time: '09:30 - 10:15', class: 'Class 10-B', subject: 'Mathematics' }
      ]},
      { day: 'Tuesday', periods: [
        { time: '08:00 - 08:45', class: 'Class 10-B', subject: 'Mathematics' },
        { time: '08:45 - 09:30', class: 'Class 10-A', subject: 'Mathematics' },
        { time: '09:30 - 10:15', class: 'Free Period', subject: '-' }
      ]}
    ]
  };

  return (
    <div>
      <div className="card-wrapper mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-32 h-32 rounded-full bg-soft-blue flex items-center justify-center">
              {teacherData.photo ? (
                <img src={teacherData.photo} alt={teacherData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-blue-500" />
              )}
            </div>
            <Button variant="outline" className="flex gap-2">
              <Edit size={16} />
              Change Photo
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{teacherData.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {teacherData.department}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {teacherData.designation}
                  </span>
                  <span className="bg-soft-blue text-primary px-2 py-1 rounded text-xs">
                    ID: {teacherData.employeeId}
                  </span>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{teacherData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{teacherData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-700">DOB: {new Date(teacherData.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-700">Joined: {new Date(teacherData.joiningDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-gray-500" />
                <span className="text-gray-700">{teacherData.qualification}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-500" />
                <span className="text-gray-700">Experience: {teacherData.experience}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="timetable">
        <TabsList className="w-full">
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="subjects">Subjects & Classes</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>
        <TabsContent value="timetable" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">My Timetable</h3>
            {teacherData.timetable.map((day, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium text-lg">{day.day}</h4>
                <div className="space-y-2 mt-2">
                  {day.periods.map((period, idx) => (
                    <div key={idx} className="p-2 border border-gray-100 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-medium bg-soft-blue px-2 py-1 rounded w-28 text-center">
                          {period.time}
                        </div>
                        <div>
                          <p className="font-medium">{period.subject}</p>
                          <p className="text-xs text-gray-500">{period.class}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="subjects" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Subjects & Classes</h3>
            <div className="mb-4">
              <h4 className="font-medium text-lg">Subjects</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacherData.subjects.map((subject, idx) => (
                  <span key={idx} className="bg-soft-blue text-primary px-3 py-1 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-lg">Classes</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacherData.classes.map((cls, idx) => (
                  <span key={idx} className="bg-soft-green text-green-700 px-3 py-1 rounded-full text-sm">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Attendance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="dashboard-card bg-soft-blue">
                <p className="dashboard-label">Total Days</p>
                <p className="dashboard-stat mt-2">{teacherData.attendance.total}</p>
              </div>
              <div className="dashboard-card bg-soft-green">
                <p className="dashboard-label">Present</p>
                <p className="dashboard-stat mt-2">{teacherData.attendance.present}</p>
              </div>
              <div className="dashboard-card bg-soft-yellow">
                <p className="dashboard-label">Absent</p>
                <p className="dashboard-stat mt-2">{teacherData.attendance.absent}</p>
              </div>
              <div className="dashboard-card bg-soft-purple">
                <p className="dashboard-label">Leave</p>
                <p className="dashboard-stat mt-2">{teacherData.attendance.leave}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: `${teacherData.attendance.present}%`}}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Attendance Rate</span>
                <span className="font-medium">{teacherData.attendance.present}%</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="bank" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="text-sm text-gray-500">Account Number</label>
                <p className="font-medium">{teacherData.bankDetails.accountNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Bank Name</label>
                <p className="font-medium">{teacherData.bankDetails.bankName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">IFSC Code</label>
                <p className="font-medium">{teacherData.bankDetails.ifscCode}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Branch</label>
                <p className="font-medium">{teacherData.bankDetails.branch}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="address" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Address</h3>
            <div className="flex items-start gap-2">
              <MapPin size={18} className="text-gray-500 mt-1" />
              <p className="text-gray-700">{teacherData.address}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StudentProfile = () => {
  // Mock student data
  const studentData = {
    name: 'Alice Johnson',
    photo: null,
    admissionNo: 'SD-2023-001',
    rollNo: '10A-01',
    email: 'alice.johnson@studentemail.com',
    phone: '9876543220',
    dateOfBirth: '2010-07-22',
    address: '456 Student Avenue, Education City, 560001',
    admissionDate: '2020-06-01',
    class: '10-A',
    section: 'A',
    bloodGroup: 'O+',
    parentDetails: {
      father: 'Robert Johnson',
      mother: 'Mary Johnson',
      guardian: 'Robert Johnson',
      contactNo: '9876543221',
      email: 'robert.johnson@email.com',
      occupation: 'Business'
    },
    attendance: {
      present: 95,
      absent: 2,
      leave: 3,
      total: 100
    },
    fees: {
      total: 25000,
      paid: 25000,
      due: 0,
      status: 'Paid'
    },
    transport: {
      route: 'Route 1',
      stop: 'Green Park',
      pickupTime: '7:15 AM',
      dropTime: '3:30 PM',
      busNo: 'KA-01-F-1234'
    }
  };

  return (
    <div>
      <div className="card-wrapper mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-32 h-32 rounded-full bg-soft-yellow flex items-center justify-center">
              {studentData.photo ? (
                <img src={studentData.photo} alt={studentData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-yellow-500" />
              )}
            </div>
            <Button variant="outline" className="flex gap-2">
              <Edit size={16} />
              Change Photo
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{studentData.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    Class {studentData.class}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Roll No: {studentData.rollNo}
                  </span>
                  <span className="bg-soft-blue text-primary px-2 py-1 rounded text-xs">
                    Admission No: {studentData.admissionNo}
                  </span>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{studentData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{studentData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-700">DOB: {new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-700">Admitted: {new Date(studentData.admissionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <School size={16} className="text-gray-500" />
                <span className="text-gray-700">Class {studentData.class}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-500" />
                <span className="text-gray-700">Blood Group: {studentData.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="attendance">
        <TabsList className="w-full">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="parents">Parent Details</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Attendance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="dashboard-card bg-soft-blue">
                <p className="dashboard-label">Total Days</p>
                <p className="dashboard-stat mt-2">{studentData.attendance.total}</p>
              </div>
              <div className="dashboard-card bg-soft-green">
                <p className="dashboard-label">Present</p>
                <p className="dashboard-stat mt-2">{studentData.attendance.present}</p>
              </div>
              <div className="dashboard-card bg-soft-yellow">
                <p className="dashboard-label">Absent</p>
                <p className="dashboard-stat mt-2">{studentData.attendance.absent}</p>
              </div>
              <div className="dashboard-card bg-soft-purple">
                <p className="dashboard-label">Leave</p>
                <p className="dashboard-stat mt-2">{studentData.attendance.leave}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: `${studentData.attendance.present}%`}}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Attendance Rate</span>
                <span className="font-medium">{studentData.attendance.present}%</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="fees" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Fees Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="dashboard-card bg-soft-blue">
                <p className="dashboard-label">Total Fees</p>
                <p className="dashboard-stat mt-2">₹{studentData.fees.total.toLocaleString()}</p>
              </div>
              <div className="dashboard-card bg-soft-green">
                <p className="dashboard-label">Paid Amount</p>
                <p className="dashboard-stat mt-2">₹{studentData.fees.paid.toLocaleString()}</p>
              </div>
              <div className="dashboard-card bg-soft-yellow">
                <p className="dashboard-label">Due Amount</p>
                <p className="dashboard-stat mt-2">₹{studentData.fees.due.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="font-medium">Payment Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {studentData.fees.status}
              </span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="parents" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Parent Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="text-sm text-gray-500">Father's Name</label>
                <p className="font-medium">{studentData.parentDetails.father}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Mother's Name</label>
                <p className="font-medium">{studentData.parentDetails.mother}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Guardian</label>
                <p className="font-medium">{studentData.parentDetails.guardian}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Occupation</label>
                <p className="font-medium">{studentData.parentDetails.occupation}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact Number</label>
                <p className="font-medium">{studentData.parentDetails.contactNo}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{studentData.parentDetails.email}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="transport" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Transport Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-medium">{studentData.transport.route}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-gray-500">Stop</p>
                <p className="font-medium">{studentData.transport.stop}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-gray-500">Pickup Time</p>
                <p className="font-medium">{studentData.transport.pickupTime}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-gray-500">Drop Time</p>
                <p className="font-medium">{studentData.transport.dropTime}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-gray-500">Bus No.</p>
                <p className="font-medium">{studentData.transport.busNo}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="address" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Address</h3>
            <div className="flex items-start gap-2">
              <MapPin size={18} className="text-gray-500 mt-1" />
              <p className="text-gray-700">{studentData.address}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ParentProfile = () => {
  // Mock parent data
  const parentData = {
    name: 'Robert Johnson',
    photo: null,
    parentId: 'PR-2023-001',
    email: 'robert.johnson@email.com',
    phone: '9876543221',
    address: '456 Student Avenue, Education City, 560001',
    occupation: 'Business',
    spouse: 'Mary Johnson',
    spouseOccupation: 'Teacher',
    children: [
      { name: 'Alice Johnson', class: '10-A', rollNo: '10A-01', admissionNo: 'SD-2023-001' },
      { name: 'James Johnson', class: '7-B', rollNo: '7B-05', admissionNo: 'SD-2023-120' }
    ]
  };

  return (
    <div>
      <div className="card-wrapper mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-32 h-32 rounded-full bg-soft-pink flex items-center justify-center">
              {parentData.photo ? (
                <img src={parentData.photo} alt={parentData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-pink-500" />
              )}
            </div>
            <Button variant="outline" className="flex gap-2">
              <Edit size={16} />
              Change Photo
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{parentData.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                    Parent
                  </span>
                  <span className="bg-soft-blue text-primary px-2 py-1 rounded text-xs">
                    ID: {parentData.parentId}
                  </span>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{parentData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{parentData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">{parentData.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-gray-700">Occupation: {parentData.occupation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="children">
        <TabsList className="w-full">
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="family">Family Details</TabsTrigger>
        </TabsList>
        <TabsContent value="children" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Children</h3>
            <div className="space-y-4">
              {parentData.children.map((child, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-lg">{child.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Class {child.class}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Roll No: {child.rollNo}
                        </span>
                        <span className="bg-soft-blue text-primary px-2 py-1 rounded text-xs">
                          Admission No: {child.admissionNo}
                        </span>
                      </div>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="family" className="mt-6">
          <div className="card-wrapper">
            <h3 className="section-title mb-4">Family Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="text-sm text-gray-500">Spouse Name</label>
                <p className="font-medium">{parentData.spouse}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Spouse Occupation</label>
                <p className="font-medium">{parentData.spouseOccupation}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{parentData.address}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StaffProfile = () => {
  // Mock staff data (simplified version)
  const staffData = {
    name: 'Sarah Wilson',
    photo: null,
    staffId: 'ST-2023-001',
    role: 'Administrative Staff',
    department: 'Administration',
    email: 'sarah.wilson@staffemail.com',
    phone: '9876543230'
  };

  return (
    <div className="card-wrapper">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-32 h-32 rounded-full bg-soft-orange flex items-center justify-center">
            {staffData.photo ? (
              <img src={staffData.photo} alt={staffData.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={48} className="text-orange-500" />
            )}
          </div>
          <Button variant="outline" className="flex gap-2">
            <Edit size={16} />
            Change Photo
          </Button>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{staffData.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  {staffData.role}
                </span>
                <span className="bg-soft-blue text-primary px-2 py-1 rounded text-xs">
                  ID: {staffData.staffId}
                </span>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              <span className="text-gray-700">{staffData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <span className="text-gray-700">{staffData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <School size={16} className="text-gray-500" />
              <span className="text-gray-700">{staffData.department}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
