import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authControllerSignIn } from "../../api-client";
import { jwtDecode } from "jwt-decode";
import { IUserToken } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //Ngăn reload

    try {
    const res = await authControllerSignIn({ body: {email, password}});

    if (res.data) {
      // Xóa dấu ngoặc kép dư nếu có
      const cleanedToken = res.data.access_token;

      const token = res.data.access_token;

      // ✅ Lưu token chính xác
      localStorage.setItem("access_token", cleanedToken);
      console.log("Access Token lưu vào localStorage:", cleanedToken);

      // decode token
        const decoded = jwtDecode<IUserToken>(token);

      // nếu là candidate → lưu candidate_id
        localStorage.setItem("user_id", decoded.userId);

      setMessage("✅ Đăng nhập thành công!");
      setTimeout(() => navigate("/home"), 1500); //Chuyển hướng
    } else {
      // ❌ Sửa lỗi cú pháp ở đây (dòng này đang sai trong code cũ)
      setMessage("❌ Sai email hoặc mật khẩu!");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    setMessage("❌ Không thể kết nối tới server!");
  }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>

      <form onSubmit={handleLogin} style={styles.form}>
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

        <button type="submit" style={{ ...styles.button, ...styles.loginBtn }}>
          Đăng nhập
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{ ...styles.button, ...styles.registerBtn }}
        >
          Đăng ký tài khoản mới
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", color: "#333", textAlign: "center" }}>
          {message}
        </p>
      )}
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
  loginBtn: { backgroundColor: "#007bff", color: "#fff" },
  registerBtn: { backgroundColor: "#f0f0f0", color: "#333" },
};
