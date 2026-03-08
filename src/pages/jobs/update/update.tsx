import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useJobDetail } from "../../../hooks/jobs/useJobDetail";
import { useUpdateJob } from "../../../hooks/jobs/useUpdateJob";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";

export default function UpdateJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobDetail(id!);
  const updateJob = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    status: "open",
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salaryMin: job.salaryMin?.toString() || "",
        salaryMax: job.salaryMax?.toString() || "",
        description: job.description || "",
        status: job.status || "open",
      });
    }
  }, [job]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (!id) return;
    updateJob.mutate({
      jobId: id,
      payload: {
        title: form.title,
        company: form.company,
        location: form.location,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        description: form.description,
        status: form.status,
      },
    });
  };

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Bạn có chắc muốn xóa job này?")) {
      deleteJobMutation.mutate(id, {
        onSuccess: () => {
          navigate("/jobs"); // chuyển về danh sách sau khi xóa
        },
      });
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Update Job</h1>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter job title..."
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Company</label>
          <input
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Enter company name..."
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Location</label>
          <input
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location..."
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Salary Min + Max */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Salary Min</label>
            <input
              value={form.salaryMin}
              onChange={(e) => handleChange("salaryMin", e.target.value)}
              placeholder="Enter min salary..."
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Salary Max</label>
            <input
              value={form.salaryMax}
              onChange={(e) => handleChange("salaryMax", e.target.value)}
              placeholder="Enter max salary..."
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter job description..."
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
