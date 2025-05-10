
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, EyeOff, School, CheckCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/components/ui/sonner";

const INSTITUTES = [
  { id: 1, name: "Valley Public School", location: "New York" },
  { id: 2, name: "Greenwood Academy", location: "Chicago" },
  { id: 3, name: "Sunshine Elementary", location: "San Francisco" }
];

const UserCreation = () => {
  const { user } = useAuth();
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(null);
  const [showInstituteForm, setShowInstituteForm] = useState(false);
  const [institutes, setInstitutes] = useState(INSTITUTES);
  const [instituteForm, setInstituteForm] = useState({
    name: '',
    location: '',
    email: '',
    contactNumber: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSelectInstitute = (id: number) => {
    setSelectedInstitute(id);
    // Generate next admin username (e.g., AD203)
    setFormData(prev => ({
      ...prev,
      username: `AD${Math.floor(Math.random() * 900) + 100}`
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstituteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInstituteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInstituteForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!instituteForm.name) newErrors.instituteName = "Institute name is required";
    if (!instituteForm.location) newErrors.instituteLocation = "Location is required";
    if (!instituteForm.email) newErrors.instituteEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(instituteForm.email)) newErrors.instituteEmail = "Email is invalid";
    if (!instituteForm.contactNumber) newErrors.instituteContact = "Contact number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInstituteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateInstituteForm()) {
      const newInstitute = {
        id: institutes.length + 1,
        name: instituteForm.name,
        location: instituteForm.location
      };
      
      setInstitutes([...institutes, newInstitute]);
      
      toast("Institute created", {
        description: `${instituteForm.name} has been successfully created`
      });
      
      setInstituteForm({
        name: '',
        location: '',
        email: '',
        contactNumber: ''
      });
      
      setShowInstituteForm(false);
      setSelectedInstitute(newInstitute.id);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInstitute) {
      toast("No institute selected", {
        description: "Please select an institute first"
      });
      return;
    }
    
    if (validateForm()) {
      const institute = institutes.find(i => i.id === selectedInstitute);
      
      toast("Admin created", {
        description: `${formData.name} has been created as an admin for ${institute?.name}`
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        username: `AD${Math.floor(Math.random() * 900) + 100}`,
        password: '',
        confirmPassword: ''
      });
    }
  };

  const selectedInstituteData = selectedInstitute ? institutes.find(i => i.id === selectedInstitute) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Creation</h1>
        <p className="text-gray-500">Create institutes and admin accounts</p>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Institutes</h2>
        <Button 
          onClick={() => setShowInstituteForm(!showInstituteForm)} 
          variant={showInstituteForm ? "outline" : "default"}
        >
          <Building size={16} className="mr-2" />
          {showInstituteForm ? "Cancel" : "Create Institute"}
        </Button>
      </div>
      
      {showInstituteForm && (
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Create New Institute</h2>
          <form onSubmit={handleInstituteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instituteName">Institute Name</Label>
                <Input
                  id="instituteName"
                  name="name"
                  value={instituteForm.name}
                  onChange={handleInstituteChange}
                  placeholder="Enter institute name"
                  className={errors.instituteName ? "border-red-500" : ""}
                />
                {errors.instituteName && <p className="text-xs text-red-500">{errors.instituteName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instituteLocation">Location</Label>
                <Input
                  id="instituteLocation"
                  name="location"
                  value={instituteForm.location}
                  onChange={handleInstituteChange}
                  placeholder="Enter location"
                  className={errors.instituteLocation ? "border-red-500" : ""}
                />
                {errors.instituteLocation && <p className="text-xs text-red-500">{errors.instituteLocation}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instituteEmail">Email Address</Label>
                <Input
                  id="instituteEmail"
                  name="email"
                  type="email"
                  value={instituteForm.email}
                  onChange={handleInstituteChange}
                  placeholder="Enter email address"
                  className={errors.instituteEmail ? "border-red-500" : ""}
                />
                {errors.instituteEmail && <p className="text-xs text-red-500">{errors.instituteEmail}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instituteContact">Contact Number</Label>
                <Input
                  id="instituteContact"
                  name="contactNumber"
                  value={instituteForm.contactNumber}
                  onChange={handleInstituteChange}
                  placeholder="Enter contact number"
                  className={errors.instituteContact ? "border-red-500" : ""}
                />
                {errors.instituteContact && <p className="text-xs text-red-500">{errors.instituteContact}</p>}
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                <Building size={16} className="mr-2" />
                Create Institute
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Institute selection */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select Institute</h2>
          <div className="space-y-4">
            {institutes.map(institute => (
              <div 
                key={institute.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                  selectedInstitute === institute.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleSelectInstitute(institute.id)}
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
        
        {/* Right column - Admin form */}
        <div className="lg:col-span-2 card-wrapper">
          <h2 className="text-lg font-medium mb-4">
            {selectedInstituteData 
              ? `Create Admin for ${selectedInstituteData.name}` 
              : "Create Administrator"
            }
          </h2>
          
          {selectedInstitute ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username (e.g. AD201)"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                  <p className="text-xs text-gray-500">Username must start with AD for admin accounts</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <UserPlus size={16} className="mr-2" />
                  Create Admin Account
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <School size={32} />
              <p className="mt-2">Select an institute first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCreation;
