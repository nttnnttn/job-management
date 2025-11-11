import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./component/login/page";
import RegisterPage from "./component/register/page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
