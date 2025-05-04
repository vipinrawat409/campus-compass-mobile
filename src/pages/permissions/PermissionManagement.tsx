
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { School, Eye, EyeOff, Search, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INSTITUTES = [
  { id: 1, name: "Valley Public School", location: "New York" },
  { id: 2, name: "Greenwood Academy", location: "Chicago" },
  { id: 3, name: "Sunshine Elementary", location: "San Francisco" }
];

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "staff", label: "Staff" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" }
];

const PERMISSIONS = [
  { id: "dashboard", name: "Dashboard", description: "View dashboard statistics and overview" },
  { id: "user-management", name: "User Management", description: "Create and manage users" },
  { id: "attendance", name: "Attendance Management", description: "Manage attendance records" },
  { id: "salary", name: "Salary Management", description: "Manage salary information" },
  { id: "leave", name: "Leave Management", description: "Manage leave applications" },
  { id: "transport", name: "Transport Management", description: "Manage transportation" },
  { id: "notices", name: "Notice Management", description: "Publish and manage notices" },
  { id: "timetable", name: "Time Table", description: "View and manage time tables" },
  { id: "fees", name: "Fees Management", description: "Manage student fees" },
  { id: "marks", name: "Marks", description: "View and manage academic marks" },
  { id: "report", name: "Report", description: "Generate and view reports" },
  { id: "profile", name: "Profile", description: "View and edit profile information" }
];

// Mock users for each role
const MOCK_USERS = {
  admin: [
    { id: 1, name: "John Smith", username: "AD101" },
    { id: 2, name: "Sarah Johnson", username: "AD102" }
  ],
  teacher: [
    { id: 1, name: "Michael Brown", username: "TC101" },
    { id: 2, name: "Emily Davis", username: "TC102" },
    { id: 3, name: "Robert Miller", username: "TC103" }
  ],
  staff: [
    { id: 1, name: "Patricia Wilson", username: "ST101" },
    { id: 2, name: "James Taylor", username: "ST102" }
  ],
  student: [
    { id: 1, name: "Jennifer Moore", username: "SD101" },
    { id: 2, name: "Thomas Anderson", username: "SD102" },
    { id: 3, name: "Daniel Lewis", username: "SD103" },
    { id: 4, name: "Lisa Walker", username: "SD104" }
  ],
  parent: [
    { id: 1, name: "Richard Moore", username: "PR101" },
    { id: 2, name: "Mary Anderson", username: "PR102" }
  ]
};

const PermissionManagement = () => {
  const { user } = useAuth();
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <EyeOff size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="text-gray-500 mt-2">You don't have permission to access this section.</p>
        </div>
      </div>
    );
  }

  const handleSelectInstitute = (id: string) => {
    setSelectedInstitute(Number(id));
    setSelectedRole(null);
    setSelectedUser(null);
    setUserPermissions({});
  };

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSelectedUser(null);
    setUserPermissions({});
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUser(userId);
    
    // Initialize with random permissions - in a real app, this would come from the database
    const initialPermissions: Record<string, boolean> = {};
    PERMISSIONS.forEach(permission => {
      initialPermissions[permission.id] = Math.random() > 0.3; // 70% chance of having permission
    });
    
    setUserPermissions(initialPermissions);
  };

  const togglePermission = (permissionId: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const savePermissions = () => {
    // In a real app, you would save these permissions to a database
    toast("Permissions saved", {
      description: "User permissions have been updated successfully"
    });
  };

  const filteredUsers = selectedRole && MOCK_USERS[selectedRole as keyof typeof MOCK_USERS]
    ? MOCK_USERS[selectedRole as keyof typeof MOCK_USERS].filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const selectedUserData = selectedUser && selectedRole
    ? MOCK_USERS[selectedRole as keyof typeof MOCK_USERS].find(u => u.id === selectedUser)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
        <p className="text-gray-500">Manage user access and permissions for each institute</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Select Institute */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select Institute</h2>
          <div className="space-y-4">
            {INSTITUTES.map(institute => (
              <div 
                key={institute.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                  selectedInstitute === institute.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleSelectInstitute(institute.id.toString())}
              >
                <div className="flex items-center">
                  <School size={18} className="text-primary mr-2" />
                  <div>
                    <p className="font-medium">{institute.name}</p>
                    <p className="text-xs text-gray-500">{institute.location}</p>
                  </div>
                </div>
                {selectedInstitute === institute.id && (
                  <CheckCircle size={18} className="text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Select Role */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select Role</h2>
          {selectedInstitute ? (
            <div className="space-y-2">
              {ROLES.map(role => (
                <div
                  key={role.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    selectedRole === role.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectRole(role.value)}
                >
                  <span>{role.label}</span>
                  {selectedRole === role.value && (
                    <CheckCircle size={18} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <School size={32} />
              <p className="mt-2">Select an institute first</p>
            </div>
          )}
        </div>

        {/* Step 3: Select User */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select User</h2>
          {selectedRole ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        selectedUser === user.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectUser(user.id)}
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.username}</p>
                      </div>
                      {selectedUser === user.id && (
                        <CheckCircle size={18} className="text-primary" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <School size={32} />
              <p className="mt-2">Select a role first</p>
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Manage Permissions */}
      {selectedUser && (
        <div className="card-wrapper">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">Manage Permissions</h2>
              <p className="text-gray-500">
                {selectedUserData?.name} ({selectedUserData?.username})
              </p>
            </div>
            <Button onClick={savePermissions}>Save Changes</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PERMISSIONS.map(permission => (
              <div 
                key={permission.id}
                className={`p-3 border rounded-lg flex items-start justify-between cursor-pointer ${
                  userPermissions[permission.id] ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
                onClick={() => togglePermission(permission.id)}
              >
                <div>
                  <p className="font-medium">{permission.name}</p>
                  <p className="text-xs text-gray-500">{permission.description}</p>
                </div>
                <div className="ml-2">
                  {userPermissions[permission.id] ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <X className="text-red-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;
