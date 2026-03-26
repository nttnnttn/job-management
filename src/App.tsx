import React from "react";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setupApiClient } from "./configs/setup-client";

import LoginPage from "./component/login/page";
import RegisterPage from "./component/register/page";
import HomeLayout from "./component/layout/home";

import UsersPage from "./pages/users/page";
import CandidatesPage from "./pages/candidates/page";

import JobListPage from "./pages/jobs/list/list";
import CreateJobPage from "./pages/jobs/create/create";
import UpdateJobPage from "./pages/jobs/update/update";

import ProfilePage from "./pages/profile/updateProfile";
import ProfileApplicationsPage from "./pages/profile/application-history";
// Setup API client (interceptor + baseURL)
setupApiClient();

// Tạo instance QueryClient
const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { element: <HomeLayout />, // The Parent Layout,
    children: [
      { path: "home", element: <h1>Home Page</h1> },
      { path: "users", element: <UsersPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "candidates", element: <CandidatesPage /> },
      { path: "jobs", element: <JobListPage />},
      { path: "jobs/create", element: <CreateJobPage /> },
      { path: "jobs/update/:id", element:<UpdateJobPage />},

      { path: "candidates/:jobId", element: <CandidatesPage /> },
      { path: "applications", element: <h1>Applications Page</h1> },
      { path: "profile/applications", element: <ProfileApplicationsPage /> },
    ]
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* Toast hiển thị toàn app */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover aria-label={undefined}      />
    </QueryClientProvider>
  );
}
