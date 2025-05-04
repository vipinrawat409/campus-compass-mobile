
import React, { useState } from 'react';
import { Bus, Search, Map, MapPin, User, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TransportManagement = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock routes data
  const routesData = [
    { 
      id: 1, 
      name: 'Route 1', 
      busNo: 'KA-01-F-1234',
      driver: 'John Miller',
      contactNo: '9876543210',
      stops: [
        { name: 'City Center', time: '7:00 AM' },
        { name: 'Green Park', time: '7:15 AM' },
        { name: 'White Field', time: '7:30 AM' },
        { name: 'School', time: '7:45 AM' }
      ],
      students: 28
    },
    { 
      id: 2, 
      name: 'Route 2', 
      busNo: 'KA-01-F-5678',
      driver: 'David Wilson',
      contactNo: '9876543211',
      stops: [
        { name: 'River View', time: '7:00 AM' },
        { name: 'Hill Garden', time: '7:20 AM' },
        { name: 'Metro Station', time: '7:35 AM' },
        { name: 'School', time: '7:50 AM' }
      ],
      students: 32
    },
    { 
      id: 3, 
      name: 'Route 3', 
      busNo: 'KA-01-F-9012',
      driver: 'Michael Brown',
      contactNo: '9876543212',
      stops: [
        { name: 'Lake View', time: '7:10 AM' },
        { name: 'Market Area', time: '7:25 AM' },
        { name: 'Hospital Road', time: '7:35 AM' },
        { name: 'School', time: '7:55 AM' }
      ],
      students: 25
    }
  ];
  
  // Mock students data
  const studentsData = [
    { id: 1, name: 'Alice Johnson', class: '10-A', route: 'Route 1', stop: 'Green Park', contact: '9876543220' },
    { id: 2, name: 'Bob Smith', class: '9-B', route: 'Route 2', stop: 'Hill Garden', contact: '9876543221' },
    { id: 3, name: 'Charlie Brown', class: '8-C', route: 'Route 1', stop: 'City Center', contact: '9876543222' },
    { id: 4, name: 'David Clark', class: '10-A', route: 'Route 3', stop: 'Lake View', contact: '9876543223' },
    { id: 5, name: 'Emma Davis', class: '7-A', route: 'Route 2', stop: 'Metro Station', contact: '9876543224' },
    { id: 6, name: 'Frank Wilson', class: '9-B', route: 'Route 3', stop: 'Hospital Road', contact: '9876543225' },
    { id: 7, name: 'Grace Taylor', class: '8-C', route: 'Route 1', stop: 'White Field', contact: '9876543226' },
    { id: 8, name: 'Harry Moore', class: '7-A', route: 'Route 2', stop: 'River View', contact: '9876543227' }
  ];
  
  // Filter data based on search term and active tab
  const filteredRoutes = routesData.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.busNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.stop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Transport Management</h1>
        <p className="text-gray-500">Manage school transport routes and students</p>
      </div>

      <div className="card-wrapper">
        <Tabs defaultValue="routes" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="routes">Bus Routes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={activeTab === 'routes' ? "Search routes..." : "Search students..."}
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex gap-2">
                <Plus size={16} />
                {activeTab === 'routes' ? 'Add Route' : 'Add Student'}
              </Button>
            </div>
          </div>

          <TabsContent value="routes" className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bus size={18} className="text-primary" />
                      <h3 className="font-semibold text-lg">{route.name}</h3>
                      <span className="bg-soft-blue px-2 py-1 text-xs rounded-md">
                        {route.busNo}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Driver:</span> {route.driver}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {route.contactNo}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{route.students} students</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Bus Stops:</p>
                  <div className="flex flex-wrap gap-2">
                    {route.stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                        <MapPin size={12} className={index === route.stops.length - 1 ? "text-red-500" : "text-gray-500"} />
                        <span>{stop.name}</span>
                        <span className="text-gray-500">({stop.time})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="students">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Class</th>
                    <th className="py-3 px-4 text-left">Route</th>
                    <th className="py-3 px-4 text-left">Stop</th>
                    <th className="py-3 px-4 text-left">Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">{student.class}</td>
                      <td className="py-3 px-4">{student.route}</td>
                      <td className="py-3 px-4">{student.stop}</td>
                      <td className="py-3 px-4">{student.contact}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransportManagement;
