import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { label: "Thông tin cá nhân", path: "/profile" },
    { label: "Quản lý CV", path: "/profile/cv" },
    { label: "Lịch sử ứng tuyển", path: "/profile/applications" },
  ];

  return (
    <div className="w-[250px] h-screen border-r bg-white fixed left-0 top-0 p-5">
      <h3 className="text-lg font-semibold mb-6">👤 Profile</h3>

      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const active = location.pathname === item.path;

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
