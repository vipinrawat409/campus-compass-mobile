
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SalaryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryData: {
    id: number;
    name: string;
    role: string;
    department: string;
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: string;
    paidOn: string;
  } | null;
  onStatusChange: (id: number, newStatus: string) => void;
  onSalaryUpdate: (id: number, updatedData: any) => void;
}

const SalaryDetailsModal = ({ 
  isOpen, 
  onClose, 
  salaryData,
  onStatusChange,
  onSalaryUpdate
}: SalaryDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const formSchema = z.object({
    basic: z.number().min(1, "Basic salary is required"),
    hra: z.number().min(0, "HRA cannot be negative"),
    allowances: z.number().min(0, "Allowances cannot be negative"),
    deductions: z.number().min(0, "Deductions cannot be negative"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basic: salaryData?.basic || 0,
      hra: salaryData?.hra || 0,
      allowances: salaryData?.allowances || 0,
      deductions: salaryData?.deductions || 0,
    },
  });

  React.useEffect(() => {
    if (salaryData) {
      form.reset({
        basic: salaryData.basic,
        hra: salaryData.hra,
        allowances: salaryData.allowances,
        deductions: salaryData.deductions,
      });
    }
  }, [salaryData, form]);

  const handleStatusChange = (status: string) => {
    if (salaryData) {
      onStatusChange(salaryData.id, status);
      toast(`Salary status changed to ${status}`, {
        description: `${salaryData.name}'s salary status has been updated.`
      });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!salaryData) return;
    
    const netSalary = values.basic + values.hra + values.allowances - values.deductions;
    
    const updatedData = {
      ...salaryData,
      ...values,
      netSalary
    };
    
    onSalaryUpdate(salaryData.id, updatedData);
    setIsEditing(false);
    
    toast("Salary details updated", {
      description: "The salary information has been successfully updated."
    });
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Salary Details</DialogTitle>
        </DialogHeader>
        
        {salaryData && (
          <div className="space-y-4">
            {!isEditing ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{salaryData.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(salaryData.status)}`}>
                    {salaryData.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{salaryData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{salaryData.department}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Salary Components</h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Basic</p>
                      <p className="font-medium">₹{salaryData.basic.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">HRA</p>
                      <p className="font-medium">₹{salaryData.hra.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Allowances</p>
                      <p className="font-medium">₹{salaryData.allowances.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deductions</p>
                      <p className="font-medium">₹{salaryData.deductions.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Net Salary</h4>
                      <p className="font-bold text-lg">₹{salaryData.netSalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                {salaryData.paidOn && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Calendar size={14} />
                    <span>Paid on: {new Date(salaryData.paidOn).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  </div>
                  
                  <div className="space-x-2">
                    {salaryData.status !== 'Paid' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange('Paid')}
                      >
                        <Check size={16} className="mr-1" />
                        Mark as Paid
                      </Button>
                    )}
                    {salaryData.status !== 'Pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-yellow-600"
                        onClick={() => handleStatusChange('Pending')}
                      >
                        Mark as Pending
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="basic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HRA</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="allowances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowances</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deductions</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalaryDetailsModal;
