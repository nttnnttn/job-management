import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { updateProfile, UpdateProfilePayload } from "../../api/users.api";
import { useProfile } from "../../hooks/users/useProfile";
import { useUpdateProfile } from "../../hooks/users/useUpdateProfile";
import { useMyApplications } from "../../hooks/job-candidate/useMyApplications";

type ProfileForm = {
  fullName: string;
  phone: string;
  level?: "intern" | "junior" | "middle" | "senior";
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { data, isLoading, refetch } = useProfile();
  const updateMutation = useUpdateProfile();

  const { data: myApplications, isLoading: loadingApps } = useMyApplications();

  const role = auth?.role?.toLowerCase();

  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    level: undefined,
  });

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
        fullName: data.fullName ?? "",
        phone: data.phone ?? "",
        level: data.level ?? undefined,
      });
    }
  }, [data]);

  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "level" ? (value || undefined) : value,
    }));
  };

  // check có thay đổi không
  const isChanged =
    form.fullName !== (data?.fullName || "") ||
    form.phone !== (data?.phone || "") ||
    form.level !== data?.level;
  // submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isChanged) return;

  // ✅ validate phone
  if (form.phone && form.phone.length < 9) {
    setMessage("❌ Số điện thoại phải >= 9 ký tự");
    return;
  }

  setMessage("");

  updateMutation.mutate(form as UpdateProfilePayload, {
    onSuccess: () => {
      setMessage("✅ Cập nhật thành công");
      refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message?.[0] || "Cập nhật thất bại";
      setMessage(`❌ ${msg}`);
    },
  });
};

  if (!auth) return null;

  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Đang tải thông tin...</p>;
  }

  if (!data) {
    return <p className="text-center mt-20">Không có dữ liệu</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">👤 Thông tin cá nhân</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={data.email}
            disabled
            className="w-full mt-1 p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            value={data.role}
            disabled
            className="w-full mt-1 p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Họ tên
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nhập họ tên..."
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại..."
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            name="level"
            value={form.level || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn level --</option>
            <option value="intern">Intern</option>
            <option value="junior">Junior</option>
            <option value="middle">Middle</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!isChanged || updateMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? "Đang lưu..." : "Cập nhật"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}