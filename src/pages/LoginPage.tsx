
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/components/ui/sonner";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
                placeholder="Enter your username (e.g. SA201, TC123)"
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
                (Use "password" as the password for demo)
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
        
        <div className="mt-5 text-center text-sm text-gray-500">
          <p>Demo user credentials:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-left pl-4">
              <p>SA201 - Super Admin</p>
              <p>AD201 - Admin</p>
              <p>TC201 - Teacher</p>
            </div>
            <div className="text-left">
              <p>ST201 - Staff</p>
              <p>SD201 - Student</p>
              <p>PR201 - Parent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
