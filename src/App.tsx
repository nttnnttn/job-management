import React from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { setupApiClient } from './configs/setup-client';
import { NotificationProvider } from './contexts/NotificationContext';

// Page Imports
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
import PublicCvPage from './pages/profile/public';

setupApiClient();
const queryClient = new QueryClient();

// Define the MUI Theme (Matches your AntD config)
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#f8fafc', // Light grey-blue background typical for modern apps
    },
  },
  shape: {
    borderRadius: 12, // Global border radius
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // AntD borderRadiusLG equivalent
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none', // Prevents all-caps buttons (standard for antd-style)
        },
      },
    },
  },
});

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/jobs" /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'profile/public/:candidateId', element: <PublicCvPage /> },
  {
    element: <HomeLayout />,
    children: [
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
      
    ]
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline fixes browser inconsistencies and sets background color */}
      <CssBaseline /> 
      
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RouterProvider router={router} />
          <ToastContainer 
            position="top-right" 
            autoClose={2000} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            pauseOnHover 
          />
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
