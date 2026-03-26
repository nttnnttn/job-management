import React from "react";
import { useMyApplications } from "../../hooks/job-candidate/useMyApplications";
import { useNavigate } from "react-router-dom";

export default function ProfileApplicationsPage() {
  const { data, isLoading } = useMyApplications();
  const navigate = useNavigate();

  if (isLoading) {
    return <p className="text-center mt-20">Đang tải lịch sử ứng tuyển...</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Bạn chưa apply job nào
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        📩 Lịch sử ứng tuyển
      </h2>

      <div className="space-y-4">
        {data.map((app: any) => (
          <div
            key={app._id}
            className="p-4 border rounded-lg flex justify-between items-center hover:shadow transition"
          >
            {/* LEFT */}
            <div>
              <h3 className="font-semibold text-lg">
                {app.job?.title || "No title"}
              </h3>

              <p className="text-sm text-gray-600">
                {app.job?.company}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(app.createdAt).toLocaleString()}
              </p>

              {/* STATUS */}
              <p
                className={`mt-1 text-sm font-medium
                  ${
                    app.status === "accepted"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                `}
              >
                {app.status || "pending"}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/jobs/${app.job?._id}`)}
                className="text-blue-600 text-sm hover:underline"
              >
                Xem job →
              </button>

              {/* 🔥 OPTIONAL: hủy apply */}
              <button
                className="text-red-500 text-sm hover:underline"
                onClick={() => {
                  alert("TODO: call API delete application");
                }}
              >
                Huỷ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
