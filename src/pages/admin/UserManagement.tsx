
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Search, Edit, Trash, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Sample user data
const sampleUsers = [
  { id: 1, name: 'John Smith', username: 'TC001', role: 'teacher', subject: 'Mathematics', status: 'active' },
  { id: 2, name: 'Emily Johnson', username: 'TC002', role: 'teacher', subject: 'English', status: 'active' },
  { id: 3, name: 'Michael Brown', username: 'ST001', role: 'staff', department: 'Administration', status: 'active' },
  { id: 4, name: 'Jessica Lee', username: 'SD001', role: 'student', class: '10A', status: 'active' },
  { id: 5, name: 'Robert Wilson', username: 'PR001', role: 'parent', student: 'Jessica Lee', status: 'active' },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("teachers");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newUserRole, setNewUserRole] = useState<string>("teacher");

  const filteredUsers = sampleUsers.filter(user => 
    (activeTab === "all" || user.role === activeTab.slice(0, -1)) && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast("User created successfully", {
      description: "New user has been added to the system."
    });
    setShowCreateForm(false);
  };

  const handleDeleteUser = (id: number) => {
    toast("User deleted", {
      description: "User has been removed from the system."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Users</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teachers" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="parents">Parents</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="teachers" className="m-0">
              <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            </TabsContent>
            <TabsContent value="staff" className="m-0">
              <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            </TabsContent>
            <TabsContent value="students" className="m-0">
              <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            </TabsContent>
            <TabsContent value="parents" className="m-0">
              <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            </TabsContent>
            <TabsContent value="all" className="m-0">
              <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="e.g., TC003" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Set initial password" required />
                </div>
                
                {newUserRole === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Mathematics" />
                  </div>
                )}
                
                {newUserRole === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" placeholder="e.g., 10A" />
                  </div>
                )}
                
                {newUserRole === 'parent' && (
                  <div className="space-y-2">
                    <Label htmlFor="student">Child/Student</Label>
                    <Input id="student" placeholder="Link to student" />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Users table component
const UsersTable = ({ 
  users, 
  onDelete 
}: { 
  users: any[],
  onDelete: (id: number) => void 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-soft-blue/25 flex items-center justify-center">
                        <User size={14} />
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 capitalize">
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => onDelete(user.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
