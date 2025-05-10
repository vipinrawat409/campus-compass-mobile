
import React, { useState } from 'react';
import { Bus, Search, Map, MapPin, User, Users, Plus, Edit, Trash2, Route, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentFeeHistoryModal from "@/components/modals/StudentFeeHistoryModal";

// Define interfaces for our route types
interface BusStop {
  name: string;
  time: string;
}

interface BusStudent {
  id: number;
  name: string;
  class: string;
  stop: string;
  contact: string;
}

interface BusRoute {
  id: number; 
  name: string; 
  busNo: string;
  driver: string;
  contactNo: string;
  stops: BusStop[];
  students: number;
}

const TransportManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedRouteStudents, setSelectedRouteStudents] = useState<BusStudent[]>([]);
  const [editMode, setEditMode] = useState(false);
  
  // Form state for adding/editing routes
  const [formData, setFormData] = useState({
    name: '',
    busNo: '',
    driver: '',
    contactNo: '',
    stops: [{ name: 'School', time: '8:00 AM' }] as BusStop[],
    students: [] as { id: number; name: string }[]
  });
  
  // Mock routes data
  const [routesData, setRoutesData] = useState<BusRoute[]>([
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
  ]);
  
  // Mock students data
  const [studentsData] = useState<BusStudent[]>([
    { id: 1, name: 'Alice Johnson', class: '10-A', stop: 'Green Park', contact: '9876543220' },
    { id: 2, name: 'Bob Smith', class: '9-B', stop: 'Hill Garden', contact: '9876543221' },
    { id: 3, name: 'Charlie Brown', class: '8-C', stop: 'City Center', contact: '9876543222' },
    { id: 4, name: 'David Clark', class: '10-A', stop: 'Lake View', contact: '9876543223' },
    { id: 5, name: 'Emma Davis', class: '7-A', stop: 'Metro Station', contact: '9876543224' },
    { id: 6, name: 'Frank Wilson', class: '9-B', stop: 'Hospital Road', contact: '9876543225' },
    { id: 7, name: 'Grace Taylor', class: '8-C', stop: 'White Field', contact: '9876543226' },
    { id: 8, name: 'Harry Moore', class: '7-A', stop: 'River View', contact: '9876543227' }
  ]);
  
  // Filter data based on search term and active tab
  const filteredRoutes = routesData.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.busNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.stop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // View route details
  const handleViewRouteDetails = (route: BusRoute) => {
    setSelectedRoute(route);
    // Filter students for this route based on stops
    const routeStopNames = route.stops.map(stop => stop.name);
    const routeStudents = studentsData.filter(student => 
      routeStopNames.includes(student.stop)
    );
    setSelectedRouteStudents(routeStudents);
    setShowRouteDetails(true);
  };

  // Add new route
  const handleAddRoute = () => {
    setEditMode(false);
    setFormData({
      name: '',
      busNo: '',
      driver: '',
      contactNo: '',
      stops: [{ name: 'School', time: '8:00 AM' }],
      students: []
    });
    setShowRouteForm(true);
  };

  // Edit route
  const handleEditRoute = (route: BusRoute) => {
    setEditMode(true);
    // Find students for this route
    const routeStopNames = route.stops.map(stop => stop.name);
    const routeStudents = studentsData
      .filter(student => routeStopNames.includes(student.stop))
      .map(student => ({ id: student.id, name: student.name }));
    
    setFormData({
      name: route.name,
      busNo: route.busNo,
      driver: route.driver,
      contactNo: route.contactNo,
      stops: [...route.stops],
      students: routeStudents
    });
    setSelectedRoute(route);
    setShowRouteForm(true);
  };

  // Delete route
  const handleDeleteRoute = (id: number) => {
    setRoutesData(routesData.filter(route => route.id !== id));
    toast({
      title: "Route Deleted",
      description: "The bus route has been deleted successfully."
    });
  };

  // Add stop to form
  const handleAddStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { name: '', time: '' }]
    });
  };

  // Update stop in form
  const handleUpdateStop = (index: number, field: 'name' | 'time', value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData({ ...formData, stops: newStops });
  };

  // Remove stop from form
  const handleRemoveStop = (index: number) => {
    if (formData.stops.length > 1) {
      const newStops = formData.stops.filter((_, i) => i !== index);
      setFormData({ ...formData, stops: newStops });
    }
  };

  // Handle form submission
  const handleSubmitForm = () => {
    // Validate form
    if (!formData.name || !formData.busNo || !formData.driver || !formData.contactNo || formData.stops.some(stop => !stop.name || !stop.time)) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && selectedRoute) {
      // Update existing route
      setRoutesData(routesData.map(route => 
        route.id === selectedRoute.id 
          ? { 
              ...route, 
              name: formData.name, 
              busNo: formData.busNo, 
              driver: formData.driver, 
              contactNo: formData.contactNo, 
              stops: formData.stops,
              students: formData.students.length
            } 
          : route
      ));
      
      toast({
        title: "Route Updated",
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      // Add new route
      const newRoute: BusRoute = {
        id: Math.max(0, ...routesData.map(r => r.id)) + 1,
        name: formData.name,
        busNo: formData.busNo,
        driver: formData.driver,
        contactNo: formData.contactNo,
        stops: formData.stops,
        students: formData.students.length
      };
      
      setRoutesData([...routesData, newRoute]);
      
      toast({
        title: "Route Added",
        description: `${formData.name} has been added successfully.`
      });
    }
    
    setShowRouteForm(false);
  };

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
              <Button className="flex gap-2" onClick={handleAddRoute}>
                <Plus size={16} />
                {activeTab === 'routes' ? 'Add Route' : 'Add Student'}
              </Button>
            </div>
          </div>

          <TabsContent value="routes" className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleViewRouteDetails(route)}>
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
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                      e.stopPropagation();
                      handleEditRoute(route);
                    }}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoute(route.id);
                      }}
                    >
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
                      <td className="py-3 px-4">{
                        routesData.find(route => 
                          route.stops.some(stop => stop.name === student.stop)
                        )?.name || '-'
                      }</td>
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

      {/* Route Details Dialog */}
      <Dialog open={showRouteDetails} onOpenChange={setShowRouteDetails}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRoute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bus className="h-5 w-5 text-primary" /> 
                  {selectedRoute.name} - {selectedRoute.busNo}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Driver</p>
                    <p>{selectedRoute.driver}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p>{selectedRoute.contactNo}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Route Map</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center">
                      <Route className="text-primary mr-2" size={18} />
                      <span className="font-medium">Bus Route</span>
                    </div>
                    <div className="ml-4 mt-2 space-y-2">
                      {selectedRoute.stops.map((stop, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="relative">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              {i === 0 && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            {i < selectedRoute.stops.length - 1 && (
                              <div className="absolute top-4 bottom-0 left-1/2 w-0.5 -ml-px h-5 bg-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{stop.name}</p>
                            <p className="text-xs text-gray-500">{stop.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Students ({selectedRouteStudents.length})</h3>
                  <div className="overflow-x-auto max-h-60 border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700 sticky top-0">
                        <tr>
                          <th className="py-2 px-4 text-left">Name</th>
                          <th className="py-2 px-4 text-left">Class</th>
                          <th className="py-2 px-4 text-left">Stop</th>
                          <th className="py-2 px-4 text-left">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedRouteStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4">{student.name}</td>
                            <td className="py-2 px-4">{student.class}</td>
                            <td className="py-2 px-4">{student.stop}</td>
                            <td className="py-2 px-4">{student.contact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setShowRouteDetails(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setShowRouteDetails(false);
                    handleEditRoute(selectedRoute);
                  }}>
                    Edit Route
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Route Form Dialog */}
      <Dialog open={showRouteForm} onOpenChange={setShowRouteForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Route' : 'Add New Route'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., East Route"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busNo">Bus Number</Label>
                <Input
                  id="busNo"
                  value={formData.busNo}
                  onChange={(e) => setFormData({...formData, busNo: e.target.value})}
                  placeholder="e.g., KA-01-F-1234"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="driver">Driver Name</Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  placeholder="e.g., John Miller"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Driver Contact</Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                  placeholder="e.g., 9876543210"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Bus Stops</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddStop}>
                  <Plus className="h-4 w-4 mr-1" /> Add Stop
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        value={stop.name}
                        onChange={(e) => handleUpdateStop(index, 'name', e.target.value)}
                        placeholder="Stop Name"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        value={stop.time}
                        onChange={(e) => handleUpdateStop(index, 'time', e.target.value)}
                        placeholder="Time (e.g., 7:30 AM)"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStop(index)}
                        disabled={formData.stops.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Assign Students</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">
                  Students will be automatically assigned based on their registered bus stops.
                </p>
                <div className="flex flex-wrap gap-2">
                  {studentsData
                    .filter(student => 
                      formData.stops.some(stop => stop.name === student.stop)
                    )
                    .map(student => (
                      <div key={student.id} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-xs">
                        <User size={12} />
                        <span>{student.name}</span>
                        <span className="text-gray-500">({student.stop})</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRouteForm(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSubmitForm}>
                {editMode ? 'Update Route' : 'Add Route'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransportManagement;
