
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { ThemeColor } from './ThemeContext';

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'staff' | 'student' | 'parent';

// Define institute interface
export interface Institute {
  id: number;
  name: string;
  location: string;
  theme: ThemeColor;
}

// List of institutes
export const INSTITUTES: Institute[] = [
  { id: 1, name: "Valley Public School", location: "New York", theme: "blue" },
  { id: 2, name: "Greenwood Academy", location: "Chicago", theme: "green" },
  { id: 3, name: "Sunshine Elementary", location: "San Francisco", theme: "purple" },
  { id: 4, name: "Oakridge High School", location: "Los Angeles", theme: "peach" },
  { id: 5, name: "Riverdale College", location: "Boston", theme: "orange" }
];

// Define user interface
export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  instituteId?: number;
  instituteName?: string;
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Sample users for demo
const DEMO_USERS: Record<string, User> = {
  // Super Admin
  "SA001": {
    id: "user-sa001",
    name: "Super Admin",
    username: "SA001",
    role: "superadmin"
  },
  
  // Valley Public School (ID: 1)
  "AD001": {
    id: "user-ad001",
    name: "Valley Admin",
    username: "AD001",
    role: "admin",
    instituteId: 1,
    instituteName: "Valley Public School"
  },
  "TC001": {
    id: "user-tc001",
    name: "John Smith",
    username: "TC001",
    role: "teacher",
    instituteId: 1,
    instituteName: "Valley Public School"
  },
  "ST001": {
    id: "user-st001",
    name: "Mike Johnson",
    username: "ST001",
    role: "staff",
    instituteId: 1,
    instituteName: "Valley Public School"
  },
  "SD001": {
    id: "user-sd001",
    name: "Emma Wilson",
    username: "SD001",
    role: "student",
    instituteId: 1,
    instituteName: "Valley Public School"
  },
  "PR001": {
    id: "user-pr001",
    name: "Sarah Wilson",
    username: "PR001",
    role: "parent",
    instituteId: 1,
    instituteName: "Valley Public School"
  },
  
  // Greenwood Academy (ID: 2)
  "AD002": {
    id: "user-ad002",
    name: "Greenwood Admin",
    username: "AD002",
    role: "admin",
    instituteId: 2,
    instituteName: "Greenwood Academy"
  },
  "TC002": {
    id: "user-tc002",
    name: "Emily Johnson",
    username: "TC002",
    role: "teacher",
    instituteId: 2,
    instituteName: "Greenwood Academy"
  },
  "SD002": {
    id: "user-sd002",
    name: "Jake Brown",
    username: "SD002",
    role: "student",
    instituteId: 2,
    instituteName: "Greenwood Academy"
  },
  
  // Sunshine Elementary (ID: 3)
  "AD003": {
    id: "user-ad003",
    name: "Sunshine Admin",
    username: "AD003",
    role: "admin",
    instituteId: 3,
    instituteName: "Sunshine Elementary"
  },
  "TC003": {
    id: "user-tc003",
    name: "Robert Davis",
    username: "TC003",
    role: "teacher",
    instituteId: 3,
    instituteName: "Sunshine Elementary"
  },
  
  // Oakridge High School (ID: 4)
  "AD004": {
    id: "user-ad004",
    name: "Oakridge Admin",
    username: "AD004", 
    role: "admin",
    instituteId: 4,
    instituteName: "Oakridge High School"
  },
  
  // Riverdale College (ID: 5)
  "AD005": {
    id: "user-ad005",
    name: "Riverdale Admin",
    username: "AD005",
    role: "admin", 
    instituteId: 5,
    instituteName: "Riverdale College"
  }
};

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

  const login = async (username: string, password: string) => {
    try {
      // For demo purposes, any password works
      if (password !== 'password') {
        toast("Invalid credentials", {
          description: "Please check your username and password"
        });
        return false;
      }

      // Find the user in our demo users
      const demoUser = DEMO_USERS[username];
      
      if (!demoUser) {
        toast("User not found", {
          description: "No user found with that username"
        });
        return false;
      }
      
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      toast("Login successful", {
        description: `Welcome back, ${demoUser.name}`
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
