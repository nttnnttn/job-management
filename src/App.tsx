import React from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { App as AntApp, ConfigProvider } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

import { setupApiClient } from './configs/setup-client';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './component/login/page';
import RegisterPage from './component/register/page';
import HomeLayout from './component/layout/home';
import UsersPage from './pages/users/page';
import CandidatesPage from './pages/candidates/page';
import JobListPage from './pages/jobs/list/list';
import CreateJobPage from './pages/jobs/create/create';
import UpdateJobPage from './pages/jobs/update/update';
import JobDetailPage from './pages/jobs/detail/detail';
import ProfilePage from './pages/profile/updateProfile';
import ProfileApplicationsPage from './pages/profile/application-history';
import AdminDashboardPage from './pages/admin/dashboard';
import AdminApplicationsPage from './pages/admin/applications';

setupApiClient();
const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/jobs" /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { element: <HomeLayout />, children: [
      { path: 'home', element: <Navigate to="/jobs" /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/applications', element: <AdminApplicationsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'candidates', element: <CandidatesPage /> },
      { path: 'jobs', element: <JobListPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'jobs/create', element: <CreateJobPage /> },
      { path: 'jobs/update/:id', element: <UpdateJobPage /> },
      { path: 'candidates/:jobId', element: <CandidatesPage /> },
      { path: 'profile/applications', element: <ProfileApplicationsPage /> },
  ]},
]);

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#2563eb', borderRadius: 12, fontFamily: 'Inter, Arial, sans-serif' }, components: { Card: { borderRadiusLG: 16 }, Button: { borderRadius: 10 } } }}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <RouterProvider router={router} />
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover aria-label={undefined} />
          </NotificationProvider>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
