import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const { Sider } = Layout;
const { Text } = Typography;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth();
  const role = (user?.role || "").toLowerCase();

  const items = useMemo(() => {
    if (role === "admin") {
      return [
        { key: "/admin", icon: <AppstoreOutlined />, label: "Dashboard" },
        { key: "/users", icon: <UserOutlined />, label: "Quản lý người dùng" },
        { key: "/jobs", icon: <FileTextOutlined />, label: "Quản lý job" },
        {
          key: "/admin/applications",
          icon: <TeamOutlined />,
          label: "Danh sách apply",
        },
      ];
    }

    const profileItems = [
      {
        key: "/profile",
        icon: <ProfileOutlined />,
        label: "Thông tin cá nhân",
      },
    ];
    if (role === "candidate") {
      profileItems.push({
        key: "/profile/applications",
        icon: <FileTextOutlined />,
        label: "Lịch sử ứng tuyển",
      });
    }
    return profileItems;
  }, [role]);

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key ||
    items[0]?.key;

  return (
    <Sider
      width={280}
      style={{
        background: "#fff",
        position: "fixed",
        left: 0,
        top: 70,
        bottom: 0,
        borderRight: "1px solid #f0f0f0",
        overflow: "auto",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0, paddingTop: 12 }}
      />
    </Sider>
  );
}
