import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import { NotificationBell } from "../notifications/NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const role = user?.role?.toLowerCase?.() || "";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, cursor: "pointer", fontWeight: 700 }}
          onClick={() => navigate("/jobs")}
        >
          Job Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" component={NavLink} to="/jobs">
            Jobs
          </Button>
          {role === "admin" && (
            <>
              <Button color="inherit" component={NavLink} to="/admin">
                Dashboard
              </Button>
              <Button color="inherit" component={NavLink} to="/users">
                Users
              </Button>
              <Button color="inherit" component={NavLink} to="/admin/applications">
                Applications
              </Button>
            </>
          )}
          {role === "recruiter" && (
            <Button color="inherit" component={NavLink} to="/jobs/create">
              Create Job
            </Button>
          )}
          {user ? (
            <>
              <NotificationBell />
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar>{user.email ? user.email[0].toUpperCase() : "U"}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                >
                  Hồ sơ cá nhân
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
