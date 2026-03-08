import React from "react";
import { Routes, Route, Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "./component/login/page";
import RegisterPage from "./component/register/page";
import HomeLayout from "./component/layout/home";

import UsersPage from "./pages/users/page";
import CandidatesPage from "./pages/candidates/page";

import JobListPage from "./pages/jobs/list/list";
import CreateJobPage from "./pages/jobs/create/create";
import UpdateJobPage from "./pages/jobs/update/update";
import path from "path";

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
      { path: "candidates", element: <CandidatesPage /> },
      { path: "jobs", element: <JobListPage />},
      { path: "jobs/create", element: <CreateJobPage /> },
      { path: "jobs/update/:id", element:<UpdateJobPage />}
    ]
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
