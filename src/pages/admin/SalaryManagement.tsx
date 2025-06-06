
import React, { useState } from 'react';
import { DollarSign, Search, Filter, Download, Plus, Calendar, Check, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import AddSalaryModal, { StaffMember, SalaryFormData } from "@/components/modals/AddSalaryModal";
import SalaryDetailsModal from "@/components/modals/SalaryDetailsModal";

const SalaryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('May 2025');
  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  const [isSalaryDetailsModalOpen, setIsSalaryDetailsModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  
  // Available months for the dropdown
  const months = ['May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025'];
  
  // Mock staff members data for dropdown
  const staffMembers: StaffMember[] = [
    { id: 1, name: 'John Miller', role: 'Senior Teacher', department: 'Mathematics' },
    { id: 2, name: 'Sarah Johnson', role: 'Teacher', department: 'English' },
    { id: 3, name: 'Michael Brown', role: 'Teacher', department: 'Science' },
    { id: 4, name: 'Emily Parker', role: 'Teacher', department: 'Social Studies' },
    { id: 5, name: 'Robert Wilson', role: 'Administrative Staff', department: 'Admin' },
    { id: 6, name: 'Lisa Davis', role: 'Teacher', department: 'Art' },
    { id: 7, name: 'James Martin', role: 'Librarian', department: 'Library' },
  ];
  
  // Mock salary data
  const [salaryData, setSalaryData] = useState([
    { 
      id: 1, 
      name: 'John Miller', 
      role: 'Senior Teacher',
      department: 'Mathematics',
      basic: 45000,
      hra: 15000,
      allowances: 8000,
      deductions: 6500,
      netSalary: 61500,
      status: 'Paid',
      paidOn: '2025-05-01'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      role: 'Teacher',
      department: 'English',
      basic: 40000,
      hra: 13000,
      allowances: 7000,
      deductions: 6000,
      netSalary: 54000,
      status: 'Paid',
      paidOn: '2025-05-01'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      role: 'Teacher',
      department: 'Science',
      basic: 42000,
      hra: 14000,
      allowances: 7500,
      deductions: 6200,
      netSalary: 57300,
      status: 'Processing',
      paidOn: ''
    },
    { 
      id: 4, 
      name: 'Emily Parker', 
      role: 'Teacher',
      department: 'Social Studies',
      basic: 38000,
      hra: 12000,
      allowances: 6500,
      deductions: 5500,
      netSalary: 51000,
      status: 'Pending',
      paidOn: ''
    },
    { 
      id: 5, 
      name: 'Robert Wilson', 
      role: 'Administrative Staff',
      department: 'Admin',
      basic: 35000,
      hra: 10000,
      allowances: 5000,
      deductions: 5000,
      netSalary: 45000,
      status: 'Paid',
      paidOn: '2025-05-01'
    }
  ]);
  
  // Filter salary data based on search term
  const filteredSalaries = salaryData.filter(salary => 
    salary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddSalary = (formData: SalaryFormData) => {
    const selectedStaff = staffMembers.find(staff => staff.id === formData.staffId);
    
    if (!selectedStaff) {
      toast("Error", {
        description: "Selected staff not found"
      });
      return;
    }
    
    const netSalary = formData.basic + formData.hra + formData.allowances - formData.deductions;
    
    const newSalary = {
      id: salaryData.length + 1,
      name: selectedStaff.name,
      role: selectedStaff.role,
      department: selectedStaff.department,
      basic: formData.basic,
      hra: formData.hra,
      allowances: formData.allowances,
      deductions: formData.deductions,
      netSalary: netSalary,
      status: 'Processing',
      paidOn: ''
    };
    
    setSalaryData([...salaryData, newSalary]);
    
    toast("Salary added", {
      description: `Salary for ${selectedStaff.name} has been added successfully`
    });
    
    setIsAddSalaryModalOpen(false);
  };

  const viewSalaryDetails = (salary: any) => {
    setSelectedSalary(salary);
    setIsSalaryDetailsModalOpen(true);
  };

  const handleSalaryStatusChange = (id: number, newStatus: string) => {
    setSalaryData(prevData => 
      prevData.map(salary => {
        if (salary.id === id) {
          const updatedSalary = {
            ...salary,
            status: newStatus,
            paidOn: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : salary.paidOn
          };
          
          // Also update the selected salary if it's currently being viewed
          if (selectedSalary && selectedSalary.id === id) {
            setSelectedSalary(updatedSalary);
          }
          
          return updatedSalary;
        }
        return salary;
      })
    );
  };

  const handleSalaryUpdate = (id: number, updatedData: any) => {
    setSalaryData(prevData => 
      prevData.map(salary => {
        if (salary.id === id) {
          // Also update the selected salary if it's currently being viewed
          if (selectedSalary && selectedSalary.id === id) {
            setSelectedSalary(updatedData);
          }
          
          return updatedData;
        }
        return salary;
      })
    );
  };

  // Calculate stats
  const totalSalaryBudget = salaryData.reduce((total, item) => total + item.netSalary, 0);
  const salariesPaid = salaryData
    .filter(item => item.status === 'Paid')
    .reduce((total, item) => total + item.netSalary, 0);
  const pendingPayments = totalSalaryBudget - salariesPaid;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Salary Management</h1>
        <p className="text-gray-500">Manage staff and teacher salaries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dashboard-card bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Total Salary Budget</p>
            <DollarSign className="text-blue-500" />
          </div>
          <p className="dashboard-stat mt-2">₹{totalSalaryBudget.toLocaleString()}</p>
        </div>
        <div className="dashboard-card bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Salaries Paid</p>
            <Check className="text-green-500" />
          </div>
          <p className="dashboard-stat mt-2">₹{salariesPaid.toLocaleString()}</p>
        </div>
        <div className="dashboard-card bg-soft-yellow">
          <div className="flex justify-between items-center">
            <p className="dashboard-label">Pending Payments</p>
            <CreditCard className="text-yellow-500" />
          </div>
          <p className="dashboard-stat mt-2">₹{pendingPayments.toLocaleString()}</p>
        </div>
      </div>

      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">Month:</span>
            <select 
              className="px-3 py-1.5 border rounded-md bg-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex gap-2">
                <Download size={16} />
                Export
              </Button>
              <Button 
                className="flex gap-2"
                onClick={() => setIsAddSalaryModalOpen(true)}
              >
                <Plus size={16} />
                Add Salary
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-right">Basic</th>
                <th className="py-3 px-4 text-right">HRA</th>
                <th className="py-3 px-4 text-right">Allowances</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Salary</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSalaries.map((salary) => (
                <tr key={salary.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{salary.name}</td>
                  <td className="py-3 px-4">{salary.role}</td>
                  <td className="py-3 px-4">{salary.department}</td>
                  <td className="py-3 px-4 text-right">₹{salary.basic.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{salary.hra.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{salary.allowances.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{salary.deductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">₹{salary.netSalary.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(salary.status)}`}>
                      {salary.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewSalaryDetails(salary)}
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

      <AddSalaryModal 
        isOpen={isAddSalaryModalOpen}
        onClose={() => setIsAddSalaryModalOpen(false)}
        onSave={handleAddSalary}
        staffMembers={staffMembers}
      />

      <SalaryDetailsModal
        isOpen={isSalaryDetailsModalOpen}
        onClose={() => setIsSalaryDetailsModalOpen(false)}
        salaryData={selectedSalary}
        onStatusChange={handleSalaryStatusChange}
        onSalaryUpdate={handleSalaryUpdate}
      />
    </div>
  );
};

export default SalaryManagement;
