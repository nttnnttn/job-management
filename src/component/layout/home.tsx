import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './sidebar';

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
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        {showSidebar && <Sidebar />}
        <div
          style={{
            marginTop: 70,
            marginLeft: showSidebar ? 280 : 0,
            padding: 20,
            width: '100%',
            transition: 'margin-left 0.2s ease',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
