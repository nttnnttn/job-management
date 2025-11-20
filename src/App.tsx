import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./component/login/page";
import RegisterPage from "./component/register/page";
import HomeLayout from "./component/layout/home";

import UsersPage from "./pages/users/page";
import CandidatesPage from "./pages/candidates/page";

import JobListPage from "./pages/jobs/list/list";
import CreateJobPage from "./pages/jobs/create/create";
import UpdateJobPage from "./pages/jobs/update/update";

export default function App() {
  return (
    <Routes>
      {/* Khi mở root → tự chuyển về trang login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes sau khi login (có Navbar) */}
      <Route element={<HomeLayout />}>
        <Route path="/home" element={<h1>Home Page</h1>} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/create" element={<CreateJobPage />} />
        <Route path="/jobs/update/:id" element={<UpdateJobPage />} />
      </Route>
    </Routes>
  );
}
