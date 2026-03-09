import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface IUserToken {
  sub: string;
  email: string;
  role: string;
}

interface User {
  _id: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // chưa login
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded: IUserToken = jwtDecode(token);

      // không phải admin
      if (decoded.role !== "admin") {
        navigate("/jobs");
        return;
      }

      fetchUsers(token);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách người dùng");
      }

      const data = await response.json();

      console.log("Users API:", data);

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.results)) {
        setUsers(data.results);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Đang tải danh sách...</p>;

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: 20 }}>👥 Danh sách người dùng</h2>

      {users.length === 0 ? (
        <p>Không có tài khoản nào</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Ngày tạo</th>
              <th>Cập nhật</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.active ? "✅" : "❌"}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>{new Date(u.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
