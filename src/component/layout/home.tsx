import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './sidebar';
import { Box } from "@mui/material";
import Chatbot from './chatbox/chatBot';

const PUBLIC_PATHS = ['/jobs'];

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();

  const isPublicRoute = PUBLIC_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  React.useEffect(() => {
    if (!user && !isPublicRoute) {
      navigate('/login', { replace: true });
    }
  }, [user, isPublicRoute, navigate]);

  const isAdminSidebarRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/users') ||
    (location.pathname.startsWith('/jobs') && user?.role?.toLowerCase() === 'admin');

  const showSidebar = !!user && (location.pathname.startsWith('/profile') || isAdminSidebarRoute);

  if (!user && !isPublicRoute) return null;

return (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      {showSidebar && (
        <Box sx={{ width: 280, flexShrink: 0 }}>
          <Sidebar />
        </Box>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: 8, // Adjust based on your Navbar height
          padding: 3,
          width: '100%',
          // Remove marginLeft: showSidebar ? '280px' : 0, 
        }}
      >
        <Outlet />
      </Box>
      <Chatbot />
    </Box>
  </Box>
);

}
