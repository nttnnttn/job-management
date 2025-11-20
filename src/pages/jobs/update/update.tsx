import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

interface JobForm {
  title: string;
  company: string;
  location: string;
  salaryMin: number | string;
  salaryMax: number | string;
  description: string;
  status: string;
}

export default function UpdateJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState<JobForm>({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    status: "open",
  });

  useEffect(() => {
    const loadJob = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/jobs/${id}?jobId=${id}`, {
          headers: {
             "accept": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const job = data.job || data.data || data;

        setForm({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          salaryMin: job.salaryMin ?? "",
          salaryMax: job.salaryMax ?? "",
          description: job.description || "",
          status: job.status || "open",
        });
      } catch (error) {
        console.error("Error loading job:", error);
      }
    };

    loadJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Missing token");

    const payload = {
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/jobs/${id}?jobId=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📌 PATCH status:", res.status);
      const text = await res.text();
      console.log("📌 Response:", text);

      if (res.ok) {
        alert("Job updated!");
        navigate("/jobs");
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Job</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <input
          name="company"
          className="w-full p-2 border rounded"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          required
        />

        <input
          name="location"
          className="w-full p-2 border rounded"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />

        <div className="flex gap-3">
          <input
            name="salaryMin"
            type="number"
            className="w-full p-2 border rounded"
            value={form.salaryMin}
            onChange={handleChange}
            placeholder="Salary Min"
          />

          <input
            name="salaryMax"
            type="number"
            className="w-full p-2 border rounded"
            value={form.salaryMax}
            onChange={handleChange}
            placeholder="Salary Max"
          />
        </div>

        <textarea
          name="description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <select
          name="status"
          className="w-full p-2 border rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Update
        </button>
      </form>
    </div>
  );
}
