import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function HomeLayout() {
  const navigate = useNavigate(); //điều hướng sang trang

  //kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  //Navbar: cố định. Outlet: nội dung động
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px", padding: "20px" }}>
        <Outlet /> 
      </div>
    </div>
  );
}
