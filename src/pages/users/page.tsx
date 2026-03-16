import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { UserDto, usersControllerGetAllUsers } from "../../api-client";

export default function UsersPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {

    // chưa login
    if (!auth) {
      navigate("/login");
      return;
    }

    // không phải admin
    if (auth.role !== "admin") {
      navigate("/jobs");
      return;
    }

    fetchUsers();
  }, [auth, navigate]);

    const fetchUsers = async () => {
    try {
      const res = await usersControllerGetAllUsers();

      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data as UserDto[]);
      } else {
        setUsers([]);
      }
    } catch (err) {
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
              <tr key={String(u._id)}>
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
