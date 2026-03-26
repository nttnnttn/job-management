import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const user = useAuth();

  const role = (user?.role || "").toLowerCase();

  let menu = [
    { label: "Thông tin cá nhân", path: "/profile" },
  ];

  // Candidate
  if (role === "candidate") {
    menu.push(
      { label: "Quản lý CV", path: "/profile/cv" },
      { label: "Lịch sử ứng tuyển", path: "/profile/applications" }
    );
  }

  //  Recruiter
  if (role === "recruiter") {
    menu.push(
      { label: "Ứng viên đã apply", path: "/profile/applications" }
    );
  }

  //  Admin
  if (role === "admin") {
    menu.push(
      { label: "Quản lý người dùng", path: "/users" },
      { label: "Quản lý job", path: "/jobs" }
    );
  }

  return (
    <div className="w-[250px] h-screen border-r bg-white fixed left-0 top-0 p-5">
      <h3 className="text-lg font-semibold mb-6">👤 Profile</h3>

      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md transition-all
                ${
                  active
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
function userAuth() {
  throw new Error("Function not implemented.");
}

