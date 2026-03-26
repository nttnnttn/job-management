import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/users/useProfile";
import { useUpdateProfile } from "../../hooks/users/useUpdateProfile";
import { toast } from "react-toastify";

export default function ProfileForm() {
  const { data, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  // 🔥 fill data từ API
  useEffect(() => {
    if (data) {
      setForm({
        fullName: typeof data.fullName === "string" ? data.fullName : "",
        phone: typeof data.phone === "string" ? data.phone : "",
        email: typeof data.email === "string" ? data.email : "",
      });
    }
  }, [data]);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = () => {
    if (!form.fullName || !form.email) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    mutate(form, {
      onSuccess: () => {
        toast.success("Cập nhật thành công 🎉");
      },
      onError: () => {
        toast.error("Cập nhật thất bại ❌");
      },
    });
  };

  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Đang tải profile...</p>;
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Thông tin cá nhân</h2>

      {/* Full name */}
      <div style={{ marginBottom: 15 }}>
        <label>Họ và tên *</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: 15 }}>
        <label>Số điện thoại</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: 15 }}>
        <label>Email *</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={isPending}
        style={{
          width: "100%",
          padding: 10,
          background: isPending ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        {isPending ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </div>
  );
}
