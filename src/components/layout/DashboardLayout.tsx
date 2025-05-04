
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Close sidebar on route change (mobile) - but don't apply the effect on mount
  useEffect(() => {
    const isInitialMount = React.useRef(true);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      closeSidebar();
    }
  }, [location.pathname, closeSidebar]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get role-specific color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-orange-100 text-orange-800';
      case 'student': return 'bg-yellow-100 text-yellow-800';
      case 'parent': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay - when sidebar is open */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-200 lg:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      
      {/* Sidebar - mobile and desktop */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-40 transition-transform duration-200 shadow-lg lg:shadow-none lg:translate-x-0 lg:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="font-semibold text-primary text-lg">Campus Compass</div>
          <button 
            onClick={closeSidebar} 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 lg:ml-0 flex-1">
            {user.instituteName && (
              <div className="text-sm text-gray-500">{user.instituteName}</div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-sm text-right">
                <div className="font-medium">{user.name}</div>
                <div className={cn("text-xs px-2 py-0.5 rounded-full inline-block", getRoleColor(user.role))}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-md hover:bg-soft-red/20 text-red-600"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
