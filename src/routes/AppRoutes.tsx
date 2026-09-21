import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Lazy loaded page components
const Login = lazy(() => import('../features/auth/Login'));
const DashboardOverviewPage = lazy(() => import('../features/dashboard/DashboardOverviewPage'));
const CustomersPage = lazy(() => import('../features/customers/CustomersPage'));
const DealsPage = lazy(() => import('../features/deals/DealsPage'));
const AnalyticsPage = lazy(() => import('../features/analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage tip="Loading Apex CRM..." />}>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverviewPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
