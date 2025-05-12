
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Check, Calendar, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import EditProfileModal from '@/components/modals/EditProfileModal';

interface ParentProfileProps {
  children?: React.ReactNode;
}

const ParentProfile = ({ children }: ParentProfileProps) => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    id: 1,
    name: user?.name || "Parent Name",
    email: user?.username ? `${user.username.toLowerCase()}@school.com` : "parent@example.com", // Using username to create an email
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    bio: "Parent of two children at Valley Public School. Active in PTA and school events.",
    avatar: null,
    role: "parent"
  });
  
  // Mock children data
  const childrenData = [
    {
      id: 1,
      name: "Sarah Wilson",
      class: "10-A",
      rollNo: "SD201",
      age: 15,
      dob: "2010-02-15",
      gender: "Female",
      bloodGroup: "O+",
      joiningDate: "2018-03-10"
    },
    {
      id: 2,
      name: "John Wilson",
      class: "7-B",
      rollNo: "SD202",
      age: 12,
      dob: "2013-05-22",
      gender: "Male",
      bloodGroup: "A+",
      joiningDate: "2018-03-10"
    }
  ];
  
  const handleSaveProfile = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card-wrapper">
            <div className="flex flex-col items-center pb-6">
              <Avatar className="w-24 h-24 mb-4">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} />
                ) : (
                  <AvatarFallback className="text-lg bg-primary text-white">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-500 capitalize">{profile.role}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
            
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{profile.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{profile.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{profile.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card-wrapper">
            <h2 className="section-title mb-4">Children Information</h2>
            
            <div className="space-y-6">
              {childrenData.map(child => (
                <div key={child.id} className="border p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-soft-blue text-primary">
                          {child.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{child.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4" />
                          <span>Class {child.class}</span>
                          <span className="px-2 py-0.5 bg-soft-blue rounded-full text-xs">
                            Roll No: {child.rollNo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Age</span>
                      <span className="font-medium">{child.age} years</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Date of Birth</span>
                      <span className="font-medium">{new Date(child.dob).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Gender</span>
                      <span className="font-medium">{child.gender}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Blood Group</span>
                      <span className="font-medium">{child.bloodGroup}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Joining Date</span>
                      <span className="font-medium">{new Date(child.joiningDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {children}
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ParentProfile;
