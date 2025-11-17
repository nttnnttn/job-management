import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Job Management</h2>
      <div style={styles.links}>
        <NavLink to="/users" style={styles.link}>
          Users
        </NavLink>
        <NavLink to="/candidates" style={styles.link}>
          Candidates
        </NavLink>
        <NavLink to="/jobs" style={styles.link}>
          Jobs
        </NavLink>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "10px 30px",
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    color: "#fff",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: 500,
  },
  logoutBtn: {
    backgroundColor: "#f44336",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
};
