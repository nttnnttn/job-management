import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { useAuth } from "../../hooks/useAuth";

export default function HomeLayout() {
  const navigate = useNavigate(); //điều hướng sang trang
  const user = useAuth();

  //kiểm tra đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

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
