
import React, { useState } from 'react';
import { DollarSign, Search, Filter, Download, Plus, FileText, User, Users, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import AddFeeModal, { Student, FeeData } from "@/components/modals/AddFeeModal";
import StudentFeeHistoryModal from "@/components/modals/StudentFeeHistoryModal";

const FeesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{name: string, class: string} | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Mock students data
  const students: Student[] = [
    { id: 1, name: 'Alice Johnson', class: '10-A' },
    { id: 2, name: 'Bob Smith', class: '10-A' },
    { id: 3, name: 'Charlie Brown', class: '9-B' },
    { id: 4, name: 'David Clark', class: '9-B' },
    { id: 5, name: 'Emma Davis', class: '8-C' },
    { id: 6, name: 'Frank Wilson', class: '8-C' },
    { id: 7, name: 'Grace Taylor', class: '7-A' },
    { id: 8, name: 'Harry Moore', class: '7-A' },
  ];
  
  // Mock fee data
  const [feesData, setFeesData] = useState([
    { id: 1, studentId: 1, student: 'Alice Johnson', class: '10-A', feeType: 'Annual Fee', amount: 25000, dueDate: '2025-06-30', status: 'Paid' },
    { id: 2, studentId: 2, student: 'Bob Smith', class: '10-A', feeType: 'Annual Fee', amount: 25000, dueDate: '2025-06-30', status: 'Pending' },
    { id: 3, studentId: 3, student: 'Charlie Brown', class: '9-B', feeType: 'Annual Fee', amount: 22000, dueDate: '2025-06-30', status: 'Partially Paid' },
    { id: 4, studentId: 4, student: 'David Clark', class: '9-B', feeType: 'Transport Fee', amount: 8000, dueDate: '2025-06-15', status: 'Paid' },
    { id: 5, studentId: 5, student: 'Emma Davis', class: '8-C', feeType: 'Annual Fee', amount: 20000, dueDate: '2025-06-30', status: 'Pending' },
    { id: 6, studentId: 6, student: 'Frank Wilson', class: '8-C', feeType: 'Transport Fee', amount: 8000, dueDate: '2025-06-15', status: 'Paid' },
    { id: 7, studentId: 7, student: 'Grace Taylor', class: '7-A', feeType: 'Annual Fee', amount: 18000, dueDate: '2025-06-30', status: 'Pending' },
    { id: 8, studentId: 8, student: 'Harry Moore', class: '7-A', feeType: 'Lab Fee', amount: 5000, dueDate: '2025-06-20', status: 'Paid' }
  ]);
  
  // Mock fee history data
  const feeHistory = [
    { id: 1, feeType: 'Annual Fee', amount: 25000, dueDate: '2024-06-30', paidDate: '2024-06-25', status: 'Paid' },
    { id: 2, feeType: 'Transport Fee', amount: 8000, dueDate: '2024-06-15', paidDate: '2024-06-10', status: 'Paid' },
    { id: 3, feeType: 'Lab Fee', amount: 5000, dueDate: '2024-06-20', paidDate: '2024-06-18', status: 'Paid' },
    { id: 4, feeType: 'Annual Fee', amount: 25000, dueDate: '2025-06-30', paidDate: null, status: 'Pending' }
  ];
  
  // Filter fees based on search term
  const filteredFees = feesData.filter(fee => 
    fee.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.feeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddFee = (formData: FeeData) => {
    const selectedStudent = students.find(student => student.id === formData.studentId);
    
    if (!selectedStudent) {
      toast("Error", {
        description: "Selected student not found"
      });
      return;
    }
    
    const newFee = {
      id: feesData.length + 1,
      studentId: formData.studentId,
      student: selectedStudent.name,
      class: selectedStudent.class,
      feeType: formData.feeType,
      amount: formData.amount,
      dueDate: formData.dueDate,
      status: 'Pending'
    };
    
    setFeesData([...feesData, newFee]);
    
    toast("Fee added", {
      description: `${formData.feeType} for ${selectedStudent.name} has been added successfully`
    });
    
    setIsAddFeeModalOpen(false);
  };

  const viewStudentHistory = (student: string, className: string) => {
    setSelectedStudent({ name: student, class: className });
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Fees Management</h1>
        <p className="text-gray-500">Manage student fees and payments</p>
      </div>

      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search student, class or fee type..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" className="flex gap-2">
              <Download size={16} />
              Export
            </Button>
            <Button 
              className="flex gap-2"
              onClick={() => setIsAddFeeModalOpen(true)}
            >
              <Plus size={16} />
              Add Fee
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Student</th>
                <th className="py-3 px-4 text-left">Class</th>
                <th className="py-3 px-4 text-left">Fee Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{fee.student}</td>
                  <td className="py-3 px-4">{fee.class}</td>
                  <td className="py-3 px-4">{fee.feeType}</td>
                  <td className="py-3 px-4 text-right">₹{fee.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(fee.status)}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewStudentHistory(fee.student, fee.class)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Total Fees Collection</p>
            <DollarSign className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">₹1,56,000</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Fees Collected</p>
            <DollarSign className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">₹98,000</p>
        </div>
        <div className="dashboard-card bg-soft-orange">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Pending Fees</p>
            <DollarSign className="text-orange-500" />
          </div>
          <p className="dashboard-stat mt-2">₹58,000</p>
        </div>
      </div>

      <AddFeeModal 
        isOpen={isAddFeeModalOpen}
        onClose={() => setIsAddFeeModalOpen(false)}
        onSave={handleAddFee}
        students={students}
      />

      <StudentFeeHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        student={selectedStudent}
        feeHistory={feeHistory}
      />
    </div>
  );
};

export default FeesManagement;
