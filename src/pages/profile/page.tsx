import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { updateProfile, UpdateProfilePayload } from "../../api/users.api";
import { useProfile } from "../../hooks/users/useProfile";
export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { data, isLoading, refetch } = useProfile();

  const [form, setForm] = useState<UpdateProfilePayload>({
    fullName: "",
    phone: "",
  });

  const [loading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 check login
  useEffect(() => {
    if (auth === null) return;

    if (!auth) {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  // 🔥 load profile
  useEffect(() => {
    if (data) {
      setForm({
        fullName: typeof data.fullName === "string" ? data.fullName : "",
        phone: typeof data.phone === "string" ? data.phone : "",
      });
    }
  }, [data]);

  // 🔥 handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      await updateProfile(form);

      setMessage("✅ Cập nhật thành công");
      refetch(); // reload data
    } catch (err) {
      console.error(err);
      setMessage("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return null;

  if (loading) {
    return <p style={{ textAlign: "center" }}>Đang tải thông tin...</p>;
  }

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: 20 }}>👤 Thông tin cá nhân</h2>

      <form onSubmit={handleSubmit}>
        {/* Email (readonly) */}
        <div style={{ marginBottom: 15 }}>
          <label>Email</label>
          <input
            type="text"
            value={auth.email}
            disabled
            style={styles.input}
          />
        </div>

        {/* Full Name */}
        <div style={{ marginBottom: 15 }}>
          <label>Họ tên</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 15 }}>
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? "Đang lưu..." : "Cập nhật"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 15, textAlign: "center" }}>{message}</p>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
