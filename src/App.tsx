
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PermissionManagement from "./pages/permissions/PermissionManagement";
import ThemeManagement from "./pages/themes/ThemeManagement";
import UserCreation from "./pages/users/UserCreation";
import UserManagement from "./pages/admin/UserManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import SalaryManagement from "./pages/admin/SalaryManagement";
import LeaveApproval from "./pages/admin/LeaveApproval";
import TransportManagement from "./pages/admin/TransportManagement";
import NoticeManagement from "./pages/admin/NoticeManagement";
import TimeTableManagement from "./pages/admin/TimeTableManagement";
import FeesManagement from "./pages/admin/FeesManagement";
import Profile from "./pages/common/Profile";
import Attendance from "./pages/student/Attendance";
import Marks from "./pages/student/Marks";
import Report from "./pages/student/Report";
import IDCard from "./pages/student/IDCard";
import NoticesView from "./pages/common/NoticesView";
import Leave from "./pages/common/Leave";
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
                  <Route path="permissions" element={<PermissionManagement />} />
                  <Route path="themes" element={<ThemeManagement />} />
                  <Route path="users" element={<UserCreation />} />
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="attendance-management" element={<AttendanceManagement />} />
                  <Route path="salary-management" element={<SalaryManagement />} />
                  <Route path="leave-approval" element={<LeaveApproval />} />
                  <Route path="transport" element={<TransportManagement />} />
                  <Route path="notices" element={<NoticeManagement />} />
                  <Route path="timetable-management" element={<TimeTableManagement />} />
                  <Route path="fees" element={<FeesManagement />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="marks" element={<Marks />} />
                  <Route path="report" element={<Report />} />
                  <Route path="id-card" element={<IDCard />} />
                  <Route path="notices-view" element={<NoticesView />} />
                  <Route path="leave" element={<Leave />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <SonnerToaster />
            </ThemeProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
