
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/toast";

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'staff' | 'student' | 'parent';

// Define user interface
export interface User {
  username: string;
  role: UserRole;
  name: string;
  instituteId?: string;
  instituteName?: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create context provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Determine user role based on username prefix
  const determineRole = (username: string): UserRole => {
    const prefix = username.substring(0, 2).toUpperCase();
    
    switch (prefix) {
      case 'SA': return 'superadmin';
      case 'AD': return 'admin';
      case 'TC': return 'teacher';
      case 'ST': return 'staff';
      case 'SD': return 'student';
      case 'PR': return 'parent';
      default: throw new Error('Invalid username format');
    }
  };

  // Mock login function that will be replaced with real API calls later
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // This is a mock - in a real app, you'd validate against a backend
      if (password !== 'password') {
        toast({
          title: "Invalid credentials",
          description: "Please check your username and password",
          variant: "destructive",
        });
        return false;
      }

      // Determine user role from username prefix
      const role = determineRole(username);
      
      // Create mock user based on role
      const mockUser: User = {
        username,
        role,
        name: getMockName(role, username),
        instituteId: role === 'superadmin' ? undefined : 'inst-001',
        instituteName: role === 'superadmin' ? undefined : 'Valley Public School'
      };

      // Set user in state and local storage
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Helper function to generate mock names
  const getMockName = (role: UserRole, username: string): string => {
    const id = username.substring(2);
    switch (role) {
      case 'superadmin': return `Super Admin ${id}`;
      case 'admin': return `Admin ${id}`;
      case 'teacher': return `Teacher ${id}`;
      case 'staff': return `Staff ${id}`;
      case 'student': return `Student ${id}`;
      case 'parent': return `Parent ${id}`;
      default: return `User ${id}`;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
