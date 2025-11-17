import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function HomeLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
