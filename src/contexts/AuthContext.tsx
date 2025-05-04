
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'staff' | 'student' | 'parent';

// Define user interface
export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  instituteName?: string;
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Helper to determine role based on username
  const getRoleFromUsername = (username: string): UserRole => {
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

  const login = async (username: string, password: string) => {
    try {
      // This is a mock - in a real app, you'd validate against a backend
      if (password !== 'password') {
        toast("Invalid credentials", {
          description: "Please check your username and password"
        });
        return false;
      }

      const role = getRoleFromUsername(username);
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        username,
        role,
      };

      // Add institute name for superadmin and admin roles
      if (role === 'superadmin') {
        mockUser.instituteName = 'All Institutes';
      } else if (role === 'admin') {
        mockUser.instituteName = 'Valley Public School';
      }

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast("Login successful", {
        description: `Welcome back, ${mockUser.name}`
      });
      
      return true;
    } catch (error) {
      toast("Login failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
    toast("Logged out", {
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
