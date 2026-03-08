import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      navigate("/jobs");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải danh sách...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>👥 Danh sách người dùng</h2>

      {users.length === 0 ? (
        <p>Không có tài khoản nào</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.email}</td>
                <td>
                  {new Date(
                    u.createdAt || u.created_date
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
