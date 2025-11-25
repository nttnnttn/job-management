import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useJobDetail } from "../../../hooks/jobs/useJobDetail";
import { useUpdateJob } from "../../../hooks/jobs/useUpdateJob";

export default function UpdateJobPage() {
  const { id} = useParams();
  const { data: job, isLoading } = useJobDetail(id!);
  const updateJob = useUpdateJob();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    status: "open",
  });

  // ⬇ Load data cũ vào form
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

  // ⬇ Gửi update
  const handleSubmit = () => {
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

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Update Job</h1>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">

        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Title"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Company"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Location"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            value={form.salaryMin}
            onChange={(e) => handleChange("salaryMin", e.target.value)}
            placeholder="Salary Min"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            value={form.salaryMax}
            onChange={(e) => handleChange("salaryMax", e.target.value)}
            placeholder="Salary Max"
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
}
