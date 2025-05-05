
import React, { useState } from 'react';
import { Calendar, Download, DollarSign, CreditCard, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const StaffSalary = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('May 2025');
  const [showSlipDialog, setShowSlipDialog] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  
  const months = ['May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025', 'December 2024'];
  
  const salaryHistory = [
    {
      id: 1,
      month: 'May 2025',
      basic: 35000,
      hra: 10000,
      allowances: 5000,
      deductions: 5000,
      netSalary: 45000,
      status: 'Paid',
      paidOn: '2025-05-01'
    },
    {
      id: 2,
      month: 'April 2025',
      basic: 35000,
      hra: 10000,
      allowances: 5000,
      deductions: 5000,
      netSalary: 45000,
      status: 'Paid',
      paidOn: '2025-04-01'
    },
    {
      id: 3,
      month: 'March 2025',
      basic: 35000,
      hra: 10000,
      allowances: 5000,
      deductions: 5000,
      netSalary: 45000,
      status: 'Paid',
      paidOn: '2025-03-01'
    }
  ];
  
  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setShowSlipDialog(true);
  };
  
  const handleDownloadSlip = (slip) => {
    toast({
      title: "Downloading Salary Slip",
      description: `Salary slip for ${slip.month} is being downloaded`
    });
  };
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter salary history by selected month
  const filteredHistory = salaryHistory.filter(slip => 
    selectedMonth === 'all' || slip.month === selectedMonth
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Staff Salary Information</h1>
        <p className="text-gray-500">View your salary details and download salary slips</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-soft-green">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Monthly Salary</p>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-semibold mt-1">₹45,000</p>
          <p className="text-xs text-gray-500 mt-1">Last credited on May 1, 2025</p>
        </Card>
        
        <Card className="p-4 bg-soft-blue">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">YTD Earnings</p>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold mt-1">₹2,25,000</p>
          <p className="text-xs text-gray-500 mt-1">Total earnings in 2025</p>
        </Card>
        
        <Card className="p-4 bg-soft-purple">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Tax Deducted</p>
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold mt-1">₹25,000</p>
          <p className="text-xs text-gray-500 mt-1">Total tax deducted in 2025</p>
        </Card>
      </div>
      
      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">Month:</span>
            <Select 
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">HRA</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell>{slip.month}</TableCell>
                    <TableCell className="text-right">₹{slip.basic.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{slip.hra.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{slip.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{slip.deductions.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">₹{slip.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(slip.status)}`}>
                        {slip.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewSlip(slip)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex gap-1 items-center"
                          onClick={() => handleDownloadSlip(slip)}
                        >
                          <Download size={14} />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No salary records found for the selected month.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Salary Slip Dialog */}
      <Dialog open={showSlipDialog} onOpenChange={setShowSlipDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Salary Slip - {selectedSlip?.month}</DialogTitle>
          </DialogHeader>
          
          {selectedSlip && (
            <div className="space-y-6 pt-4">
              <div className="p-4 border rounded-md">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">Valley Public School</h2>
                  <p className="text-sm text-gray-500">123 Education Street, New York</p>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Salary Slip - {selectedSlip.month}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p><span className="font-medium">Employee Name:</span> Robert Wilson</p>
                    <p><span className="font-medium">Employee ID:</span> EMP-1024</p>
                    <p><span className="font-medium">Department:</span> Administration</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Designation:</span> Administrative Staff</p>
                    <p><span className="font-medium">Bank Account:</span> XXXX-XXXX-1234</p>
                    <p><span className="font-medium">Payment Date:</span> {selectedSlip.paidOn}</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Earnings</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Basic Salary</span>
                          <span>₹{selectedSlip.basic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HRA</span>
                          <span>₹{selectedSlip.hra.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DA</span>
                          <span>₹{(selectedSlip.allowances * 0.4).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conveyance</span>
                          <span>₹{(selectedSlip.allowances * 0.3).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medical Allowance</span>
                          <span>₹{(selectedSlip.allowances * 0.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Deductions</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Provident Fund</span>
                          <span>₹{(selectedSlip.deductions * 0.5).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Professional Tax</span>
                          <span>₹{(selectedSlip.deductions * 0.15).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Income Tax</span>
                          <span>₹{(selectedSlip.deductions * 0.3).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Deductions</span>
                          <span>₹{(selectedSlip.deductions * 0.05).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between font-semibold">
                  <span>Net Pay</span>
                  <span>₹{selectedSlip.netSalary.toLocaleString()}</span>
                </div>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>This is a computer-generated document. No signature required.</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="flex gap-2 items-center"
                  onClick={() => handleDownloadSlip(selectedSlip)}
                >
                  <Download size={16} />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffSalary;
