import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../types/user";
import client from "../../api/client";
import { CreateUserDto } from "../../api/Api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [message, setMessage] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra khớp mật khẩu trước khi gửi API
    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }
    // const res = await client.users.authControllerSignIn({email, password});

    try {
      const body: CreateUserDto = {
        password: password,
        email: email,
        role: role
      }
      const res = await client.users.authControllerRegister(body);
      /*const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      }); */

      console.log(res);
      if (res.ok) {
        navigate("/login", {
          state: { message: "Đăng ký thành công! Vui lòng đăng nhập." }
        });
      } else {
        setMessage(`❌ ${ "Không thể đăng ký"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Không thể kết nối tới server!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký tài khoản</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Nhập email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            placeholder="Nhập mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Nhập lại mật khẩu"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Vai trò</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            style={styles.input}
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button type="submit" style={{ ...styles.button, ...styles.registerBtn }}>
          Đăng ký
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{ ...styles.button, ...styles.loginBtn }}
        >
          Quay lại đăng nhập
        </button>
      </form>

      {message && <p style={{ marginTop: "20px", color: "#333" }}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
  },
  inputGroup: { marginBottom: "16px" },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
  registerBtn: { backgroundColor: "#007bff", color: "#fff" },
  loginBtn: { backgroundColor: "#f0f0f0", color: "#333" },
};
