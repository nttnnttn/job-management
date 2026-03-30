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
    navigate("/login");
  };

  // click ngoài → đóng menu
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
      <h2 className="text-lg font-bold">Job Management</h2>

      <div className="flex items-center gap-5">
        {role === "admin" && (
          <>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/candidates">Candidates</NavLink>
          </>
        )}

        {role === "candidate" && <NavLink to="/jobs">Jobs</NavLink>}

        {role === "recruiter" && (
          <>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/candidates">Candidates</NavLink>
          </>
        )}
         {/* Notifications */}
        <NotificationBell />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="font-medium hover:opacity-80"
          >
            👤 {user?.email}
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
      </div>
    </nav>
  );
}
