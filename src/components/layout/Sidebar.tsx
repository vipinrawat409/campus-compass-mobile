
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings,
  Users,
  Clock,
  FileCheck,
  Bus,
  Bell,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Info,
  Bookmark,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
      roles: ['superadmin', 'admin', 'teacher', 'staff', 'student', 'parent']
    },
    {
      title: "Permission Management",
      icon: <Settings size={18} />,
      path: "/dashboard/permissions",
      roles: ['superadmin']
    },
    {
      title: "Theme Management",
      icon: <Settings size={18} />,
      path: "/dashboard/themes",
      roles: ['superadmin']
    },
    {
      title: "User Creation",
      icon: <Users size={18} />,
      path: "/dashboard/users",
      roles: ['superadmin']
    },
    {
      title: "User Management",
      icon: <Users size={18} />,
      path: "/dashboard/user-management",
      roles: ['admin']
    },
    {
      title: "Attendance Management",
      icon: <CheckCircle size={18} />,
      path: "/dashboard/attendance-management",
      roles: ['admin', 'teacher']
    },
    {
      title: "Salary Management",
      icon: <DollarSign size={18} />,
      path: "/dashboard/salary-management",
      roles: ['admin']
    },
    {
      title: "Leave Approval",
      icon: <FileCheck size={18} />,
      path: "/dashboard/leave-approval",
      roles: ['admin', 'teacher']
    },
    {
      title: "Transport Management",
      icon: <Bus size={18} />,
      path: "/dashboard/transport",
      roles: ['admin']
    },
    {
      title: "Notice Management",
      icon: <Bell size={18} />,
      path: "/dashboard/notices",
      roles: ['admin', 'teacher']
    },
    {
      title: "Time Table Management",
      icon: <Calendar size={18} />,
      path: "/dashboard/timetable-management",
      roles: ['admin']
    },
    {
      title: "Fees Management",
      icon: <DollarSign size={18} />,
      path: "/dashboard/fees",
      roles: ['admin']
    },
    {
      title: "Profile",
      icon: <User size={18} />,
      path: "/dashboard/profile",
      roles: ['teacher', 'staff', 'student', 'parent']
    },
    {
      title: "Attendance",
      icon: <CheckCircle size={18} />,
      path: "/dashboard/attendance",
      roles: ['student', 'parent']
    },
    {
      title: "Marks",
      icon: <FileText size={18} />,
      path: "/dashboard/marks",
      roles: ['student', 'parent']
    },
    {
      title: "Report",
      icon: <Info size={18} />,
      path: "/dashboard/report",
      roles: ['student', 'parent']
    },
    {
      title: "ID Card",
      icon: <Bookmark size={18} />,
      path: "/dashboard/id-card",
      roles: ['student']
    },
    {
      title: "Notice",
      icon: <Bell size={18} />,
      path: "/dashboard/notices-view",
      roles: ['student', 'parent']
    },
    {
      title: "Leave",
      icon: <Clock size={18} />,
      path: "/dashboard/leave",
      roles: ['teacher', 'parent']
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="h-[calc(100%-4rem)] overflow-y-auto py-4 px-2">
      <nav>
        <ul className="space-y-1">
          {filteredMenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "menu-item",
                  isActive && "menu-item-active"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
