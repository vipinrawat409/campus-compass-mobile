
import React, { useRef } from 'react';
import { Download, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const IDCard = () => {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mock student data
  const studentData = {
    name: 'Alice Johnson',
    photo: null,
    admissionNo: 'SD-2023-001',
    rollNo: '10A-01',
    class: '10-A',
    dateOfBirth: '2010-07-22',
    bloodGroup: 'O+',
    address: '456 Student Avenue, Education City, 560001',
    phone: '9876543220',
    email: 'alice.johnson@studentemail.com',
    validFrom: '2025-04-01',
    validTo: '2026-03-31',
    barcode: 'SD2023001'
  };
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF download of the ID card
    toast.success("ID Card downloaded successfully");
  };
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">ID Card</h1>
        <p className="text-gray-500">View and download your digital ID card</p>
      </div>
      
      <div className="card-wrapper flex flex-col items-center">
        <div className="flex sm:flex-row flex-col sm:items-start items-center gap-4 mb-6">
          <div 
            ref={cardRef}
            className="w-full max-w-sm bg-white border-2 border-primary rounded-lg overflow-hidden shadow-lg"
          >
            {/* ID Card Header */}
            <div className="bg-primary text-white p-4 text-center">
              <h2 className="text-xl font-bold">Valley Public School</h2>
              <p className="text-sm">Student Identity Card</p>
            </div>
            
            {/* ID Card Body */}
            <div className="p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-soft-yellow flex items-center justify-center">
                  {studentData.photo ? (
                    <img src={studentData.photo} alt={studentData.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={36} className="text-yellow-500" />
                  )}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">{studentData.name}</h3>
                <div className="text-sm text-gray-600">Class {studentData.class}</div>
                <div className="mt-1 flex justify-center gap-2">
                  <span className="px-2 py-1 bg-soft-blue text-primary text-xs rounded-full">Roll No: {studentData.rollNo}</span>
                  <span className="px-2 py-1 bg-soft-green text-green-700 text-xs rounded-full">Blood Group: {studentData.bloodGroup}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span className="text-gray-700">{studentData.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  <span className="text-gray-700">{studentData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  <span className="text-gray-700">{studentData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="text-gray-700">DOB: {new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* ID Card Footer */}
            <div className="border-t px-4 py-3">
              <div className="text-xs text-gray-600">
                <div className="font-medium">Admission Number: {studentData.admissionNo}</div>
                <div className="flex justify-between mt-1">
                  <span>Valid From: {new Date(studentData.validFrom).toLocaleDateString()}</span>
                  <span>Valid To: {new Date(studentData.validTo).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {/* In a real app, this would be an actual barcode */}
                <div className="h-10 w-32 bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{studentData.barcode}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg bg-soft-blue max-w-xs">
              <h3 className="text-lg font-medium mb-2">ID Card Instructions</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>This digital ID card is for identification purposes within the school premises.</li>
                <li>Always carry your physical ID card while in school.</li>
                <li>Report immediately if your ID card is lost or damaged.</li>
                <li>The ID card is valid only for the academic year mentioned.</li>
              </ul>
            </div>
            
            <Button onClick={handleDownload} className="flex items-center gap-2 w-full">
              <Download size={16} />
              Download ID Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
