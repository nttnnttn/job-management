import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Job created!");
      navigate("/jobs");
    } else {
      alert("Error creating job");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Job</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          className="w-full p-2 border rounded"
          placeholder="Title"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          className="w-full p-2 border rounded"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <input
          name="salary"
          className="w-full p-2 border rounded"
          placeholder="Salary"
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="w-full p-2 border rounded"
          placeholder="Description"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Create
        </button>
      </form>
    </div>
  );
}
