import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import {
  DashboardOutlined,
  GroupOutlined,
  PersonOutlineOutlined,
  DescriptionOutlined,
  AccountCircleOutlined,
  HistoryEduOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth();
  const role = (user?.role || "").toLowerCase();

  const items = useMemo(() => {
    if (role === "admin") {
      return [
        { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/users", icon: <PersonOutlineOutlined />, label: "Quản lý người dùng" },
        { key: "/jobs", icon: <DescriptionOutlined />, label: "Quản lý job" },
        {
          key: "/admin/applications",
          icon: <GroupOutlined />,
          label: "Danh sách apply",
        },
      ];
    }

    const profileItems = [
      {
        key: "/profile",
        icon: <AccountCircleOutlined />,
        label: "Thông tin cá nhân",
      },
    ];
    if (role === "candidate") {
      profileItems.push({
        key: `/profile/public/${user?.userId}`,
        icon: <HistoryEduOutlined />,
        label: "Hồ sơ công khai",
      });
      profileItems.push({
        key: "/profile/applications",
        icon: <HistoryEduOutlined />,
        label: "Lịch sử ứng tuyển",
      });
    }
    return profileItems;
  }, [role]);

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key ||
    items[0]?.key;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 280,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 280,
          top: 70,
          boxSizing: "border-box",
          borderRight: "1px solid #f0f0f0",
        },
      }}
    >
      <Box sx={{ pt: 2 }}>
        <List>
          {items.map(({ key, icon, label }) => (
            <ListItem key={key} disablePadding>
              <ListItemButton
                selected={selectedKey === key}
                onClick={() => navigate(key)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
