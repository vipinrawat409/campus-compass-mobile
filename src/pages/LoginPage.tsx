
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/components/ui/sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { INSTITUTES } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast("Error", {
        description: "Please enter both username and password"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine role based on username prefix
  const determineRole = () => {
    if (!username || username.length < 2) return '';

    const prefix = username.substring(0, 2).toUpperCase();
    
    switch (prefix) {
      case 'SA': return 'Super Admin';
      case 'AD': return 'Admin';
      case 'TC': return 'Teacher';
      case 'ST': return 'Staff';
      case 'SD': return 'Student';
      case 'PR': return 'Parent';
      default: return '';
    }
  };

  const role = determineRole();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Campus Compass</h1>
          <p className="text-gray-600 mt-2">Student Management System</p>
        </div>
        
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username (e.g. SA001, AD001)"
                className="rounded-lg"
                autoComplete="username"
              />
              {role && (
                <p className="text-sm text-primary font-medium">
                  Role detected: {role}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-lg"
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-500 italic">
                (Use "password" as the password for all demo accounts)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
        
        <div className="mt-5">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowCredentials(!showCredentials)}
          >
            {showCredentials ? "Hide Demo Credentials" : "Show Demo Credentials"}
          </Button>
          
          {showCredentials && (
            <div className="mt-4 bg-white shadow-sm rounded-xl border border-gray-100 p-4 overflow-hidden">
              <h3 className="font-medium mb-2">Available Demo Accounts</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Institute</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">SA001</TableCell>
                      <TableCell>Super Admin</TableCell>
                      <TableCell>All Institutes</TableCell>
                    </TableRow>
                    
                    {INSTITUTES.map(institute => (
                      <React.Fragment key={institute.id}>
                        <TableRow>
                          <TableCell className="font-medium">AD00{institute.id}</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>{institute.name}</TableCell>
                        </TableRow>
                        
                        {institute.id <= 3 && (
                          <TableRow>
                            <TableCell className="font-medium">TC00{institute.id}</TableCell>
                            <TableCell>Teacher</TableCell>
                            <TableCell>{institute.name}</TableCell>
                          </TableRow>
                        )}
                        
                        {institute.id === 1 && (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">ST001</TableCell>
                              <TableCell>Staff</TableCell>
                              <TableCell>{institute.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">SD001</TableCell>
                              <TableCell>Student</TableCell>
                              <TableCell>{institute.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">PR001</TableCell>
                              <TableCell>Parent</TableCell>
                              <TableCell>{institute.name}</TableCell>
                            </TableRow>
                          </>
                        )}

                        {institute.id === 2 && (
                          <TableRow>
                            <TableCell className="font-medium">SD002</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>{institute.name}</TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
