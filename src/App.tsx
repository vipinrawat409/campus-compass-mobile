
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="permissions" element={<div className="p-4">Permission Management (coming soon)</div>} />
                  <Route path="themes" element={<div className="p-4">Theme Management (coming soon)</div>} />
                  <Route path="users" element={<div className="p-4">User Creation (coming soon)</div>} />
                  <Route path="user-management" element={<div className="p-4">User Management (coming soon)</div>} />
                  <Route path="attendance-management" element={<div className="p-4">Attendance Management (coming soon)</div>} />
                  <Route path="salary-management" element={<div className="p-4">Salary Management (coming soon)</div>} />
                  <Route path="leave-approval" element={<div className="p-4">Leave Approval (coming soon)</div>} />
                  <Route path="transport" element={<div className="p-4">Transport Management (coming soon)</div>} />
                  <Route path="notices" element={<div className="p-4">Notice Management (coming soon)</div>} />
                  <Route path="timetable-management" element={<div className="p-4">Time Table Management (coming soon)</div>} />
                  <Route path="fees" element={<div className="p-4">Fees Management (coming soon)</div>} />
                  <Route path="profile" element={<div className="p-4">Profile (coming soon)</div>} />
                  <Route path="attendance" element={<div className="p-4">Attendance (coming soon)</div>} />
                  <Route path="marks" element={<div className="p-4">Marks (coming soon)</div>} />
                  <Route path="report" element={<div className="p-4">Report (coming soon)</div>} />
                  <Route path="id-card" element={<div className="p-4">ID Card (coming soon)</div>} />
                  <Route path="notices-view" element={<div className="p-4">Notices (coming soon)</div>} />
                  <Route path="leave" element={<div className="p-4">Leave (coming soon)</div>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </ThemeProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
