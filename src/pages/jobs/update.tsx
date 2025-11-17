import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function UpdateJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    fetch(`${API_BASE}/jobs/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          title: data.title,
          location: data.location,
          salary: data.salary,
          description: data.description,
        })
      );
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Job updated!");
      navigate("/jobs");
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
        />

        <input
          name="location"
          className="w-full p-2 border rounded"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="salary"
          className="w-full p-2 border rounded"
          value={form.salary}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Update
        </button>
      </form>
    </div>
  );
}
