import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { AdminLayout } from '@(admin)/layout';
import { RoleBasedRedirect } from './role-based-redirect';
import Notifications from '@/app/admin/pages/notifications';
import Inbox from '@/app/admin/pages/inbox';
import CoursesInbox from '@/app/admin/pages/courses-inbox';

// Lazy loaded components
const CatalogManagement = React.lazy(() => import('@(admin)/pages/catalog-management'));
const CourseManagement = React.lazy(() => import('@(admin)/pages/course-management'));
const Roles = React.lazy(() => import('@(admin)/pages/roles'));
const Orders = React.lazy(() => import('@(admin)/pages/orders'));
const Codes = React.lazy(() => import('@(admin)/pages/codes'));
const ChangePasswordRequests = React.lazy(() => import('@(admin)/pages/change-password-requests'));
const UsersManagement = React.lazy(() => import('@(admin)/pages/users-management'));
const ContentManagement = React.lazy(() => import('@(admin)/pages/content-management'));
const ActivityLog = React.lazy(() => import('@(admin)/pages/activity-log'));

const Home = React.lazy(() => import('@(admin)/pages/home'));

export const AdminRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute isAdminRoute />}>
      <Route Component={AdminLayout}>
        <Route
          path="/users"
          element={
            <Suspense fallback={<>Loading...</>}>
              <UsersManagement />
            </Suspense>
          }
        />
        <Route
          path="/catalog-management"
          element={
            <Suspense fallback={<>Loading...</>}>
              <CatalogManagement />
            </Suspense>
          }
        />
        <Route
          path="/course-management"
          element={
            <Suspense fallback={<>Loading...</>}>
              <CourseManagement />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Orders />
            </Suspense>
          }
        />
        <Route
          path="/change-password-requests"
          element={
            <Suspense fallback={<>Loading...</>}>
              <ChangePasswordRequests />
            </Suspense>
          }
        />
        <Route
          path="/roles"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Roles />
            </Suspense>
          }
        />
        <Route
          path="/codes"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Codes />
            </Suspense>
          }
        />
        <Route
          path="/admin-home"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/content-management"
          element={
            <Suspense fallback={<>Loading...</>}>
              <ContentManagement />
            </Suspense>
          }
        />
        <Route
          path="/notifications"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Notifications />
            </Suspense>
          }
        />
        <Route
          path="/inbox"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Inbox />
            </Suspense>
          }
        />
        <Route
          path="/courses-inbox"
          element={
            <Suspense fallback={<>Loading...</>}>
              <CoursesInbox />
            </Suspense>
          }
        />
        <Route
          path="/activity-log"
          element={
            <Suspense fallback={<>Loading...</>}>
              <ActivityLog />
            </Suspense>
          }
        />
        <Route path="/" element={<RoleBasedRedirect />} />
      </Route>
    </Route>
  </Routes>
);
