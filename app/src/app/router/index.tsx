import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { DealsPage } from '../../pages/DealsPage';
import { TasksPage } from '../../pages/TasksPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { SettingsPage } from '../../pages/SettingsPage';

// Auth Imports
import { AuthProvider } from '../../features/auth/AuthContext';
import { AuthLayout } from '../../features/auth/AuthLayout';
import { LoginPage } from '../../features/auth/LoginPage';
import { RegisterPage } from '../../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../../features/auth/ForgotPasswordPage';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute';

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Authentication Routes (Public / Unprotected) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected Dashboard/App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Application Page Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
