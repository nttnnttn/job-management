import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "../notifications/NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const role = user?.role?.toLowerCase?.() || "";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center bg-blue-600 px-8 py-3 fixed top-0 left-0 right-0 z-50 text-white">
      <h2
        className="text-lg font-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/jobs")}
      >
        Job Management
      </h2>

      <div className="flex items-center gap-5">
        <NavLink className="text-white!" to="/jobs">
          Jobs
        </NavLink>
        {role === "admin" && (
          <>
            <NavLink to="/admin" className="text-white!">
              Dashboard
            </NavLink>
            <NavLink className="text-white!" to="/users">
              Users
            </NavLink>
            <NavLink className="text-white!" to="/admin/applications">
              Applications
            </NavLink>
          </>
        )}

        {role === "recruiter" && (
          <NavLink className="text-white!" to="/jobs/create">
            Create Job
          </NavLink>
        )}

        {user ? (
          <>
            <NotificationBell />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="font-medium hover:opacity-80"
              >
                👤 {user.email}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                  >
                    Hồ sơ cá nhân
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
            <button onClick={() => navigate("/register")}>Đăng ký</button>
          </>
        )}
      </div>
    </nav>
  );
}
