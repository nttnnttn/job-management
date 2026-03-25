import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./sidebar";

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();

  // 🔥 check login
  useEffect(() => {
    if (user === null) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // 🔥 chỉ show sidebar khi vào profile
  const showSidebar = location.pathname.startsWith("/profile");

  // chưa load xong user → không render
  if (user === null) return null;

  // chưa login → không render 
  if (!user) return null;

  return (
    <div>
      {/* Navbar luôn ở trên */}
      <Navbar />

      <div style={{ display: "flex" }}>
        {/* ✅ Sidebar chỉ hiện khi cần */}
        {showSidebar && <Sidebar />}

        {/* ✅ Content */}
        <div
          style={{
            marginTop: 70, // tránh bị navbar che
            marginLeft: showSidebar ? 250 : 0, // có sidebar thì đẩy content
            padding: 20,
            width: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
